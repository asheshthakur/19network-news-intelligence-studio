import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#123B2B",
          dark: "#0B2119",
          emerald: "#16834A",
          bright: "#22A06B",
          mint: "#DDF5E8",
          subtle: "#EDF8F2",
        },
        surface: {
          bg: "#F5F8F5",
          card: "#FFFFFF",
          border: "#DCE6DF",
          borderLight: "#E8EFEA",
          darkBg: "#0B1612",
          darkCard: "#11231D",
          darkBorder: "#1C352C",
        },
        editorial: {
          text: "#14231B",
          muted: "#728078",
          dim: "#9EADA4",
          darkText: "#EBF3EE",
          darkMuted: "#8FA397",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "'Georgia'",
          "'Times New Roman'",
          "serif",
        ],
        mono: [
          "'SF Mono'",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(18, 59, 43, 0.04), 0 1px 2px -1px rgba(18, 59, 43, 0.04)",
        cardHover: "0 4px 6px -1px rgba(18, 59, 43, 0.08), 0 2px 4px -2px rgba(18, 59, 43, 0.06)",
        float: "0 10px 15px -3px rgba(18, 59, 43, 0.08), 0 4px 6px -4px rgba(18, 59, 43, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
