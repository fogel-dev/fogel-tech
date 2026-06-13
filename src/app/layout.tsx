import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";

import { dictionaries, type Locale } from "@/content/home";
import {
  PreferencesProvider,
  type Theme,
} from "@/features/preferences/preferences-provider";
import { TooltipProvider } from "@/shared/ui/tooltip";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: dictionaries.ru.meta.title,
  description: dictionaries.ru.meta.description,
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ede9df" },
    { media: "(prefers-color-scheme: dark)", color: "#080a09" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const localeCookie = cookieStore.get("locale")?.value;
  const themeCookie = cookieStore.get("theme")?.value;
  const language = headerStore.get("accept-language") ?? "";
  const initialLocale: Locale =
    localeCookie === "en" || localeCookie === "ru"
      ? localeCookie
      : language.toLowerCase().startsWith("en")
        ? "en"
        : "ru";
  const initialTheme: Theme =
    themeCookie === "light" || themeCookie === "dark"
      ? themeCookie
      : "dark";

  return (
    <html
      lang={initialLocale}
      data-theme={initialTheme}
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <PreferencesProvider
          initialLocale={initialLocale}
          initialTheme={initialTheme}
        >
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
