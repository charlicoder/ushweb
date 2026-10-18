'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

interface AppContextType {
  lang: Language;
  isAr: boolean;
  dir: 'ltr' | 'rtl';
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: (en: string, ar: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // 1. Load saved preferences from localStorage on mount
    try {
      const savedLang = localStorage.getItem('ush_lang') as Language | null;
      if (savedLang === 'en' || savedLang === 'ar') {
        setLangState(savedLang);
      }
      const savedTheme = localStorage.getItem('ush_theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    // Apply lang and dir to document
    if (typeof document !== 'undefined') {
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
      document.documentElement.setAttribute('dir', dir);
      try {
        localStorage.setItem('ush_lang', lang);
      } catch {
        // Ignore storage errors
      }
    }
  }, [lang]);

  useEffect(() => {
    // Apply theme to document
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      try {
        localStorage.setItem('ush_theme', theme);
      } catch {
        // Ignore storage errors
      }
    }
  }, [theme]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isAr = lang === 'ar';
  const isDark = theme === 'dark';
  const dir: 'ltr' | 'rtl' = isAr ? 'rtl' : 'ltr';

  const t = (en: string, ar: string) => (isAr ? ar : en);

  return (
    <AppContext.Provider
      value={{
        lang,
        isAr,
        dir,
        setLang,
        toggleLang,
        theme,
        isDark,
        setTheme,
        toggleTheme,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    return {
      lang: 'en' as Language,
      isAr: false,
      dir: 'ltr' as const,
      setLang: () => {},
      toggleLang: () => {},
      theme: 'light' as Theme,
      isDark: false,
      setTheme: () => {},
      toggleTheme: () => {},
      t: (en: string, ar: string) => en,
    };
  }
  return context;
}
