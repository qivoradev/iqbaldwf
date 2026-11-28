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
let cachedClickNoiseBuffer: AudioBuffer | null = null;
let cachedLightSwitchNoiseBuffer: AudioBuffer | null = null;

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

function getClickNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (
    cachedClickNoiseBuffer &&
    cachedClickNoiseBuffer.sampleRate === ctx.sampleRate
  ) {
    return cachedClickNoiseBuffer;
  }
  const frameCount = Math.max(1, Math.ceil(ctx.sampleRate * 0.012));
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    const progress = i / frameCount;
    const envelope = Math.pow(1 - progress, 1.8);
    data[i] = (Math.random() * 2 - 1) * envelope;
  }
  cachedClickNoiseBuffer = buffer;
  return buffer;
}

function getLightSwitchNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (
    cachedLightSwitchNoiseBuffer &&
    cachedLightSwitchNoiseBuffer.sampleRate === ctx.sampleRate
  ) {
    return cachedLightSwitchNoiseBuffer;
  }
  const frameCount = Math.max(1, Math.ceil(ctx.sampleRate * 0.026));
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    const progress = i / frameCount;
    const envelope = Math.pow(1 - progress, 1.6);
    data[i] = (Math.random() * 2 - 1) * envelope;
  }
  cachedLightSwitchNoiseBuffer = buffer;
  return buffer;
}

export function useUiSound() {
  const {
    soundEnabled,
    setSoundEnabled,
    toggleSoundEnabled,
    isMuted,
    toggleMute,
    setMuted,
  } = useSoundContext();
  const lastTickTimeRef = useRef<number>(0);
  const lastKeyTimeRef = useRef<number>(0);

  /**
   * Mechanical Toggle Switch for Theme & Sound Switch:
   * - Initial crisp click at 0ms (1100 Hz -> 480 Hz, 15ms)
   * - Followed by a thin micro-snap at 18ms (Highpass 2600 Hz noise, 10ms)
   * - Volume: 0.28-0.32
   * - Pass `forcePlay = true` when toggling Sound effects back ON so confirmation plays immediately
   */
  const playSwitch = useCallback(
    (
      isDarkOrMode?: boolean | "auto" | "light" | "dark" | "tech",
      forcePlay = false
    ) => {
      if (!soundEnabled && !forcePlay) return;
      const ctx = ensureAudioContext();
      if (!ctx) return;

      try {
        if (ctx.state === "suspended") {
          void ctx.resume().catch(() => {});
        }

        const now = ctx.currentTime;
        const isDark =
          typeof isDarkOrMode === "boolean"
            ? isDarkOrMode
            : isDarkOrMode === "dark" || isDarkOrMode === "tech";

        // 1. Primary mechanical switch click at 0ms (15ms)
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();

        const startFreq =
          isDarkOrMode === undefined ? 1100 : isDark ? 980 : 1220;
        const endFreq = isDarkOrMode === undefined ? 480 : isDark ? 420 : 540;

        clickOsc.type = "triangle";
        clickOsc.frequency.setValueAtTime(startFreq, now);
        clickOsc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.015);

        clickGain.gain.setValueAtTime(0.3, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.016);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);

        clickOsc.start(now);
        clickOsc.stop(now + 0.018);

        // 2. Crisp micro-snap at +18ms (Highpass 2600 Hz, 10ms)
        const snapTime = now + 0.018;
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = getClickNoiseBuffer(ctx);

        const highpass = ctx.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.setValueAtTime(isDark ? 2450 : 2750, snapTime);
        highpass.Q.setValueAtTime(1.1, snapTime);

        const snapGain = ctx.createGain();
        snapGain.gain.setValueAtTime(0.28, snapTime);
        snapGain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.01);

        noiseSource.connect(highpass);
        highpass.connect(snapGain);
        snapGain.connect(ctx.destination);

        noiseSource.start(snapTime);
        noiseSource.stop(snapTime + 0.012);
      } catch {
        // Ignore autoplay restriction errors gracefully
      }
    },
    [soundEnabled]
  );

  /**
   * Mechanical Rocker Light Switch for Theme Segmented Control & Sound Effects Toggle:
   * - Layer 1 (t = 0ms): Pre-snap lever friction (~8ms bandpass noise around 2800Hz, Q = 2.2)
   * - Layer 2 (t = +16ms): Main plastic snap (~22ms bandpass noise: 2200Hz for 'on', 1550Hz for 'off')
   *   + Housing cavity thud (~35ms triangle pitch drop: 270Hz -> 95Hz for 'on', 210Hz -> 72Hz for 'off')
   */
  const playLightSwitch = useCallback(
    (variant: "on" | "off" = "on", forcePlay = false) => {
      if (!soundEnabled && !forcePlay) return;
      const ctx = ensureAudioContext();
      if (!ctx) return;

      try {
        if (ctx.state === "suspended") {
          void ctx.resume().catch(() => {});
        }

        const now = ctx.currentTime;
        const noiseBuffer = getLightSwitchNoiseBuffer(ctx);
        const isOn = variant === "on";

        // Layer 1: Pre-snap lever friction at t = 0ms (~8ms, bandpass 2800Hz, Q = 2.2)
        const preNoise = ctx.createBufferSource();
        preNoise.buffer = noiseBuffer;

        const preFilter = ctx.createBiquadFilter();
        preFilter.type = "bandpass";
        preFilter.frequency.setValueAtTime(2800, now);
        preFilter.Q.setValueAtTime(2.2, now);

        const preGain = ctx.createGain();
        preGain.gain.setValueAtTime(0.18, now);
        preGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

        preNoise.connect(preFilter);
        preFilter.connect(preGain);
        preGain.connect(ctx.destination);

        preNoise.start(now);
        preNoise.stop(now + 0.01);

        // Layer 2a: Main plastic clack snap at t = +16ms (~22ms, bandpass 2200Hz 'on' / 1550Hz 'off')
        const clackTime = now + 0.016;
        const snapNoise = ctx.createBufferSource();
        snapNoise.buffer = noiseBuffer;

        const snapFilter = ctx.createBiquadFilter();
        snapFilter.type = "bandpass";
        snapFilter.frequency.setValueAtTime(isOn ? 2200 : 1550, clackTime);
        snapFilter.Q.setValueAtTime(1.8, clackTime);

        const snapGain = ctx.createGain();
        snapGain.gain.setValueAtTime(isOn ? 0.34 : 0.32, clackTime);
        snapGain.gain.exponentialRampToValueAtTime(0.001, clackTime + 0.022);

        snapNoise.connect(snapFilter);
        snapFilter.connect(snapGain);
        snapGain.connect(ctx.destination);

        snapNoise.start(clackTime);
        snapNoise.stop(clackTime + 0.024);

        // Layer 2b: Switch housing cavity thud at t = +16ms (~35ms pitch drop)
        const thudOsc = ctx.createOscillator();
        const thudGain = ctx.createGain();

        thudOsc.type = "triangle";
        thudOsc.frequency.setValueAtTime(isOn ? 270 : 210, clackTime);
        thudOsc.frequency.exponentialRampToValueAtTime(
          isOn ? 95 : 72,
          clackTime + 0.035
        );

        thudGain.gain.setValueAtTime(isOn ? 0.28 : 0.3, clackTime);
        thudGain.gain.exponentialRampToValueAtTime(0.001, clackTime + 0.035);

        thudOsc.connect(thudGain);
        thudGain.connect(ctx.destination);

        thudOsc.start(clackTime);
        thudOsc.stop(clackTime + 0.037);
      } catch {
        // Ignore autoplay restriction errors gracefully
      }
    },
    [soundEnabled]
  );

  /**
   * Crisp Tactile Micro-Click for ID/EN toggle, nav links, Dock icons, and Vinyl controls
   */
  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    const perfNow =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    if (perfNow - lastTickTimeRef.current < 28) return;
    lastTickTimeRef.current = perfNow;

    const ctx = ensureAudioContext();
    if (!ctx) return;

    try {
      if (ctx.state === "suspended") {
        void ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;

      // 1. Short highpass noise burst (3200 Hz, 8ms, gain 0.24)
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = getClickNoiseBuffer(ctx);

      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.setValueAtTime(3200, now);
      highpass.Q.setValueAtTime(1.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.24, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

      noiseSource.connect(highpass);
      highpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.01);

      // 2. Punchy pitch drop (triangle 1900 Hz -> 750 Hz in 18ms, gain 0.22)
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();

      bodyOsc.type = "triangle";
      bodyOsc.frequency.setValueAtTime(1900, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(750, now + 0.018);

      bodyGain.gain.setValueAtTime(0.22, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.02);
    } catch {
      // Ignore if AudioContext has not been unlocked by a click gesture yet
    }
  }, [soundEnabled]);

  /**
   * Vintage Mechanical Typewriter Keystroke
   */
  const playKeystroke = useCallback(
    (char?: string) => {
      if (!soundEnabled) return;
      if (char !== undefined && char.trim() === "") return;

      const perfNow =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      if (perfNow - lastKeyTimeRef.current < 22) return;
      lastKeyTimeRef.current = perfNow;

      const ctx = ensureAudioContext();
      if (!ctx) return;

      try {
        if (ctx.state === "suspended") {
          void ctx.resume().catch(() => {});
        }

        const now = ctx.currentTime;
        const jitter = 0.86 + Math.random() * 0.28;
        const masterVol = 0.09 + Math.random() * 0.05;
        const strikeDecay = 0.012 + Math.random() * 0.004;

        // Layer 1: Highpass-filtered white noise (2200-3400 Hz)
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

        // Layer 3: Typewriter body thump (180-240 Hz, 24ms decay)
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
    [soundEnabled]
  );

  /**
   * Subtle Vintage Typewriter Carriage Return Bell ("ting!")
   */
  const playTypewriterBell = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    try {
      if (ctx.state === "suspended") {
        void ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;

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
  }, [soundEnabled]);

  return {
    soundEnabled,
    setSoundEnabled,
    toggleSoundEnabled,
    isMuted,
    toggleMute,
    setMuted,
    playSwitch,
    playLightSwitch,
    playTick,
    playKeystroke,
    playTypewriterBell,
  };
}
