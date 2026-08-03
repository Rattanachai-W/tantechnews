import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://tantechnews.com",
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
