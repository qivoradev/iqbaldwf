"use client";

import { useState } from "react";
import Image from "next/image";
import { FilterTrackSlug, PROFILE } from "@/data/portfolio";
import { useLanguage, useTheme } from "@/components/providers/AppProviders";
import { useUiSound } from "@/hooks/useUiSound";
import { SignatureDock } from "./SignatureDock";

interface HeroSectionProps {
  onSelectTrack: (track: FilterTrackSlug) => void;
}

/**
 * Minimal Spark-Chart / TrendingUp inline editorial glyph
 */
function InlineSparkTrendGlyph({ isTech }: { isTech: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mx-2 sm:mx-2.5 inline-flex items-center justify-center align-middle ${
        isTech ? "text-[#FFFFFF]" : "text-foreground"
      }`}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        className="h-[0.78em] w-[0.78em] translate-y-[-0.04em]"
      >
        <path
          d="M5.5 7.5V27.5C5.5 28.88 6.62 30 8 30H29.5"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 23L16.5 16.5L21.5 20.5L29.5 11.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.5 11.5H29.5V17.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function HeroSection({ onSelectTrack }: HeroSectionProps) {
  const { resolvedTheme, mounted } = useTheme();
  const { lang } = useLanguage();
  const { playSwitch } = useUiSound();
  const [isFlipped, setIsFlipped] = useState(false);

  const isTech = mounted && resolvedTheme === "tech";
  const flipLabel =
    lang === "id" ? "Balik foto profil" : "Flip profile photo";

  const handleFlipAvatar = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    playSwitch(nextFlipped);
  };

  return (
    <section
      aria-label="Introduction and portfolio dock"
      className="mx-auto flex w-full max-w-[820px] flex-col items-center px-4 sm:px-5 text-center"
    >
      {/* 3D Coin Flip Avatar: Front = Portrait, Back = IDF Monogram */}
      <button
        type="button"
        onClick={handleFlipAvatar}
        aria-pressed={isFlipped}
        aria-label={flipLabel}
        title={flipLabel}
        className="avatar-flip-scene group relative h-24 w-24 cursor-pointer bg-transparent p-0 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      >
        <div
          data-flipped={isFlipped ? "true" : "false"}
          className="avatar-flip-inner relative h-full w-full"
        >
          {/* Front Face: Profile Photo */}
          <div
            className={`avatar-flip-face avatar-flip-front absolute inset-0 overflow-hidden transition-shadow duration-200 ${
              isTech
                ? `rounded-none border border-[#FFFFFF] bg-[#04472B] ${
                    isFlipped ? "shadow-none" : "shadow-[4px_4px_0px_#FFFFFF]"
                  }`
                : "rounded-full bg-neutral-200/60 dark:bg-neutral-900"
            }`}
          >
            <Image
              src="/avatar.png"
              alt={PROFILE.name}
              width={192}
              height={192}
              priority
              className="h-full w-full bg-transparent object-cover object-top scale-105 translate-y-1 grayscale contrast-[1.05]"
            />
          </div>

          {/* Back Face: IDF Monogram */}
          <div
            aria-hidden={!isFlipped}
            className={`avatar-flip-face avatar-flip-back absolute inset-0 flex items-center justify-center overflow-hidden select-none transition-shadow duration-200 ${
              isTech
                ? `rounded-none border border-[#FFFFFF] bg-[#FFFFFF] font-mono text-xl font-bold tracking-[0.14em] text-[#04472B] ${
                    isFlipped
                      ? "shadow-[3px_3px_0px_#04472B,4px_4px_0px_#FFFFFF]"
                      : "shadow-none"
                  }`
                : "rounded-full border border-black/15 bg-[#111111] text-xl font-semibold tracking-[0.14em] text-[#FFFFFF] dark:border-white/[0.16] dark:bg-[#171717] dark:text-[#F5F5F5]"
            }`}
          >
            <span className="translate-x-[0.07em]">IDF</span>
          </div>
        </div>
      </button>

      {/* Name: Tight spacing directly below avatar */}
      <p
        className={`mt-3.5 text-[15px] font-normal tracking-[-0.01em] ${
          isTech
            ? "text-[#FFFFFF]"
            : "text-neutral-700 dark:text-neutral-300"
        }`}
      >
        {PROFILE.name}
      </p>

      {/* Headline: Strictly font-normal (weight 400), mobile-safe clamp(1.75rem,7vw,3.35rem), 2 balanced lines */}
      <h1
        className={`mt-6 px-4 text-[clamp(1.75rem,7vw,3.35rem)] leading-[1.12] font-normal tracking-[-0.03em] ${
          isTech ? "text-[#FFFFFF]" : "text-foreground"
        }`}
      >
        <span className="block">
          Data analyst
          <InlineSparkTrendGlyph isTech={isTech} />
          &amp;
        </span>
        <span className="block">BI reporting</span>
      </h1>

      {/* Signature Squircle Dock */}
      <div className="mt-10 w-full md:mt-14">
        <SignatureDock onSelectTrack={onSelectTrack} />
      </div>
    </section>
  );
}
