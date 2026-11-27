"use client";

import { useCallback, useRef } from "react";
import { useSoundContext } from "@/components/providers/AppProviders";

type AudioContextConstructor = typeof AudioContext;

function getAudioContextClass(): AudioContextConstructor | null {
  if (typeof window === "undefined") return null;
  const win = window as Window & {
    webkitAudioContext?: AudioContextConstructor;
  };
  return window.AudioContext || win.webkitAudioContext || null;
}

let sharedAudioCtx: AudioContext | null = null;

function ensureAudioContext(): AudioContext | null {
  const AudioCtx = getAudioContextClass();
  if (!AudioCtx) return null;

  try {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === "suspended") {
      void sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export function useUiSound() {
  const { isMuted, toggleMute, setMuted } = useSoundContext();
  const lastTickTimeRef = useRef<number>(0);
  const lastKeyTimeRef = useRef<number>(0);

  /**
   * Crisp physical switch click for Light/Dark theme toggle (~30ms)
   */
  const playSwitch = useCallback(
    (nextMode?: "light" | "dark") => {
      if (isMuted) return;
      const ctx = ensureAudioContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const isToLight = nextMode !== "dark";
        const startFreq = isToLight ? 520 : 680;
        const endFreq = isToLight ? 880 : 380;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.028);

        gain.gain.setValueAtTime(0.055, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.034);
      } catch {
        // Ignore autoplay restriction errors gracefully
      }
    },
    [isMuted]
  );

  /**
   * Subtle micro-pop / tick when hovering Dock squircles & Pill buttons (~14ms)
   */
  const playTick = useCallback(() => {
    if (isMuted) return;
    const perfNow = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (perfNow - lastTickTimeRef.current < 45) return;
    lastTickTimeRef.current = perfNow;

    const ctx = ensureAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(410, now + 0.014);

      gain.gain.setValueAtTime(0.028, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.018);
    } catch {
      // Ignore if AudioContext has not been unlocked by a click gesture yet
    }
  }, [isMuted]);

  /**
   * Soft organic editorial keystroke sound for About typewriter (~11ms)
   */
  const playKeystroke = useCallback(() => {
    if (isMuted) return;
    const perfNow = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (perfNow - lastKeyTimeRef.current < 26) return;
    lastKeyTimeRef.current = perfNow;

    const ctx = ensureAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Add subtle ±5% pitch variation for natural mechanical feel
      const jitter = 0.95 + Math.random() * 0.1;
      const baseFreq = 460 * jitter;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.65, now + 0.011);

      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.014);
    } catch {
      // Ignore if blocked by browser autoplay policy
    }
  }, [isMuted]);

  return {
    isMuted,
    toggleMute,
    setMuted,
    playSwitch,
    playTick,
    playKeystroke,
  };
}
