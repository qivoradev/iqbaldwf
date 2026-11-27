"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FilterTrackSlug, PROFILE, t } from "@/data/portfolio";
import { useLanguage } from "@/components/providers/AppProviders";
import { useUiSound } from "@/hooks/useUiSound";

interface AboutSectionProps {
  onSelectTrack?: (track: FilterTrackSlug) => void;
}

function DottedLink({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "text-foreground underline decoration-dotted decoration-neutral-400 underline-offset-[5px] transition-colors hover:decoration-foreground dark:decoration-neutral-500";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={className}
      >
        {children}
      </button>
    );
  }

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        onClick={(e) => e.stopPropagation()}
        className={className}
      >
        {children}
      </a>
    );
  }

  return <span className={className}>{children}</span>;
}

function LiveWibTime() {
  const [timeStr, setTimeStr] = useState<string>("--:-- WIB");

  useEffect(() => {
    const update = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date());
        setTimeStr(`${formatted} WIB`);
      } catch {
        setTimeStr("UTC+7 WIB");
      }
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return <span className="font-mono tabular-nums">{timeStr}</span>;
}

export function AboutSection({ onSelectTrack }: AboutSectionProps) {
  const { lang } = useLanguage();
  const fullIntro = t(PROFILE.aboutTypewriterIntro, lang);
  const [typedCount, setTypedCount] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const { playKeystroke, playTick } = useUiSound();
  const playKeystrokeRef = useRef(playKeystroke);

  useEffect(() => {
    playKeystrokeRef.current = playKeystroke;
  }, [playKeystroke]);

  const completeImmediately = useCallback(() => {
    setTypedCount(fullIntro.length);
    setIsDone(true);
  }, [fullIntro.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isDone) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const interval = window.setInterval(() => {
      if (reducedMotion) {
        window.clearInterval(interval);
        setTypedCount(fullIntro.length);
        setIsDone(true);
        return;
      }

      setTypedCount((prev) => {
        const next = prev + 2;
        if (next % 4 === 0) {
          playKeystrokeRef.current();
        }
        if (next >= fullIntro.length) {
          window.clearInterval(interval);
          setIsDone(true);
          return fullIntro.length;
        }
        return next;
      });
    }, 20);

    return () => window.clearInterval(interval);
  }, [fullIntro.length, isDone]);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    playTick();
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section
      aria-label="About Iqbal Dwi Fathonah"
      onClick={() => {
        if (!isDone) {
          playTick();
          completeImmediately();
        }
      }}
      className={`mx-auto w-full max-w-[600px] px-6 py-10 text-left md:py-14 ${
        !isDone ? "cursor-pointer" : ""
      }`}
    >
      <div className="space-y-6 text-[15px] leading-[1.68] font-normal tracking-[-0.01em] text-neutral-800 md:text-[16px] dark:text-neutral-200">
        {/* Greeting */}
        <p className="text-foreground">
          {lang === "id" ? "Halo" : "Hi there"}{" "}
          <span aria-hidden="true">👋</span>{" "}
          <span className="ml-1 font-mono text-xs text-muted">
            @{PROFILE.handle}
          </span>
        </p>

        {/* Opening paragraph with skippable typewriter */}
        <p className="min-h-[4.5rem]">
          {isDone ? (
            lang === "id" ? (
              <>
                Saya <span className="text-foreground">{PROFILE.name}</span>,
                lulusan baru S1 Teknologi Informasi 2026 dari{" "}
                <DottedLink>
                  Universitas Muhammadiyah Yogyakarta (UMY)
                </DottedLink>{" "}
                yang berfokus mengubah dataset kompleks menjadi keputusan bisnis
                yang jernih dan terukur.
              </>
            ) : (
              <>
                I’m <span className="text-foreground">{PROFILE.name}</span>, a
                2026 Information Technology graduate from{" "}
                <DottedLink>
                  Universitas Muhammadiyah Yogyakarta (UMY)
                </DottedLink>{" "}
                focused on turning complex datasets into clear, measurable
                business decisions.
              </>
            )
          ) : (
            <>
              <span>{fullIntro.slice(0, typedCount)}</span>
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-4 w-[1.5px] translate-y-0.5 animate-pulse bg-foreground"
              />
            </>
          )}
        </p>

        {/* Primary Focus: Data Analytics paragraph */}
        {lang === "id" ? (
          <p>
            Fokus utama saya saat ini berada di bidang{" "}
            <DottedLink
              onClick={
                onSelectTrack ? () => onSelectTrack("data-analyst") : undefined
              }
            >
              Data Analytics
            </DottedLink>
            . Saya menggunakan <DottedLink>SQL</DottedLink> (CTE, Window
            Functions, data staging), <DottedLink>Microsoft Excel</DottedLink>,
            dan <DottedLink>Google Looker Studio</DottedLink> untuk membersihkan
            dan memodelkan ribuan baris data pada studi kasus{" "}
            <DottedLink
              onClick={
                onSelectTrack ? () => onSelectTrack("data-analyst") : undefined
              }
            >
              Global Layoffs (2020–2026)
            </DottedLink>
            , kinerja operasional ritel Pizza Sales, serta analisis keselamatan
            lalu lintas NYC.
          </p>
        ) : (
          <p>
            My primary focus is{" "}
            <DottedLink
              onClick={
                onSelectTrack ? () => onSelectTrack("data-analyst") : undefined
              }
            >
              Data Analytics
            </DottedLink>
            . I work with <DottedLink>SQL</DottedLink> (CTEs, Window Functions,
            data staging), <DottedLink>Microsoft Excel</DottedLink>, and{" "}
            <DottedLink>Google Looker Studio</DottedLink> to clean and model
            multi-thousand-row datasets across case studies including{" "}
            <DottedLink
              onClick={
                onSelectTrack ? () => onSelectTrack("data-analyst") : undefined
              }
            >
              Global Layoffs (2020–2026)
            </DottedLink>
            , Pizza Sales retail operations, and NYC Traffic Safety.
          </p>
        )}

        {/* Secondary Background & Exploration */}
        {lang === "id" ? (
          <p>
            Selain analitik data, saya memiliki latar belakang pengembangan
            antarmuka web modern (<DottedLink>Next.js</DottedLink>,{" "}
            <DottedLink>TypeScript</DottedLink>,{" "}
            <DottedLink>Tailwind CSS</DottedLink>) yang sedang saya siapkan di
            jalur{" "}
            <DottedLink
              onClick={
                onSelectTrack ? () => onSelectTrack("frontend") : undefined
              }
            >
              Web Dev
            </DottedLink>{" "}
            dan{" "}
            <DottedLink
              onClick={onSelectTrack ? () => onSelectTrack("lab") : undefined}
            >
              Web Lab
            </DottedLink>
            .
          </p>
        ) : (
          <p>
            Alongside data analytics, I bring a background in modern web
            interface engineering (<DottedLink>Next.js</DottedLink>,{" "}
            <DottedLink>TypeScript</DottedLink>,{" "}
            <DottedLink>Tailwind CSS</DottedLink>), with dedicated documentation
            currently being curated under the{" "}
            <DottedLink
              onClick={
                onSelectTrack ? () => onSelectTrack("frontend") : undefined
              }
            >
              Web Dev
            </DottedLink>{" "}
            and{" "}
            <DottedLink
              onClick={onSelectTrack ? () => onSelectTrack("lab") : undefined}
            >
              Web Lab
            </DottedLink>{" "}
            tracks.
          </p>
        )}

        {/* Location & Availability */}
        {lang === "id" ? (
          <p>
            Saat ini saya berdomisili di <DottedLink>Yogyakarta</DottedLink> dan
            terbuka untuk peluang karier penuh waktu maupun kolaborasi (
            <DottedLink>Remote &amp; Relokasi</DottedLink>).
          </p>
        ) : (
          <p>
            I am currently based in <DottedLink>Yogyakarta</DottedLink> and open
            to full-time roles and collaborative opportunities (
            <DottedLink>Remote &amp; Relocation</DottedLink>).
          </p>
        )}

        {/* Subtle Editorial Footer Line inside About */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.08] pt-6 text-xs text-muted dark:border-white/[0.1]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopyEmail}
              onMouseEnter={playTick}
              className="font-mono text-xs text-foreground underline decoration-dotted underline-offset-4 transition-opacity hover:opacity-80"
            >
              {copied
                ? lang === "id"
                  ? "Email disalin!"
                  : "Copied email!"
                : PROFILE.email}
            </button>
            <span>·</span>
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={playTick}
              className="font-mono text-xs text-muted transition-colors hover:text-foreground"
            >
              GitHub (@{PROFILE.githubUsername})
            </a>
            <span>·</span>
            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={playTick}
              className="font-mono text-xs text-muted transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
            <LiveWibTime />
          </div>
        </div>
      </div>
    </section>
  );
}
