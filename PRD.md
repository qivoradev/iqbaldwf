# PRD.md — Personal Portfolio Hub (`iqbaldf`)

## 1. Ringkasan Produk & Identitas

- **Nama Proyek:** Personal Portfolio Hub — Iqbal Dwi Fathonah (`iqbaldf`)
- **Pemilik Profil:** Iqbal Dwi Fathonah, Fresh Graduate S1 Teknologi Informasi 2026 — Universitas Muhammadiyah Yogyakarta (UMY)
- **Visi Produk:** Membangun satu *Personal Portfolio Hub* berestetika *ultra-minimal monochrome editorial & micro-OS* yang mampu mempresentasikan kapabilitas multi-bidang Iqbal (**Data Analyst**, **Frontend Developer**, dan **Web Lab / Eksperimen Kreatif**, serta siap diperluas ke bidang masa depan) secara terstruktur, jujur, cepat dipindai oleh rekruter, dan mudah diperbarui secara *real-time* dari satu sumber data.
- **Tech Stack Utama:**
  - **Framework:** Next.js (App Router) + TypeScript (`src/` directory)
  - **Styling:** Tailwind CSS v4 (`@theme` semantic tokens, Light & Dark Mode)
  - **Motion:** `motion/react` (spring physics, shared `layoutId`, filter transition, modal/sheet overlay)
  - **Icons:** `lucide-react`
  - **Audio Feedback:** Native Web Audio API (`0 KB` file audio eksternal)

---

## 2. Target Pengguna & Kebutuhan Utama

1. **HR / Technical Recruiter (Spesifik Role):**
   - Ingin memvalidasi kecocokan Iqbal untuk satu posisi spesifik (mis. *Data Analyst* atau *Frontend Engineer*) dalam waktu kurang dari 15 detik tanpa terdistraksi oleh proyek dari disiplin lain → dilayani oleh **Filter Instan** dan **Rute Khusus `/tracks/[slug]`**.
2. **Hiring Manager / Engineering & Data Lead:**
   - Ingin membaca cara berpikir, metodologi pemecahan masalah, ketajaman analisis data, atau kualitas eksekusi kode → dilayani oleh **Case Study Overlay/Modal** yang mengurai *Problem, Approach, Architecture/Insights,* dan *Outcome*.
3. **Rekan Kolaborator & Komunitas Teknologi:**
   - Ingin melihat eksperimen terbaru, apa yang sedang dipelajari Iqbal saat ini, dan menghubungi Iqbal secara langsung → dilayani oleh **Signature Dock**, **Web Lab**, **Living Log**, dan **Direct Footer**.

---

## 3. Arsitektur Data Terpusat & Skalabilitas (`src/data/portfolio.ts`)

Seluruh konten portofolio dikelola melalui **satu sumber kebenaran terpusat (*Single Source of Truth*)** di `src/data/portfolio.ts`. Pendekatan ini menjamin pembaruan *real-time* di tingkat kode tanpa perlu mengubah struktur komponen UI (*Zero-UI-Refactor Scalability*).

### Kontrak Tipe Data Utama (`TypeScript Interfaces`)

```ts
export type TrackSlug = "data-analyst" | "frontend-dev" | "web-lab" | (string & {});

export interface Track {
  slug: TrackSlug;
  title: string;           // Contoh: "Data Analyst"
  shortLabel: string;      // Label pendek untuk Dock mobile, mis: "Data"
  headline: string;        // Value proposition spesifik untuk halaman /tracks/[slug]
  description: string;     // Ringkasan fokus keahlian pada Bento Card
  accentHex: string;       // "#259B52" | "#2563EB" | "#F59E0B" | "#8B5CF6"
  iconName: string;        // Nama ikon terpetakan (lucide-react)
  bentoClass: string;      // Konfigurasi bentang kolom Bento asimetris (mis. "md:col-span-7")
  highlights: string[];    // 2-3 metrik/fokus utama bidang
  coreStack: string[];     // Daftar tools inti bidang tersebut
  featured?: boolean;
}

export interface CaseStudyDetail {
  problem: string;
  approach: string;
  keyInsights: string[];   // Temuan analitis atau keputusan arsitektur teknis
  outcome: string;         // Dampak terukur / hasil akhir
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  trackSlug: TrackSlug;    // Relasi utama ke Track[]
  year: string;            // Contoh: "2026"
  role: string;            // Contoh: "Data Analyst" / "Frontend Engineer"
  summary: string;         // Ringkasan 1-2 kalimat untuk kartu showcase
  impactBadge?: string;    // Highlight metrik singkat (mono badge)
  techStack: string[];     // Contoh: ["Python", "SQL", "Tableau"] atau ["Next.js", "TypeScript"]
  caseStudy: CaseStudyDetail;
  links: {
    live?: string;
    github?: string;
    artifact?: string;     // Link ke dashboard, notebook, atau deck presentasi
  };
  featured: boolean;
}

export interface ActivityLog {
  id: string;
  date: string;            // Format konsisten untuk tampilan mono, mis. "2026.11.27"
  trackSlug: TrackSlug;    // Menentukan warna dot indikator bidang
  category: "release" | "research" | "learning" | "milestone";
  title: string;
  description?: string;
  href?: string;
}
```

### Cara Ekspansi Bidang Baru (*Future Track Ready*)
Ketika Iqbal ingin menambahkan bidang ke-4 di masa depan (mis. *AI / Machine Learning* atau *Business Intelligence* dengan aksen `#8B5CF6`):
1. Tambahkan 1 entri `Track` baru ke array `TRACKS` di `src/data/portfolio.ts`.
2. Tambahkan proyek atau log dengan `trackSlug` tersebut.
3. Komponen *Dock*, *Bento Grid*, *Filter Pills*, serta rute dinamis `/tracks/[slug]` akan otomatis mengenali dan merender bidang baru tersebut.

---

## 4. Arsitektur Halaman & Struktur 6 Section di `/` (Home Hub)

Selain elemen navigasi mengambang (*Floating Top Pill Navbar* yang memuat Theme Switcher, Audio Mute/Unmute Toggle, dan navigasi cepat `About`), halaman utama `/` tersusun atas **6 Section berurutan**:

### Section 1: Hero & Interactive Signature Dock
- **Komponen Visual:**
  - Avatar monokrom/potret lingkaran bersih + indikator status aktif (`#259B52` pulsing halus) bertuliskan status lulusan baru (*Fresh Graduate S1 TI UMY 2026 · Open for Opportunities*).
  - Nama lengkap `Iqbal Dwi Fathonah` (`@iqbaldf`) dan *Display Headline* dua baris yang merangkum titik temu antara analisis data dan rekayasa antarmuka web, disisipi satu ikon simbolis *inline*.
- **Interactive Signature Dock:**
  - **Sisi Kiri (Tracks):** `All`, `Data Analyst` (`#259B52`), `Frontend Dev` (`#2563EB`), `Web Lab` (`#111111`/`#F59E0B`). Mengklik salah satu ikon akan mengaktifkan fokus filter bidang dan mengarahkan pandangan secara mulus ke karya terkait (serta menyediakan pintasan ke halaman penuh bidang tersebut).
  - **Pemisah Tengah:** Garis pembatas tipis `1px` (`border-line`).
  - **Sisi Kanan (Kontak Langsung):** `LinkedIn`, `GitHub`, dan `Email`.
  - **Perilaku Responsif:** Horizontal dengan *floating pill tooltip* + *hover pop audio* di desktop (`>= md`); bertransformasi menjadi **Grid 4 Kolom dengan label teks kecil di bawah ikon** di mobile (`< md`).

### Section 2: Portfolio Hub / Tracks (Asymmetric Bento Grid)
- **Layout:** Kontainer `max-w-[1040px]` dengan komposisi grid Bento asimetris (contoh: baris pertama memadukan kartu lebar `Data Analyst` `7 kolom` dan `Frontend Dev` `5 kolom`; baris kedua menampilkan kartu eksperimental `Web Lab` `12 kolom` horizontal yang siap dibagi `7/5` saat `Future Track` diaktifkan).
- **Isi Kartu (`rounded-[20px]`):**
  - Squircle icon `rounded-[14px]` sesuai warna aksen bidang + jumlah proyek tersedia.
  - Judul bidang, deskripsi peran yang ditawarkan Iqbal, dan deretan *core tools* dalam kapsul `JetBrains Mono`.
  - Dua aksi terukur: tombol **"Filter Works"** (memfilter *Selected Works* di halaman yang sama) dan tautan **"Dedicated View →"** menuju `/tracks/[slug]`.

### Section 3: Selected Works (Filterable Showcase Grid + Case Study Overlay)
- **Filter Bar:** Deretan pill tombol (`All`, `Data Analyst`, `Frontend Dev`, `Web Lab`) dengan indikator aktif yang berpindah mulus menggunakan `motion/react` `layoutId`. State filter tersinkronisasi penuh dengan pilihan track dari *Signature Dock* maupun *Bento Grid*.
- **Showcase Grid:** Grid kartu proyek (`rounded-[20px]`) di dalam `max-w-[1040px]` yang menampilkan badge warna bidang, tahun, judul proyek, ringkasan padat, metrik utama (*impact badge*), dan tag teknologi.
- **Modal / Overlay Detail Studi Kasus:**
  - Saat sebuah kartu diklik, terbuka overlay/modal (`max-w-[680px]` di desktop, *bottom sheet* di mobile) tanpa meninggalkan konteks halaman.
  - Menyajikan struktur yang disukai rekruter: **Context & Problem**, **Analytical / Engineering Approach**, **Key Insights / System Highlights**, **Measured Outcome**, lengkap dengan tautan **Live Preview**, **GitHub Repository**, atau **Dashboard/Notebook**.
  - Mendukung penutupan via tombol `Esc`, klik area luar (*scrim*), atau tombol tutup eksplisit.

### Section 4: Living Log / Currently (Editorial Real-Time Updates)
- **Konsep:** Daftar pembaruan kronologis bergaya jurnal kerja/changelog personal yang menunjukkan bahwa portofolio ini "hidup" dan Iqbal aktif berkarya serta belajar pasca-kelulusan 2026.
- **Format Tampilan:** Menggunakan ritme editorial bersih (`max-w-[680px]` atau tata letak kolom judul kiri + daftar entri kanan pada `max-w-[1040px]`):
  - Kolom tanggal presisi menggunakan `JetBrains Mono` (`tabular-nums`).
  - Titik indikator kecil berwarna sesuai bidang (`Data`, `Frontend`, `Web Lab`).
  - Judul aktivitas singkat + catatan opsional / tautan bukti karya.

### Section 5: About & Core Stack (Split Editorial + Skippable Typewriter)
- **Tata Letak Split (`max-w-[1040px]`):**
  - **Kolom Kiri — Narasi Editorial (`max-w-[680px]`):**
    - Memperkenalkan Iqbal Dwi Fathonah, latar belakang akademik **S1 Teknologi Informasi 2026 di Universitas Muhammadiyah Yogyakarta (UMY)**, cara kerja lintas data & kode, serta antusiasme membangun produk digital yang jernih dan berdampak.
    - **Interactive Skippable Typewriter:** Saat seksi masuk ke *viewport* (atau dibuka via tombol `about`), teks diketik secara halus disertai bunyi ketikan Web Audio API yang lembut (jika tidak *mute*). **Penting:** Mengklik di mana saja pada area teks atau menekan tombol pill `"Skip"` akan **langsung menampilkan 100% seluruh paragraf seketika** dan menghentikan suara ketikan agar tidak pernah menghambat rekruter yang sedang terburu-buru.
    - **Dotted Underline Keywords:** Entitas dan kompetensi kunci (seperti *Universitas Muhammadiyah Yogyakarta*, *exploratory data analysis*, *SQL & Python*, *Next.js & TypeScript*) diberi garis bawah titik-titik (`dotted underline`) bergaya editorial dengan *micro-tooltip* atau penekanan halus saat disorot.
  - **Kolom Kanan — Core Stack & Academic Snapshot:**
    - Ringkasan terstruktur keahlian inti yang dikelompokkan per domain (*Data & BI*, *Frontend Engineering*, *Tools & Workflow*) serta kartu ringkas kredensial pendidikan S1 TI UMY (2026).

### Section 6: Minimalist Footer
- **Komponen:**
  - Kalimat penutup lugas untuk diskusi peluang kerja penuh waktu (*Full-time*), magang lanjutan, maupun kolaborasi proyek, disertai tautan langsung (`Email` dengan fitur *copy-to-clipboard* + umpan balik instan, `LinkedIn`, `GitHub`).
  - **Live Local Time (WIB):** Jam digital langsung zona waktu Yogyakarta/Jakarta (`Asia/Jakarta`, `WIB / UTC+7`) menggunakan `JetBrains Mono` (`tabular-nums`) yang diperbarui setiap detik di sisi klien tanpa memicu *hydration mismatch*.
  - **Pill Back to Top:** Tombol kapsul minimalis (`↑ Back to top`) yang menggulirkan halaman kembali ke puncak secara halus.

---

## 5. Spesifikasi Rute Khusus Per Bidang (`/tracks/[slug]`)

Untuk mendukung strategi melamar kerja yang terfokus, tersedia rute dinamis `src/app/tracks/[slug]/page.tsx`:

1. **URL Terkurasi untuk CV & Lamaran:**
   - `/tracks/data-analyst` — khusus dikirimkan pada lamaran Data Analyst / BI Analyst.
   - `/tracks/frontend-dev` — khusus dikirimkan pada lamaran Frontend / Web Engineer.
   - `/tracks/web-lab` — khusus untuk memamerkan eksplorasi UI, interaksi mikro, dan prototipe kreatif.
2. **Struktur Halaman `/tracks/[slug]`:**
   - Breadcrumb / Pill navigasi kembali ke Hub utama (`← Portfolio Hub`).
   - **Focused Track Hero:** Ikon squircle bidang, *value proposition* spesifik bidang tersebut, profil singkat Iqbal yang disesuaikan dengan kacamata bidang tersebut, dan daftar *Core Stack* terkait.
   - **Filtered Project Showcase:** Hanya merender daftar proyek dari `src/data/portfolio.ts` yang cocok dengan `slug` bidang, lengkap dengan dukungan *Case Study Modal* yang sama.
   - **Track-Specific Activity Log:** Menampilkan entri *Living Log* yang relevan dengan bidang tersebut.
   - **Direct CTA & Footer:** Kontak cepat dan jam lokal WIB.
3. **Static Generation & Metadata:**
   - Menggunakan `generateStaticParams()` dari daftar `TRACKS` agar seluruh halaman bidang ter-prerender secara statis dan sangat cepat, serta `generateMetadata()` untuk menghasilkan `<title>` dan `<meta name="description">` yang relevan bagi masing-masing profesi.

---

## 6. Persyaratan Non-Fungsional & Kualitas Teknis

- **Zero Git Commands Rule:** Selama pengembangan oleh agen, dilarang menjalankan perintah Git apa pun sesuai instruksi pemilik proyek.
- **No Hydration Mismatch:** Elemen dinamis berbasis klien (tema terang/gelap, status *mute* audio, dan jam lokal WIB) harus dirender secara aman terhadap SSR Next.js.
- **Keyboard & Screen Reader Friendly:** Seluruh squircle di Dock, tombol pill navbar, filter, dan modal studi kasus wajib memiliki `aria-label` deskriptif, manajemen fokus yang rapi (`focus-visible:ring`), dan dukungan tombol `Escape`.
- **Zero External Audio Payload:** Semua efek suara wajib disintesis lewat Web Audio API (`0 KB` unduhan aset).

---

## 7. Rencana Tahapan Implementasi

- **Tahap 1 (Saat Ini — Setup & Spesifikasi):**
  - Inisialisasi proyek Next.js (App Router, TypeScript, Tailwind CSS v4, `src/` directory) + instalasi `motion` dan `lucide-react`.
  - Penyusunan dokumen pedoman `DESIGN.md` dan `PRD.md` untuk di-review bersama sebelum penulisan komponen.
- **Tahap 2 (Fondasi Sistem, Data, Tema & Audio Engine):**
  - Konfigurasi font (`Plus Jakarta Sans` + `JetBrains Mono`), token `@theme` di `globals.css`, *Theme Provider* + *Web Audio Tactile Engine*, serta pengisian data awal terstruktur di `src/data/portfolio.ts`.
- **Tahap 3 (Implementasi UI Home Hub `/` — 6 Section & Case Study Modal):**
  - Pembangunan *Floating Top Pill Navbar*, *Hero & Signature Dock* (responsif desktop/mobile 4 kolom), *Asymmetric Bento Grid*, *Filterable Selected Works + Case Study Overlay*, *Living Log*, *About Typewriter*, dan *Minimalist Footer*.
- **Tahap 4 (Rute `/tracks/[slug]` & Polish Akhir):**
  - Pembangunan halaman dinamis per bidang, pengecekan responsivitas mobile, audit aksesibilitas & `prefers-reduced-motion`, serta verifikasi *production build*.
