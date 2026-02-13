import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        "primary-dark": "#2563EB",
        "primary-hover": "#2563eb",
        "background-light": "#f8fafc",
        "background-dark": "#0F172A",
        "surface-dark": "#1E293B",
        "surface-darker": "#020617",
        "border-dark": "#334155",
        "accent-dark": "#475569",
        "secondary-text": "#94a3b8",
        "border-color": "#334155",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "Noto Sans", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
