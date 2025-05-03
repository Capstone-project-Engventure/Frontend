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
      },
    },
  },
  plugins: [],
  darkMode: 'selector'
};

export default config;
