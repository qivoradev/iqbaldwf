"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  FilterTrackSlug,
  Project,
  getLogsByTrack,
  getProjectsByTrack,
  getTrackBySlug,
  t,
} from "@/data/portfolio";
import { useLanguage } from "@/components/providers/AppProviders";
import { useUiSound } from "@/hooks/useUiSound";
import { ProjectModal } from "@/components/sections/ProjectModal";

interface EditorialTrackViewProps {
  activeTrack?: FilterTrackSlug;
  onSelectTrack?: (track: FilterTrackSlug) => void;
}

export function EditorialTrackView({}: EditorialTrackViewProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { lang } = useLanguage();
  const { playTick } = useUiSound();

  const dataTrack = getTrackBySlug("data-analyst");
  const projects = getProjectsByTrack("data-analyst");
  const logs = getLogsByTrack("data-analyst");

  return (
    <section
      aria-label="Data Analyst portfolio view"
      className="mx-auto w-full max-w-[680px] px-5 pt-24 pb-16 text-left sm:px-6"
    >
      {/* Clean Editorial Header: 100% focused on Data Analyst */}
      <header className="pb-6">
        <p className="font-mono text-xs text-muted">
          {dataTrack
            ? t(dataTrack.badgeLabel, lang)
            : lang === "id"
              ? "Data Analytics · Fokus Utama"
              : "Data Analytics · Primary Focus"}
        </p>
        <h1 className="mt-1.5 text-2xl font-normal tracking-[-0.025em] text-foreground md:text-[28px]">
          {dataTrack ? t(dataTrack.title, lang) : "Data Analyst"}
        </h1>
        <p className="mt-2.5 text-[15px] leading-[1.65] font-normal text-muted">
          {dataTrack ? t(dataTrack.description, lang) : ""}
        </p>

        {dataTrack && (
          <p className="mt-3.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
            {dataTrack.coreStack.join(" · ")}
          </p>
        )}
      </header>

      {/* Clean Minimalist Editorial Project List (No thumbnail clutter in main list) */}
      <div className="divide-y divide-black/[0.08] border-y border-black/[0.08] dark:divide-white/[0.1] dark:border-white/[0.1]">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{
                duration: 0.24,
                delay: index * 0.03,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => {
                playTick();
                setSelectedProject(project);
              }}
              onMouseEnter={playTick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  playTick();
                  setSelectedProject(project);
                }
              }}
              className="group cursor-pointer py-5 transition-colors"
            >
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                <h2 className="text-[16px] leading-snug font-normal tracking-[-0.015em] text-foreground decoration-dotted underline-offset-4 group-hover:underline">
                  {project.title}
                </h2>

                <div className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted tabular-nums">
                  <span>{t(project.role, lang)}</span>
                  <span>·</span>
                  <span>{project.year}</span>
                </div>
              </div>

              <p className="mt-2 text-sm leading-[1.65] font-normal text-muted">
                {t(project.summary, lang)}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {project.techStack.join(" · ")}
                </span>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors group-hover:text-foreground">
                    <span>
                      {lang === "id" ? "Studi kasus" : "Case study"}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* Minimalist Living Log Footer Section */}
      {logs.length > 0 && (
        <div className="mt-10">
          <p className="font-mono text-xs text-muted">
            {lang === "id"
              ? "Catatan Perkembangan / Living Log"
              : "Living Log / Recent Updates"}
          </p>
          <div className="mt-3 divide-y divide-black/[0.06] border-t border-black/[0.08] dark:divide-white/[0.08] dark:border-white/[0.1]">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {t(log.title, lang)}
                </p>
                <time className="shrink-0 font-mono text-[11px] text-muted tabular-nums">
                  {log.date}
                </time>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Case Study Detail Modal (Rendered via Portal inside ProjectModal) */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
