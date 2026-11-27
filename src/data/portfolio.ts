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
  heroLine1Left: LocalizedText;
  heroLine1Right: LocalizedText;
  heroLine2: LocalizedText;
  aboutTypewriterIntro: LocalizedText;
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

export interface CaseStudyDetail {
  problem: LocalizedText;
  approach: LocalizedText;
  keyInsights: {
    id: string[];
    en: string[];
  };
  outcome: LocalizedText;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  trackSlug: TrackSlug;
  year: string;
  period: LocalizedText;
  role: LocalizedText;
  summary: LocalizedText;
  impactBadge: string;
  techStack: string[];
  caseStudy: CaseStudyDetail;
  links: {
    live?: string;
    liveLabel?: LocalizedText;
    github?: string;
    artifact?: string;
    artifactLabel?: LocalizedText;
  };
  featured: boolean;
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
  heroLine1Left: {
    id: "Analis data",
    en: "Data analyst",
  },
  heroLine1Right: {
    id: "& pengembang",
    en: "& frontend",
  },
  heroLine2: {
    id: "antarmuka web",
    en: "web developer",
  },
  aboutTypewriterIntro: {
    id: "Saya Iqbal Dwi Fathonah, lulusan baru S1 Teknologi Informasi 2026 dari Universitas Muhammadiyah Yogyakarta (UMY) yang berfokus mengubah dataset kompleks menjadi keputusan bisnis yang jernih dan terukur.",
    en: "I’m Iqbal Dwi Fathonah, a 2026 Information Technology graduate from Universitas Muhammadiyah Yogyakarta (UMY) focused on turning complex datasets into clear, measurable business decisions.",
  },
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
      id: "Pembersihan data dengan SQL (CTE & Window Functions), pemodelan KPI di Microsoft Excel, dan perancangan dashboard interaktif di Google Looker Studio.",
      en: "Data cleaning with SQL (CTEs & Window Functions), KPI modeling in Microsoft Excel, and interactive executive dashboards in Google Looker Studio.",
    },
    accentHex: "#16A34A",
    coreStack: [
      "SQL",
      "Microsoft Excel",
      "Google Looker Studio",
      "Data Cleaning",
      "Exploratory Data Analysis",
      "KPI Dashboarding",
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
      id: "Web Dev",
      en: "Web Dev",
    },
    dockTooltip: {
      id: "Web Dev · Segera Hadir",
      en: "Web Dev · Soon",
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
      id: "Jalur portofolio Web Development sedang disiapkan agar tampil dengan kedalaman studi kasus yang utuh. Saat ini fokus utama portofolio berada pada jalur Data Analyst.",
      en: "The Web Development track is currently being prepared with full case study depth. At this time, my primary portfolio focus is on the Data Analyst track.",
    },
    comingSoonMessage: {
      id: "Studi kasus pengembangan web sedang dalam tahap kurasi akhir. Sementara jalur ini disiapkan, fokus utama portofolio saya saat ini berada pada analisis data dan pemodelan bisnis di jalur Data Analyst.",
      en: "Web development case studies are currently undergoing final curation. While this track is being prepared, my primary focus is on data analytics and business intelligence in the Data Analyst track.",
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
      id: "Web Lab",
      en: "Web Lab",
    },
    dockTooltip: {
      id: "Web Lab · Segera Hadir",
      en: "Web Lab · Soon",
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
      id: "Ruang laboratorium untuk eksperimen QA Engineering dan perkakas web mikro sedang disiapkan. Saat ini fokus utama portofolio berada pada jalur Data Analyst.",
      en: "This laboratory space for QA Engineering experiments and micro web tools is currently in preparation. Right now, my primary focus is on the Data Analyst track.",
    },
    comingSoonMessage: {
      id: "Ruang eksperimen Web Lab & QA Engineering sedang disiapkan untuk dokumentasi publik. Saat ini fokus utama portofolio dan studi kasus saya berada pada jalur Data Analyst.",
      en: "The Web Lab & QA Engineering sandbox is currently being prepared for public release. At present, my primary focus and published case studies are in the Data Analyst track.",
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
    period: {
      id: "2026 · Studi Kasus SQL & BI End-to-End",
      en: "2026 · End-to-End SQL & BI Case Study",
    },
    role: {
      id: "Data Analyst",
      en: "Data Analyst",
    },
    summary: {
      id: "Pembersihan data berskala ribuan baris dan analisis tren PHK industri global lintas negara, tahapan pendanaan, dan sektor (2020–2026) menggunakan SQL, Excel, dan Looker Studio.",
      en: "Multi-thousand-row data cleaning and exploratory trend analysis of global tech & corporate layoffs across countries, funding stages, and sectors (2020–2026) using SQL, Excel, and Looker Studio.",
    },
    impactBadge: "2,300+ Records Cleaned · Multi-Year Trend",
    techStack: ["SQL", "Microsoft Excel", "Google Looker Studio"],
    caseStudy: {
      problem: {
        id: "Dataset mentah pelacakan PHK global dari tahun 2020 hingga 2026 memiliki tingkat duplikasi baris yang tinggi, inkonsistensi penulisan nama perusahaan dan negara (mis. 'United States' vs 'United States.'), format tanggal bertipe teks, serta banyak nilai kosong pada kolom total_laid_off dan funds_raised_millions.",
        en: "The raw global layoffs dataset spanning 2020–2026 suffered from duplicate entries, inconsistent company and country naming (e.g., 'United States' vs 'United States.'), text-formatted dates, and extensive null values across total_laid_off and funds_raised_millions.",
      },
      approach: {
        id: "Membangun pipeline pembersihan bertahap di SQL menggunakan staging table, CTE dengan ROW_NUMBER() OVER(PARTITION BY ...) untuk menghapus duplikat secara presisi, trimming & standardisasi entitas geografi/industri, konversi tipe tanggal, serta perhitungan rolling total bulanan menggunakan Window Functions sebelum divisualisasikan di Microsoft Excel dan Google Looker Studio.",
        en: "Built a staged SQL cleaning pipeline using staging tables, CTEs with ROW_NUMBER() OVER(PARTITION BY ...) for exact deduplication, string trimming & entity standardization, date casting, and monthly rolling total aggregations via Window Functions before modeling in Excel and visualizing in Google Looker Studio.",
      },
      keyInsights: {
        id: [
          "Gelombang efisiensi terbesar terkonsentrasi pada sektor Consumer Tech, Retail, dan Finance pasca-ekspansi agresif 2021, dengan puncak koreksi pada 2023–2024 dan normalisasi bertahap hingga 2026.",
          "Perusahaan berstatus Post-IPO menyumbang volume absolut PHK tertinggi, sedangkan startup fase awal (Seed–Series B) mengalami persentase pemangkasan tenaga kerja per entitas yang lebih tajam (sering mencapai 30%–100%).",
          "Standardisasi SQL berhasil mengeliminasi ratusan entri duplikat dan menyatukan kategori industri yang terfragmentasi menjadi taksonomi analitik yang bersih.",
        ],
        en: [
          "Workforce reductions were most heavily concentrated in Consumer Tech, Retail, and Finance following aggressive 2021 expansion, peaking during the 2023–2024 correction and gradually stabilizing through 2026.",
          "Post-IPO enterprises accounted for the highest absolute layoff volume, whereas early-stage startups (Seed–Series B) experienced much steeper percentage cuts per company (often 30%–100%).",
          "SQL standardization eliminated hundreds of duplicate rows and consolidated fragmented industry labels into a clean analytical taxonomy.",
        ],
      },
      outcome: {
        id: "Menghasilkan skrip SQL yang terdokumentasi penuh, workbook validasi Excel, dan dashboard interaktif Google Looker Studio yang memungkinkan pemfilteran dinamis berdasarkan rentang tahun, negara, sektor industri, dan tahapan pendanaan.",
        en: "Delivered fully documented SQL transformation scripts, an Excel validation workbook, and an interactive Google Looker Studio dashboard enabling dynamic filtering by year, country, industry sector, and funding stage.",
      },
    },
    links: {
      artifact: "https://lookerstudio.google.com/",
      artifactLabel: {
        id: "Dashboard Looker Studio",
        en: "Looker Studio Dashboard",
      },
      github: "https://github.com/qivoradev",
    },
    featured: true,
  },
  {
    id: "proj-pizza-sales",
    slug: "pizza-sales-performance-analytics",
    title: "Pizza Sales Performance & Operational Analytics Dashboard",
    trackSlug: "data-analyst",
    year: "2025",
    period: {
      id: "2025–2026 · Analitik Operasional & Ritel",
      en: "2025–2026 · Retail & Operations Analytics",
    },
    role: {
      id: "Data Analyst",
      en: "Data Analyst",
    },
    summary: {
      id: "Evaluasi kinerja penjualan tahunan, pola jam sibuk pesanan, dan kontribusi margin menu dari 48.620 baris transaksi untuk mengoptimalkan kapasitas dapur dan promosi gerai.",
      en: "Annual sales performance evaluation, peak-hour order distribution, and menu revenue contribution across 48,620 order lines to optimize kitchen staffing and promotional bundling.",
    },
    impactBadge: "48,620 Order Lines · Operational KPI",
    techStack: ["SQL", "Microsoft Excel", "Google Looker Studio"],
    caseStudy: {
      problem: {
        id: "Manajemen operasional membutuhkan visibilitas yang jelas dari puluhan ribu baris transaksi tahunan untuk menjawab kapan jam sibuk dapur terjadi, ukuran dan kategori pizza mana yang paling mendominasi pendapatan, serta menu mana yang berkinerja rendah.",
        en: "Store operations needed clear visibility across tens of thousands of annual transaction rows to identify kitchen rush hours, top revenue-generating pizza sizes and categories, and underperforming SKUs.",
      },
      approach: {
        id: "Mengekstrak metrik inti (Total Revenue, Average Order Value, Total Pizzas Sold, Total Orders, Average Pizzas per Order) menggunakan agregasi SQL, melakukan tabulasi silang jam dan hari pesanan di Microsoft Excel, lalu membangun dashboard pemantauan operasional di Google Looker Studio.",
        en: "Extracted core KPIs (Total Revenue, Average Order Value, Total Pizzas Sold, Total Orders, Average Pizzas per Order) via SQL aggregations, built hourly and day-of-week pivot models in Microsoft Excel, and designed an operational dashboard in Google Looker Studio.",
      },
      keyInsights: {
        id: [
          "Lonjakan pesanan paling padat terjadi pada jam makan siang (12:00–13:00) dan jam makan malam (17:00–19:00), dengan volume puncak pada hari Kamis, Jumat, dan Sabtu.",
          "Kategori Classic menyumbang jumlah pesanan dan kuantitas terjual tertinggi, sementara ukuran Large (L) memberikan kontribusi pendapatan paling signifikan terhadap Average Order Value.",
          "Teridentifikasi 5 SKU dengan kontribusi pendapatan terendah yang menjadi kandidat kuat untuk evaluasi ulang bahan baku atau bundling promosi.",
        ],
        en: [
          "Order volume spikes sharply during lunch (12:00–13:00) and dinner rush windows (17:00–19:00), with peak weekly demand on Thursdays, Fridays, and Saturdays.",
          "The Classic category drives the highest total orders and units sold, while Large (L) pizzas contribute the largest share of overall revenue and lift Average Order Value.",
          "Identified 5 bottom-performing SKUs that represent prime candidates for menu rationalization or promotional bundling.",
        ],
      },
      outcome: {
        id: "Memberikan panduan berbasis data untuk penjadwalan staf dapur pada jam puncak serta rekomendasi penataan ulang promosi menu guna mendongkrak nilai rata-rata transaksi.",
        en: "Provided data-backed guidance for peak-hour kitchen shift scheduling and menu promotion adjustments to increase average transaction value.",
      },
    },
    links: {
      artifact: "https://lookerstudio.google.com/",
      artifactLabel: {
        id: "Laporan Looker Studio",
        en: "Looker Studio Report",
      },
      github: "https://github.com/qivoradev",
    },
    featured: true,
  },
  {
    id: "proj-nyc-traffic",
    slug: "nyc-traffic-safety-analysis-2021-2023",
    title: "NYC Traffic Safety Analysis (2021–2023)",
    trackSlug: "data-analyst",
    year: "2025",
    period: {
      id: "2025 · Analisis Data Keselamatan Publik",
      en: "2025 · Public Safety Data Analysis",
    },
    role: {
      id: "Data Analyst",
      en: "Data Analyst",
    },
    summary: {
      id: "Investigasi multi-tahun terhadap insiden kecelakaan lalu lintas di lima wilayah New York City (2021–2023) untuk memetakan titik waktu rawan, faktor penyebab utama, dan risiko bagi pejalan kaki.",
      en: "Multi-year investigation of motor vehicle collisions across New York City's five boroughs (2021–2023) mapping high-risk time windows, primary contributing factors, and vulnerable road user impact.",
    },
    impactBadge: "5 NYC Boroughs · 3-Year Collision Study",
    techStack: ["SQL", "Microsoft Excel", "Google Looker Studio"],
    caseStudy: {
      problem: {
        id: "Data insiden tabrakan kendaraan bermotor di New York City selama periode 2021–2023 mencakup ratusan ribu catatan dengan klasifikasi penyebab dan kategori korban (pejalan kaki, pesepeda, pengendara) yang perlu distandardisasi sebelum dapat ditarik kesimpulan kebijakan keselamatan.",
        en: "New York City collision records from 2021–2023 contain hundreds of thousands of incident logs with varied contributing factor codes and victim classifications (pedestrians, cyclists, motorists) requiring standardization before policy insights can be drawn.",
      },
      approach: {
        id: "Menggunakan SQL untuk menyaring catatan tidak lengkap dan mengelompokkan tingkat keparahan cedera serta kematian per borough, dilanjutkan dengan analisis distribusi jam/musiman di Microsoft Excel dan penyusunan peta ringkasan visual di Google Looker Studio.",
        en: "Used SQL to filter incomplete records and aggregate injury/fatality severity by borough, followed by hourly and seasonal distribution modeling in Microsoft Excel and visual dashboarding in Google Looker Studio.",
      },
      keyInsights: {
        id: [
          "Brooklyn dan Queens mencatat volume kecelakaan tertinggi secara keseluruhan, berkorelasi erat dengan kepadatan jaringan jalan arteri dan volume komuter.",
          "Rentang waktu pukul 15:00–18:00 merupakan jendela risiko tertinggi untuk insiden yang melibatkan cedera korban, terutama pada hari kerja.",
          "Driver Inattention/Distraction dan Failure to Yield Right-of-Way secara konsisten menjadi dua faktor kontributor teratas pada insiden yang melibatkan pejalan kaki dan pesepeda.",
        ],
        en: [
          "Brooklyn and Queens recorded the highest total collision volume, correlating strongly with arterial road density and commuter traffic.",
          "The 15:00–18:00 afternoon commute window represents the highest-risk period for injury-producing collisions, particularly on weekdays.",
          "Driver Inattention/Distraction and Failure to Yield Right-of-Way consistently ranked as the top two contributing factors in collisions involving pedestrians and cyclists.",
        ],
      },
      outcome: {
        id: "Menyajikan dashboard analitik keselamatan publik yang merangkum pola bahaya berdasarkan lokasi, waktu, dan perilaku mengemudi secara ringkas dan mudah dipahami.",
        en: "Delivered a public safety analytics dashboard summarizing hazard patterns by borough, time of day, and driver behavior in an accessible executive format.",
      },
    },
    links: {
      artifact: "https://lookerstudio.google.com/",
      artifactLabel: {
        id: "Analisis Looker Studio",
        en: "Looker Studio Analysis",
      },
      github: "https://github.com/qivoradev",
    },
    featured: false,
  },
];

export const ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "log-2026-11-27",
    date: "2026.11.27",
    trackSlug: "data-analyst",
    category: "release",
    title: {
      id: "Merilis Personal Portfolio Hub (iqbaldf) dengan fokus utama studi kasus Data Analyst",
      en: "Launched Personal Portfolio Hub (iqbaldf) highlighting end-to-end Data Analyst case studies",
    },
    description: {
      id: "Menyajikan studi kasus SQL, Microsoft Excel, dan Google Looker Studio dalam antarmuka editorial monokrom dua bahasa (ID/EN).",
      en: "Presenting SQL, Microsoft Excel, and Google Looker Studio case studies inside a bilingual (ID/EN) monochrome editorial hub.",
    },
  },
  {
    id: "log-2026-11-18",
    date: "2026.11.18",
    trackSlug: "data-analyst",
    category: "research",
    title: {
      id: "Finalisasi studi kasus Global Layoffs Analysis (2020–2026) dengan SQL & Looker Studio",
      en: "Finalized Global Layoffs Analysis (2020–2026) using SQL Window Functions & Looker Studio",
    },
    description: {
      id: "Standardisasi 2.300+ catatan perusahaan global menggunakan SQL CTE & Window Functions serta publikasi dashboard tren lintas sektor.",
      en: "Standardized 2,300+ global company records using SQL CTEs & Window Functions and published an interactive cross-sector dashboard.",
    },
  },
  {
    id: "log-2026-11-09",
    date: "2026.11.09",
    trackSlug: "data-analyst",
    category: "milestone",
    title: {
      id: "Penyusunan dashboard KPI operasional Pizza Sales & analisis keselamatan lalu lintas NYC",
      en: "Completed Pizza Sales operational KPI dashboard & NYC Traffic Safety collision study",
    },
    description: {
      id: "Pemodelan 48.620 baris transaksi ritel serta pemetaan faktor risiko kecelakaan di lima wilayah New York City.",
      en: "Modeled 48,620 retail order lines and mapped collision risk factors across New York City's five boroughs.",
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
