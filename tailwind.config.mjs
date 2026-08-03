/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Google Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        heading: [
          "Google Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      colors: {
        ink: "#111827",
        muted: "#5f6b7a",
        line: "#d9e0e8",
        paper: "#f7f9fb",
        brand: {
          DEFAULT: "#0f766e",
          dark: "#115e59",
          light: "#ccfbf1"
        },
        accent: {
          DEFAULT: "#b45309",
          light: "#fef3c7"
        }
      }
    }
  },
  plugins: []
};
