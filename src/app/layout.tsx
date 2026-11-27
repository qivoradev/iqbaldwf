import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { MiniVinylPlayer } from "@/components/MiniVinylPlayer";
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

const SITE_DESCRIPTION =
  "Personal Portfolio Hub Iqbal Dwi Fathonah, Fresh Graduate S1 Teknologi Informasi 2026 Universitas Muhammadiyah Yogyakarta. Data Analyst (SQL, Excel, Looker Studio).";

export const metadata: Metadata = {
  metadataBase: new URL("https://iqbaldwifathonah.vercel.app"),
  title: "iqbaldwifathonah",
  description: SITE_DESCRIPTION,
  keywords: [
    "Iqbal Dwi Fathonah",
    "iqbaldwifathonah",
    "qivoradev",
    "Data Analyst Indonesia",
    "Universitas Muhammadiyah Yogyakarta",
    "SQL",
    "Looker Studio",
    "Microsoft Excel",
  ],
  authors: [{ name: PROFILE.name }],
  openGraph: {
    title: "iqbaldwifathonah",
    description:
      "Data Analyst Portfolio Hub — SQL, Microsoft Excel & Google Looker Studio Case Studies.",
    url: "https://iqbaldwifathonah.vercel.app",
    siteName: "iqbaldwifathonah",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "iqbaldwifathonah",
    description:
      "Data Analyst Portfolio Hub — SQL, Microsoft Excel & Google Looker Studio Case Studies.",
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
          <MiniVinylPlayer />
        </AppProviders>
      </body>
    </html>
  );
}
