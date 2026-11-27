import type { LanguageCode } from "@/components/providers/AppProviders";

export type TrackSlug = "data-analyst" | "frontend" | "lab";

export type FilterTrackSlug = "all" | TrackSlug;

export interface LocalizedText {
  id: string;
  en: string;
}

export interface ProfileData {
  name: string;
  handle: string;
  degree: LocalizedText;
  graduationYear: string;
  university: string;
  universityShort: string;
  location: LocalizedText;
  availability: LocalizedText;
  email: string;
  githubUsername: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface Track {
  slug: TrackSlug;
  aliases?: string[];
  isComingSoon?: boolean;
  title: LocalizedText;
  shortLabel: LocalizedText;
  dockTooltip: LocalizedText;
  badgeLabel: LocalizedText;
  headline: LocalizedText;
  description: LocalizedText;
  comingSoonMessage?: LocalizedText;
  accentHex: string;
  coreStack: string[];
}

export interface ProjectKpi {
  value: string;
  label: LocalizedText;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  trackSlug: TrackSlug;
  year: string;
  image: string;
  role: LocalizedText;
  summary: LocalizedText;
  techStack: string[];
  kpis: ProjectKpi[];
  keyInsights: {
    id: string[];
    en: string[];
  };
  recommendation?: LocalizedText;
  links: {
    liveDashboard?: string;
    github: string;
  };
  featured: boolean;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  shortDate: LocalizedText;
  fullDate: LocalizedText;
  credentialId: string;
  verifyUrl?: string;
  image: string;
  orientation: "landscape" | "portrait";
}

export interface ActivityLog {
  id: string;
  date: string;
  trackSlug: TrackSlug;
  category: "release" | "research" | "learning" | "milestone";
  title: LocalizedText;
  description: LocalizedText;
  href?: string;
}

export function t(value: LocalizedText, lang: LanguageCode): string {
  return value[lang];
}

export const PROFILE: ProfileData = {
  name: "Iqbal Dwi Fathonah",
  handle: "iqbaldf",
  degree: {
    id: "S1 Teknologi Informasi",
    en: "B.S. in Information Technology",
  },
  graduationYear: "2026",
  university: "Universitas Muhammadiyah Yogyakarta",
  universityShort: "UMY",
  location: {
    id: "Yogyakarta, Indonesia",
    en: "Yogyakarta, Indonesia",
  },
  availability: {
    id: "Terbuka untuk Remote & Relokasi",
    en: "Open for Remote & Relocation",
  },
  email: "iqbalfathonah20@gmail.com",
  githubUsername: "qivoradev",
  githubUrl: "https://github.com/qivoradev",
  linkedinUrl: "https://www.linkedin.com/in/iqbaldf",
};

export const TRACKS: Track[] = [
  {
    slug: "data-analyst",
    aliases: ["data"],
    isComingSoon: false,
    title: {
      id: "Data Analyst",
      en: "Data Analyst",
    },
    shortLabel: {
      id: "Data",
      en: "Data",
    },
    dockTooltip: {
      id: "Data Analyst",
      en: "Data Analyst",
    },
    badgeLabel: {
      id: "Data Analytics · Fokus Utama",
      en: "Data Analytics · Primary Focus",
    },
    headline: {
      id: "Mengubah data transaksi dan operasional mentah menjadi temuan bisnis yang jernih dan siap dieksekusi.",
      en: "Transforming messy transactional and operational data into clear, actionable business intelligence.",
    },
    description: {
      id: "Pembersihan data dengan SQL (MySQL), pemodelan KPI & PivotTable di Microsoft Excel, serta perancangan dashboard interaktif di Google Looker Studio.",
      en: "Data cleaning with SQL (MySQL), KPI & PivotTable modeling in Microsoft Excel, and interactive executive dashboards in Google Looker Studio.",
    },
    accentHex: "#16A34A",
    coreStack: [
      "SQL (MySQL)",
      "Microsoft Excel",
      "Google Looker Studio",
      "PivotTable",
      "Data Modeling",
    ],
  },
  {
    slug: "frontend",
    aliases: ["frontend-dev", "web-dev"],
    isComingSoon: true,
    title: {
      id: "Web Dev",
      en: "Web Dev",
    },
    shortLabel: {
      id: "Segera",
      en: "Soon",
    },
    dockTooltip: {
      id: "Web Dev · Segera Hadir",
      en: "Web Dev · Coming Soon",
    },
    badgeLabel: {
      id: "Frontend & Web Dev · Segera Hadir",
      en: "Frontend & Web Dev · Coming Soon",
    },
    headline: {
      id: "Dokumentasi studi kasus rekayasa web sedang dikurasi.",
      en: "Web engineering case studies are currently being curated.",
    },
    description: {
      id: "Jalur portofolio Web Development sedang disiapkan. Saat ini fokus utama portofolio berada pada jalur Data Analyst.",
      en: "The Web Development track is currently in preparation. At this time, my primary portfolio focus is on the Data Analyst track.",
    },
    accentHex: "#0A0A0A",
    coreStack: ["Next.js", "React", "TypeScript", "Tailwind CSS v4", "Supabase"],
  },
  {
    slug: "lab",
    aliases: ["web-lab", "future"],
    isComingSoon: true,
    title: {
      id: "Web Lab",
      en: "Web Lab",
    },
    shortLabel: {
      id: "Segera",
      en: "Soon",
    },
    dockTooltip: {
      id: "Web Lab · Segera Hadir",
      en: "Web Lab · Coming Soon",
    },
    badgeLabel: {
      id: "Web Lab & Eksperimen · Segera Hadir",
      en: "Web Lab & Experiments · Coming Soon",
    },
    headline: {
      id: "Ruang eksperimen teknis dan QA Engineering sedang disiapkan.",
      en: "Technical experiments and QA Engineering sandbox are in preparation.",
    },
    description: {
      id: "Ruang laboratorium untuk eksperimen QA Engineering dan perkakas web mikro sedang disiapkan.",
      en: "This laboratory space for QA Engineering experiments and micro web tools is currently in preparation.",
    },
    accentHex: "#F94D23",
    coreStack: ["QA Engineering", "Test Case Matrix", "Web Tools", "Automation"],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "proj-global-layoffs",
    slug: "global-layoffs-analysis-2020-2026",
    title: "Global Layoffs Analysis (2020–2026)",
    trackSlug: "data-analyst",
    year: "2026",
    image: "/projects/global-layoffs.jpg",
    role: {
      id: "Data Analyst",
      en: "Data Analyst",
    },
    summary: {
      id: "Analisis end-to-end pembersihan data SQL hingga dashboard interaktif Looker Studio untuk memetakan gelombang PHK global 2020–2026.",
      en: "End-to-end SQL data cleaning and interactive Looker Studio dashboard mapping global layoff waves from 2020 to 2026.",
    },
    techStack: ["SQL (MySQL)", "Microsoft Excel", "Google Looker Studio"],
    kpis: [
      {
        value: "947.449",
        label: { id: "Total PHK", en: "Total Laid Off" },
      },
      {
        value: "2.631",
        label: { id: "Perusahaan", en: "Companies" },
      },
      {
        value: "39,86%",
        label: { id: "Rata-rata % PHK", en: "Avg. Layoff %" },
      },
      {
        value: "62",
        label: { id: "Negara", en: "Countries" },
      },
    ],
    keyInsights: {
      id: [
        "Puncak restrukturisasi terjadi akhir 2022–awal 2023 (~90rb–100rb karyawan/bulan), dengan gelombang berulang 10rb–35rb/bulan di 2024–2026.",
        "Amerika Serikat mendominasi 70,7% (670.039 karyawan), dengan Retail, Hardware, dan Consumer sebagai sektor paling terdampak.",
        "Top 10 perusahaan (seluruhnya tahap Post-IPO, dipimpin Amazon 59.810 & Intel 43.167) menyumbang 29,9% total PHK global.",
      ],
      en: [
        "Restructuring peaked in late 2022–early 2023 (~90k–100k employees/month), followed by recurring waves of 10k–35k/month across 2024–2026.",
        "The United States accounted for 70.7% (670,039 employees), with Retail, Hardware, and Consumer as the hardest-hit sectors.",
        "The top 10 companies (all Post-IPO, led by Amazon at 59,810 & Intel at 43,167) represented 29.9% of total global layoffs.",
      ],
    },
    links: {
      liveDashboard:
        "https://datastudio.google.com/reporting/9951d45c-28b4-42a9-81f2-cefb0c635cb8",
      github: "https://github.com/qivoradev/global-layoffs-analysis-2020-2026",
    },
    featured: true,
  },
  {
    id: "proj-pizza-sales",
    slug: "pizza-sales-performance-dashboard",
    title: "Pizza Sales Performance & Operational Analytics Dashboard",
    trackSlug: "data-analyst",
    year: "2026",
    image: "/projects/pizza-sales.png",
    role: {
      id: "Data Analyst",
      en: "Data Analyst",
    },
    summary: {
      id: "Dashboard BI interaktif untuk mengevaluasi omzet tahunan, pola jam sibuk dapur, dan kontribusi kategori menu pizza.",
      en: "Interactive BI dashboard evaluating annual revenue, kitchen rush-hour patterns, and pizza menu category contribution.",
    },
    techStack: ["Microsoft Excel", "Google Sheets", "Google Looker Studio"],
    kpis: [
      {
        value: "$817.860,05",
        label: { id: "Total Revenue", en: "Total Revenue" },
      },
      {
        value: "49.574",
        label: { id: "Pizza Terjual", en: "Pizzas Sold" },
      },
      {
        value: "21.350",
        label: { id: "Total Orders", en: "Total Orders" },
      },
      {
        value: "$38,31",
        label: { id: "AOV", en: "Avg. Order Value" },
      },
    ],
    keyInsights: {
      id: [
        "Pola beban kerja ganda setiap hari: puncak makan siang (12.00–13.00, ~2.500 order/jam) & makan malam (17.00–18.00), dengan penurunan sore pukul 14.00–16.00.",
        "Distribusi kategori sehat dan merata: Classic (26,9%), Supreme (25,5%), Chicken (24,0%), dan Veggie (23,7%).",
        "Tiga menu penyumbang omzet tertinggi semuanya berbasis ayam (dipimpin The Thai Chicken Pizza $43.434,25)—krusial untuk menjaga safety stock bahan baku.",
      ],
      en: [
        "Dual daily workload peaks: lunch rush (12:00–13:00, ~2,500 orders/hr) and dinner rush (17:00–18:00), with an afternoon lull from 14:00–16:00.",
        "Balanced category share across the menu: Classic (26.9%), Supreme (25.5%), Chicken (24.0%), and Veggie (23.7%).",
        "All top three revenue-generating pizzas are chicken-based (led by The Thai Chicken Pizza at $43,434.25)—critical for raw ingredient safety stock.",
      ],
    },
    recommendation: {
      id: "Staggered shift staf di jam puncak, promo bundling jam sore (14.00–16.00), dan safety stock fillet ayam & saus utama.",
      en: "Staggered kitchen shifts during peak hours, afternoon bundling promos (14:00–16:00), and safety stock for chicken fillet & core sauces.",
    },
    links: {
      liveDashboard: "", // TODO: isi link Looker Studio Pizza Sales
      github: "https://github.com/qivoradev/pizza-sales-performance-dashboard",
    },
    featured: true,
  },
  {
    id: "proj-nyc-traffic",
    slug: "nyc-traffic-collision-analysis",
    title: "NYC Traffic Safety & Collision Analysis Dashboard",
    trackSlug: "data-analyst",
    year: "2026",
    image: "/projects/nyc-traffic.png",
    role: {
      id: "Data Analyst",
      en: "Data Analyst",
    },
    summary: {
      id: "Dashboard Excel interaktif (2021–2023) untuk memetakan titik rawan wilayah, waktu puncak, dan akar penyebab kecelakaan lalu lintas di NYC.",
      en: "Interactive Excel dashboard (2021–2023) mapping borough hotspots, peak collision hours, and root causes of NYC traffic accidents.",
    },
    techStack: ["Microsoft Excel", "PivotTable", "Data Modeling"],
    kpis: [
      {
        value: "238.421",
        label: { id: "Total Kasus", en: "Total Collisions" },
      },
      {
        value: "116.227",
        label: { id: "Korban Luka", en: "Total Injured" },
      },
      {
        value: "268",
        label: { id: "Meninggal", en: "Fatalities" },
      },
      {
        value: "48,7%",
        label: { id: "Rasio Cedera", en: "Injury Rate" },
      },
    ],
    keyInsights: {
      id: [
        "Brooklyn (76.416 kasus / 32%) dan Queens (63.751) menyumbang hampir 59% dari seluruh kecelakaan di kota.",
        "Insiden memuncak secara musiman di bulan Maret (25.099 kasus) dan secara harian pada jam pulang kerja sore (16.00–17.00).",
        "Kelalaian pengemudi (Driver Inattention/Distraction) menjadi penyebab utama dengan 58.308 kasus (±25% dari total insiden).",
      ],
      en: [
        "Brooklyn (76,416 cases / 32%) and Queens (63,751) account for nearly 59% of all citywide collisions.",
        "Incidents peak seasonally in March (25,099 cases) and daily during the late-afternoon commute (16:00–17:00).",
        "Driver Inattention/Distraction is the leading root cause with 58,308 cases (~25% of total collisions).",
      ],
    },
    links: {
      github: "https://github.com/qivoradev/nyc-traffic-collision-analysis",
    },
    featured: false,
  },
];

export const CERTIFICATES: CertificateItem[] = [
  {
    id: "cert-it-specialist-ai",
    title: "IT Specialist — Artificial Intelligence",
    issuer: "Certiport · CertNexus · Pearson",
    shortDate: {
      id: "Jun 2026",
      en: "Jun 2026",
    },
    fullDate: {
      id: "18 Juni 2026",
      en: "June 18, 2026",
    },
    credentialId: "hd9z-4wLu",
    verifyUrl: "https://verify.certiport.com",
    image: "/certificates/cert-ai.jpg",
    orientation: "landscape",
  },
  {
    id: "cert-bnsp-cwdev",
    title: "Certified Web Developer (CWDev)",
    issuer: "BNSP · LSP Informatika",
    shortDate: {
      id: "Mar 2026",
      en: "Mar 2026",
    },
    fullDate: {
      id: "17 Maret 2026",
      en: "March 17, 2026",
    },
    credentialId: "TIK.317.00540 2026",
    image: "/certificates/cert-cwdev.png",
    orientation: "portrait",
  },
];

export const ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "log-2026-11-27",
    date: "2026.11.27",
    trackSlug: "data-analyst",
    category: "release",
    title: {
      id: "Publikasi studi kasus Global Layoffs Analysis (2020–2026) — 947.449 karyawan terdampak di 62 negara",
      en: "Published Global Layoffs Analysis (2020–2026) case study — 947,449 affected employees across 62 countries",
    },
    description: {
      id: "Pembersihan data dengan MySQL dan visualisasi dashboard interaktif di Google Looker Studio.",
      en: "End-to-end data cleaning in MySQL and interactive dashboarding in Google Looker Studio.",
    },
  },
  {
    id: "log-2026-11-18",
    date: "2026.11.18",
    trackSlug: "data-analyst",
    category: "research",
    title: {
      id: "Analisis operasional Pizza Sales Performance Dashboard ($817.860,05 revenue & 21.350 orders)",
      en: "Completed Pizza Sales Performance operational BI dashboard ($817,860.05 revenue & 21,350 orders)",
    },
    description: {
      id: "Identifikasi pola beban kerja ganda dapur dan rekomendasi safety stock bahan baku utama.",
      en: "Identified dual daily rush-hour peaks and raw ingredient safety stock recommendations.",
    },
  },
  {
    id: "log-2026-11-09",
    date: "2026.11.09",
    trackSlug: "data-analyst",
    category: "milestone",
    title: {
      id: "Pemodelan NYC Traffic Safety & Collision Analysis (238.421 insiden di 5 wilayah NYC)",
      en: "Built NYC Traffic Safety & Collision Analysis dashboard (238,421 collisions across 5 NYC boroughs)",
    },
    description: {
      id: "Dashboard Excel interaktif menggunakan PivotTable dan Data Modeling untuk pemetaan jam rawan dan faktor risiko.",
      en: "Interactive Excel dashboard using PivotTables and Data Modeling to map peak hours and contributing factors.",
    },
  },
];

export function getTrackBySlug(slug: string): Track | undefined {
  return TRACKS.find(
    (track) =>
      track.slug === slug || (track.aliases && track.aliases.includes(slug))
  );
}

export function getProjectsByTrack(filter: FilterTrackSlug): Project[] {
  if (filter === "all") {
    return PROJECTS.filter((project) => project.trackSlug === "data-analyst");
  }
  return PROJECTS.filter((project) => project.trackSlug === filter);
}

export function getLogsByTrack(filter: FilterTrackSlug): ActivityLog[] {
  if (filter === "all") return ACTIVITY_LOGS;
  return ACTIVITY_LOGS.filter((log) => log.trackSlug === filter);
}
