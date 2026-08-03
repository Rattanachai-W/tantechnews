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
  response_format: {
    type: "json_object";
  };
}

function parseJsonObject(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI response did not contain a JSON object");
    return JSON.parse(match[0]);
  }
}

function extractResponseText(payload: unknown): string {
  if (typeof payload === "string") return payload;

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (typeof record.output_text === "string") return record.output_text;
    if (typeof record.text === "string") return record.text;
    if (typeof record.content === "string") return record.content;

    const choices = record.choices;
    if (Array.isArray(choices)) {
      const first = choices[0] as Record<string, unknown> | undefined;
      const message = first?.message as Record<string, unknown> | undefined;
      if (typeof message?.content === "string") return message.content;
      if (typeof first?.text === "string") return first.text;
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

  throw new Error("AI response shape is unsupported");
}

export async function requestAiSummary(
  config: AiClientConfig,
  prompt: SummaryPromptPayload
): Promise<ArticleSummary | null> {
  const body: AiSummaryRequest = {
    model: config.model,
    messages: [
      { role: "system", content: prompt.system },
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
          throw new Error(`AI summary request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const responseText = extractResponseText(payload);
        const parsed = parseJsonObject(responseText);
        const validation = articleSummarySchema.safeParse(parsed);

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
