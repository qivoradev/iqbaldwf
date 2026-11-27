"use client";

import Image from "next/image";
import { FilterTrackSlug, PROFILE } from "@/data/portfolio";
import { useLanguage } from "@/components/providers/AppProviders";
import { SignatureDock } from "./SignatureDock";

interface HeroSectionProps {
  onSelectTrack: (track: FilterTrackSlug) => void;
}

function InlineLayersPlusGlyph() {
  return (
    <span
      aria-hidden="true"
      className="mx-2 inline-flex items-center justify-center align-middle"
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        className="h-[0.78em] w-[0.78em] translate-y-[-0.04em] text-foreground"
      >
        <path
          d="M18 4.5L4.5 11.2L18 17.9L31.5 11.2L18 4.5Z"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 17.9L18 24.6L31.5 17.9"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 24.6L18 31.3L23.5 28.5"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28.5 24V31.5M24.75 27.75H32.25"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function HeroSection({ onSelectTrack }: HeroSectionProps) {
  const { lang } = useLanguage();

  return (
    <section
      aria-label="Introduction and portfolio dock"
      className="mx-auto flex w-full max-w-[820px] flex-col items-center px-5 text-center"
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

      {/* Headline: Strictly font-normal (weight 400), 2 balanced lines with inline icon (mx-2) */}
      <h1 className="mt-6 text-[clamp(2rem,4.5vw,3.35rem)] leading-[1.12] font-normal tracking-[-0.03em] text-foreground">
        <span className="block">
          Data analyst
          <InlineLayersPlusGlyph />
          &amp;
        </span>
        <span className="block">
          {lang === "id" ? "eksplorasi web" : "web enthusiast"}
        </span>
      </h1>

      {/* Signature Squircle Dock */}
      <div className="mt-11 w-full md:mt-14">
        <SignatureDock onSelectTrack={onSelectTrack} />
      </div>
    </section>
  );
}
