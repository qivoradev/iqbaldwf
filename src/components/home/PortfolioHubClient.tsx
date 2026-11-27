"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FilterTrackSlug } from "@/data/portfolio";
import { TopPillNavbar } from "@/components/layout/TopPillNavbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { EditorialTrackView } from "@/components/tracks/EditorialTrackView";

type ActiveView =
  | { type: "home" }
  | { type: "about" }
  | { type: "track"; track: FilterTrackSlug };

const VIEW_TRANSITION = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function PortfolioHubClient() {
  const [view, setView] = useState<ActiveView>({ type: "home" });

  const handleSelectTrack = useCallback((track: FilterTrackSlug) => {
    setView({ type: "track", track });
  }, []);

  const handleSelectAbout = useCallback(() => {
    setView({ type: "about" });
  }, []);

  const handleBackToHome = useCallback(() => {
    setView({ type: "home" });
  }, []);

  // Allow Escape key to return to Home when in About or Track view
  useEffect(() => {
    if (view.type === "home") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector('[role="dialog"]')) {
        setView({ type: "home" });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view.type]);

  const isSubView = view.type !== "home";
  const viewKey =
    view.type === "track" ? `track-${view.track}` : view.type;

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-canvas text-foreground">
      {/* Slim Top Pill Navbar */}
      <TopPillNavbar
        isSubView={isSubView}
        onSelectAbout={handleSelectAbout}
        onBack={handleBackToHome}
      />

      {/* Home is vertically centered; About & Track views start comfortably from the top */}
      <main
        className={`flex flex-1 flex-col items-center ${
          view.type === "home" ? "justify-center py-6" : "justify-start"
        }`}
      >
        <AnimatePresence mode="wait">
          {view.type === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(4px)", y: -6 }}
              transition={VIEW_TRANSITION}
              className="flex w-full flex-col items-center justify-center"
            >
              <HeroSection onSelectTrack={handleSelectTrack} />
            </motion.div>
          )}

          {view.type === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(4px)", y: -6 }}
              transition={VIEW_TRANSITION}
              className="w-full"
            >
              <AboutSection onSelectTrack={handleSelectTrack} />
            </motion.div>
          )}

          {view.type === "track" && (
            <motion.div
              key={viewKey}
              initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(4px)", y: -6 }}
              transition={VIEW_TRANSITION}
              className="w-full"
            >
              <EditorialTrackView
                activeTrack={view.track}
                onSelectTrack={handleSelectTrack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom symmetric spacer so Home Hero stays optically centered */}
      <div aria-hidden="true" className="h-10 shrink-0" />
    </div>
  );
}
