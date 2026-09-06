/**
 * Utilitas waktu relatif berbahasa Indonesia.
 *
 * Bukan konten acara, jadi tidak diletakkan di `lib/event-config.ts`: label di
 * sini adalah pembentuk kalimat lokalisasi ("3 hari lalu"), bukan teks yang
 * akan direvisi mempelai. Yang dapat direvisi — misalnya label "Baru saja" —
 * tetap dikonsumsi lewat argumen dari config.
 */

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;

/**
 * Mengubah ISO string menjadi penanda waktu relatif, mis. "2 hari lalu".
 *
 * `nowMs` sengaja menjadi parameter, bukan `Date.now()` di dalam fungsi: nilai
 * itu dibaca sekali per render di komponen supaya seluruh baris daftar memakai
 * acuan waktu yang sama, dan supaya hasil fungsi ini dapat diuji.
 *
 * Waktu di masa depan (jam perangkat tamu di belakang jam server) diperlakukan
 * sebagai "baru saja", bukan sebagai angka negatif.
 */
export function formatRelativeTimeId(
  iso: string | null | undefined,
  nowMs: number,
  justNowLabel = 'Baru saja'
): string {
  if (!iso) return justNowLabel;

  const then = Date.parse(iso);
  if (Number.isNaN(then)) return justNowLabel;

  const diff = nowMs - then;
  if (diff < MINUTE_MS) return justNowLabel;

  if (diff < HOUR_MS) {
    return `${Math.floor(diff / MINUTE_MS)} menit lalu`;
  }
  if (diff < DAY_MS) {
    return `${Math.floor(diff / HOUR_MS)} jam lalu`;
  }
  if (diff < WEEK_MS) {
    return `${Math.floor(diff / DAY_MS)} hari lalu`;
  }
  if (diff < MONTH_MS) {
    return `${Math.floor(diff / WEEK_MS)} minggu lalu`;
  }
  return `${Math.floor(diff / MONTH_MS)} bulan lalu`;
}
