# DESIGN.md — Personal Portfolio Hub (`iqbaldf`)

Dokumen ini adalah panduan sistem desain ketat (*Strict Design System & Engineering Guidelines*) untuk **Personal Portfolio Hub** milik **Iqbal Dwi Fathonah (`iqbaldf`)**, Fresh Graduate S1 Teknologi Informasi 2026 (Universitas Muhammadiyah Yogyakarta).

---

## 1. Prinsip Visual & Arsitektur

### Pure View-Switching Micro-OS & Monochrome Editorial Aesthetic
1. **Satu Layar Penuh Tanpa Long-Scrolling Landing Page:**
   - Halaman utama (`/`) wajib berupa kanvas 1 layar penuh (`min-h-dvh flex flex-col justify-between`) yang bersih dan terpusat secara optik.
   - Tidak ada kartu Bento SaaS raksasa, tidak ada badge status hijau di bawah nama pada Hero, dan tidak ada paragraf subjudul panjang di bawah headline.
2. **Pure View Switching (`Home` ↔ `About` / `Track View`):**
   - **Home View (Default):** Hanya menampilkan *Slim Top Pill Navbar*, *Avatar* bulat `96×96px`, *Nama*, *Headline* 2 baris (`font-normal`) dengan *inline icon*, serta *Signature Dock*.
   - **About View:** Saat tombol `about` di Top Pill diklik, tampilan berganti mulus ke kolom baca editorial sempit (`max-w-[600px]`) dengan efek *typewriter* yang bisa di-*skip* dan *dotted underline* pada kata kunci, sementara tombol kanan di Top Pill otomatis berubah menjadi **`back`**.
   - **Editorial Track View:** Saat ikon bidang di Dock diklik (atau melalui rute `/tracks/[slug]`), tampilan berganti ke daftar proyek editorial minimalis (`max-w-[680px]`) dengan garis pemisah tipis `1px`—bebas dari kartu SaaS penuh badge.

---

## 2. Sistem Warna (`@theme` Tailwind CSS v4)

| Token Semantik | Variabel CSS | Light Mode | Dark Mode | Kegunaan Utama |
| :--- | :--- | :--- | :--- | :--- |
| **Background** | `--bg` | `#F6F6F5` | `#050505` | Kanvas utama halaman |
| **Surface** | `--surface` | `#FFFFFF` | `#0F0F0F` | Panel modal studi kasus & kontrol mengambang |
| **Text Primary** | `--fg` | `#111111` | `#F5F5F5` | Headline, nama, judul proyek |
| **Text Muted** | `--muted` | `#666666` | `#8E8E93` | Metadata, tahun, deskripsi ringkas |
| **Border** | `--border` | `#E4E4E2` | `#1F1F1F` | Garis pemisah editorial `1px` |

### Warna Squircle di Signature Dock (`52×52px`, `rounded-[13px]`)
- **All Works (`all`):** Kuning `#FCD34D` dengan ikon frame terminal penuh hitam (`#111111`).
- **Data Analyst (`data-analyst`):** Hijau `#16A34A` dengan ikon wireframe globe/grid analitik putih penuh.
- **Frontend Dev (`frontend`):** Hitam `#0A0A0A` (dark mode `#141414` + inner ring tipis) dengan blok geometris diagonal putih.
- **Web Lab (`lab`):** Merah-Oranye `#F94D23` dengan lingkaran putih & simbol eksperimen di tengah.
- **LinkedIn:** `#0A66C2` dengan tipografi `in` putih tebal proporsional.
- **GitHub:** `#181717` (dark mode `#242424`) dengan siluet Octocat putih penuh.
- **Email:** Gradasi vertikal `from-[#2563EB] to-[#38BDF8]` dengan amplop putih solid penuh.

---

## 3. Tipografi & Proporsi Hero

1. **Font Stack (`next/font/google`):**
   - **Display & Body:** `Inter` (`--font-inter`, weights: `400`, `500`, `600`).
   - **Metadata & Tanggal:** `JetBrains Mono` (`--font-jetbrains-mono`, weights: `400`, `500`, `tabular-nums`).
2. **Avatar (`public/avatar.png` via `next/image`):**
   - Container lingkaran bersih `w-24 h-24 rounded-full overflow-hidden bg-neutral-200/60 dark:bg-neutral-900` tanpa ring/border ganda.
   - Kelas gambar: `object-cover object-top scale-105 translate-y-1 grayscale contrast-[1.05]`.
3. **Nama (`Iqbal Dwi Fathonah`):**
   - `text-[15px] font-normal tracking-[-0.01em] text-neutral-700 dark:text-neutral-300`, jarak rapat (`mt-3.5`) di bawah avatar.
4. **Headline 2 Baris:**
   - Wajib menggunakan `font-normal` (weight `400`), `text-[clamp(2rem,4.5vw,3.35rem)] leading-[1.12] tracking-[-0.03em]`.
   - Baris 1: `Data analyst [inline-icon] & frontend`
   - Baris 2: `web developer`

---

## 4. Spesifikasi Komponen Kunci

### Slim Top Pill Navbar
- Tinggi ramping `h-9 px-2 text-[13px]`, `rounded-full`, border tipis `1px solid`, `bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md` tanpa bayangan berat.
- Struktur item: `[Theme Toggle] | [Sound Play Toggle] | [about / back]`.

### Double-Bezel Signature Dock & Single Active Tooltip
- **Container Dock:** `p-2 rounded-[22px] gap-2`, efek *double-bezel* kaca tipis (`bg-white/75 dark:bg-neutral-900/75 border border-black/[0.08] dark:border-white/[0.1] shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-white/60 dark:ring-white/5 backdrop-blur-xl`), tanpa titik indikator di bawah ikon agar tinggi atas-bawah simetris.
- **Pemisah Vertikal:** `w-[1px] h-8 bg-black/10 dark:bg-white/15 mx-1.5`.
- **Single Active Tooltip:** Hanya merender **1 tooltip aktif** berdasarkan `hoveredId`. Gaya kapsul kontras tinggi (`bg-[#222222] text-white dark:bg-[#F5F5F5] dark:text-[#111111] text-[13px] font-medium px-3.5 py-1.5 rounded-full shadow-md`), melayang `14px` di atas squircle.

### Transisi & Custom Dot Cursor
- **View Switching Transition:** Menggunakan `<AnimatePresence mode="wait">` dengan transisi `opacity: 0 -> 1`, `filter: blur(4px) -> blur(0px)`, dan `y: 8 -> 0` (`duration: 0.35s`, `ease: [0.22, 1, 0.36, 1]`).
- **Dock Hover Physics:** Spring lembut (`scale: 1.08, y: -3`, `stiffness: 260, damping: 26, mass: 0.8`).
- **Custom Cursor:** Titik tajam solid `w-2 h-2` (`8px`, `bg-black dark:bg-white`, `opacity-100`) dengan *spring/lerp* responsif (`stiffness: 900, damping: 42, mass: 0.2`), otomatis nonaktif pada perangkat sentuh (`pointer: coarse`).
