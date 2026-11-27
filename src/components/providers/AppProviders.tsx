"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

export type ThemeMode = "auto" | "light" | "dark" | "tech";
export type ResolvedTheme = "light" | "dark" | "tech";
export type LanguageCode = "id" | "en";

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  mounted: boolean;
}

interface SoundContextValue {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSoundEnabled: () => boolean;
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
  theme: "auto",
  resolvedTheme: "dark",
  toggleTheme: () => "dark",
  setTheme: () => {},
  mounted: false,
});

const SoundContext = createContext<SoundContextValue>({
  soundEnabled: true,
  setSoundEnabled: () => {},
  toggleSoundEnabled: () => true,
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
const SOUND_STORAGE_KEY = "iqbaldf-sound-enabled";
const LANG_STORAGE_KEY = "iqbaldf-lang";

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mounted = useHydrated();

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "auto";
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (
        saved === "auto" ||
        saved === "light" ||
        saved === "dark" ||
        saved === "tech"
      ) {
        return saved;
      }
    } catch {
      // Ignore storage access errors
    }
    return "auto";
  });

  const [systemDark, setSystemDark] = useState<boolean>(() =>
    getSystemPrefersDark()
  );

  // Listen to real-time OS color-scheme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === "auto" ? (systemDark ? "dark" : "light") : theme;

  // Apply classes and data-theme attribute to <html>
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "tech") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "tech");
    } else {
      root.removeAttribute("data-theme");
      const shouldBeDark =
        theme === "dark" || (theme === "auto" && getSystemPrefersDark());
      if (shouldBeDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme, systemDark]);

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
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, toggleTheme, setTheme, mounted }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = window.localStorage.getItem(SOUND_STORAGE_KEY);
      if (saved === "false") return false;
      if (saved === "true") return true;
    } catch {
      // Ignore storage errors
    }
    return true;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
    } catch {
      // Ignore storage errors
    }
  }, [soundEnabled]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
  }, []);

  const toggleSoundEnabled = useCallback((): boolean => {
    let nextEnabled = true;
    setSoundEnabledState((prev) => {
      nextEnabled = !prev;
      return nextEnabled;
    });
    return nextEnabled;
  }, []);

  const isMuted = !soundEnabled;

  const setMuted = useCallback((muted: boolean) => {
    setSoundEnabledState(!muted);
  }, []);

  const toggleMute = useCallback((): boolean => {
    let nextMuted = false;
    setSoundEnabledState((prev) => {
      const nextEnabled = !prev;
      nextMuted = !nextEnabled;
      return nextEnabled;
    });
    return nextMuted;
  }, []);

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        toggleSoundEnabled,
        isMuted,
        toggleMute,
        setMuted,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
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
