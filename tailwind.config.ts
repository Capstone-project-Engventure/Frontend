// tailwind.config.js
/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f59e0b", // amber-500
          light: "#fcd34d",   // amber-300
          dark: "#d97706",    // amber-600
        },
        secondary: {
          DEFAULT: "#3b82f6", // blue-500
          light: "#60a5fa",   // blue-400
          dark: "#1d4ed8",    // blue-700
        },
      },
      opacity: {
        "15": "0.15",
        "35": "0.35",
        "65": "0.65",
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;