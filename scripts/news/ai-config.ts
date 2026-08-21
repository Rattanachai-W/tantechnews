export interface AiClientConfig {
  endpoint: string;
  apiKey: string;
  model: string;
  timeoutMs: number;
  maxRetries: number;
}

function getPositiveInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function loadAiClientConfig(env = process.env, modelOverride?: string, timeoutOverride?: string): AiClientConfig | null {
  if (!env.AI_API_KEY && !env.OPENROUTER_API_KEY) {
    try {
      process.loadEnvFile?.();
    } catch {
      // ignore if .env does not exist
    }
  }

  const rawEndpoint = (env.AI_API_ENDPOINT || env.OPENROUTER_API_ENDPOINT || "https://openrouter.ai/api/v1/chat/completions").trim();
  const rawApiKey = (env.AI_API_KEY || env.OPENROUTER_API_KEY || "").trim();
  const apiKey = rawApiKey.replace(/^["']|["']$/g, "");
  const endpoint = rawEndpoint.replace(/^["']|["']$/g, "");

  if (!endpoint || !apiKey) {
    return null;
  }

  return {
    endpoint,
    apiKey,
    model: (
      modelOverride ||
      env.AI_MODEL ||
      env.OPENROUTER_MODEL ||
      "openai/gpt-5.6-luna"
    ).trim().replace(/^["']|["']$/g, ""),
    timeoutMs: getPositiveInteger(
      timeoutOverride || env.AI_TIMEOUT_MS || env.OPENROUTER_TIMEOUT_MS,
      60000
    ),
    maxRetries: getPositiveInteger(env.AI_MAX_RETRIES || env.OPENROUTER_MAX_RETRIES, 3)
  };
}

export function loadAiSummaryConfig(env = process.env): AiClientConfig | null {
  return loadAiClientConfig(env, env.AI_SUMMARY_MODEL, env.AI_SUMMARY_TIMEOUT_MS ?? env.AI_TIMEOUT_MS);
}

export function loadAiScoringConfig(env = process.env): AiClientConfig | null {
  return loadAiClientConfig(env, env.AI_SCORING_MODEL, env.AI_SCORING_TIMEOUT_MS ?? env.AI_TIMEOUT_MS);
}