"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../dictionaries/en.json";
import vi from "../dictionaries/vi.json";

const dictionaries: any = { en, vi };

type LanguageContextType = {
  locale: string;
  setLocale: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang");
    if (savedLang && dictionaries[savedLang]) {
      setLocale(savedLang);
    }
  }, []);

  const handleSetLocale = (lang: string) => {
    setLocale(lang);
    localStorage.setItem("app_lang", lang);
  };

  const t = (key: string) => {
    const keys = key.split(".");
    let value = dictionaries[locale];

    for (const k of keys) {
      if (!value || value[k] === undefined) {
        // Fallback về Tiếng Anh nếu bên Tiếng Việt chưa dịch chữ này
        let englishFallback = dictionaries["en"];
        for (const engKey of keys) {
          if (!englishFallback || englishFallback[engKey] === undefined) return key;
          englishFallback = englishFallback[engKey];
        }
        return englishFallback;
      }
      value = value[k];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};