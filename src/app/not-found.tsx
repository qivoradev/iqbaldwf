import Link from "next/link";
import { TopPillNavbar } from "@/components/layout/TopPillNavbar";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col justify-between bg-canvas text-foreground">
      <TopPillNavbar backHref="/" />

      <main className="mx-auto flex flex-1 max-w-[600px] flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs text-muted">404</p>
        <h1 className="mt-2 text-2xl font-normal tracking-[-0.025em] text-foreground">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          Rute yang Anda tuju tidak tersedia. Silakan kembali ke tampilan utama.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full border border-black/[0.12] px-4 py-1.5 text-xs font-normal text-foreground transition-colors hover:border-black/30 dark:border-white/[0.14] dark:hover:border-white/35"
        >
          back to home
        </Link>
      </main>

      <div aria-hidden="true" className="h-10 shrink-0" />
    </div>
  );
}
