"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage, useTheme } from "@/components/providers/AppProviders";
import { useUiSound } from "@/hooks/useUiSound";

interface TopPillNavbarProps {
  isSubView?: boolean;
  onSelectAbout?: () => void;
  onBack?: () => void;
  backHref?: string;
}

function SunGlyph() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <circle
        cx="10"
        cy="10"
        r="3.4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 2.5V4.3M10 15.7V17.5M17.5 10H15.7M4.3 10H2.5M15.3 4.7L14.03 5.97M5.97 14.03L4.7 15.3M15.3 15.3L14.03 14.03M5.97 5.97L4.7 4.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path
        d="M14.95 12.68A5.8 5.8 0 017.32 5.05a5.8 5.8 0 107.63 7.63z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopPillNavbar({
  isSubView = false,
  onSelectAbout,
  onBack,
  backHref,
}: TopPillNavbarProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const { lang, toggleLanguage } = useLanguage();
  const { playSwitch, playTick } = useUiSound();

  const handleThemeToggle = () => {
    const nextIsDark = theme !== "dark";
    toggleTheme();
    playSwitch(nextIsDark);
  };

  const handleLanguageToggle = () => {
    playTick();
    toggleLanguage();
  };

  const aboutLabel = lang === "id" ? "tentang" : "about";
  const backLabel = lang === "id" ? "kembali" : "back";

  return (
    <header className="sticky top-4 z-40 mx-auto w-fit pt-4 sm:pt-6 md:pt-8">
      <nav
        aria-label="Primary controls"
        className="flex h-9 items-center gap-1.5 rounded-full border border-black/[0.12] bg-white/85 px-2 text-[13px] text-neutral-700 backdrop-blur-md transition-colors dark:border-white/[0.14] dark:bg-neutral-950/85 dark:text-neutral-300"
      >
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={handleThemeToggle}
          onMouseEnter={playTick}
          aria-label={
            mounted
              ? theme === "dark"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
              : "Toggle color theme"
          }
          title={
            mounted
              ? theme === "dark"
                ? "Light mode"
                : "Dark mode"
              : "Toggle theme"
          }
          className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-neutral-700 transition-all duration-150 hover:text-black focus-visible:ring-1 focus-visible:ring-black active:scale-95 dark:text-neutral-300 dark:hover:text-white dark:focus-visible:ring-white"
        >
          {mounted && theme === "dark" ? <MoonGlyph /> : <SunGlyph />}
        </button>

        <span
          aria-hidden="true"
          className="h-3.5 w-[1px] bg-black/10 dark:bg-white/15"
        />

        {/* Single Language Code Toggle: displays ONLY 'ID' or 'EN' */}
        <button
          type="button"
          onClick={handleLanguageToggle}
          onMouseEnter={playTick}
          aria-label={
            lang === "id"
              ? "Ganti bahasa ke Bahasa Inggris (EN)"
              : "Switch language to Indonesian (ID)"
          }
          title={
            lang === "id"
              ? "Bahasa Indonesia (Klik untuk EN)"
              : "English (Click for ID)"
          }
          className="relative flex h-6.5 min-w-[28px] items-center justify-center overflow-hidden rounded-full px-1.5 font-mono text-[11px] font-medium tracking-wider text-neutral-700 uppercase transition-colors duration-150 hover:text-black focus-visible:ring-1 focus-visible:ring-black active:scale-95 dark:text-neutral-300 dark:hover:text-white dark:focus-visible:ring-white"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={lang}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="block leading-none"
            >
              {lang.toUpperCase()}
            </motion.span>
          </AnimatePresence>
        </button>

        <span
          aria-hidden="true"
          className="h-3.5 w-[1px] bg-black/10 dark:bg-white/15"
        />

        {/* Right Action: "tentang/about" on Home, "kembali/back" on Sub-view / Track page */}
        {backHref ? (
          <Link
            href={backHref}
            onClick={playTick}
            onMouseEnter={playTick}
            className="rounded-full px-2.5 py-0.5 text-[13px] font-normal tracking-[-0.01em] text-neutral-700 transition-all duration-150 hover:text-black hover:ring-1 hover:ring-black/25 focus-visible:ring-1 focus-visible:ring-black active:scale-95 dark:text-neutral-300 dark:hover:text-white dark:hover:ring-white/30 dark:focus-visible:ring-white"
          >
            {backLabel}
          </Link>
        ) : isSubView ? (
          <button
            type="button"
            onClick={() => {
              playTick();
              onBack?.();
            }}
            onMouseEnter={playTick}
            className="rounded-full px-2.5 py-0.5 text-[13px] font-normal tracking-[-0.01em] text-neutral-700 transition-all duration-150 hover:text-black hover:ring-1 hover:ring-black/25 focus-visible:ring-1 focus-visible:ring-black active:scale-95 dark:text-neutral-300 dark:hover:text-white dark:hover:ring-white/30 dark:focus-visible:ring-white"
          >
            {backLabel}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              playTick();
              onSelectAbout?.();
            }}
            onMouseEnter={playTick}
            className="rounded-full px-2.5 py-0.5 text-[13px] font-normal tracking-[-0.01em] text-neutral-700 transition-all duration-150 hover:text-black hover:ring-1 hover:ring-black/25 focus-visible:ring-1 focus-visible:ring-black active:scale-95 dark:text-neutral-300 dark:hover:text-white dark:hover:ring-white/30 dark:focus-visible:ring-white"
          >
            {aboutLabel}
          </button>
        )}
      </nav>
    </header>
  );
}
