"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

export type ThemeMode = "light" | "dark";
export type LanguageCode = "id" | "en";

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  mounted: boolean;
}

interface SoundContextValue {
  isMuted: boolean;
  toggleMute: () => boolean;
  setMuted: (muted: boolean) => void;
}

interface LanguageContextValue {
  lang: LanguageCode;
  toggleLanguage: () => LanguageCode;
  setLanguage: (code: LanguageCode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => "light",
  setTheme: () => {},
  mounted: false,
});

const SoundContext = createContext<SoundContextValue>({
  isMuted: false,
  toggleMute: () => false,
  setMuted: () => {},
});

const LanguageContext = createContext<LanguageContextValue>({
  lang: "id",
  toggleLanguage: () => "id",
  setLanguage: () => {},
});

const emptySubscribe = () => () => {};

function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const THEME_STORAGE_KEY = "iqbaldf-theme";
const LANG_STORAGE_KEY = "iqbaldf-lang";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mounted = useHydrated();
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "dark" || saved === "light") return saved;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch {
      // Ignore storage access errors
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback((): ThemeMode => {
    let nextMode: ThemeMode = "light";
    setThemeState((prev) => {
      nextMode = prev === "dark" ? "light" : "dark";
      return nextMode;
    });
    return nextMode;
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  // Subtle tactile audio remains gently enabled by default in the background
  const [isMuted, setIsMutedState] = useState<boolean>(false);

  const setMuted = useCallback((muted: boolean) => {
    setIsMutedState(muted);
  }, []);

  const toggleMute = useCallback((): boolean => {
    let nextMuted = false;
    setIsMutedState((prev) => {
      nextMuted = !prev;
      return nextMuted;
    });
    return nextMuted;
  }, []);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, setMuted }}>
      {children}
    </SoundContext.Provider>
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default language is 'id'
  const [lang, setLangState] = useState<LanguageCode>("id");

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  }, [lang]);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLangState(code);
  }, []);

  const toggleLanguage = useCallback((): LanguageCode => {
    let nextLang: LanguageCode = "en";
    setLangState((prev) => {
      nextLang = prev === "id" ? "en" : "id";
      return nextLang;
    });
    return nextLang;
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SoundProvider>{children}</SoundProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useSoundContext() {
  return useContext(SoundContext);
}

export function useLanguage() {
  return useContext(LanguageContext);
}
