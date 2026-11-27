"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FilterTrackSlug, PROFILE } from "@/data/portfolio";
import { useLanguage } from "@/components/providers/AppProviders";
import { useUiSound } from "@/hooks/useUiSound";

interface AboutSectionProps {
  onSelectTrack?: (track: FilterTrackSlug) => void;
}

function DottedKeyword({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const className =
    "text-foreground underline decoration-dotted decoration-neutral-400 underline-offset-4 transition-colors hover:decoration-foreground dark:decoration-neutral-500";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={className}
      >
        {children}
      </button>
    );
  }

  return <span className={className}>{children}</span>;
}

const ABOUT_TEXT = {
  id: "Halo, saya Iqbal Dwi Fathonah, fresh graduate S1 Teknologi Informasi Universitas Muhammadiyah Yogyakarta (2026) yang berdedikasi mengolah data mentah menjadi insight bisnis yang rapi dan terukur. Saya berfokus sebagai Data Analyst menggunakan SQL, Excel, dan Looker Studio untuk mendukung keputusan operasional.",
  en: "Hi, I'm Iqbal Dwi Fathonah, a 2026 Bachelor of Information Technology fresh graduate from Universitas Muhammadiyah Yogyakarta dedicated to transforming raw data into clean, measurable business insights. I focus on Data Analysis using SQL, Excel, and Looker Studio to support operational decision-making.",
} as const;

export function AboutSection({ onSelectTrack }: AboutSectionProps) {
  const { lang } = useLanguage();
  const fullText = ABOUT_TEXT[lang];
  const [typedCount, setTypedCount] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  const { playKeystroke, playTick } = useUiSound();
  const playKeystrokeRef = useRef(playKeystroke);

  useEffect(() => {
    playKeystrokeRef.current = playKeystroke;
  }, [playKeystroke]);

  const completeImmediately = useCallback(() => {
    setTypedCount(fullText.length);
    setIsDone(true);
  }, [fullText.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isDone) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const interval = window.setInterval(() => {
      if (reducedMotion) {
        window.clearInterval(interval);
        setTypedCount(fullText.length);
        setIsDone(true);
        return;
      }

      setTypedCount((prev) => {
        const next = prev + 2;
        if (next % 4 === 0) {
          playKeystrokeRef.current();
        }
        if (next >= fullText.length) {
          window.clearInterval(interval);
          setIsDone(true);
          return fullText.length;
        }
        return next;
      });
    }, 18);

    return () => window.clearInterval(interval);
  }, [fullText.length, isDone]);

  return (
    <section
      aria-label="About Iqbal Dwi Fathonah"
      onClick={() => {
        if (!isDone) {
          playTick();
          completeImmediately();
        }
      }}
      className={`mx-auto w-full max-w-[600px] px-6 py-10 text-left md:py-14 ${
        !isDone ? "cursor-pointer" : ""
      }`}
    >
      <div className="space-y-6 text-[16px] leading-[1.72] font-normal tracking-[-0.01em] text-neutral-800 md:text-[17px] dark:text-neutral-200">
        <p className="min-h-[7.5rem]">
          {isDone ? (
            lang === "id" ? (
              <>
                Halo, saya{" "}
                <span className="text-foreground">{PROFILE.name}</span>, fresh
                graduate S1 Teknologi Informasi{" "}
                <DottedKeyword>
                  Universitas Muhammadiyah Yogyakarta (2026)
                </DottedKeyword>{" "}
                yang berdedikasi mengolah data mentah menjadi insight bisnis
                yang rapi dan terukur. Saya berfokus sebagai{" "}
                <DottedKeyword
                  onClick={
                    onSelectTrack
                      ? () => onSelectTrack("data-analyst")
                      : undefined
                  }
                >
                  Data Analyst
                </DottedKeyword>{" "}
                menggunakan <DottedKeyword>SQL</DottedKeyword>,{" "}
                <DottedKeyword>Excel</DottedKeyword>, dan{" "}
                <DottedKeyword>Looker Studio</DottedKeyword> untuk mendukung
                keputusan operasional.
              </>
            ) : (
              <>
                Hi, I&apos;m{" "}
                <span className="text-foreground">{PROFILE.name}</span>, a{" "}
                <DottedKeyword>2026</DottedKeyword> Bachelor of Information
                Technology fresh graduate from{" "}
                <DottedKeyword>
                  Universitas Muhammadiyah Yogyakarta
                </DottedKeyword>{" "}
                dedicated to transforming raw data into clean, measurable
                business insights. I focus on{" "}
                <DottedKeyword
                  onClick={
                    onSelectTrack
                      ? () => onSelectTrack("data-analyst")
                      : undefined
                  }
                >
                  Data Analysis
                </DottedKeyword>{" "}
                using <DottedKeyword>SQL</DottedKeyword>,{" "}
                <DottedKeyword>Excel</DottedKeyword>, and{" "}
                <DottedKeyword>Looker Studio</DottedKeyword> to support
                operational decision-making.
              </>
            )
          ) : (
            <>
              <span>{fullText.slice(0, typedCount)}</span>
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-4 w-[1.5px] translate-y-0.5 animate-pulse bg-foreground"
              />
            </>
          )}
        </p>
      </div>
    </section>
  );
}
