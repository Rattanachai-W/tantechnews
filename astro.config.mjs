import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/static";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://tantechnews.com",
  output: "static",
  redirects: {
    "/news/introducing-chatgpt-for-teens-built-for-learning-backed-by-p": "/news/openai-chatgpt-for-teens/",
    "/news/introducing-chatgpt-for-teens-built-for-learning-backed-by-p/": "/news/openai-chatgpt-for-teens/",
    "/news/partnering-with-codeai-to-prepare-the-first-ai-generation": "/news/openai-codeai-ai/",
    "/news/partnering-with-codeai-to-prepare-the-first-ai-generation/": "/news/openai-codeai-ai/",
    "/news/responding-to-the-next-frontier-of-critical-cyber-capabiliti": "/news/openai-dup/",
    "/news/responding-to-the-next-frontier-of-critical-cyber-capabiliti/": "/news/openai-dup/"
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false
    })
  ],
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  }
});
