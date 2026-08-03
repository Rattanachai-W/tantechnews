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

export function loadAiClientConfig(env = process.env, modelOverride?: string): AiClientConfig | null {
  const endpoint = env.AI_API_ENDPOINT;
  const apiKey = env.AI_API_KEY;

  if (!endpoint || !apiKey) {
    return null;
  }

  return {
    endpoint,
    apiKey,
    model: modelOverride ?? env.AI_MODEL ?? "tantech-news-model",
    timeoutMs: getPositiveInteger(env.AI_TIMEOUT_MS, 45000),
    maxRetries: getPositiveInteger(env.AI_MAX_RETRIES, 2)
  };
}

export function loadAiSummaryConfig(env = process.env): AiClientConfig | null {
  return loadAiClientConfig(env, env.AI_SUMMARY_MODEL);
}

export function loadAiScoringConfig(env = process.env): AiClientConfig | null {
  return loadAiClientConfig(env, env.AI_SCORING_MODEL);
}
