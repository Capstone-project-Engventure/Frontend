"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { motion } from "motion/react";
const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();
  const [isLight, setIsLight] = useState(theme === "light");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const toggleTheme = () => {
    const newTheme = isLight ? "dark" : "light";
    setTheme(newTheme);
    setIsLight(!isLight);
  };

  if (!mounted) return null;
  return (
    <div className="relative flex items-center justify-center">
      <div
        data-tooltip-id="theme-tooltip"
        data-tooltip-content={
          isLight ? "Switch to dark mode" : "Switch to light mode"
        }
        className="cursor-pointer relative w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 p-1 flex items-center transition-all duration-500"
        style={{
          justifyContent: "flex-" + (isLight ? "end" : "start"),
        }}
        onClick={toggleTheme}
      >
        <motion.div
          className="absolute w-full h-full rounded-full"
          initial={{ backgroundColor: isLight ? "#f3f4f6" : "#374151" }}
          animate={{ backgroundColor: isLight ? "#f3f4f6" : "#374151" }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="w-6 h-6 rounded-full bg-white flex items-center justify-center z-10"
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
        >
          {isLight ? <FiSun /> : <FiMoon />}
        </motion.div>
      </div>

      <Tooltip id="theme-tooltip" />
    </div>
  );
};
export default ThemeChanger;
