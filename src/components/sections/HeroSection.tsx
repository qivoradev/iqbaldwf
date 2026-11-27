"use client";

import Image from "next/image";
import { FilterTrackSlug, PROFILE } from "@/data/portfolio";
import { SignatureDock } from "./SignatureDock";

interface HeroSectionProps {
  onSelectTrack: (track: FilterTrackSlug) => void;
}

/**
 * Minimal Spark-Chart / TrendingUp inline editorial glyph
 */
function InlineSparkTrendGlyph() {
  return (
    <span
      aria-hidden="true"
      className="mx-2 sm:mx-2.5 inline-flex items-center justify-center align-middle"
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        className="h-[0.78em] w-[0.78em] translate-y-[-0.04em] text-foreground"
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
  return (
    <section
      aria-label="Introduction and portfolio dock"
      className="mx-auto flex w-full max-w-[820px] flex-col items-center px-4 sm:px-5 text-center"
    >
      {/* Avatar: Clean 96x96 circle using public/avatar.png (or replace with public/avatar.jpg) */}
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-neutral-200/60 dark:bg-neutral-900">
        <Image
          src="/avatar.png"
          alt={PROFILE.name}
          width={192}
          height={192}
          priority
          className="h-full w-full bg-transparent object-cover object-top scale-105 translate-y-1 grayscale contrast-[1.05]"
        />
      </div>

      {/* Name: Tight spacing directly below avatar */}
      <p className="mt-3.5 text-[15px] font-normal tracking-[-0.01em] text-neutral-700 dark:text-neutral-300">
        {PROFILE.name}
      </p>

      {/* Headline: Strictly font-normal (weight 400), mobile-safe clamp(1.75rem,7vw,3.35rem), 2 balanced lines */}
      <h1 className="mt-6 px-4 text-[clamp(1.75rem,7vw,3.35rem)] leading-[1.12] font-normal tracking-[-0.03em] text-foreground">
        <span className="block">
          Data analyst
          <InlineSparkTrendGlyph />
          &amp;
        </span>
        <span className="block">web developer</span>
      </h1>

      {/* Signature Squircle Dock */}
      <div className="mt-10 w-full md:mt-14">
        <SignatureDock onSelectTrack={onSelectTrack} />
      </div>
    </section>
  );
}
