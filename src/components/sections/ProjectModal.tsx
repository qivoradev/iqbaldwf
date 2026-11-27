"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Maximize2,
  X,
} from "lucide-react";
import { Project, getTrackBySlug, t } from "@/data/portfolio";
import { useLanguage, useTheme } from "@/components/providers/AppProviders";
import { useUiSound } from "@/hooks/useUiSound";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { lang } = useLanguage();
  const { mounted, resolvedTheme } = useTheme();
  const { playTick } = useUiSound();
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!project) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [project, onClose, isZoomed]);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  const isTech = resolvedTheme === "tech";
  const track = project ? getTrackBySlug(project.trackSlug) : undefined;
  const closeLabel = lang === "id" ? "Tutup" : "Close";
  const hasLiveDashboard = Boolean(project?.links.liveDashboard?.trim());

  const handleCloseModal = () => {
    setIsZoomed(false);
    onClose();
  };

  return createPortal(
    <>
      <AnimatePresence>
        {project && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
            className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
          >
            {/* Full-Viewport Backdrop Scrim (Covers TopPillNavbar & background) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseModal}
              className={
                isTech
                  ? "fixed inset-0 bg-[#022416]/85 backdrop-blur-xs"
                  : "fixed inset-0 bg-black/75 backdrop-blur-md dark:bg-black/80"
              }
            />

            {/* 3-Part Flex Modal Container (Header shrink-0, Body flex-1 overflow-y-auto, Footer shrink-0) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", bounce: 0, duration: 0.34 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative z-10 flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden sm:max-h-[88dvh] ${
                isTech
                  ? "rounded-none border border-[#FFFFFF] bg-[#04472B] text-[#FFFFFF] shadow-[4px_4px_0px_#FFFFFF]"
                  : "rounded-2xl border border-black/10 bg-surface text-foreground shadow-2xl sm:rounded-[22px] dark:border-white/10"
              }`}
            >
              {/* 1. Header (shrink-0, solid separated from scroll area) */}
              <div
                className={`flex shrink-0 items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4 ${
                  isTech
                    ? "border-[#FFFFFF] bg-[#04472B]"
                    : "border-black/10 bg-surface dark:border-white/10"
                }`}
              >
                <span className="font-mono text-xs text-muted tabular-nums">
                  {track ? t(track.title, lang) : project.trackSlug} /{" "}
                  {project.year}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    playTick();
                    handleCloseModal();
                  }}
                  onMouseEnter={playTick}
                  aria-label={closeLabel}
                  title={closeLabel}
                  className={`flex h-8 w-8 items-center justify-center transition-all duration-150 active:scale-95 ${
                    isTech
                      ? "rounded-none border border-[#FFFFFF] bg-[#04472B] text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#04472B]"
                      : "rounded-full border border-black/10 bg-canvas text-muted hover:border-black/30 hover:text-foreground dark:border-white/15 dark:hover:border-white/35"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 2. Scrollable Body (flex-1 overflow-y-auto overscroll-contain with custom thin scrollbar) */}
              <div className="minimal-scroll flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
                {/* Dashboard Preview Image (Click to open Fullscreen Lightbox; 100% original colors protected) */}
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
                  className={`group relative cursor-zoom-in overflow-hidden ${
                    isTech
                      ? "rounded-none border border-[#FFFFFF] bg-[#04472B]"
                      : "rounded-xl border border-black/10 bg-neutral-100 dark:border-white/10 dark:bg-neutral-900"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="max-h-[260px] w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.015] sm:max-h-[300px]"
                  />
                  <div
                    className={`pointer-events-none absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] transition-opacity ${
                      isTech
                        ? "rounded-none border border-[#FFFFFF] bg-[#04472B] text-[#FFFFFF] shadow-[2px_2px_0px_#FFFFFF]"
                        : "rounded-full bg-black/75 text-white backdrop-blur-xs group-hover:bg-black/90"
                    }`}
                  >
                    <Maximize2 className="h-3 w-3" />
                    <span>{lang === "id" ? "Perbesar" : "Expand"}</span>
                  </div>
                </div>

                {/* Title, 1-Sentence Summary & Tools */}
                <div className="mt-4 sm:mt-5">
                  <h2
                    id="modal-project-title"
                    className="text-lg leading-[1.28] font-medium tracking-[-0.02em] text-foreground sm:text-xl"
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
                        className={
                          isTech
                            ? "rounded-none border border-[#FFFFFF] bg-[#04472B] px-2.5 py-0.5 font-mono text-[11px] text-[#FFFFFF]"
                            : "rounded-full border border-black/[0.08] bg-canvas px-2.5 py-0.5 font-mono text-[11px] text-neutral-700 dark:border-white/[0.1] dark:text-neutral-300"
                        }
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4-KPI Grid (2x2 on mobile, 4 columns on desktop) */}
                {project.kpis.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:grid-cols-4">
                    {project.kpis.map((kpi, idx) => (
                      <div
                        key={idx}
                        className={
                          isTech
                            ? "rounded-none border border-[#FFFFFF] bg-[#04472B] px-3 py-2.5 shadow-[3px_3px_0px_#FFFFFF]"
                            : "rounded-xl border border-black/[0.08] bg-canvas px-3 py-2.5 dark:border-white/[0.1]"
                        }
                      >
                        <p className="font-mono text-lg font-semibold tracking-tight text-foreground tabular-nums sm:text-xl">
                          {kpi.value}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-tight text-muted">
                          {t(kpi.label, lang)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3 Key Findings & Optional Recommendation */}
                <div
                  className={`mt-4 border-t pt-4 sm:mt-5 ${
                    isTech
                      ? "border-[#FFFFFF]"
                      : "border-black/[0.08] dark:border-white/[0.08]"
                  }`}
                >
                  <h3 className="font-mono text-[11px] tracking-wider text-muted uppercase">
                    {lang === "id" ? "Temuan Utama" : "Key Findings"}
                  </h3>

                  <ul className="mt-2.5 space-y-2.5">
                    {project.keyInsights[lang].map((insight, idx) => (
                      <li
                        key={idx}
                        className={`flex items-baseline gap-3 text-sm leading-[1.62] ${
                          isTech ? "text-[#FFFFFF]" : "text-foreground/90"
                        }`}
                      >
                        <span className="shrink-0 font-mono text-xs text-muted tabular-nums select-none">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>

                  {project.recommendation && (
                    <div
                      className={
                        isTech
                          ? "mt-4 rounded-none border border-[#FFFFFF] bg-[#04472B] px-3.5 py-2.5 text-xs leading-relaxed text-[#FFFFFF] shadow-[3px_3px_0px_#FFFFFF]"
                          : "mt-4 rounded-xl border border-black/[0.08] bg-canvas px-3.5 py-2.5 text-xs leading-relaxed text-neutral-700 dark:border-white/[0.1] dark:text-neutral-300"
                      }
                    >
                      <span className="font-medium text-foreground">
                        {lang === "id" ? "Rekomendasi: " : "Recommendation: "}
                      </span>
                      {t(project.recommendation, lang)}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Footer (shrink-0, solid separated from scroll area, full-width stacked on mobile with h-11 tap height) */}
              <div
                className={`flex shrink-0 flex-col gap-2.5 border-t px-4 py-3.5 sm:flex-row sm:items-center sm:px-6 sm:py-4 ${
                  isTech
                    ? "border-[#FFFFFF] bg-[#04472B]"
                    : "border-black/10 bg-surface dark:border-white/10"
                }`}
              >
                {hasLiveDashboard && (
                  <a
                    href={project.links.liveDashboard}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playTick}
                    className={
                      isTech
                        ? "inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-none border border-[#FFFFFF] bg-[#FFFFFF] px-5 font-mono text-xs font-semibold text-[#04472B] transition-colors duration-150 hover:bg-[#04472B] hover:text-[#FFFFFF] active:scale-[0.98] sm:h-9 sm:w-auto"
                        : "inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-[#111111] px-5 text-xs font-medium text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98] sm:h-9 sm:w-auto dark:bg-[#F5F5F5] dark:text-[#111111]"
                    }
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
                  className={
                    isTech
                      ? "inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-none border border-[#FFFFFF] bg-[#04472B] px-5 font-mono text-xs font-normal text-[#FFFFFF] transition-colors duration-150 hover:bg-[#FFFFFF] hover:text-[#04472B] active:scale-[0.98] sm:h-9 sm:w-auto"
                      : "inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-black/15 bg-canvas px-5 text-xs font-normal text-foreground transition-colors duration-150 hover:border-black/35 active:scale-[0.98] sm:h-9 sm:w-auto dark:border-white/15 dark:hover:border-white/35"
                  }
                >
                  <span>
                    {lang === "id"
                      ? "Dokumentasi Lengkap di GitHub"
                      : "Full Documentation on GitHub"}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen ImageZoomLightbox Portal Overlay (z-[80]) */}
      <AnimatePresence>
        {project && isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsZoomed(false)}
            className={`fixed inset-0 z-[80] flex cursor-zoom-out flex-col items-center justify-center p-3 sm:p-8 ${
              isTech
                ? "bg-[#022416]/95"
                : "bg-black/90 backdrop-blur-md"
            }`}
          >
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              aria-label={closeLabel}
              className={`absolute top-4 right-4 inline-flex h-9 items-center gap-1.5 px-3.5 text-xs transition-colors ${
                isTech
                  ? "rounded-none border border-[#FFFFFF] bg-[#04472B] text-[#FFFFFF] shadow-[3px_3px_0px_#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#04472B]"
                  : "rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
              }`}
            >
              <X className="h-3.5 w-3.5" />
              <span>{closeLabel}</span>
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              onClick={(e) => e.stopPropagation()}
              className={`max-h-[82dvh] max-w-[94vw] cursor-default object-contain ${
                isTech
                  ? "rounded-none border border-[#FFFFFF]"
                  : "rounded-lg shadow-2xl"
              }`}
            />
            <p
              className={`mt-3 text-center font-mono text-xs ${
                isTech ? "text-[#FFFFFF]" : "text-neutral-300"
              }`}
            >
              {project.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
