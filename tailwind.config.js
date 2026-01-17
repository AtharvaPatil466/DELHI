/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b", // Deep Matte Charcoal
        surface: "#18181b",    // Zinc-900 (Cards)
        primary: "#3b82f6",    // Blue-500 (Brand)
        secondary: "#8b5cf6",  // Violet-500
        success: "#10b981",    // Emerald-500
        warning: "#f59e0b",    // Amber-500
        danger: "#ef4444",     // Red-500
        text: "#fafafa",       // Zinc-50
        muted: "#a1a1aa",      // Zinc-400
        border: "#27272a",     // Zinc-800
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'tech-pattern': "radial-gradient(#27272a 1px, transparent 1px)",
      },
      backgroundSize: {
        'tech-grid': '24px 24px',
      }
    },
  },
  plugins: [],
}
