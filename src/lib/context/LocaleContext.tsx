"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface LocaleContextProps {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      setCurrentLanguage(savedLang);
    }
  }, []);
  
  return (
    <LocaleContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context)
    throw new Error("useLocale must be used within a LocaleProvider");
  return context;
};
