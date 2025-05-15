import { type Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
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
      },
    },
  },
  plugins: [],
  darkMode: "selector",
};

export default config;
