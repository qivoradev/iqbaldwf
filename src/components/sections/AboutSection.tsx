"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Mail, X } from "lucide-react";
import {
  CERTIFICATES,
  CertificateItem,
  FilterTrackSlug,
  PROFILE,
  t,
} from "@/data/portfolio";
import { useLanguage, useTheme } from "@/components/providers/AppProviders";
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
    { text: "Saya Iqbal Dwi Fathonah, lulusan S1 Teknologi Informasi " },
    { text: "Universitas Muhammadiyah Yogyakarta (2026)", underline: true },
    {
      text: " yang fokus mengolah data mentah menjadi analisis bisnis yang jelas dan terstruktur.",
    },
  ],
  p2: [
    { text: "Sehari-hari saya bekerja di bidang " },
    { text: "Data Analyst", underline: true, action: "data-analyst" },
    { text: " menggunakan " },
    { text: "SQL", underline: true },
    { text: ", " },
    { text: "Excel", underline: true },
    { text: ", dan " },
    { text: "Looker Studio", underline: true },
    { text: " untuk membantu pengambilan keputusan operasional." },
  ],
};

const PARAGRAPHS_EN: { greeting: string; p1: TextSegment[]; p2: TextSegment[] } = {
  greeting: "Hey, glad you stopped by.",
  p1: [
    {
      text: "I'm Iqbal Dwi Fathonah, an Information Technology graduate from ",
    },
    { text: "Universitas Muhammadiyah Yogyakarta (2026)", underline: true },
    {
      text: " focused on turning raw data into clear, structured business analysis.",
    },
  ],
  p2: [
    { text: "My current work centers on " },
    { text: "Data Analysis", underline: true, action: "data-analyst" },
    { text: " with " },
    { text: "SQL", underline: true },
    { text: ", " },
    { text: "Excel", underline: true },
    { text: ", and " },
    { text: "Looker Studio", underline: true },
    { text: " to support practical operational decisions." },
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
  const { mounted } = useTheme();
  const content = lang === "id" ? PARAGRAPHS_ID : PARAGRAPHS_EN;

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
  const [activeCertificate, setActiveCertificate] =
    useState<CertificateItem | null>(null);

  const { playKeystroke, playTypewriterBell, playTick } = useUiSound();
  const playKeystrokeRef = useRef(playKeystroke);
  const playBellRef = useRef(playTypewriterBell);
  const bellPlayedRef = useRef<boolean>(false);

  useEffect(() => {
    playKeystrokeRef.current = playKeystroke;
    playBellRef.current = playTypewriterBell;
  }, [playKeystroke, playTypewriterBell]);

  const completeBySkip = useCallback(() => {
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
    let delay = 24 + Math.floor(Math.random() * 15);

    if (reducedMotion) {
      delay = 10;
    } else if (currentChar === "\n") {
      delay = 220;
    } else if (currentChar === "." || currentChar === ",") {
      delay = 140;
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

  // Handle Escape key & body scroll lock for CertificateModal
  useEffect(() => {
    if (!activeCertificate) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setActiveCertificate(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [activeCertificate]);

  const activeCount = isDone ? fullStream.length : typedCount;
  const greetingBudget = Math.min(activeCount, greetingLen);
  const p1Budget = Math.max(0, Math.min(activeCount - greetingLen - 1, p1Len));
  const p2Budget = Math.max(0, activeCount - greetingLen - 1 - p1Len - 1);
  const closeLabel = lang === "id" ? "Tutup" : "Close";

  return (
    <section
      aria-label="About Iqbal Dwi Fathonah"
      onClick={() => {
        if (!isDone) {
          playTick();
          completeBySkip();
        }
      }}
      className={`mx-auto w-full max-w-[540px] px-5 pt-24 pb-16 text-left sm:px-6 ${
        !isDone ? "cursor-pointer" : ""
      }`}
    >
      {/* Top Greeting Line */}
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

        {/* Minimalist Certifications & Closing Block (Fade-in after typing completes) */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 pt-4"
          >
            {/* Minimalist 2-Row Certifications Section */}
            <div>
              <h2 className="font-mono text-xs tracking-wider text-neutral-500 uppercase">
                {lang === "id" ? "Sertifikasi" : "Certifications"}
              </h2>

              <div className="mt-2 border-t border-black/10 dark:border-white/10">
                {CERTIFICATES.map((cert) => (
                  <button
                    key={cert.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playTick();
                      setActiveCertificate(cert);
                    }}
                    onMouseEnter={playTick}
                    className="group flex w-full items-center justify-between gap-3 border-b border-black/10 py-3 text-left transition-colors dark:border-white/10"
                  >
                    <div className="min-w-0">
                      <p className="text-[15px] leading-snug font-normal text-foreground decoration-dotted underline-offset-4 group-hover:underline">
                        {cert.title}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        {cert.issuer}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 font-mono text-xs text-neutral-500 tabular-nums dark:text-neutral-400">
                      <span>{t(cert.shortDate, lang)}</span>
                      <span className="inline-flex items-center gap-0.5 text-foreground/80 transition-colors group-hover:text-foreground">
                        <span>{lang === "id" ? "Lihat" : "View"}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Minimalist Connect Row */}
            <div>
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
            </div>
          </motion.div>
        )}
      </div>

      {/* CertificateModal via React Portal (Full-screen backdrop, 3-part flex container) */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {activeCertificate && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={activeCertificate.title}
                onClick={(e) => e.stopPropagation()}
                className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
              >
                {/* Full-Viewport Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveCertificate(null)}
                  className="fixed inset-0 bg-black/75 backdrop-blur-md dark:bg-black/80"
                />

                {/* 3-Part Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.34 }}
                  className="relative z-10 flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-surface text-foreground shadow-2xl sm:max-h-[88dvh] sm:rounded-[22px] dark:border-white/10"
                >
                  {/* 1. Header (shrink-0) */}
                  <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/10 bg-surface px-4 py-3 sm:px-6 sm:py-4 dark:border-white/10">
                    <h3 className="truncate text-sm font-medium text-foreground sm:text-base">
                      {activeCertificate.title}
                    </h3>

                    <button
                      type="button"
                      onClick={() => {
                        playTick();
                        setActiveCertificate(null);
                      }}
                      onMouseEnter={playTick}
                      aria-label={closeLabel}
                      title={closeLabel}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-canvas text-muted transition-all duration-150 hover:border-black/30 hover:text-foreground active:scale-95 dark:border-white/15 dark:hover:border-white/35"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* 2. Body (flex-1 overflow-y-auto overscroll-contain) */}
                  <div className="minimal-scroll flex flex-1 items-center justify-center overflow-y-auto overscroll-contain bg-neutral-100/70 p-3 sm:p-5 dark:bg-neutral-900/70">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeCertificate.image}
                      alt={activeCertificate.title}
                      className="mx-auto max-h-[65dvh] w-auto max-w-full rounded-lg object-contain shadow-md"
                    />
                  </div>

                  {/* 3. Footer (shrink-0) */}
                  <div className="flex shrink-0 flex-col justify-between gap-3 border-t border-black/10 bg-surface px-4 py-3.5 text-xs sm:flex-row sm:items-center sm:px-6 sm:py-4 dark:border-white/10">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
                      <span className="font-medium text-foreground">
                        {activeCertificate.issuer}
                      </span>
                      <span>/</span>
                      <span>{t(activeCertificate.fullDate, lang)}</span>
                      <span>/</span>
                      <span className="font-mono text-[11px] text-foreground">
                        ID: {activeCertificate.credentialId}
                      </span>
                    </div>

                    {activeCertificate.verifyUrl && (
                      <a
                        href={activeCertificate.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={playTick}
                        className="inline-flex h-10 w-full items-center justify-center gap-1 rounded-full border border-black/15 bg-canvas px-4 font-mono text-xs text-foreground transition-colors hover:border-black/35 sm:h-8 sm:w-auto dark:border-white/15 dark:hover:border-white/35"
                      >
                        <span>
                          {lang === "id"
                            ? "Verifikasi Kredensial"
                            : "Verify Credential"}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
