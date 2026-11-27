"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Layers,
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

  useEffect(() => {
    if (!project) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  const track = project ? getTrackBySlug(project.trackSlug) : undefined;
  const backLabel = lang === "id" ? "kembali" : "back";

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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/75"
          />

          {/* Modal / Bottom Sheet Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", bounce: 0, duration: 0.36 }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-[660px] flex-col overflow-hidden rounded-t-[24px] border border-line bg-surface shadow-2xl sm:rounded-[20px]"
          >
            {/* Sticky Top Bar with Pill Back Button */}
            <div className="flex items-center justify-between border-b border-line bg-surface/95 px-5 py-3.5 backdrop-blur-md sm:px-7">
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
                  onClose();
                }}
                onMouseEnter={playTick}
                aria-label="Close case study"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-normal text-foreground transition-all duration-150 hover:border-foreground/40 active:scale-[0.97]"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>{backLabel}</span>
                <span className="ml-1 hidden rounded border border-line px-1 py-0.2 font-mono text-[10px] text-muted sm:inline">
                  ESC
                </span>
              </button>
            </div>

            {/* Scrollable Case Study Content */}
            <div className="overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
              {/* Role & Impact Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-line bg-canvas px-2.5 py-0.5 font-mono text-[11px] text-muted">
                  {t(project.role, lang)}
                </span>
                <span className="rounded-full border border-line bg-canvas px-2.5 py-0.5 font-mono text-[11px] text-foreground tabular-nums">
                  {project.impactBadge}
                </span>
              </div>

              {/* Title & Summary */}
              <h2
                id="modal-project-title"
                className="mt-3.5 text-xl leading-[1.2] font-normal tracking-[-0.025em] text-foreground sm:text-2xl"
              >
                {project.title}
              </h2>
              <p className="mt-2.5 text-sm leading-[1.7] text-muted">
                {t(project.summary, lang)}
              </p>

              {/* Tools Used */}
              <div className="mt-5 flex flex-wrap items-center gap-1.5 border-y border-line py-3.5">
                <span className="mr-1.5 inline-flex items-center gap-1 font-mono text-[11px] text-muted">
                  <Layers className="h-3 w-3" />
                  Tools:
                </span>
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line bg-canvas px-2.5 py-0.5 font-mono text-[11px] text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Case Study Sections */}
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-mono text-[11px] tracking-[0.04em] text-muted uppercase">
                    {lang === "id"
                      ? "01 / Masalah & Konteks"
                      : "01 / Problem & Context"}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.72] text-foreground/90">
                    {t(project.caseStudy.problem, lang)}
                  </p>
                </div>

                <div>
                  <h3 className="font-mono text-[11px] tracking-[0.04em] text-muted uppercase">
                    {lang === "id"
                      ? "02 / Metodologi & Pendekatan Analitik"
                      : "02 / Analytical & Technical Approach"}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.72] text-foreground/90">
                    {t(project.caseStudy.approach, lang)}
                  </p>
                </div>

                <div>
                  <h3 className="font-mono text-[11px] tracking-[0.04em] text-muted uppercase">
                    {lang === "id"
                      ? "03 / Temuan Utama & Insight"
                      : "03 / Key Insights & Highlights"}
                  </h3>
                  <ul className="mt-2.5 space-y-2.5">
                    {project.caseStudy.keyInsights[lang].map((insight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm leading-[1.68] text-foreground/90"
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
                </div>

                <div className="rounded-[16px] border border-line bg-canvas p-4">
                  <h3 className="font-mono text-[11px] tracking-[0.04em] text-muted uppercase">
                    {lang === "id"
                      ? "04 / Hasil & Dampak"
                      : "04 / Measured Outcome"}
                  </h3>
                  <p className="mt-1.5 text-sm leading-[1.68] text-foreground">
                    {t(project.caseStudy.outcome, lang)}
                  </p>
                </div>
              </div>

              {/* External Action Links */}
              <div className="mt-7 flex flex-wrap items-center gap-2.5 border-t border-line pt-5">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playTick}
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-normal text-canvas transition-transform duration-150 hover:opacity-90 active:scale-[0.97]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>
                      {project.links.liveLabel
                        ? t(project.links.liveLabel, lang)
                        : "Live Demo"}
                    </span>
                  </a>
                )}

                {project.links.artifact && (
                  <a
                    href={project.links.artifact}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playTick}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#16A34A] px-4 py-2 text-xs font-normal text-white transition-transform duration-150 hover:opacity-90 active:scale-[0.97]"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>
                      {project.links.artifactLabel
                        ? t(project.links.artifactLabel, lang)
                        : "Looker Studio Dashboard"}
                    </span>
                  </a>
                )}

                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playTick}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-4 py-2 text-xs font-normal text-foreground transition-colors duration-150 hover:border-foreground/40 active:scale-[0.97]"
                  >
                    <span>GitHub Repository</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
