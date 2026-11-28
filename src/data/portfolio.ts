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
      id: "Data Analytics",
      en: "Data Analytics",
    },
    headline: {
      id: "Mengolah data transaksi dan operasional menjadi laporan yang jernih dan siap digunakan.",
      en: "Turning transactional and operational data into clear, practical reports.",
    },
    description: {
      id: "Mengubah data mentah menjadi wawasan bisnis melalui pembersihan data, analisis tren, dan perancangan dashboard KPI interaktif untuk mendukung pengambilan keputusan.",
      en: "Turning raw data into actionable business insights through data cleaning, trend analysis, and interactive KPI dashboards to support decision-making.",
    },
    accentHex: "#16A34A",
    coreStack: [
      "SQL (MySQL)",
      "Microsoft Excel",
      "Google Looker Studio",
      "Data Cleaning",
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
      id: "Web Dev (Segera Hadir)",
      en: "Web Dev (Coming Soon)",
    },
    badgeLabel: {
      id: "Frontend & Web Dev (Segera Hadir)",
      en: "Frontend & Web Dev (Coming Soon)",
    },
    headline: {
      id: "Dokumentasi studi kasus pengembangan web sedang disiapkan.",
      en: "Web development case studies are currently in preparation.",
    },
    description: {
      id: "Jalur portofolio Web Development sedang disiapkan. Saat ini fokus utama portofolio berada pada jalur Data Analyst.",
      en: "The Web Development track is currently in preparation. Right now, my primary focus is on the Data Analyst track.",
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
      id: "Web Lab (Segera Hadir)",
      en: "Web Lab (Coming Soon)",
    },
    badgeLabel: {
      id: "Web Lab & Eksperimen (Segera Hadir)",
      en: "Web Lab & Experiments (Coming Soon)",
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
    title: "Global Layoffs Analysis (2020-2026)",
    trackSlug: "data-analyst",
    year: "2026",
    image: "/projects/global-layoffs.jpg",
    role: {
      id: "Data Analyst",
      en: "Data Analyst",
    },
    summary: {
      id: "Pembersihan data dengan SQL dan perancangan dashboard Looker Studio untuk memetakan 947K+ karyawan terdampak PHK di 62 negara (2020-2026).",
      en: "SQL data cleaning and Looker Studio dashboard design to map 947K+ laid-off employees across 62 countries (2020-2026).",
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
        "Puncak PHK terjadi pada akhir 2022 hingga awal 2023 dengan sekitar 90rb-100rb karyawan per bulan, disusul gelombang 10rb-35rb per bulan sepanjang 2024-2026.",
        "Amerika Serikat menyumbang 70,7% dari total angka global (670.039 karyawan), terutama pada sektor Retail, Hardware, dan Consumer.",
        "Sepuluh perusahaan teratas semuanya berstatus Post-IPO, dipimpin Amazon (59.810) dan Intel (43.167), yang mencakup 29,9% total PHK global.",
      ],
      en: [
        "Layoffs peaked between late 2022 and early 2023 at around 90k-100k employees per month, followed by 10k-35k monthly waves across 2024-2026.",
        "The United States accounted for 70.7% of the global total (670,039 employees), with Retail, Hardware, and Consumer hit the hardest.",
        "The top 10 companies were all Post-IPO enterprises, led by Amazon (59,810) and Intel (43,167), representing 29.9% of total global layoffs.",
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
      id: "Evaluasi omzet tahunan ($817K+ dari 21K+ pesanan), pola jam sibuk dapur, dan kontribusi kategori menu pizza lewat dashboard Looker Studio.",
      en: "Evaluation of annual revenue ($817K+ across 21K+ orders), kitchen peak hours, and menu category performance via Looker Studio.",
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
        "Pesanan harian memuncak pada jam makan siang (12.00-13.00, sekitar 2.500 order per jam) dan makan malam (17.00-18.00), lalu melandai pada pukul 14.00-16.00.",
        "Kontribusi pesanan terbagi merata di empat kategori menu: Classic (26,9%), Supreme (25,5%), Chicken (24,0%), dan Veggie (23,7%).",
        "Tiga menu dengan pendapatan tertinggi semuanya berbahan dasar ayam, dipimpin The Thai Chicken Pizza ($43.434,25), sehingga stok bahan baku ayam menjadi prioritas utama.",
      ],
      en: [
        "Daily orders peak during lunch (12:00-13:00, around 2,500 orders per hour) and dinner (17:00-18:00), with a quieter window between 14:00-16:00.",
        "Order volume is evenly distributed across all four categories: Classic (26.9%), Supreme (25.5%), Chicken (24.0%), and Veggie (23.7%).",
        "The top three revenue-generating pizzas are all chicken-based, led by The Thai Chicken Pizza ($43,434.25), making chicken stock management a top priority.",
      ],
    },
    recommendation: {
      id: "Pengaturan jadwal shift bertahap pada jam sibuk, paket promo sore pukul 14.00-16.00, serta penjagaan stok aman untuk fillet ayam dan saus utama.",
      en: "Staggered kitchen shifts during peak hours, afternoon combo promos from 14:00-16:00, and safety stock buffers for chicken fillet and core sauces.",
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
      id: "Analisis 238K+ catatan kecelakaan lalu lintas New York City (2021-2023) dengan Microsoft Excel untuk memetakan wilayah rawan, jam puncak, dan penyebab utama insiden.",
      en: "Analysis of 238K+ New York City collision records (2021-2023) in Microsoft Excel to map high-risk areas, peak hours, and primary causes.",
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
        "Brooklyn (76.416 kasus atau 32%) dan Queens (63.751 kasus) menyumbang hampir 59% dari seluruh kecelakaan di New York City.",
        "Jumlah kasus tertinggi tercatat pada bulan Maret (25.099 kasus), dengan puncak harian pada jam pulang kerja pukul 16.00-17.00.",
        "Kelalaian pengemudi (Driver Inattention/Distraction) menjadi penyebab terbesar dengan 58.308 kasus, atau sekitar 25% dari total insiden.",
      ],
      en: [
        "Brooklyn (76,416 cases or 32%) and Queens (63,751 cases) account for nearly 59% of all collisions across New York City.",
        "Incident volume peaks seasonally in March (25,099 cases) and daily during the afternoon commute from 16:00-17:00.",
        "Driver Inattention/Distraction is the leading cause with 58,308 recorded cases, or around 25% of total collisions.",
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
    title: "IT Specialist: Artificial Intelligence",
    issuer: "Certiport, CertNexus, Pearson",
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
    issuer: "BNSP, LSP Informatika",
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
      id: "Publikasi studi kasus Global Layoffs Analysis (2020-2026), mencakup 947.449 karyawan terdampak di 62 negara",
      en: "Published Global Layoffs Analysis (2020-2026) case study covering 947,449 affected employees across 62 countries",
    },
    description: {
      id: "Pembersihan data dengan MySQL dan visualisasi dashboard interaktif di Google Looker Studio.",
      en: "Data cleaning in MySQL and interactive dashboard design in Google Looker Studio.",
    },
  },
  {
    id: "log-2026-11-18",
    date: "2026.11.18",
    trackSlug: "data-analyst",
    category: "research",
    title: {
      id: "Analisis operasional Pizza Sales Performance Dashboard ($817.860,05 pendapatan dari 21.350 pesanan)",
      en: "Completed Pizza Sales Performance operational BI dashboard ($817,860.05 revenue across 21,350 orders)",
    },
    description: {
      id: "Identifikasi jam sibuk operasional dapur dan perencanaan stok bahan baku utama.",
      en: "Identified daily kitchen rush-hour peaks and raw ingredient stock priorities.",
    },
  },
  {
    id: "log-2026-11-09",
    date: "2026.11.09",
    trackSlug: "data-analyst",
    category: "milestone",
    title: {
      id: "Pemodelan NYC Traffic Safety & Collision Analysis (238.421 insiden di 5 wilayah New York City)",
      en: "Built NYC Traffic Safety & Collision Analysis dashboard (238,421 collisions across 5 NYC boroughs)",
    },
    description: {
      id: "Dashboard Excel interaktif menggunakan PivotTable dan Data Modeling untuk pemetaan jam rawan dan faktor penyebab.",
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
