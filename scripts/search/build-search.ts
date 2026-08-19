import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

// Detect whether Astro outputted to .vercel/output/static (Vercel adapter) or dist/ (standard)
const targetDir = existsSync(".vercel/output/static")
  ? ".vercel/output/static"
  : existsSync("dist")
  ? "dist"
  : ".vercel/output/static";

console.log(`Running Pagefind on directory: ${targetDir}`);
execSync(`npx pagefind --site "${targetDir}"`, { stdio: "inherit" });
