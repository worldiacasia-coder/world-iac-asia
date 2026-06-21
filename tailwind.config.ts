import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#C5A059",
          "gold-hover": "#B38F4D",
          "gold-light": "#FDF8EF",
          star: "#C5A059",
        },
        "brand-gold": "#C5A059",
        "brand-gold-hover": "#B38F4D",
        "brand-gold-light": "#FDF8EF",
        gold: {
          50: "#fdf8ef",
          100: "#f9edd8",
          200: "#f0ddb0",
          300: "#e4c67a",
          400: "#d4ad52",
          500: "#C5A059",
          600: "#B38F4D",
          700: "#96753f",
          800: "#7a5f35",
          900: "#644e2e",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-in": "fadeIn 0.7s ease-out both",
        "zoom-in": "zoomIn 8s ease-out both",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        zoomIn: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.06)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
