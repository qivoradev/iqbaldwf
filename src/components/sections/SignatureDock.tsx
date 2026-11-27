"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FilterTrackSlug, PROFILE } from "@/data/portfolio";
import { useLanguage } from "@/components/providers/AppProviders";
import { useUiSound } from "@/hooks/useUiSound";

interface SignatureDockProps {
  onSelectTrack: (track: FilterTrackSlug) => void;
}

interface DockTrackItem {
  id: FilterTrackSlug;
  label: string;
  mobileLabel: string;
  bgClass: string;
  isComingSoon?: boolean;
  icon: React.ReactNode;
}

interface DockSocialItem {
  id: string;
  label: string;
  mobileLabel: string;
  href: string;
  external?: boolean;
  bgClass: string;
  icon: React.ReactNode;
}

/* ============================================================================
 * Custom Full-Bleed Proportional Squircle Icons (52x52 container)
 * ========================================================================== */

/** 1. All Works: Bold black square terminal frame with `>_` prompt on #FCD34D */
function TerminalSquircleSvg() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="h-7 w-7 text-[#111111]"
    >
      <rect
        x="3.5"
        y="4.5"
        width="25"
        height="23"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M8.5 12L12.5 15.5L8.5 19"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 19.5H20.5"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 2. Data Analyst: Full white wireframe globe / global analytics grid on #16A34A */
function DataGlobeSquircleSvg() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="h-7.5 w-7.5 text-white"
    >
      <circle
        cx="16"
        cy="16"
        r="12"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="6"
        ry="12"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16 4V28M4.5 12.5H27.5M4.5 19.5H27.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 3. Web Dev (Coming Soon): Bold white diagonal geometric block on #0A0A0A */
function FrontendBlockSquircleSvg() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="h-7 w-7 text-white"
    >
      <path
        d="M20.8 7.5L24.5 11.2L11.2 24.5L7.5 20.8L20.8 7.5Z"
        fill="currentColor"
      />
      <path
        d="M22.2 6.1L25.9 9.8L24.9 10.8L21.2 7.1L22.2 6.1Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

/** 4. Web Lab (Coming Soon): Original Geometric Isometric Cube & Prism in full white on #F94D23 */
function LabGeometricSquircleSvg() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="h-7.5 w-7.5 text-white"
    >
      <path
        d="M16 4.5L26 10.25V21.75L16 27.5L6 21.75V10.25L16 4.5Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M16 4.5L26 10.25L16 16L6 10.25L16 4.5Z"
        fill="currentColor"
      />
      <path
        d="M16 16V27.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 5. LinkedIn: Bold large proportional 'in' on #0A66C2 */
function LinkedInSquircleSvg() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className="h-7.5 w-7.5 text-white"
    >
      <path d="M9.6 12.6V24.8H5.4V12.6H9.6ZM7.5 6.8C8.95 6.8 9.95 7.8 9.98 9.1C9.98 10.4 8.95 11.4 7.47 11.4H7.44C5.99 11.4 5.02 10.4 5.02 9.1C5.02 7.8 6.02 6.8 7.5 6.8ZM26.6 17.8V24.8H22.4V18.3C22.4 16.55 21.78 15.35 20.2 15.35C19 15.35 18.28 16.15 17.97 16.92C17.85 17.2 17.82 17.6 17.82 18V24.8H13.62C13.62 24.8 13.68 13.75 13.62 12.6H17.82V14.45C18.38 13.58 19.38 12.32 21.62 12.32C24.4 12.32 26.6 14.12 26.6 17.8Z" />
    </svg>
  );
}

/** 6. GitHub: Full white Octocat silhouette on #181717 */
function GitHubSquircleSvg() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-7 w-7 text-white"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

/** 7. Email: Full solid white envelope on blue-cyan vertical gradient */
function EmailSquircleSvg() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="h-7.5 w-7.5 text-white"
    >
      <path
        d="M4.5 9.2C4.5 8.26 5.26 7.5 6.2 7.5H25.8C26.74 7.5 27.5 8.26 27.5 9.2L16 17.1L4.5 9.2Z"
        fill="currentColor"
      />
      <path
        d="M4.5 11.4V22.5C4.5 23.6 5.4 24.5 6.5 24.5H25.5C26.6 24.5 27.5 23.6 27.5 22.5V11.4L17.1 18.55C16.44 19 15.56 19 14.9 18.55L4.5 11.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

const DOCK_HOVER_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 26,
  mass: 0.8,
};

export function SignatureDock({ onSelectTrack }: SignatureDockProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const { lang } = useLanguage();
  const { playTick } = useUiSound();

  const trackItems: DockTrackItem[] = [
    {
      id: "all",
      label: lang === "id" ? "Semua Karya" : "All Works",
      mobileLabel: lang === "id" ? "Semua" : "All",
      bgClass: "bg-[#FCD34D]",
      isComingSoon: false,
      icon: <TerminalSquircleSvg />,
    },
    {
      id: "data-analyst",
      label: "Data Analyst",
      mobileLabel: "Data",
      bgClass: "bg-[#16A34A]",
      isComingSoon: false,
      icon: <DataGlobeSquircleSvg />,
    },
    {
      id: "frontend",
      label: lang === "id" ? "Web Dev · Segera Hadir" : "Web Dev · Coming Soon",
      mobileLabel: lang === "id" ? "Segera" : "Soon",
      // Deep #0A0A0A contrasts cleanly against elevated graphite #2C2C2E dock in dark mode
      bgClass:
        "bg-[#0A0A0A] dark:bg-[#0A0A0A] ring-1 ring-inset ring-black/15 dark:ring-white/[0.08] shadow-xs",
      isComingSoon: true,
      icon: <FrontendBlockSquircleSvg />,
    },
    {
      id: "lab",
      label: lang === "id" ? "Web Lab · Segera Hadir" : "Web Lab · Coming Soon",
      mobileLabel: lang === "id" ? "Segera" : "Soon",
      bgClass: "bg-[#F94D23]",
      isComingSoon: true,
      icon: <LabGeometricSquircleSvg />,
    },
  ];

  const socialItems: DockSocialItem[] = [
    {
      id: "linkedin",
      label: "LinkedIn",
      mobileLabel: "LinkedIn",
      href: PROFILE.linkedinUrl,
      external: true,
      bgClass: "bg-[#0A66C2]",
      icon: <LinkedInSquircleSvg />,
    },
    {
      id: "github",
      label: "GitHub",
      mobileLabel: "GitHub",
      href: PROFILE.githubUrl,
      external: true,
      // Rich dark slate contrasts clearly against #2C2C2E graphite dock surface
      bgClass:
        "bg-[#181717] dark:bg-[#141416] ring-1 ring-inset ring-black/15 dark:ring-white/[0.1] shadow-xs",
      icon: <GitHubSquircleSvg />,
    },
    {
      id: "email",
      label: "Email",
      mobileLabel: "Email",
      href: `mailto:${PROFILE.email}`,
      external: false,
      bgClass: "bg-gradient-to-b from-[#2563EB] to-[#38BDF8]",
      icon: <EmailSquircleSvg />,
    },
  ];

  const handleTrackItemClick = (item: DockTrackItem) => {
    playTick();
    if (item.isComingSoon) {
      setShakingId(item.id);
      window.setTimeout(() => {
        setShakingId((prev) => (prev === item.id ? null : prev));
      }, 260);
      return;
    }
    onSelectTrack(item.id);
  };

  return (
    <div className="mx-auto w-full max-w-[360px] md:w-fit md:max-w-none">
      {/* Desktop Horizontal Double-Bezel Glass/Graphite Dock (>= md) */}
      <div
        role="toolbar"
        aria-label="Portfolio tracks and direct social links"
        onMouseLeave={() => setHoveredId(null)}
        className="hidden md:flex md:items-center md:gap-2 md:rounded-[22px] md:border md:border-black/[0.08] md:bg-white/75 md:p-2 md:shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:ring-1 md:ring-inset md:ring-white/60 md:backdrop-blur-xl dark:md:border dark:md:border-white/[0.16] dark:md:bg-[#2C2C2E]/95 dark:md:shadow-[0_12px_36px_rgba(0,0,0,0.65)] dark:md:ring-1 dark:md:ring-inset dark:md:ring-white/[0.08]"
      >
        {/* Left: Portfolio Tracks */}
        <div className="flex items-center gap-2">
          {trackItems.map((item) => {
            const isHovered = hoveredId === item.id;
            const isShaking = shakingId === item.id;

            return (
              <div key={item.id} className="relative flex items-center">
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      key={`tooltip-${item.id}`}
                      initial={{ opacity: 0, y: 6, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.94 }}
                      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                      className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#222222] px-3.5 py-1.5 text-[13px] leading-none font-medium text-white shadow-md dark:bg-[#F5F5F5] dark:text-[#111111]"
                    >
                      {item.label}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="button"
                  onClick={() => handleTrackItemClick(item)}
                  onMouseEnter={() => {
                    setHoveredId(item.id);
                    playTick();
                  }}
                  onFocus={() => setHoveredId(item.id)}
                  onBlur={() =>
                    setHoveredId((prev) => (prev === item.id ? null : prev))
                  }
                  animate={isShaking ? { x: [0, -3, 3, -2, 0] } : { x: 0 }}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={item.isComingSoon ? undefined : { scale: 0.96 }}
                  transition={
                    isShaking
                      ? { duration: 0.25, ease: "easeInOut" }
                      : DOCK_HOVER_SPRING
                  }
                  aria-label={item.label}
                  aria-disabled={item.isComingSoon}
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-[13px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${item.bgClass}`}
                >
                  {item.icon}
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Thin Vertical Divider: crisp visibility on both Light and Dark (#2C2C2E) */}
        <div
          aria-hidden="true"
          className="mx-1.5 h-8 w-[1px] shrink-0 bg-black/10 dark:bg-white/25"
        />

        {/* Right: Direct Social & Email */}
        <div className="flex items-center gap-2">
          {socialItems.map((item) => {
            const isHovered = hoveredId === item.id;

            return (
              <div key={item.id} className="relative flex items-center">
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      key={`tooltip-${item.id}`}
                      initial={{ opacity: 0, y: 6, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.94 }}
                      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                      className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#222222] px-3.5 py-1.5 text-[13px] leading-none font-medium text-white shadow-md dark:bg-[#F5F5F5] dark:text-[#111111]"
                    >
                      {item.label}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onMouseEnter={() => {
                    setHoveredId(item.id);
                    playTick();
                  }}
                  onFocus={() => setHoveredId(item.id)}
                  onBlur={() =>
                    setHoveredId((prev) => (prev === item.id ? null : prev))
                  }
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  transition={DOCK_HOVER_SPRING}
                  aria-label={item.label}
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-[13px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${item.bgClass}`}
                >
                  {item.icon}
                </motion.a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile 4-Column Grid Dock (< md) */}
      <div
        role="toolbar"
        aria-label="Mobile portfolio tracks and social links"
        className="rounded-[22px] border border-black/[0.08] bg-white/80 p-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-inset ring-white/60 backdrop-blur-xl md:hidden dark:border dark:border-white/[0.16] dark:bg-[#2C2C2E]/95 dark:shadow-[0_12px_36px_rgba(0,0,0,0.65)] dark:ring-1 dark:ring-inset dark:ring-white/[0.08]"
      >
        <div className="grid grid-cols-4 gap-2.5">
          {trackItems.map((item) => {
            const isShaking = shakingId === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => handleTrackItemClick(item)}
                animate={isShaking ? { x: [0, -3, 3, -2, 0] } : { x: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                aria-disabled={item.isComingSoon}
                className="group flex flex-col items-center gap-1.5"
              >
                <div
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-[13px] transition-transform duration-150 ${
                    item.isComingSoon ? "" : "group-active:scale-95"
                  } ${item.bgClass}`}
                >
                  {item.icon}
                </div>
                <span className="text-center text-[10px] leading-tight font-normal text-neutral-600 dark:text-neutral-300">
                  {item.mobileLabel}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div
          aria-hidden="true"
          className="my-3 h-[1px] w-full bg-black/10 dark:bg-white/20"
        />

        <div className="grid grid-cols-4 gap-2.5">
          {socialItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              onClick={playTick}
              className="group flex flex-col items-center gap-1.5"
            >
              <div
                className={`flex h-[52px] w-[52px] items-center justify-center rounded-[13px] transition-transform duration-150 group-active:scale-95 ${item.bgClass}`}
              >
                {item.icon}
              </div>
              <span className="text-center text-[10px] leading-tight font-normal text-neutral-600 dark:text-neutral-300">
                {item.mobileLabel}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
