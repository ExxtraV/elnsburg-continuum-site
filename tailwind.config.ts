import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#f5f1e8",
        "night-sky": "#0f0b2d",
        "royal-gold": "#eab308"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "serif"]
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "70ch"
          }
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
