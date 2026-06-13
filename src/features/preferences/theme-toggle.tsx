"use client";

import { Moon, Sun } from "lucide-react";
import type { MouseEvent } from "react";

import { usePreferences } from "@/features/preferences/preferences-provider";
import { Button } from "@/shared/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export function ThemeToggle() {
  const { theme, toggleTheme, locale } = usePreferences();
  const label =
    locale === "ru"
      ? theme === "dark"
        ? "Включить светлую тему"
        : "Включить темную тему"
      : theme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme";

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="icon"
          size="icon"
          aria-label={label}
          onClick={handleClick}
          className="group"
        >
          {theme === "dark" ? (
            <Sun className="size-4 transition-transform group-hover:rotate-45" />
          ) : (
            <Moon className="size-4 transition-transform group-hover:-rotate-12" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
