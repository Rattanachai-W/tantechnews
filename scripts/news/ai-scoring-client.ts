import { logger } from "../shared/logger";
import { withRetry } from "../shared/retry";
import type { ArticleScore } from "../../src/types/article";
import type { AiClientConfig } from "./ai-config";
import type { ScoringPromptPayload } from "./scoring-prompt";
import { aiScoringResponseSchema } from "./validate-score";

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
  }

  throw new Error("AI response shape is unsupported");
}

export async function requestAiScores(
  config: AiClientConfig,
  prompt: ScoringPromptPayload
): Promise<Map<string, ArticleScore> | null> {
  try {
    return await withRetry(
      async () => {
        const response = await fetch(config.endpoint, {
          method: "POST",
          headers: {
            authorization: `Bearer ${config.apiKey}`,
            "content-type": "application/json"
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              { role: "system", content: prompt.system },
              { role: "user", content: prompt.user }
            ],
            response_format: {
              type: "json_object"
            }
          }),
          signal: AbortSignal.timeout(config.timeoutMs)
        });

        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          throw new Error(`AI scoring request failed with status ${response.status}${errText ? `: ${errText.slice(0, 300)}` : ""}`);
        }

        const payload = (await response.json()) as unknown;
        const parsed = parseJsonObject(extractResponseText(payload));
        const validation = aiScoringResponseSchema.safeParse(parsed);
        if (!validation.success) {
          throw new Error(`AI scoring validation failed: ${validation.error.message}`);
        }

        return new Map(validation.data.articles.map((article) => [article.id, article.score]));
      },
      {
        attempts: config.maxRetries,
        label: "ai-scoring"
      }
    );
  } catch (error) {
    logger.error("AI scoring failed", {
      error: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
}
