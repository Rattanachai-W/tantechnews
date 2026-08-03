export function shouldIncludeDraftContent(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.TANTECH_INCLUDE_DRAFTS === "true";
}
