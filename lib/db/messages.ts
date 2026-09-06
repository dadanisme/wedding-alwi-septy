import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '../firebase-admin';
import type { GuestMessage } from '../../types/database';

const COLLECTION_NAME = 'messages';

// Batas sebagai pertahanan lapis kedua. Validasi utama ada di
// app/actions/messages.ts; nilai di sini mencegah dokumen membengkak atau
// aturan terlewat bila fungsi ini kelak dipanggil dari jalur lain
// (mis. admin panel atau skrip seeding).
const MAX_NAME_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 500;
const MAX_ENTRIES_PER_GUEST = 3;
const COOLDOWN_MS = 30_000;

// Batas atas jumlah dokumen yang boleh diminta sekali baca. Server Action
// adalah endpoint HTTP publik: tanpa ini, satu pemanggil bisa meminta jumlah
// sewenang-wenang dan menghabiskan kuota baca Firestore.
//
// Angkanya sengaja DI ATAS plafon produk sendiri, bukan di bawahnya. Ucapan
// hanya dapat dikirim oleh tamu yang punya link, maksimal 3 per tamu, untuk
// 150 tamu — jadi plafon nyatanya 450 dokumen. Penjepit yang lebih rendah dari
// itu (sebelumnya 60) membuat ucapan di luar jendela TIDAK PERNAH terjangkau
// paginasi, sementara `hasMore` di bawah tetap menjawab "masih ada" karena ia
// dihitung terhadap limit yang sudah dijepit. Penjepit ini murni pertahanan
// terhadap pemanggil bermusuhan, bukan pembatas produk.
const MAX_PAGE_SIZE = 500;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toIsoString(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  if (val instanceof Date) return val.toISOString();
  return new Date().toISOString();
}

/**
 * Milidetik epoch dari nilai timestamp Firestore. Mengembalikan 0 bila nilainya
 * tidak dapat dibaca — pemanggil memperlakukan 0 sebagai "tidak ada acuan
 * waktu", bukan sebagai "tahun 1970".
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toMillis(val: any): number {
  if (!val) return 0;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val.toDate === 'function') return val.toDate().getTime();
  if (val instanceof Date) return val.getTime();
  if (typeof val === 'string') {
    const parsed = Date.parse(val);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMessageDoc(id: string, data: Record<string, any>): GuestMessage {
  return {
    id,
    guestId: data.guestId || undefined,
    guestName: data.guestName || 'Tamu Undangan',
    message: data.message || '',
    isHidden: Boolean(data.isHidden),
    createdAt: toIsoString(data.createdAt),
  };
}

export interface MessagePage {
  messages: GuestMessage[];
  /** Masih ada ucapan lebih lama di luar halaman ini (PRD §4.4 "dengan paginasi"). */
  hasMore: boolean;
}

/**
 * Mengambil satu halaman ucapan yang tampil (tidak disembunyikan admin),
 * terbaru di atas (PRD §4.4).
 *
 * Paginasi sengaja memakai "limit yang tumbuh dari puncak", bukan cursor
 * `startAfter`. Alasannya: daftar ini juga dipakai untuk penyegaran berkala —
 * satu bacaan yang sama harus sekaligus menangkap ucapan baru di puncak DAN
 * ucapan yang baru disembunyikan admin di tengah daftar. Cursor hanya
 * mengambil ekor daftar, sehingga penyembunyian pada halaman yang sudah dimuat
 * tidak akan pernah terlihat tanpa memuat ulang halaman.
 *
 * Dilengkapi fallback in-memory sorting bila indeks gabungan Firestore sedang
 * dibangun (FAILED_PRECONDITION), supaya seksi tidak pernah memunculkan
 * galat 500 di depan tamu.
 */
export async function getVisibleMessages(limitCount = 10): Promise<MessagePage> {
  const db = getAdminDb();

  const safeLimit = Math.min(
    Math.max(Math.trunc(Number(limitCount) || 0), 1),
    MAX_PAGE_SIZE
  );

  // Ambil satu lebih banyak dari yang diminta: kelebihannya tidak dikembalikan,
  // hanya dipakai untuk menyimpulkan masih ada halaman berikutnya.
  const probeLimit = safeLimit + 1;

  try {
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('isHidden', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(probeLimit)
      .get();

    const docs = snapshot.docs.slice(0, safeLimit);
    return {
      messages: docs.map((doc) => mapMessageDoc(doc.id, doc.data())),
      hasMore: snapshot.size > safeLimit,
    };
  } catch (err: unknown) {
    const errorDetails = String(err);
    if (errorDetails.includes('FAILED_PRECONDITION') || errorDetails.includes('requires an index')) {
      const fallbackSnapshot = await db
        .collection(COLLECTION_NAME)
        .where('isHidden', '==', false)
        .get();

      const items = fallbackSnapshot.docs.map((doc) =>
        mapMessageDoc(doc.id, doc.data())
      );

      // Urutkan terbaru di atas. ISO 8601 UTC berurut secara leksikografis,
      // jadi perbandingan string sudah cukup dan tidak perlu parsing tanggal.
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      return {
        messages: items.slice(0, safeLimit),
        hasMore: items.length > safeLimit,
      };
    }

    throw err;
  }
}

/**
 * Mengambil seluruh ucapan (termasuk yang disembunyikan) untuk panel moderasi admin.
 */
export async function getAllMessagesForAdmin(): Promise<GuestMessage[]> {
  const db = getAdminDb();
  const snapshot = await db.collection(COLLECTION_NAME).orderBy('createdAt', 'desc').get();

  return snapshot.docs.map((doc) => mapMessageDoc(doc.id, doc.data()));
}

export interface PostMessageInput {
  /** Wajib. Ucapan anonim tidak diterima: batas 3 ucapan dan jeda antar
   *  pengiriman keduanya bersandar pada identitas tamu (PRD §4.4). */
  guestId: string;
  guestName: string;
  message: string;
  /**
   * Kunci idempotensi buatan klien, dipakai sebagai ID dokumen. Bila kosong,
   * ID dibuat server dan pengiriman TIDAK idempoten. Sudah divalidasi
   * bentuknya oleh pemanggil (app/actions/messages.ts).
   */
  clientKey?: string;
}

export type PostMessageRejection =
  | 'empty_name'
  | 'empty_message'
  | 'name_too_long'
  | 'message_too_long'
  | 'missing_guest'
  | 'limit_reached'
  | 'cooldown'
  | 'key_taken';

export type PostMessageResult =
  | {
      ok: true;
      message: GuestMessage;
      remaining: number;
      /** Ucapan ini sudah tersimpan sebelumnya; pengiriman ini adalah kirim
       *  ulang dari kunci yang sama, bukan ucapan baru. */
      replayed: boolean;
    }
  | { ok: false; reason: PostMessageRejection; retryAfterSeconds?: number };

/**
 * Mengirim ucapan baru ke Buku Tamu (PRD §4.4).
 *
 * Menegakkan tiga aturan sekaligus dalam SATU transaksi Firestore:
 * 1. Panjang pesan maksimal 500 karakter.
 * 2. Maksimal 3 ucapan per tamu.
 * 3. Jeda minimum 30 detik antar pengiriman dari link yang sama.
 *
 * Transaksi bukan hiasan. Link undangan boleh diteruskan (PRD §4.1), jadi dua
 * perangkat memang bisa mengirim pada saat yang sama dari link yang sama.
 * Dengan `count()` lalu `set()` terpisah, keduanya membaca "sudah ada 2" dan
 * keduanya menulis — menghasilkan 4 ucapan pada batas 3. Pembacaan di dalam
 * transaksi membuat Firestore menserialisasi keduanya: yang kalah diulang,
 * membaca keadaan terbaru, lalu ditolak dengan benar.
 *
 * Aturan jeda dan batas 3 dilayani oleh SATU pembacaan yang sama: dokumen per
 * tamu paling banyak 3, jadi mengambil semuanya lebih murah daripada
 * `count()` + query `orderBy` terpisah — dan tidak menuntut indeks gabungan
 * baru yang harus menunggu masa building sebelum bisa dipakai.
 *
 * Ucapan yang disembunyikan admin TETAP dihitung terhadap batas 3.
 * Penyembunyian adalah moderasi, bukan pengembalian jatah — kalau dihitung
 * ulang, tamu yang ucapannya disembunyikan justru mendapat kesempatan menulis
 * ulang hal yang sama.
 */
export async function postGuestMessage(input: PostMessageInput): Promise<PostMessageResult> {
  const guestId = typeof input.guestId === 'string' ? input.guestId.trim() : '';
  const cleanName = (typeof input.guestName === 'string' ? input.guestName : '').trim();
  const cleanMsg = (typeof input.message === 'string' ? input.message : '').trim();

  if (!guestId) return { ok: false, reason: 'missing_guest' };
  if (!cleanName) return { ok: false, reason: 'empty_name' };
  if (cleanName.length > MAX_NAME_LENGTH) return { ok: false, reason: 'name_too_long' };
  if (!cleanMsg) return { ok: false, reason: 'empty_message' };
  if (cleanMsg.length > MAX_MESSAGE_LENGTH) return { ok: false, reason: 'message_too_long' };

  const db = getAdminDb();

  // ID dokumen dibuat SEBELUM transaksi. Kalau Firestore mengulang transaksi
  // karena contention, penulisan mendarat di dokumen yang sama alih-alih
  // menghasilkan ucapan ganda — pola yang sama dengan `rsvpHistory`.
  //
  // Bila klien menyertakan kunci idempotensi, kunci itulah yang menjadi ID
  // dokumen. Itu menutup kasus yang paling merugikan tamu: transaksi sudah
  // commit tetapi responsnya hilang di jaringan 4G yang putus. Tanpa kunci,
  // tamu diberi tahu "belum terkirim" untuk ucapan yang SUDAH tersimpan, lalu
  // kirim ulangnya menghasilkan ucapan kedua yang identik — tampil ke semua
  // tamu dan memakan jatah 3 miliknya sendiri.
  const clientKey =
    typeof input.clientKey === 'string' ? input.clientKey.trim() : '';
  const docRef = clientKey
    ? db.collection(COLLECTION_NAME).doc(clientKey)
    : db.collection(COLLECTION_NAME).doc();
  const ownedQuery = db.collection(COLLECTION_NAME).where('guestId', '==', guestId);

  const result = await db.runTransaction<PostMessageResult>(async (tx) => {
    // Seluruh pembacaan harus mendahului seluruh penulisan dalam satu
    // transaksi Firestore.
    const existing = clientKey ? await tx.get(docRef) : null;
    const owned = await tx.get(ownedQuery);

    // Kirim ulang dari kunci yang sama: kembalikan yang sudah tersimpan,
    // jangan menulis dokumen kedua. Diperiksa SEBELUM batas dan jeda — kirim
    // ulang bukan pengiriman baru, jadi tidak boleh ditolak oleh keduanya.
    if (existing && existing.exists) {
      const data = existing.data()!;

      // Kunci sudah dipakai dokumen milik tamu LAIN. Tabrakan UUID praktis
      // mustahil, jadi ini pemanggil yang menebak-nebak ID. Jangan pernah
      // membaca isinya, dan jangan pernah menimpanya.
      if (data.guestId !== guestId) {
        return { ok: false, reason: 'key_taken' };
      }

      return {
        ok: true,
        message: mapMessageDoc(existing.id, data),
        remaining: Math.max(0, MAX_ENTRIES_PER_GUEST - owned.size),
        replayed: true,
      };
    }

    if (owned.size >= MAX_ENTRIES_PER_GUEST) {
      return { ok: false, reason: 'limit_reached' };
    }

    let newestMs = 0;
    owned.docs.forEach((doc) => {
      const ms = toMillis(doc.get('createdAt'));
      if (ms > newestMs) newestMs = ms;
    });

    // newestMs === 0 berarti tidak ada acuan waktu yang bisa dibaca (dokumen
    // hasil impor tanpa createdAt). Jangan menolak tamu atas dasar data yang
    // tidak ada — batas 3 di atas tetap menjaganya.
    if (newestMs > 0) {
      const elapsed = Date.now() - newestMs;
      // elapsed negatif = jam server kita di belakang jam Firestore. Perlakukan
      // seperti "baru saja mengirim", bukan seperti jeda yang sudah lewat.
      if (elapsed < COOLDOWN_MS) {
        return {
          ok: false,
          reason: 'cooldown',
          retryAfterSeconds: Math.max(1, Math.ceil((COOLDOWN_MS - elapsed) / 1000)),
        };
      }
    }

    tx.set(docRef, {
      guestId,
      guestName: cleanName,
      message: cleanMsg,
      isHidden: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    return {
      ok: true,
      message: {
        id: docRef.id,
        guestId,
        guestName: cleanName,
        message: cleanMsg,
        isHidden: false,
        createdAt: new Date().toISOString(),
      },
      remaining: MAX_ENTRIES_PER_GUEST - (owned.size + 1),
      replayed: false,
    };
  });

  return result;
}

/**
 * Moderasi admin: menyembunyikan atau menampilkan kembali ucapan (PRD §4.4).
 */
export async function toggleMessageVisibility(messageId: string, isHidden: boolean): Promise<boolean> {
  const db = getAdminDb();
  await db.collection(COLLECTION_NAME).doc(messageId).update({
    isHidden,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return true;
}
