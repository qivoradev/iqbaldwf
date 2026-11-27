"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { FilterTrackSlug, Track } from "@/data/portfolio";
import { TopPillNavbar } from "@/components/layout/TopPillNavbar";
import { EditorialTrackView } from "@/components/tracks/EditorialTrackView";

interface TrackDetailViewProps {
  track: Track;
}

export function TrackDetailView({ track }: TrackDetailViewProps) {
  const router = useRouter();

  const handleSwitchTrack = (nextTrack: FilterTrackSlug) => {
    if (nextTrack === "all") {
      router.push("/");
    } else {
      router.push(`/tracks/${nextTrack}`);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-canvas text-foreground">
      <TopPillNavbar backHref="/" />

      <main className="flex flex-1 flex-col items-center justify-center py-6">
        <motion.div
          initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <EditorialTrackView
            activeTrack={track.slug}
            onSelectTrack={handleSwitchTrack}
          />
        </motion.div>
      </main>

      <div aria-hidden="true" className="h-10 shrink-0" />
    </div>
  );
}
