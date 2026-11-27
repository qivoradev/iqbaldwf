"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, SkipForward, X } from "lucide-react";
import { MUSIC_PLAYLIST } from "@/data/music";
import { useLanguage, useTheme } from "@/components/providers/AppProviders";
import { useUiSound } from "@/hooks/useUiSound";

/* ============================================================================
 * Minimal TypeScript Definitions for YouTube IFrame Player API
 * ========================================================================== */

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
}

interface YTReadyEvent {
  target: YTPlayer;
}

interface YTStateChangeEvent {
  data: number;
  target: YTPlayer;
}

interface YTErrorEvent {
  data: number;
  target: YTPlayer;
}

interface YTPlayerOptions {
  height?: string | number;
  width?: string | number;
  videoId: string;
  playerVars?: {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    fs?: 0 | 1;
    modestbranding?: 0 | 1;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
    origin?: string;
  };
  events?: {
    onReady?: (event: YTReadyEvent) => void;
    onStateChange?: (event: YTStateChangeEvent) => void;
    onError?: (event: YTErrorEvent) => void;
  };
}

interface YTNamespace {
  Player: new (
    element: HTMLElement | string,
    options: YTPlayerOptions
  ) => YTPlayer;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/* ============================================================================
 * Singleton YouTube IFrame API Script Loader (Safe for React Strict Mode)
 * ========================================================================== */

let ytApiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeIframeApi(): Promise<YTNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is undefined"));
  }

  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  if (ytApiPromise) {
    return ytApiPromise;
  }

  ytApiPromise = new Promise<YTNamespace>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevReady?.();
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
      } else {
        ytApiPromise = null;
        reject(new Error("YouTube IFrame API unavailable"));
      }
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        ytApiPromise = null;
        reject(new Error("Failed to load YouTube IFrame API script"));
      };
      document.head.appendChild(script);
    }
  });

  return ytApiPromise;
}

type PlayerStatus = "idle" | "buffering" | "playing" | "paused";

const INITIAL_VOLUME = 35;

export function MiniVinylPlayer() {
  const { lang } = useLanguage();
  const { resolvedTheme, mounted } = useTheme();
  const { playTick } = useUiSound();

  const isTech = mounted && resolvedTheme === "tech";

  const [isExpanded, setIsExpanded] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>("idle");
  const [hasError, setHasError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const playerHostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const isReadyRef = useRef<boolean>(false);
  const pendingPlayRef = useRef<boolean>(false);
  const trackIndexRef = useRef<number>(0);

  const currentTrack = MUSIC_PLAYLIST[trackIndex] ?? MUSIC_PLAYLIST[0];
  const hasMultipleTracks = MUSIC_PLAYLIST.length > 1;

  useEffect(() => {
    trackIndexRef.current = trackIndex;
  }, [trackIndex]);

  useEffect(() => {
    let isCancelled = false;
    const host = playerHostRef.current;
    if (!host) return;

    const initialVideoId = MUSIC_PLAYLIST[0]?.youtubeId;
    if (!initialVideoId) return;

    loadYouTubeIframeApi()
      .then((YT) => {
        if (isCancelled || !playerHostRef.current) return;

        const mountEl = document.createElement("div");
        playerHostRef.current.innerHTML = "";
        playerHostRef.current.appendChild(mountEl);

        const player = new YT.Player(mountEl, {
          width: 200,
          height: 200,
          videoId: initialVideoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin:
              typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: (event) => {
              if (isCancelled) return;
              isReadyRef.current = true;
              event.target.setVolume(INITIAL_VOLUME);

              if (pendingPlayRef.current) {
                pendingPlayRef.current = false;
                try {
                  event.target.playVideo();
                } catch {
                  setHasError(true);
                  setPlayerStatus("idle");
                }
              }
            },
            onStateChange: (event) => {
              if (isCancelled) return;
              const { PLAYING, PAUSED, BUFFERING, ENDED } = YT.PlayerState;

              if (event.data === PLAYING) {
                setHasError(false);
                setPlayerStatus("playing");
              } else if (event.data === BUFFERING) {
                setHasError(false);
                setPlayerStatus("buffering");
              } else if (event.data === PAUSED) {
                setPlayerStatus("paused");
              } else if (event.data === ENDED) {
                if (MUSIC_PLAYLIST.length <= 1) {
                  event.target.seekTo(0, true);
                  event.target.playVideo();
                } else {
                  const nextIdx =
                    (trackIndexRef.current + 1) % MUSIC_PLAYLIST.length;
                  const nextTrack = MUSIC_PLAYLIST[nextIdx];
                  trackIndexRef.current = nextIdx;
                  setTrackIndex(nextIdx);
                  setCoverError(false);
                  if (nextTrack) {
                    setPlayerStatus("buffering");
                    event.target.loadVideoById(nextTrack.youtubeId);
                  }
                }
              }
            },
            onError: () => {
              if (isCancelled) return;
              pendingPlayRef.current = false;
              setHasError(true);
              setPlayerStatus("idle");
            },
          },
        });

        playerRef.current = player;
      })
      .catch(() => {
        if (isCancelled) return;
        pendingPlayRef.current = false;
        setHasError(true);
        setPlayerStatus("idle");
      });

    return () => {
      isCancelled = true;
      isReadyRef.current = false;
      pendingPlayRef.current = false;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore teardown errors
        }
        playerRef.current = null;
      }
      if (host) {
        host.innerHTML = "";
      }
    };
  }, []);

  const isActiveSpin =
    !hasError && (playerStatus === "playing" || playerStatus === "buffering");

  const handleTogglePlay = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      playTick();

      if (playerStatus === "playing" || playerStatus === "buffering") {
        pendingPlayRef.current = false;
        setPlayerStatus("paused");
        try {
          playerRef.current?.pauseVideo();
        } catch {
          // Ignore pause errors
        }
        return;
      }

      setHasError(false);
      setPlayerStatus("buffering");

      if (isReadyRef.current && playerRef.current) {
        try {
          playerRef.current.setVolume(INITIAL_VOLUME);
          playerRef.current.playVideo();
        } catch {
          setHasError(true);
          setPlayerStatus("idle");
        }
      } else {
        pendingPlayRef.current = true;
      }
    },
    [playTick, playerStatus]
  );

  const handleNextTrack = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!hasMultipleTracks) return;
      playTick();

      const nextIdx = (trackIndex + 1) % MUSIC_PLAYLIST.length;
      const nextTrack = MUSIC_PLAYLIST[nextIdx];
      if (!nextTrack) return;

      setTrackIndex(nextIdx);
      setCoverError(false);
      setHasError(false);
      setPlayerStatus("buffering");

      if (isReadyRef.current && playerRef.current) {
        try {
          playerRef.current.setVolume(INITIAL_VOLUME);
          playerRef.current.loadVideoById(nextTrack.youtubeId);
        } catch {
          setHasError(true);
          setPlayerStatus("idle");
        }
      } else {
        pendingPlayRef.current = true;
      }
    },
    [hasMultipleTracks, playTick, trackIndex]
  );

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

  const playPauseLabel = isActiveSpin
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

  const subtitleText = hasError
    ? lang === "id"
      ? "Audio tidak tersedia"
      : "Audio unavailable"
    : playerStatus === "buffering"
      ? lang === "id"
        ? "Memuat..."
        : "Loading..."
      : currentTrack.artist;

  return (
    <>
      {/* Hidden Off-Screen YouTube Audio Backend */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-[9999px] -left-[9999px] h-1 w-1 overflow-hidden opacity-0"
      >
        <div ref={playerHostRef} />
      </div>

      {/* Floating Minimalist Vinyl Player Capsule */}
      <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
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
          className={`flex items-center transition-colors ${
            isTech
              ? "rounded-none border border-[#4ADE80]/55 bg-[#0B0D0C]/95 shadow-[4px_4px_0px_rgba(74,222,128,0.25)]"
              : "rounded-full border border-black/10 bg-white/85 shadow-lg ring-1 ring-inset ring-white/60 backdrop-blur-xl dark:border-white/15 dark:bg-[#2C2C2E]/92 dark:ring-white/[0.08]"
          } ${
            isExpanded
              ? "max-w-[calc(100vw-2rem)] gap-2.5 p-1.5 pr-2.5 sm:max-w-[275px]"
              : "cursor-pointer gap-2 p-1.5 pr-3 hover:border-black/25 dark:hover:border-white/25"
          }`}
        >
          {/* Vinyl Record Disc (Strictly circular .vinyl-disc even in Tech mode) */}
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
            className="vinyl-disc relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md ring-1 ring-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:ring-white/15"
          >
            {/* Rotating Disc Layer */}
            <div
              style={{
                animationPlayState: isActiveSpin ? "running" : "paused",
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
                  animationPlayState: isActiveSpin ? "running" : "paused",
                }}
                className={`w-[2px] transition-all ${
                  isTech
                    ? "rounded-none bg-[#4ADE80]"
                    : "rounded-full bg-neutral-700 dark:bg-neutral-200"
                } ${isActiveSpin ? "eq-bar-anim-1" : "h-1.5 opacity-60"}`}
              />
              <span
                style={{
                  animationPlayState: isActiveSpin ? "running" : "paused",
                }}
                className={`w-[2px] transition-all ${
                  isTech
                    ? "rounded-none bg-[#4ADE80]"
                    : "rounded-full bg-neutral-700 dark:bg-neutral-200"
                } ${isActiveSpin ? "eq-bar-anim-2" : "h-2.5 opacity-60"}`}
              />
              <span
                style={{
                  animationPlayState: isActiveSpin ? "running" : "paused",
                }}
                className={`w-[2px] transition-all ${
                  isTech
                    ? "rounded-none bg-[#4ADE80]"
                    : "rounded-full bg-neutral-700 dark:bg-neutral-200"
                } ${isActiveSpin ? "eq-bar-anim-3" : "h-1 opacity-60"}`}
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
                {/* Middle: Track Title & Artist / Buffering / Error */}
                <div className="min-w-0 flex-1 pr-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs leading-tight font-medium text-foreground">
                      {currentTrack.title}
                    </p>
                    {hasMultipleTracks && (
                      <span
                        className={`shrink-0 px-1 py-0.2 font-mono text-[9px] text-muted tabular-nums ${
                          isTech
                            ? "rounded-none border border-[#4ADE80]/30 bg-[#080A09]"
                            : "rounded bg-black/[0.06] dark:bg-white/[0.1]"
                        }`}
                      >
                        {trackIndex + 1}/{MUSIC_PLAYLIST.length}
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-0.5 truncate text-[10px] leading-tight ${
                      hasError
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-muted"
                    }`}
                  >
                    {subtitleText}
                  </p>
                </div>

                {/* Right: Play/Pause, optional Next Track, and Collapse (×) */}
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    aria-label={playPauseLabel}
                    title={playPauseLabel}
                    className={`flex h-7 w-7 items-center justify-center transition-transform duration-150 active:scale-95 ${
                      isTech
                        ? "rounded-none border border-[#4ADE80] bg-[#4ADE80] text-[#080A09] hover:opacity-90"
                        : "rounded-full bg-foreground text-canvas hover:opacity-90"
                    }`}
                  >
                    {isActiveSpin ? (
                      <Pause className="h-3 w-3 fill-current" />
                    ) : (
                      <Play className="h-3 w-3 translate-x-[0.5px] fill-current" />
                    )}
                  </button>

                  {hasMultipleTracks && (
                    <button
                      type="button"
                      onClick={handleNextTrack}
                      aria-label={nextTrackLabel}
                      title={nextTrackLabel}
                      className={`flex h-7 w-7 items-center justify-center transition-colors duration-150 active:scale-95 ${
                        isTech
                          ? "rounded-none border border-[#4ADE80]/40 bg-[#080A09] text-[#E6ECE8] hover:border-[#4ADE80]"
                          : "rounded-full border border-black/10 bg-canvas text-foreground hover:border-black/30 dark:border-white/15 dark:hover:border-white/35"
                      }`}
                    >
                      <SkipForward className="h-3 w-3" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCollapse}
                    aria-label={closePillLabel}
                    title={closePillLabel}
                    className={`flex h-6.5 w-6.5 items-center justify-center text-muted transition-colors duration-150 active:scale-95 ${
                      isTech
                        ? "rounded-none hover:bg-[#4ADE80]/15 hover:text-[#4ADE80]"
                        : "rounded-full hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                    }`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
