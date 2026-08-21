import { logger } from "../shared/logger";
import { withRetry } from "../shared/retry";
import type { ArticleSummary } from "../../src/types/article";
import { articleSummarySchema } from "./validate-summary";
import type { AiClientConfig } from "./ai-config";
import type { SummaryPromptPayload } from "./summary-prompt";

interface AiSummaryRequest {
  model: string;
  messages: Array<{
    role: "system" | "user";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  response_format: {
    type: "json_object";
  };
}

function parseJsonObject(text: string): unknown {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const jsonCandidate = text.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (err) {
        logger.warn("Failed to parse JSON candidate", { sample: jsonCandidate.slice(0, 200) });
      }
    }

    throw new Error("AI response did not contain a JSON object");
  }
}

function extractResponseText(payload: unknown): string {
  if (typeof payload === "string") return payload;

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (typeof record.output_text === "string") return record.output_text;
    if (typeof record.text === "string") return record.text;
    if (typeof record.content === "string") return record.content;
    if (typeof record.response === "string") return record.response;

    const choices = record.choices;
    if (Array.isArray(choices) && choices.length > 0) {
      const first = choices[0] as Record<string, unknown> | undefined;
      const message = first?.message as Record<string, unknown> | undefined;
      if (typeof message?.content === "string") return message.content;
      if (Array.isArray(message?.content)) {
        const textParts = (message.content as Array<Record<string, unknown>>)
          .map((part) => (typeof part?.text === "string" ? part.text : ""))
          .filter(Boolean);
        if (textParts.length > 0) return textParts.join("\n");
      }
      if (typeof first?.text === "string") return first.text;
    }

    const candidates = record.candidates;
    if (Array.isArray(candidates) && candidates.length > 0) {
      const first = candidates[0] as Record<string, unknown> | undefined;
      const content = first?.content as Record<string, unknown> | undefined;
      if (Array.isArray(content?.parts)) {
        const text = (content.parts as Array<Record<string, unknown>>)
          .map((p) => (typeof p?.text === "string" ? p.text : ""))
          .filter(Boolean)
          .join("\n");
        if (text) return text;
      }
    }

    const output = record.output;
    if (Array.isArray(output)) {
      const textParts = output.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const content = (item as Record<string, unknown>).content;
        if (!Array.isArray(content)) return [];
        return content.flatMap((part) => {
          if (!part || typeof part !== "object") return [];
          const text = (part as Record<string, unknown>).text;
          return typeof text === "string" ? [text] : [];
        });
      });

      if (textParts.length > 0) return textParts.join("\n");
    }
  }

  logger.warn("Unknown AI payload structure", { payload: JSON.stringify(payload).slice(0, 500) });
  throw new Error("AI response shape is unsupported");
}

function normalizeParsedSummary(parsed: unknown): unknown {
  if (!parsed || typeof parsed !== "object") return parsed;
  const obj = { ...(parsed as Record<string, unknown>) };

  if (Array.isArray(obj.tags)) {
    obj.tags = obj.tags
      .filter((t) => typeof t === "string" && t.trim().length > 0)
      .slice(0, 10);
  }

  if (Array.isArray(obj.categories)) {
    obj.categories = obj.categories.slice(0, 3);
  }

  if (typeof obj.titleTh === "string") {
    obj.titleTh = obj.titleTh.trim().slice(0, 200);
  }

  if (typeof obj.excerpt === "string") {
    obj.excerpt = obj.excerpt.trim().slice(0, 280);
  }

  if (typeof obj.oneSentenceSummary === "string") {
    obj.oneSentenceSummary = obj.oneSentenceSummary.trim().slice(0, 220);
  }

  if (typeof obj.tantechView === "string") {
    const trimmed = obj.tantechView.trim();
    if (!trimmed.startsWith("บทวิเคราะห์") && !trimmed.startsWith("มุมมอง")) {
      obj.tantechView = `บทวิเคราะห์: ${trimmed}`;
    }
  }

  return obj;
}

export async function requestAiSummary(
  config: AiClientConfig,
  prompt: SummaryPromptPayload
): Promise<ArticleSummary | null> {
  const body: AiSummaryRequest = {
    model: config.model,
    temperature: 0.2,
    max_tokens: 6000,
    messages: [
      { role: "system", content: prompt.system + "\n\nThink concisely and output only the complete JSON." },
      { role: "user", content: prompt.user }
    ],
    response_format: {
      type: "json_object"
    }
  };

  try {
    return await withRetry(
      async () => {
        const response = await fetch(config.endpoint, {
          method: "POST",
          headers: {
            authorization: `Bearer ${config.apiKey}`,
            "content-type": "application/json"
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(config.timeoutMs)
        });

        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          throw new Error(`AI summary request failed with status ${response.status}${errText ? `: ${errText.slice(0, 300)}` : ""}`);
        }

        const payload = (await response.json()) as unknown;
        const responseText = extractResponseText(payload);
        const parsed = parseJsonObject(responseText);
        const normalized = normalizeParsedSummary(parsed);
        const validation = articleSummarySchema.safeParse(normalized);

        if (!validation.success) {
          throw new Error(`AI summary validation failed: ${validation.error.message}`);
        }

        return validation.data;
      },
      {
        attempts: config.maxRetries,
        label: "ai-summary"
      }
    );
  } catch (error) {
    logger.error("AI summary generation failed", {
      error: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
}
