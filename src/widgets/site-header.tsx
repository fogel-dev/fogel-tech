"use client";

import { Menu } from "lucide-react";

import { LanguageToggle } from "@/features/preferences/language-toggle";
import { usePreferences } from "@/features/preferences/preferences-provider";
import { ThemeToggle } from "@/features/preferences/theme-toggle";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

const links = [
  ["work", "#work"],
  ["approach", "#approach"],
  ["stack", "#stack"],
  ["contact", "#contact"],
] as const;

export function SiteHeader() {
  const { dictionary } = usePreferences();

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 md:px-8 md:pt-6">
      <div className="mx-auto flex max-w-[96rem] items-center justify-between rounded-full border border-border bg-background/55 px-3 py-2 shadow-[var(--shadow-nav)] backdrop-blur-2xl md:px-4">
        <a
          href="#top"
          className="group flex items-center gap-3 rounded-full px-2 py-1"
          aria-label="Egor Fogel"
        >
          <span className="grid size-8 place-items-center rounded-full border border-accent/40 bg-accent/10 font-mono text-[0.65rem] font-semibold text-accent">
            EF
          </span>
          <span className="hidden text-sm font-semibold tracking-[-0.02em] sm:block">
            Egor Fogel
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(([key, href]) => (
            <Button key={key} asChild variant="ghost" size="sm">
              <a href={href}>{dictionary.nav[key]}</a>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="icon"
                size="icon"
                className="lg:hidden"
                aria-label={dictionary.nav.menu}
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {dictionary.nav.menu}
              </SheetTitle>
              <nav className="mt-20 grid gap-3">
                {links.map(([key, href], index) => (
                  <SheetClose asChild key={key}>
                    <a
                      href={href}
                      className="flex items-baseline gap-4 border-b border-border py-5 text-3xl font-semibold tracking-[-0.04em]"
                    >
                      <span className="font-mono text-[0.65rem] text-accent">
                        0{index + 1}
                      </span>
                      {dictionary.nav[key]}
                    </a>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
