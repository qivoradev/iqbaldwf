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
  activeTrack: FilterTrackSlug;
  onSelectTrack?: (track: FilterTrackSlug) => void;
}

export function EditorialTrackView({
  activeTrack,
  onSelectTrack,
}: EditorialTrackViewProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { lang } = useLanguage();
  const { playTick } = useUiSound();

  const currentTrack =
    activeTrack === "all"
      ? getTrackBySlug("data-analyst")
      : getTrackBySlug(activeTrack);

  const isComingSoon = Boolean(currentTrack?.isComingSoon);
  const projects = getProjectsByTrack("data-analyst");
  const logs = getLogsByTrack("data-analyst");

  const trackTabs: {
    id: FilterTrackSlug;
    label: string;
    dotColor?: string;
    isSoon?: boolean;
  }[] = [
    {
      id: "data-analyst",
      label: "Data Analyst",
      dotColor: "#16A34A",
    },
    {
      id: "frontend",
      label: lang === "id" ? "Web Dev · Segera" : "Web Dev · Soon",
      dotColor: "#0A0A0A",
      isSoon: true,
    },
    {
      id: "lab",
      label: lang === "id" ? "Web Lab · Segera" : "Web Lab · Soon",
      dotColor: "#F94D23",
      isSoon: true,
    },
  ];

  const resolvedTabId: FilterTrackSlug =
    activeTrack === "all" ? "data-analyst" : activeTrack;

  return (
    <section
      aria-label="Portfolio track view"
      className="mx-auto w-full max-w-[680px] px-6 py-10 text-left md:py-14"
    >
      {/* Minimalist Track Switcher Pills */}
      {onSelectTrack && (
        <div
          role="tablist"
          aria-label="Switch portfolio track"
          className="mb-8 flex flex-wrap items-center gap-1.5"
        >
          {trackTabs.map((tab) => {
            const isActive = resolvedTabId === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onMouseEnter={playTick}
                onClick={() => {
                  playTick();
                  onSelectTrack(tab.id);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-normal transition-all duration-150 active:scale-95 ${
                  isActive
                    ? "bg-foreground text-canvas"
                    : "border border-black/[0.1] text-muted hover:border-black/25 hover:text-foreground dark:border-white/[0.12] dark:hover:border-white/30"
                }`}
              >
                {tab.dotColor && (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        tab.id === "frontend" && isActive
                          ? "currentColor"
                          : tab.dotColor,
                    }}
                  />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Coming Soon View for Web Dev & Web Lab */}
      {isComingSoon && currentTrack ? (
        <motion.div
          key={`soon-${currentTrack.slug}-${lang}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="py-4"
        >
          <div className="inline-flex items-center gap-2 font-mono text-xs text-muted">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: currentTrack.accentHex }}
            />
            <span>
              {lang === "id"
                ? "Status · Segera Hadir"
                : "Status · Coming Soon"}
            </span>
          </div>

          <h1 className="mt-2.5 text-2xl font-normal tracking-[-0.025em] text-foreground md:text-[28px]">
            {t(currentTrack.title, lang)} —{" "}
            <span className="text-muted">
              {lang === "id" ? "Segera Hadir" : "Coming Soon"}
            </span>
          </h1>

          <p className="mt-4 max-w-[580px] text-[15px] leading-[1.7] font-normal text-neutral-700 md:text-[16px] dark:text-neutral-300">
            {currentTrack.comingSoonMessage
              ? t(currentTrack.comingSoonMessage, lang)
              : t(currentTrack.description, lang)}
          </p>

          <p className="mt-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
            {currentTrack.coreStack.join(" · ")}
          </p>

          <div className="mt-8 border-t border-black/[0.08] pt-6 dark:border-white/[0.1]">
            <button
              type="button"
              onMouseEnter={playTick}
              onClick={() => {
                playTick();
                onSelectTrack?.("data-analyst");
              }}
              className="text-[15px] font-normal text-foreground underline decoration-dotted decoration-neutral-400 underline-offset-[5px] transition-colors hover:decoration-foreground dark:decoration-neutral-500"
            >
              {lang === "id"
                ? "Lihat portofolio Data Analyst →"
                : "Explore Data Analyst portfolio →"}
            </button>
          </div>
        </motion.div>
      ) : (
        /* Active Data Analyst Editorial View */
        <>
          <header className="pb-6">
            <p className="font-mono text-xs text-muted">
              {currentTrack
                ? t(currentTrack.badgeLabel, lang)
                : lang === "id"
                  ? "Data Analytics · Fokus Utama"
                  : "Data Analytics · Primary Focus"}
            </p>
            <h1 className="mt-1.5 text-2xl font-normal tracking-[-0.025em] text-foreground md:text-[28px]">
              {currentTrack ? t(currentTrack.title, lang) : "Data Analyst"}
            </h1>
            <p className="mt-2.5 text-[15px] leading-[1.65] font-normal text-muted">
              {currentTrack ? t(currentTrack.description, lang) : ""}
            </p>

            {currentTrack && (
              <p className="mt-3.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                {currentTrack.coreStack.join(" · ")}
              </p>
            )}
          </header>

          {/* Clean Minimalist Editorial Project List */}
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
                    <h2 className="text-[16px] font-normal tracking-[-0.015em] text-foreground decoration-dotted underline-offset-4 group-hover:underline">
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
        </>
      )}

      {/* Case Study Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
