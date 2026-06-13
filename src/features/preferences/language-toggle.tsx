"use client";

import { usePreferences } from "@/features/preferences/preferences-provider";
import { Button } from "@/shared/ui/button";

export function LanguageToggle() {
  const { locale, setLocale } = usePreferences();
  const nextLocale = locale === "ru" ? "en" : "ru";
  const label =
    locale === "ru" ? "Switch language to English" : "Переключить язык на русский";

  return (
    <Button
      variant="icon"
      size="icon"
      aria-label={label}
      onClick={() => setLocale(nextLocale)}
      className="font-mono text-[0.68rem] uppercase tracking-widest"
    >
      {nextLocale}
    </Button>
  );
}
