"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Mail } from "lucide-react";
import { FilterTrackSlug, PROFILE } from "@/data/portfolio";
import { useLanguage } from "@/components/providers/AppProviders";
import { useUiSound } from "@/hooks/useUiSound";

interface AboutSectionProps {
  onSelectTrack?: (track: FilterTrackSlug) => void;
}

interface TextSegment {
  text: string;
  underline?: boolean;
  action?: "data-analyst";
}

function LinkedInMiniIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path d="M6.94 8.5v10.56H3.56V8.5h3.38zm.22-3.26c0 1.01-.76 1.82-1.99 1.82h-.02c-1.19 0-1.95-.81-1.95-1.82 0-1.03.78-1.82 2-1.82s1.94.79 1.96 1.82zM20.44 13v6.06h-3.37v-5.65c0-1.42-.51-2.39-1.78-2.39-.97 0-1.55.65-1.8 1.28-.09.23-.12.54-.12.86v5.9H9.99s.05-9.57 0-10.56h3.38v1.5c.45-.69 1.25-1.68 3.05-1.68 2.22 0 4.02 1.45 4.02 4.68z" />
    </svg>
  );
}

function GitHubMiniIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

const PARAGRAPHS_ID: { greeting: string; p1: TextSegment[]; p2: TextSegment[] } = {
  greeting: "Hai, terima kasih sudah mampir.",
  p1: [
    { text: "Saya Iqbal Dwi Fathonah, fresh graduate S1 Teknologi Informasi " },
    { text: "Universitas Muhammadiyah Yogyakarta (2026)", underline: true },
    {
      text: " yang berdedikasi mengolah data mentah menjadi insight bisnis yang rapi dan terukur.",
    },
  ],
  p2: [
    { text: "Saat ini saya berfokus sebagai " },
    { text: "Data Analyst", underline: true, action: "data-analyst" },
    { text: " menggunakan " },
    { text: "SQL", underline: true },
    { text: ", " },
    { text: "Excel", underline: true },
    { text: ", dan " },
    { text: "Looker Studio", underline: true },
    { text: " untuk mendukung keputusan operasional." },
  ],
};

const PARAGRAPHS_EN: { greeting: string; p1: TextSegment[]; p2: TextSegment[] } = {
  greeting: "Hey, glad you stopped by.",
  p1: [
    {
      text: "I'm Iqbal Dwi Fathonah, a Bachelor of Information Technology fresh graduate from ",
    },
    { text: "Universitas Muhammadiyah Yogyakarta (2026)", underline: true },
    {
      text: " dedicated to transforming raw data into clean, measurable business insights.",
    },
  ],
  p2: [
    { text: "Currently, I focus on " },
    { text: "Data Analysis", underline: true, action: "data-analyst" },
    { text: " using " },
    { text: "SQL", underline: true },
    { text: ", " },
    { text: "Excel", underline: true },
    { text: ", and " },
    { text: "Looker Studio", underline: true },
    { text: " to support operational decision-making." },
  ],
};

function renderSegmentsUpTo(
  segments: TextSegment[],
  charBudget: number,
  onSelectTrack?: (track: FilterTrackSlug) => void
) {
  let remaining = charBudget;
  return segments.map((seg, idx) => {
    if (remaining <= 0) return null;
    const slice = seg.text.slice(0, remaining);
    remaining -= slice.length;

    const underlineClass =
      "text-foreground underline decoration-neutral-400/70 dark:decoration-neutral-500 underline-offset-4 transition-colors hover:decoration-neutral-900 dark:hover:decoration-white";

    if (seg.underline && seg.action && onSelectTrack) {
      return (
        <button
          key={idx}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectTrack(seg.action!);
          }}
          className={underlineClass}
        >
          {slice}
        </button>
      );
    }

    if (seg.underline) {
      return (
        <span key={idx} className={underlineClass}>
          {slice}
        </span>
      );
    }

    return <span key={idx}>{slice}</span>;
  });
}

export function AboutSection({ onSelectTrack }: AboutSectionProps) {
  const { lang } = useLanguage();
  const content = lang === "id" ? PARAGRAPHS_ID : PARAGRAPHS_EN;

  // Build combined timeline string with '\n' markers for paragraph pauses
  const fullStream = useMemo(() => {
    const p1Text = content.p1.map((s) => s.text).join("");
    const p2Text = content.p2.map((s) => s.text).join("");
    return `${content.greeting}\n${p1Text}\n${p2Text}`;
  }, [content]);

  const greetingLen = content.greeting.length;
  const p1Len = useMemo(
    () => content.p1.reduce((acc, s) => acc + s.text.length, 0),
    [content.p1]
  );

  const [typedCount, setTypedCount] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  const { playKeystroke, playTypewriterBell, playTick } = useUiSound();
  const playKeystrokeRef = useRef(playKeystroke);
  const playBellRef = useRef(playTypewriterBell);
  const bellPlayedRef = useRef<boolean>(false);

  useEffect(() => {
    playKeystrokeRef.current = playKeystroke;
    playBellRef.current = playTypewriterBell;
  }, [playKeystroke, playTypewriterBell]);

  const completeBySkip = useCallback(() => {
    // Mark bell as already handled so skipping never rings the typewriter bell
    bellPlayedRef.current = true;
    setTypedCount(fullStream.length);
    setIsDone(true);
  }, [fullStream.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isDone) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (typedCount >= fullStream.length) {
      const doneTimer = window.setTimeout(() => {
        if (!bellPlayedRef.current) {
          bellPlayedRef.current = true;
          playBellRef.current();
        }
        setIsDone(true);
      }, 10);
      return () => window.clearTimeout(doneTimer);
    }

    const currentChar = fullStream[typedCount] ?? "";
    // Rhythmic vintage typewriter cadence: 24–38ms per character
    let delay = 24 + Math.floor(Math.random() * 15);

    if (reducedMotion) {
      delay = 10;
    } else if (currentChar === "\n") {
      delay = 220; // Natural paragraph transition pause
    } else if (currentChar === "." || currentChar === ",") {
      delay = 140; // Natural punctuation pause (140ms)
    }

    const timer = window.setTimeout(() => {
      if (reducedMotion) {
        bellPlayedRef.current = true;
        setTypedCount(fullStream.length);
        setIsDone(true);
        return;
      }

      if (currentChar !== " " && currentChar !== "\n") {
        playKeystrokeRef.current(currentChar);
      }

      const nextCount = typedCount + 1;
      setTypedCount(nextCount);
      if (nextCount >= fullStream.length) {
        if (!bellPlayedRef.current) {
          bellPlayedRef.current = true;
          playBellRef.current();
        }
        setIsDone(true);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [typedCount, fullStream, isDone]);

  // Calculate visible character budgets for Greeting, P1, and P2
  const activeCount = isDone ? fullStream.length : typedCount;
  const greetingBudget = Math.min(activeCount, greetingLen);
  const p1Budget = Math.max(0, Math.min(activeCount - greetingLen - 1, p1Len));
  const p2Budget = Math.max(0, activeCount - greetingLen - 1 - p1Len - 1);

  return (
    <section
      aria-label="About Iqbal Dwi Fathonah"
      onClick={() => {
        if (!isDone) {
          playTick();
          completeBySkip();
        }
      }}
      className={`mx-auto w-full max-w-[540px] px-6 pt-28 pb-20 text-left ${
        !isDone ? "cursor-pointer" : ""
      }`}
    >
      {/* Top Greeting Line: warm, muted editorial tone */}
      <p className="mb-6 text-[15px] font-normal text-neutral-500 dark:text-neutral-400">
        {content.greeting.slice(0, greetingBudget)}
      </p>

      <div className="space-y-6 text-[16px] leading-[1.72] font-normal tracking-[-0.01em] text-neutral-800 md:text-[17px] dark:text-neutral-200">
        {/* Paragraph 1 */}
        {p1Budget > 0 && (
          <p>{renderSegmentsUpTo(content.p1, p1Budget, onSelectTrack)}</p>
        )}

        {/* Paragraph 2 */}
        {p2Budget > 0 && (
          <p>{renderSegmentsUpTo(content.p2, p2Budget, onSelectTrack)}</p>
        )}

        {/* Minimalist Closing Block (Fade-in after typing completes) */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pt-4"
          >
            <p className="text-[15px] text-foreground">
              {lang === "id" ? "Mari terhubung" : "Let's connect"}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-5 text-[14px]">
              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={playTick}
                className="inline-flex items-center gap-1.5 text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                <LinkedInMiniIcon />
                <span>LinkedIn</span>
              </a>

              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={playTick}
                className="inline-flex items-center gap-1.5 text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                <GitHubMiniIcon />
                <span>GitHub</span>
              </a>

              <a
                href={`mailto:${PROFILE.email}`}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={playTick}
                className="inline-flex items-center gap-1.5 text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email</span>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
