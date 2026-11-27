export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  cover: string;
}

/**
 * PANDUAN MENAMBAH ATAU MENGGANTI LAGU:
 * 1. Untuk menambah lagu ke-2 (atau lebih), cukup salin format objek di bawah ini
 *    dan masukkan `youtubeId` baru (bagian kode setelah `v=` pada URL YouTube).
 * 2. Saat jumlah lagu lebih dari 1, indikator urutan (1/2) dan tombol ganti lagu
 *    akan otomatis muncul pada MiniVinylPlayer.
 * 3. Gambar sampul piringan tersimpan di `public/music/vinyl-cover.jpg`.
 */
export const MUSIC_PLAYLIST: MusicTrack[] = [
  {
    id: "cry-slowed-rain",
    title: "Cry (slowed + rain)",
    artist: "Cigarettes After Sex",
    youtubeId: "Z9iThNdZpKY",
    cover: "/music/vinyl-cover.jpg",
  },
];
