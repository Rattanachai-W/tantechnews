import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// Detect whether Astro outputted to .vercel/output/static (Vercel adapter) or dist/ (standard)
const targetDir = existsSync(".vercel/output/static")
  ? ".vercel/output/static"
  : existsSync("dist")
  ? "dist"
  : ".vercel/output/static";

console.log(`Running Pagefind on directory: ${targetDir}`);
execSync(`npx pagefind --site "${targetDir}"`, { stdio: "inherit" });

// Copy generated pagefind assets into public/pagefind so that search works during local dev (pnpm dev)
const generatedPagefindDir = join(targetDir, "pagefind");
const publicPagefindDir = join("public", "pagefind");

if (existsSync(generatedPagefindDir)) {
  console.log("Syncing search assets to public/pagefind for dev server...");
  mkdirSync("public", { recursive: true });
  cpSync(generatedPagefindDir, publicPagefindDir, { recursive: true, force: true });
  console.log("Search assets synced successfully!");
}
