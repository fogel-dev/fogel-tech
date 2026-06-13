"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { dictionaries, type Locale } from "@/content/home";

export type Theme = "light" | "dark";

type PreferencesContextValue = {
  locale: Locale;
  theme: Theme;
  dictionary: (typeof dictionaries)[Locale];
  setLocale: (locale: Locale) => void;
  toggleTheme: (origin?: { x: number; y: number }) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

type TransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
  };
};

export function PreferencesProvider({
  children,
  initialLocale,
  initialTheme,
  hasStoredTheme,
}: {
  children: ReactNode;
  initialLocale: Locale;
  initialTheme: Theme;
  hasStoredTheme: boolean;
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [theme, setTheme] = useState(initialTheme);
  const [hasManualTheme, setHasManualTheme] = useState(hasStoredTheme);

  const applyTheme = useCallback((nextTheme: Theme, persist = true) => {
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    if (persist) {
      document.cookie = `theme=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
    }
    setTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const nextTheme = theme === "dark" ? "light" : "dark";
      const doc = document as TransitionDocument;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setHasManualTheme(true);

      if (!doc.startViewTransition || reduceMotion) {
        applyTheme(nextTheme);
        return;
      }

      const transition = doc.startViewTransition(() => {
        startTransition(() => applyTheme(nextTheme));
      });

      void transition.ready.then(() => {
        const x = origin?.x ?? window.innerWidth - 40;
        const y = origin?.y ?? 40;
        const radius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        );

        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 650,
            easing: "cubic-bezier(.76,0,.24,1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    },
    [applyTheme, theme],
  );

  const setLocale = useCallback((nextLocale: Locale) => {
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLocale;
    document.title = dictionaries[nextLocale].meta.title;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", dictionaries[nextLocale].meta.description);
    startTransition(() => setLocaleState(nextLocale));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.theme = theme;
  }, [locale, theme]);

  useEffect(() => {
    if (hasManualTheme) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applySystemTheme = () =>
      applyTheme(media.matches ? "dark" : "light", false);
    const frame = window.requestAnimationFrame(applySystemTheme);
    media.addEventListener("change", applySystemTheme);
    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("change", applySystemTheme);
    };
  }, [applyTheme, hasManualTheme]);

  const value = useMemo(
    () => ({
      locale,
      theme,
      dictionary: dictionaries[locale],
      setLocale,
      toggleTheme,
    }),
    [locale, setLocale, theme, toggleTheme],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
