/**
 * Returns an optimized CDN proxy URL (via wsrv.nl powered by Cloudflare)
 * for article cover images. Compresses images to WebP and resizes to target width.
 * Returns null if no valid image URL is provided.
 */
export function getOptimizedImageUrl(rawUrl?: string, width = 800): string | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;

  // Keep data URLs or SVG icons as-is
  if (trimmed.startsWith("data:") || trimmed.endsWith(".svg")) return trimmed;

  // Use wsrv.nl Image CDN Proxy
  return `https://wsrv.nl/?url=${encodeURIComponent(trimmed)}&w=${width}&output=webp&q=80`;
}
