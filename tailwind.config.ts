import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#f8f3ec",
        surface: "#fffaf3",
        soft: "#efe7dc",
        primary: {
          DEFAULT: "#c9a9a6",
          strong: "#ad8581",
        },
        secondary: "#a8b5c8",
        charcoal: "#2c2c2c",
        muted: "#766f68",
        border: "#e5d8ca",
        success: "#789376",
        warning: "#d8aa5a",
      },
      fontFamily: {
        serif: [
          "Playfair Display",
          "Cormorant Garamond",
          "Noto Serif SC",
          "Georgia",
          "serif",
        ],
        sans: [
          "Libre Franklin",
          "DM Sans",
          "Noto Sans SC",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(44, 44, 44, 0.06)",
        "card-hover": "0 4px 20px rgba(44, 44, 44, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
