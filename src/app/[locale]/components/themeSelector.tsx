"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";

const ThemeChanger = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  const getIcon = () => {
    if (theme === "system") {
      return <FiMonitor className="w-5 h-5" />;
    }
    return resolvedTheme === "dark" ? 
      <FiMoon className="w-5 h-5" /> : 
      <FiSun className="w-5 h-5" />;
  };

  const getLabel = () => {
    if (theme === "system") {
      return `System (${systemTheme})`;
    }
    return theme === "dark" ? "Dark" : "Light";
  };

  return (
    <div className="relative">
      <button
        onClick={cycleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
        aria-label={`Current theme: ${getLabel()}. Click to cycle themes.`}
        title={`Current: ${getLabel()}. Click to cycle.`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme + resolvedTheme}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${
              theme === "system" 
                ? "text-blue-600 dark:text-blue-400" 
                : resolvedTheme === "dark" 
                  ? "text-gray-300" 
                  : "text-yellow-600"
            }`}
          >
            {getIcon()}
          </motion.div>
        </AnimatePresence>
      </button>
    </div>
  );
};

export default ThemeChanger;