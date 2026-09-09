/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Luxury Culinary Color System
        brand: {
          green: "#0D381E",
          forest: "#0D381E",
          emerald: "#0F4725",
          "green-dark": "#072312",
          "green-light": "#E8F5EC",
          orange: "#C85419",
          terracotta: "#C85419",
          "orange-hover": "#D95D1E",
          "orange-light": "#FDF2EB",
          charcoal: "#0F172A",
          slate: "#334155",
          muted: "#64748B",
        },
        // Surfaces & Backgrounds (crisp porcelain, no muddy yellow)
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F8FAFC",
          muted: "#F1F5F9",
          dark: "#08160E",
          "dark-card": "#0F2418",
        },
        border: {
          subtle: "#E2E8F0",
          DEFAULT: "#CBD5E1",
          emerald: "rgba(13, 56, 30, 0.15)",
          orange: "rgba(200, 84, 25, 0.2)",
        },
        // Legacy token mappings for backwards compatibility
        "brand-green": "#0D381E",
        "brand-orange": "#C85419",
        "brand-cream": "#FFFFFF",
        "brand-ivory": "#F8FAFC",
        "primary-green": "#0D381E",
        "primary-orange": "#C85419",
        canvas: "#FFFFFF",
        "canvas-alt": "#F8FAFC",
        charcoal: "#0F172A",
        hairline: "#E2E8F0",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        "glow-green": "0 10px 25px -5px rgba(13, 56, 30, 0.25)",
        "glow-orange": "0 10px 25px -5px rgba(200, 84, 25, 0.28)",
        "card-soft": "0 2px 12px -2px rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.04)",
        "card-hover": "0 20px 30px -10px rgba(15, 23, 42, 0.1), 0 4px 10px -2px rgba(15, 23, 42, 0.05)",
      },
    },
  },
  plugins: [],
}
