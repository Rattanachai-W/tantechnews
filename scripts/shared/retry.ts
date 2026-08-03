import { logger } from "./logger";

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: { attempts: number; label: string; delayMs?: number }
): Promise<T> {
  const delayMs = options.delayMs ?? 700;
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      logger.warn("Operation failed; retrying if attempts remain", {
        label: options.label,
        attempt,
        attempts: options.attempts,
        error: error instanceof Error ? error.message : String(error)
      });

      if (attempt < options.attempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
}
