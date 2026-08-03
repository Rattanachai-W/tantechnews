import { createHash } from "node:crypto";

export function createArticleId(normalizedUrl: string): string {
  return createHash("sha256").update(normalizedUrl).digest("hex");
}
