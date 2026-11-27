"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Maximize2,
  X,
} from "lucide-react";
import { Project, getTrackBySlug, t } from "@/data/portfolio";
import { useLanguage } from "@/components/providers/AppProviders";
import { useUiSound } from "@/hooks/useUiSound";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { lang } = useLanguage();
  const { playTick } = useUiSound();
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!project) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose, isZoomed]);

  const track = project ? getTrackBySlug(project.trackSlug) : undefined;
  const backLabel = lang === "id" ? "kembali" : "back";
  const hasLiveDashboard = Boolean(project?.links.liveDashboard?.trim());

  const handleCloseModal = () => {
    setIsZoomed(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {project && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
        >
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black/55 backdrop-blur-sm dark:bg-black/75"
          />

          {/* Main Case Study Modal Panel (max-w-2xl max-h-[88vh] overflow-y-auto rounded-[22px]) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[22px] border border-black/10 bg-surface shadow-2xl sm:rounded-[22px] dark:border-white/10"
          >
            {/* Sticky Top Bar */}
            <div className="flex items-center justify-between border-b border-black/[0.08] bg-surface/95 px-5 py-3.5 backdrop-blur-md sm:px-6 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: track?.accentHex ?? "#16A34A",
                  }}
                />
                <span className="font-mono text-xs text-muted tabular-nums">
                  {track ? t(track.title, lang) : project.trackSlug} ·{" "}
                  {project.year}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  playTick();
                  handleCloseModal();
                }}
                onMouseEnter={playTick}
                aria-label="Close case study"
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-canvas px-3 py-1 text-xs font-normal text-foreground transition-all duration-150 hover:border-black/30 active:scale-95 dark:border-white/15 dark:hover:border-white/35"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>{backLabel}</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              {/* 1. Dashboard Preview Image at the Top (Click to Expand Lightbox) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  playTick();
                  setIsZoomed(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    playTick();
                    setIsZoomed(true);
                  }
                }}
                aria-label={
                  lang === "id"
                    ? "Klik untuk memperbesar gambar dashboard"
                    : "Click to expand dashboard preview"
                }
                className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-black/10 bg-neutral-100 dark:border-white/10 dark:bg-neutral-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="max-h-[310px] w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.015]"
                />
                <div className="pointer-events-none absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur-xs transition-opacity group-hover:bg-black/90">
                  <Maximize2 className="h-3 w-3" />
                  <span>{lang === "id" ? "Perbesar" : "Expand"}</span>
                </div>
              </div>

              {/* 2. Title, One-Sentence Summary & Tools */}
              <div className="mt-5">
                <h2
                  id="modal-project-title"
                  className="text-lg leading-[1.25] font-medium tracking-[-0.02em] text-foreground sm:text-xl"
                >
                  {project.title}
                </h2>
                <p className="mt-1.5 text-sm leading-[1.65] text-muted">
                  {t(project.summary, lang)}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.techStack.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-black/[0.08] bg-canvas px-2.5 py-0.5 font-mono text-[11px] text-neutral-700 dark:border-white/[0.1] dark:text-neutral-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Mini 4-KPI Row (2x2 on mobile, 4 cols on desktop) */}
              {project.kpis.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {project.kpis.map((kpi, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-black/[0.08] bg-canvas px-3.5 py-2.5 dark:border-white/[0.1]"
                    >
                      <p className="font-mono text-base font-semibold tracking-tight text-foreground tabular-nums sm:text-[17px]">
                        {kpi.value}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-tight text-muted">
                        {t(kpi.label, lang)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. Concise 3 Key Insights & Optional 1-Line Recommendation */}
              <div className="mt-5 border-t border-black/[0.08] pt-4 dark:border-white/[0.08]">
                <h3 className="font-mono text-[11px] tracking-wider text-muted uppercase">
                  {lang === "id" ? "Temuan Utama" : "Key Insights"}
                </h3>

                <ul className="mt-2.5 space-y-2">
                  {project.keyInsights[lang].map((insight, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm leading-[1.62] text-foreground/90"
                    >
                      <CheckCircle2
                        className="mt-1 h-3.5 w-3.5 shrink-0"
                        style={{
                          color: track?.accentHex ?? "#16A34A",
                        }}
                      />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>

                {project.recommendation && (
                  <div className="mt-4 rounded-xl border border-black/[0.08] bg-canvas px-3.5 py-2.5 text-xs leading-relaxed text-neutral-700 dark:border-white/[0.1] dark:text-neutral-300">
                    <span className="font-medium text-foreground">
                      {lang === "id" ? "Rekomendasi: " : "Recommendation: "}
                    </span>
                    {t(project.recommendation, lang)}
                  </div>
                )}
              </div>

              {/* 5. Action Footer */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-black/[0.08] pt-4 dark:border-white/[0.08]">
                {hasLiveDashboard && (
                  <a
                    href={project.links.liveDashboard}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playTick}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#16A34A] px-4 py-2 text-xs font-medium text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                  >
                    <span>
                      {lang === "id"
                        ? "Lihat Dashboard Interaktif"
                        : "View Interactive Dashboard"}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}

                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={playTick}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-canvas px-4 py-2 text-xs font-normal text-foreground transition-colors duration-150 hover:border-black/35 active:scale-95 dark:border-white/15 dark:hover:border-white/35"
                >
                  <span>
                    {lang === "id"
                      ? "Dokumentasi Lengkap di GitHub"
                      : "Full Documentation on GitHub"}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Fullscreen Image Lightbox when Dashboard Preview is clicked */}
          <AnimatePresence>
            {isZoomed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setIsZoomed(false)}
                className="fixed inset-0 z-[70] flex cursor-zoom-out flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
              >
                <button
                  type="button"
                  onClick={() => setIsZoomed(false)}
                  aria-label="Close fullscreen preview"
                  className="absolute top-5 right-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>{lang === "id" ? "Tutup" : "Close"}</span>
                </button>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[86vh] max-w-[94vw] cursor-default rounded-lg object-contain shadow-2xl"
                />
                <p className="mt-3 font-mono text-xs text-neutral-300">
                  {project.title}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
