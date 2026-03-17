// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 0 0 1px rgba(255,255,255,0.12)",
        soft: "0 0 0 1px rgba(255,255,255,0.08), 0 10px 30px rgba(255,255,255,0.04)"
      },
      animation: {
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite",
        floatSlow: "floatSlow 8s ease-in-out infinite",
        marqueeUp: "marqueeUp 16s linear infinite"
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" }
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        marqueeUp: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-50%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
