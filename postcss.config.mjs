const config = {
  plugins: ["@tailwindcss/postcss"],
  colors: {
    primary: {
      DEFAULT: "#f59e0b", //  amber-50
      light: "#fcd34d", // brighter
      dark: "#d97706", // darker
    },
    opacity: {
      "15": "0.15",
      "35": "0.35",
      "65": "0.65",
    },
    secondary: {
      DEFAULT: "#3b82f6", //  blue-50
      light: "#60a5fa", // brighter
      dark: "#1d4ed8", // darker
    },
  },
};

export default config;
