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
        background: "#0b1120",
        foreground: "#e2e8f0",
        accent: "#38bdf8",
        muted: "#1e293b",
        success: "#22c55e",
        warning: "#facc15",
        danger: "#f43f5e"
      },
      boxShadow: {
        glow: "0 0 35px rgba(56, 189, 248, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
