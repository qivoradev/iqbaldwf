import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PROFILE } from "@/data/portfolio";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${PROFILE.name} (${PROFILE.handle}) — Data Analyst & Frontend Web Developer`,
    template: `%s · ${PROFILE.name} (${PROFILE.handle})`,
  },
  description:
    "Personal Portfolio Hub Iqbal Dwi Fathonah (iqbaldf), Fresh Graduate S1 Teknologi Informasi 2026 Universitas Muhammadiyah Yogyakarta. Data Analyst (SQL, Excel, Looker Studio) & Frontend Web Developer (Next.js, TypeScript, Tailwind CSS).",
  keywords: [
    "Iqbal Dwi Fathonah",
    "iqbaldf",
    "qivoradev",
    "Data Analyst Indonesia",
    "Frontend Web Developer",
    "Universitas Muhammadiyah Yogyakarta",
    "JagoSel",
    "SQL",
    "Looker Studio",
    "Next.js",
  ],
  authors: [{ name: PROFILE.name }],
  openGraph: {
    title: `${PROFILE.name} (${PROFILE.handle}) — Personal Portfolio Hub`,
    description:
      "Multi-Track Portfolio Hub: Data Analytics, Frontend Web Engineering & Experimental Web Lab.",
    type: "website",
    locale: "id_ID",
  },
};

const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('iqbaldf-theme');
    var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh flex flex-col bg-canvas text-foreground selection:bg-foreground selection:text-canvas">
        <AppProviders>
          <CustomCursor />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
