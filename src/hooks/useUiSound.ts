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
let cachedNoiseBuffer: AudioBuffer | null = null;

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

function getShortNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedNoiseBuffer && cachedNoiseBuffer.sampleRate === ctx.sampleRate) {
    return cachedNoiseBuffer;
  }
  // 20ms mono white noise buffer for tactile keycap click transient
  const frameCount = Math.max(1, Math.ceil(ctx.sampleRate * 0.02));
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    // Taper envelope slightly inside buffer for smooth attack/release
    const env = 1 - i / frameCount;
    data[i] = (Math.random() * 2 - 1) * env;
  }
  cachedNoiseBuffer = buffer;
  return buffer;
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
    const perfNow =
      typeof performance !== "undefined" ? performance.now() : Date.now();
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
   * Soft tactile mechanical keystroke ("thock") for About typewriter:
   * - Filtered white noise burst (BandpassFilter 1100–1600 Hz, Q 1.4, 18ms)
   * - Soft low body pulse (140–180 Hz fast decay 22ms)
   * - ±10% random frequency variation per keystroke
   * - Skips space characters (' ') and enforces ~35ms minimum interval
   */
  const playKeystroke = useCallback(
    (char?: string) => {
      if (isMuted) return;
      if (char !== undefined && char.trim() === "") return;

      const perfNow =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      if (perfNow - lastKeyTimeRef.current < 35) return;
      lastKeyTimeRef.current = perfNow;

      const ctx = ensureAudioContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;
        // ±10% pitch variation (0.90 to 1.10)
        const jitter = 0.9 + Math.random() * 0.2;

        // 1. Short Filtered White Noise Burst (1100–1600 Hz bandpass, Q = 1.4, 18ms)
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = getShortNoiseBuffer(ctx);

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = "bandpass";
        bandpass.frequency.setValueAtTime(1350 * jitter, now);
        bandpass.Q.setValueAtTime(1.4, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.095, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

        noiseSource.connect(bandpass);
        bandpass.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseSource.start(now);
        noiseSource.stop(now + 0.019);

        // 2. Soft Low Body Pulse (140–180 Hz sine/triangle thock, 22ms decay)
        const bodyOsc = ctx.createOscillator();
        const bodyGain = ctx.createGain();

        const bodyStartFreq = 160 * jitter;
        bodyOsc.type = "sine";
        bodyOsc.frequency.setValueAtTime(bodyStartFreq, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(
          bodyStartFreq * 0.42,
          now + 0.022
        );

        bodyGain.gain.setValueAtTime(0.09, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(ctx.destination);

        bodyOsc.start(now);
        bodyOsc.stop(now + 0.024);
      } catch {
        // Ignore if blocked by browser autoplay policy
      }
    },
    [isMuted]
  );

  return {
    isMuted,
    toggleMute,
    setMuted,
    playSwitch,
    playTick,
    playKeystroke,
  };
}
