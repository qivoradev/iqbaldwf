"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ThemeMode,
  useLanguage,
  useTheme,
} from "@/components/providers/AppProviders";
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

function TerminalPromptGlyph() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-3.5 w-3.5 text-current"
    >
      <path
        d="M4.5 6.5L8.5 10L4.5 13.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 13.5H15.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

const THEME_OPTIONS: { id: ThemeMode; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "tech", label: "Tech" },
];

export function TopPillNavbar({
  isSubView = false,
  onSelectAbout,
  onBack,
  backHref,
}: TopPillNavbarProps) {
  const { theme, resolvedTheme, setTheme, mounted } = useTheme();
  const { lang, toggleLanguage } = useLanguage();
  const { soundEnabled, setSoundEnabled, playLightSwitch, playTick } =
    useUiSound();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isTech = mounted && resolvedTheme === "tech";

  // Close popover on outside click or Escape key
  useEffect(() => {
    if (!isPopoverOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (
        containerRef.current &&
        target &&
        !containerRef.current.contains(target)
      ) {
        setIsPopoverOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isPopoverOpen]);

  const handleTogglePopover = () => {
    playTick();
    setIsPopoverOpen((prev) => !prev);
  };

  const handleSelectTheme = (nextTheme: ThemeMode) => {
    if (nextTheme === theme) return;
    setTheme(nextTheme);
    const variant =
      nextTheme === "light" || nextTheme === "auto" ? "on" : "off";
    playLightSwitch(variant);
  };

  const handleToggleSoundEffects = () => {
    const nextEnabled = !soundEnabled;
    if (nextEnabled) {
      setSoundEnabled(true);
      playLightSwitch("on", true);
    } else {
      playLightSwitch("off", true);
      setSoundEnabled(false);
    }
  };

  const handleLanguageToggle = () => {
    playTick();
    toggleLanguage();
  };

  const aboutLabel = lang === "id" ? "tentang" : "about";
  const backLabel = lang === "id" ? "kembali" : "back";

  return (
    <header className="sticky top-4 z-40 mx-auto w-fit pt-4 sm:pt-6 md:pt-8">
      <div ref={containerRef} className="relative">
        <nav
          aria-label="Primary controls"
          className={`flex h-9 items-center gap-1.5 px-2 text-[13px] transition-all ${
            isTech
              ? "rounded-none border border-[#FFFFFF] bg-[#04472B] text-[#FFFFFF] shadow-[4px_4px_0px_#FFFFFF]"
              : "rounded-full border border-black/[0.12] bg-white/85 text-neutral-700 backdrop-blur-md dark:border-white/[0.14] dark:bg-neutral-950/85 dark:text-neutral-300"
          }`}
        >
          {/* Theme & Sound Settings Popover Trigger */}
          <button
            type="button"
            onClick={handleTogglePopover}
            onMouseEnter={playTick}
            aria-expanded={isPopoverOpen}
            aria-haspopup="dialog"
            aria-label={
              lang === "id"
                ? "Pengaturan tema dan efek suara"
                : "Theme and sound effects settings"
            }
            title={
              lang === "id"
                ? "Tema & Efek Suara"
                : "Theme & Sound Effects"
            }
            className={`flex h-6.5 w-6.5 items-center justify-center transition-all duration-150 active:scale-95 ${
              isTech
                ? `rounded-none ${
                    isPopoverOpen
                      ? "bg-[#FFFFFF] text-[#04472B]"
                      : "text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#04472B]"
                  }`
                : `rounded-full text-neutral-700 hover:text-black focus-visible:ring-1 focus-visible:ring-black dark:text-neutral-300 dark:hover:text-white dark:focus-visible:ring-white ${
                    isPopoverOpen
                      ? "bg-black/[0.07] dark:bg-white/[0.12]"
                      : ""
                  }`
            }`}
          >
            {mounted ? (
              resolvedTheme === "tech" ? (
                <TerminalPromptGlyph />
              ) : resolvedTheme === "dark" ? (
                <MoonGlyph />
              ) : (
                <SunGlyph />
              )
            ) : (
              <SunGlyph />
            )}
          </button>

          <span
            aria-hidden="true"
            className={`h-3.5 w-[1px] ${
              isTech ? "bg-[#FFFFFF]" : "bg-black/10 dark:bg-white/15"
            }`}
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
            className={`relative flex h-6.5 min-w-[28px] items-center justify-center overflow-hidden px-1.5 font-mono text-[11px] font-medium tracking-wider uppercase transition-colors duration-150 active:scale-95 ${
              isTech
                ? "rounded-none text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#04472B]"
                : "rounded-full text-neutral-700 hover:text-black focus-visible:ring-1 focus-visible:ring-black dark:text-neutral-300 dark:hover:text-white dark:focus-visible:ring-white"
            }`}
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
            className={`h-3.5 w-[1px] ${
              isTech ? "bg-[#FFFFFF]" : "bg-black/10 dark:bg-white/15"
            }`}
          />

          {/* Right Action: "tentang/about" on Home, "kembali/back" on Sub-view / Track page */}
          {backHref ? (
            <Link
              href={backHref}
              onClick={playTick}
              onMouseEnter={playTick}
              className={`px-2.5 py-0.5 text-[13px] font-normal tracking-[-0.01em] transition-all duration-150 active:scale-95 ${
                isTech
                  ? "rounded-none text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#04472B]"
                  : "rounded-full text-neutral-700 hover:text-black hover:ring-1 hover:ring-black/25 focus-visible:ring-1 focus-visible:ring-black dark:text-neutral-300 dark:hover:text-white dark:hover:ring-white/30 dark:focus-visible:ring-white"
              }`}
            >
              {backLabel}
            </Link>
          ) : isSubView ? (
            <button
              type="button"
              onClick={() => {
                playTick();
                setIsPopoverOpen(false);
                onBack?.();
              }}
              onMouseEnter={playTick}
              className={`px-2.5 py-0.5 text-[13px] font-normal tracking-[-0.01em] transition-all duration-150 active:scale-95 ${
                isTech
                  ? "rounded-none text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#04472B]"
                  : "rounded-full text-neutral-700 hover:text-black hover:ring-1 hover:ring-black/25 focus-visible:ring-1 focus-visible:ring-black dark:text-neutral-300 dark:hover:text-white dark:hover:ring-white/30 dark:focus-visible:ring-white"
              }`}
            >
              {backLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                playTick();
                setIsPopoverOpen(false);
                onSelectAbout?.();
              }}
              onMouseEnter={playTick}
              className={`px-2.5 py-0.5 text-[13px] font-normal tracking-[-0.01em] transition-all duration-150 active:scale-95 ${
                isTech
                  ? "rounded-none text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#04472B]"
                  : "rounded-full text-neutral-700 hover:text-black hover:ring-1 hover:ring-black/25 focus-visible:ring-1 focus-visible:ring-black dark:text-neutral-300 dark:hover:text-white dark:hover:ring-white/30 dark:focus-visible:ring-white"
              }`}
            >
              {aboutLabel}
            </button>
          )}
        </nav>

        {/* Settings Popover (4-Mode Theme Segmented Control + Global Sound Effects Switch) */}
        <AnimatePresence>
          {isPopoverOpen && (
            <motion.div
              role="dialog"
              aria-label={
                lang === "id" ? "Pengaturan tampilan" : "Display settings"
              }
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute top-full left-1/2 z-50 mt-2.5 w-[290px] max-w-[calc(100vw-2rem)] -translate-x-1/2 p-3.5 ${
                isTech
                  ? "rounded-none border border-[#FFFFFF] bg-[#04472B] text-[#FFFFFF] shadow-[4px_4px_0px_#FFFFFF]"
                  : "rounded-[20px] border border-black/10 bg-white/92 text-neutral-800 shadow-[0_14px_40px_rgba(0,0,0,0.12)] ring-1 ring-inset ring-white/60 backdrop-blur-xl dark:border-white/15 dark:bg-[#1C1C1E]/95 dark:text-neutral-200 dark:shadow-[0_18px_46px_rgba(0,0,0,0.65)] dark:ring-white/[0.06]"
              }`}
            >
              {/* 1. Theme Segmented Control */}
              <div>
                <p
                  className={`text-[11px] font-medium tracking-wider uppercase ${
                    isTech
                      ? "font-mono text-[#FFFFFF]"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {lang === "id" ? "Tema" : "Theme"}
                </p>

                <div
                  role="radiogroup"
                  aria-label={lang === "id" ? "Pilih tema" : "Select theme"}
                  className={`mt-2 grid grid-cols-4 ${
                    isTech
                      ? "divide-x divide-[#FFFFFF] rounded-none border border-[#FFFFFF] bg-[#04472B] p-0"
                      : "gap-1 rounded-xl bg-black/[0.05] p-1 dark:bg-white/[0.07]"
                  }`}
                >
                  {THEME_OPTIONS.map((opt) => {
                    const isSelected = mounted && theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleSelectTheme(opt.id)}
                        onMouseEnter={playTick}
                        className={`py-1.5 text-center text-xs font-medium transition-all duration-150 ${
                          isTech
                            ? isSelected
                              ? "rounded-none border-b-4 border-[#FFFFFF] bg-[#FFFFFF] font-semibold text-[#04472B]"
                              : "rounded-none bg-[#04472B] text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#04472B]"
                            : isSelected
                              ? "rounded-lg bg-white text-black shadow-xs dark:bg-neutral-800 dark:text-white"
                              : "rounded-lg text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div
                aria-hidden="true"
                className={`my-3 h-px w-full ${
                  isTech
                    ? "bg-[#FFFFFF]"
                    : "bg-black/[0.08] dark:bg-white/[0.1]"
                }`}
              />

              {/* 2. Global UI Sound Effects Toggle Row */}
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-[13px] ${
                    isTech
                      ? "font-mono text-[#FFFFFF]"
                      : "font-normal text-neutral-800 dark:text-neutral-200"
                  }`}
                >
                  {lang === "id" ? "Efek suara" : "Sound effects"}
                </span>

                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  aria-label={
                    lang === "id"
                      ? "Saklar efek suara interaksi"
                      : "Toggle UI sound effects"
                  }
                  onClick={handleToggleSoundEffects}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center transition-colors duration-150 ${
                    isTech
                      ? "rounded-none border border-[#FFFFFF] bg-[#04472B]"
                      : `rounded-full p-0.5 ${
                          soundEnabled
                            ? "bg-neutral-900 dark:bg-white"
                            : "bg-neutral-300 dark:bg-neutral-700"
                        }`
                  }`}
                >
                  <span
                    className={`pointer-events-none block h-4.5 w-4.5 transition-transform duration-150 ${
                      isTech
                        ? `rounded-none bg-[#FFFFFF] ${
                            soundEnabled
                              ? "translate-x-5.5"
                              : "translate-x-0.5 opacity-60"
                          }`
                        : `rounded-full shadow-xs ${
                            soundEnabled
                              ? "translate-x-5 bg-white dark:bg-neutral-950"
                              : "translate-x-0.5 bg-white dark:bg-neutral-300"
                          }`
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
