export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
}

/**
 * PANDUAN MENGGANTI LAGU & COVER:
 * 1. Masukkan file audio MP3 Anda ke dalam folder `public/music/`
 *    (misalnya `public/music/track-1.mp3` dan `public/music/track-2.mp3`).
 * 2. Gambar sampul piringan vinyl tersimpan di `public/music/vinyl-cover.jpg`.
 * 3. Ubah properti `title`, `artist`, `src`, atau `cover` pada array `MUSIC_PLAYLIST` di bawah ini.
 */
export const MUSIC_PLAYLIST: MusicTrack[] = [
  {
    id: "track-1",
    title: "Track 01",
    artist: "Personal Playlist",
    src: "/music/track-1.mp3",
    cover: "/music/vinyl-cover.jpg",
  },
  {
    id: "track-2",
    title: "Track 02",
    artist: "Personal Playlist",
    src: "/music/track-2.mp3",
    cover: "/music/vinyl-cover.jpg",
  },
];
