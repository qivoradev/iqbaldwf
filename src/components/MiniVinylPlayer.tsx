"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, SkipForward, X } from "lucide-react";
import { MUSIC_PLAYLIST } from "@/data/music";
import { useLanguage } from "@/components/providers/AppProviders";
import { useUiSound } from "@/hooks/useUiSound";

const DEFAULT_VOLUME = 0.3;

export function MiniVinylPlayer() {
  const { lang } = useLanguage();
  const { playTick } = useUiSound();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = MUSIC_PLAYLIST[trackIndex] ?? MUSIC_PLAYLIST[0];

  // Configure default 30% volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = DEFAULT_VOLUME;
    }
  }, []);

  // Attempt playback or graceful visual preview mode when track or play state changes
  const syncPlayback = useCallback(async (shouldPlay: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = DEFAULT_VOLUME;

    if (!shouldPlay) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
      setIsPreviewMode(false);
    } catch {
      // File .mp3 not yet placed in public/music/ -> run safely in visual Preview Mode
      setIsPreviewMode(true);
    }
  }, []);

  const handleTogglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playTick();
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    void syncPlayback(nextPlay);
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTick();
    const nextIdx = (trackIndex + 1) % MUSIC_PLAYLIST.length;
    setTrackIndex(nextIdx);
    setCoverError(false);

    // Wait a tick for <audio src> to update, then play if active or start playing
    const nextPlaying = true;
    setIsPlaying(nextPlaying);
    window.setTimeout(() => {
      void syncPlayback(nextPlaying);
    }, 30);
  };

  const handleExpand = () => {
    if (!isExpanded) {
      playTick();
      setIsExpanded(true);
    }
  };

  const handleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTick();
    setIsExpanded(false);
  };

  const playPauseLabel = isPlaying
    ? lang === "id"
      ? "Jeda musik"
      : "Pause music"
    : lang === "id"
      ? "Putar musik"
      : "Play music";

  const nextTrackLabel =
    lang === "id" ? "Ganti lagu berikutnya" : "Switch to next track";

  const closePillLabel =
    lang === "id" ? "Lipat pemutar musik" : "Collapse music player";

  const previewSubtext =
    lang === "id"
      ? "Mode preview · audio belum diisi"
      : "Preview mode · no audio yet";

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      {/* Hidden HTML5 Audio Element (Never autoplays on page load) */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="none"
        onCanPlay={() => setIsPreviewMode(false)}
        onError={() => setIsPreviewMode(true)}
        onEnded={() => {
          const nextIdx = (trackIndex + 1) % MUSIC_PLAYLIST.length;
          setTrackIndex(nextIdx);
          window.setTimeout(() => {
            void syncPlayback(true);
          }, 30);
        }}
      />

      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 340,
          damping: 30,
          mass: 0.8,
        }}
        onClick={!isExpanded ? handleExpand : undefined}
        role={!isExpanded ? "button" : "region"}
        tabIndex={!isExpanded ? 0 : undefined}
        onKeyDown={
          !isExpanded
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleExpand();
                }
              }
            : undefined
        }
        aria-label={
          !isExpanded
            ? lang === "id"
              ? "Buka pemutar musik vinyl"
              : "Expand vinyl music player"
            : lang === "id"
              ? "Pemutar musik mini"
              : "Mini vinyl music player"
        }
        className={`flex items-center rounded-full border border-black/10 bg-white/85 shadow-lg ring-1 ring-inset ring-white/60 backdrop-blur-xl transition-colors dark:border-white/15 dark:bg-[#2C2C2E]/92 dark:ring-white/[0.08] ${
          isExpanded
            ? "max-w-[calc(100vw-2rem)] gap-2.5 p-1.5 pr-2.5 sm:max-w-[290px]"
            : "cursor-pointer gap-2 p-1.5 pr-3 hover:border-black/25 dark:hover:border-white/25"
        }`}
      >
        {/* Vinyl Record Disc (w-11 h-11 / 44px) */}
        <button
          type="button"
          onClick={isExpanded ? handleTogglePlay : handleExpand}
          aria-label={
            isExpanded
              ? playPauseLabel
              : lang === "id"
                ? "Buka pemutar musik"
                : "Open music player"
          }
          className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md ring-1 ring-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:ring-white/15"
        >
          {/* Rotating Disc Layer (Preserves exact rotation angle on Pause via animationPlayState) */}
          <div
            style={{
              animationPlayState: isPlaying ? "running" : "paused",
              background:
                "repeating-radial-gradient(circle at center, #101010 0px, #101010 1.8px, #232325 2.4px, #121214 3.4px)",
            }}
            className="vinyl-disc-spin relative flex h-full w-full items-center justify-center rounded-full"
          >
            {/* Inner Circular Cover Art */}
            <div className="relative h-7.5 w-7.5 overflow-hidden rounded-full ring-1 ring-black/40">
              {!coverError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  onError={() => setCoverError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-neutral-800" />
              )}
            </div>

            {/* Center Spindle Hole */}
            <span
              aria-hidden="true"
              className="absolute h-2.5 w-2.5 rounded-full border border-white/30 bg-neutral-950 shadow-inner"
            />
          </div>

          {/* Static Realistic Vinyl Sheen / Conic Reflection Overlay */}
          <span
            aria-hidden="true"
            style={{
              background:
                "conic-gradient(from 40deg, transparent 0deg, rgba(255,255,255,0.22) 32deg, transparent 68deg, transparent 180deg, rgba(255,255,255,0.16) 212deg, transparent 248deg)",
            }}
            className="pointer-events-none absolute inset-0 rounded-full"
          />
        </button>

        {/* Compact Mode: Micro 3-Bar Equalizer Indicator */}
        {!isExpanded && (
          <div
            aria-hidden="true"
            className="flex h-3.5 items-end gap-[2.5px] pr-0.5"
          >
            <span
              style={{
                animationPlayState: isPlaying ? "running" : "paused",
              }}
              className={`w-[2px] rounded-full bg-neutral-700 transition-all dark:bg-neutral-200 ${
                isPlaying ? "eq-bar-anim-1" : "h-1.5 opacity-60"
              }`}
            />
            <span
              style={{
                animationPlayState: isPlaying ? "running" : "paused",
              }}
              className={`w-[2px] rounded-full bg-neutral-700 transition-all dark:bg-neutral-200 ${
                isPlaying ? "eq-bar-anim-2" : "h-2.5 opacity-60"
              }`}
            />
            <span
              style={{
                animationPlayState: isPlaying ? "running" : "paused",
              }}
              className={`w-[2px] rounded-full bg-neutral-700 transition-all dark:bg-neutral-200 ${
                isPlaying ? "eq-bar-anim-3" : "h-1 opacity-60"
              }`}
            />
          </div>
        )}

        {/* Expanded Mode: Track Metadata & Transport Controls */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="expanded-controls"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden"
            >
              {/* Middle: Track Title, Artist / Preview Status, and 1/2 Counter */}
              <div className="min-w-0 flex-1 pr-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs leading-tight font-medium text-foreground">
                    {currentTrack.title}
                  </p>
                  <span className="shrink-0 rounded bg-black/[0.06] px-1 py-0.2 font-mono text-[9px] text-muted tabular-nums dark:bg-white/[0.1]">
                    {trackIndex + 1}/{MUSIC_PLAYLIST.length}
                  </span>
                </div>

                <p className="mt-0.5 truncate text-[10px] leading-tight text-muted">
                  {isPreviewMode ? previewSubtext : currentTrack.artist}
                </p>
              </div>

              {/* Right: Play/Pause, Switch Track, and Collapse Button */}
              <div className="flex shrink-0 items-center gap-1">
                {/* Play / Pause */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  aria-label={playPauseLabel}
                  title={playPauseLabel}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-canvas transition-transform duration-150 hover:opacity-90 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="h-3 w-3 fill-current" />
                  ) : (
                    <Play className="h-3 w-3 translate-x-[0.5px] fill-current" />
                  )}
                </button>

                {/* Next / Switch Track (1 <-> 2) */}
                <button
                  type="button"
                  onClick={handleNextTrack}
                  aria-label={nextTrackLabel}
                  title={nextTrackLabel}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-canvas text-foreground transition-colors duration-150 hover:border-black/30 active:scale-95 dark:border-white/15 dark:hover:border-white/35"
                >
                  <SkipForward className="h-3 w-3" />
                </button>

                {/* Collapse Pill (×) */}
                <button
                  type="button"
                  onClick={handleCollapse}
                  aria-label={closePillLabel}
                  title={closePillLabel}
                  className="flex h-6.5 w-6.5 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-black/5 hover:text-foreground active:scale-95 dark:hover:bg-white/10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
