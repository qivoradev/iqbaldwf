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
let cachedStrikeNoiseBuffer: AudioBuffer | null = null;

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

function getStrikeNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (
    cachedStrikeNoiseBuffer &&
    cachedStrikeNoiseBuffer.sampleRate === ctx.sampleRate
  ) {
    return cachedStrikeNoiseBuffer;
  }
  // 18ms crisp white noise buffer with sharp initial transient for metal typebar strike
  const frameCount = Math.max(1, Math.ceil(ctx.sampleRate * 0.018));
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    const progress = i / frameCount;
    const envelope = Math.pow(1 - progress, 2.2);
    data[i] = (Math.random() * 2 - 1) * envelope;
  }
  cachedStrikeNoiseBuffer = buffer;
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
   * Vintage Mechanical Typewriter Keystroke:
   * - Layer 1 (Metal strike): Short highpass-filtered white noise (2200–3400 Hz, 12–16ms decay)
   * - Layer 2 (Metal lever resonance): Brief triangle oscillator (1400 Hz -> 480 Hz in 14ms)
   * - Layer 3 (Carriage/body thump): Soft low thump (180–240 Hz, 24ms decay)
   * - Organic variation: ±14% random frequency jitter & 0.09–0.14 random volume
   * - Skips space characters (' ')
   */
  const playKeystroke = useCallback(
    (char?: string) => {
      if (isMuted) return;
      if (char !== undefined && char.trim() === "") return;

      const perfNow =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      if (perfNow - lastKeyTimeRef.current < 22) return;
      lastKeyTimeRef.current = perfNow;

      const ctx = ensureAudioContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;
        // ±14% frequency variation (0.86 to 1.14)
        const jitter = 0.86 + Math.random() * 0.28;
        // Random volume between 0.09 and 0.14
        const masterVol = 0.09 + Math.random() * 0.05;
        // Random strike decay between 12ms and 16ms
        const strikeDecay = 0.012 + Math.random() * 0.004;

        // Layer 1: Highpass-filtered white noise (2200–3400 Hz) for metal typebar clack on paper
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = getStrikeNoiseBuffer(ctx);

        const highpass = ctx.createBiquadFilter();
        highpass.type = "highpass";
        const hpFreq = Math.min(3400, Math.max(2200, 2800 * jitter));
        highpass.frequency.setValueAtTime(hpFreq, now);
        highpass.Q.setValueAtTime(0.9, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(masterVol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0008, now + strikeDecay);

        noiseSource.connect(highpass);
        highpass.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseSource.start(now);
        noiseSource.stop(now + strikeDecay + 0.002);

        // Layer 2: Metal lever resonance (triangle 1400 Hz -> 480 Hz in 14ms)
        const leverOsc = ctx.createOscillator();
        const leverGain = ctx.createGain();

        leverOsc.type = "triangle";
        leverOsc.frequency.setValueAtTime(1400 * jitter, now);
        leverOsc.frequency.exponentialRampToValueAtTime(
          480 * jitter,
          now + 0.014
        );

        leverGain.gain.setValueAtTime(masterVol * 0.42, now);
        leverGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.014);

        leverOsc.connect(leverGain);
        leverGain.connect(ctx.destination);

        leverOsc.start(now);
        leverOsc.stop(now + 0.015);

        // Layer 3: Typewriter body thump (180–240 Hz, 24ms decay)
        const bodyOsc = ctx.createOscillator();
        const bodyGain = ctx.createGain();

        const bodyFreq = Math.min(240, Math.max(180, 210 * jitter));
        bodyOsc.type = "sine";
        bodyOsc.frequency.setValueAtTime(bodyFreq, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(
          bodyFreq * 0.38,
          now + 0.024
        );

        bodyGain.gain.setValueAtTime(masterVol * 0.85, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.024);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(ctx.destination);

        bodyOsc.start(now);
        bodyOsc.stop(now + 0.026);
      } catch {
        // Ignore if blocked by browser autoplay policy
      }
    },
    [isMuted]
  );

  /**
   * Subtle Vintage Typewriter Carriage Return Bell ("ting!"):
   * - Fundamental sine at 2550 Hz + soft harmonic at 5100 Hz
   * - Decay 0.55s, gentle volume 0.05
   * - Triggered once when About typewriter finishes naturally (not when skipped)
   */
  const playTypewriterBell = useCallback(() => {
    if (isMuted) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Fundamental bell tone (2550 Hz)
      const bellOsc = ctx.createOscillator();
      const bellGain = ctx.createGain();

      bellOsc.type = "sine";
      bellOsc.frequency.setValueAtTime(2550, now);

      bellGain.gain.setValueAtTime(0.0001, now);
      bellGain.gain.linearRampToValueAtTime(0.05, now + 0.004);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      bellOsc.connect(bellGain);
      bellGain.connect(ctx.destination);

      bellOsc.start(now);
      bellOsc.stop(now + 0.56);

      // Soft metallic overtone harmonic (5100 Hz)
      const harmonicOsc = ctx.createOscillator();
      const harmonicGain = ctx.createGain();

      harmonicOsc.type = "sine";
      harmonicOsc.frequency.setValueAtTime(5100, now);

      harmonicGain.gain.setValueAtTime(0.0001, now);
      harmonicGain.gain.linearRampToValueAtTime(0.018, now + 0.003);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      harmonicOsc.connect(harmonicGain);
      harmonicGain.connect(ctx.destination);

      harmonicOsc.start(now);
      harmonicOsc.stop(now + 0.36);
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
    playTypewriterBell,
  };
}
