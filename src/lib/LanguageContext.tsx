import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Lang } from "./i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem("aionis_lang") as Lang) || "en";
    } catch {
      return "en";
    }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("aionis_lang", l);
    } catch {}
  };

  // Listen for storage changes from other components
  useEffect(() => {
    const handler = () => {
      try {
        const stored = localStorage.getItem("aionis_lang") as Lang;
        if (stored && stored !== lang) setLangState(stored);
      } catch {}
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
