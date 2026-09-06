"use client";

import { useCallback, useEffect, useId, useRef, useState, useTransition } from "react";
import { guestBookConfig, type GuestBookEntry } from "@/lib/event-config";
import {
  fetchGuestMessagesAction,
  submitGuestMessageAction,
} from "@/app/actions/messages";
import { formatRelativeTimeId } from "@/lib/time";

interface BukuTamuProps {
  guestName?: string;
  /**
   * Slug lengkap dari URL tamu ("nama-slug-token"). Bila kosong, seksi berjalan
   * dalam mode pratinjau (rute "/" tanpa tamu): daftar memakai data contoh
   * mockup, pengiriman dinonaktifkan, dan basis data tidak pernah disentuh.
   */
  fullSlug?: string;
  /** Halaman pertama ucapan, dirender di server supaya daftar tampil seketika. */
  initialEntries?: readonly GuestBookEntry[];
  /** Masih ada ucapan lebih lama di luar halaman pertama. */
  initialHasMore?: boolean;
  /**
   * Pengambilan halaman pertama di server gagal. Berbeda dari "belum ada
   * ucapan": tanpa pembeda ini, kegagalan Firestore menampilkan klaim palsu
   * "Belum ada ucapan" kepada tamu.
   */
  initialLoadFailed?: boolean;
}

/**
 * Seksi 9: Buku Tamu
 * Ditranskrip dari mockup yang diapprove mempelai (docs/mockup/Undangan Alwi & Septy.html, seksi 9).
 * Menampilkan:
 * 1. Judul seksi "BUKU TAMU" dengan ornamen emas (#orn)
 * 2. Formulir ucapan: input nama (default ke guestName jika tersedia) & textarea pesan/doa
 * 3. Tombol submit "Kirim Ucapan"
 * 4. Daftar ucapan terbaru dengan atribusi nama, penanda waktu, dan isi doa
 * 5. Ornamen sulur di sudut bawah (1 di ponsel, 2 di desktop)
 *
 * Integrasi Firestore (PRD §4.4): pengiriman lewat Server Action, paginasi
 * "Muat Ucapan Lainnya", dan penyegaran berkala menggantikan listener
 * real-time — klien tidak pernah memegang kredensial baca Firestore
 * (keputusan terkunci di CLAUDE.md). Lihat docs/DECISIONS.md.
 */
export function BukuTamu({
  guestName = "",
  fullSlug,
  initialEntries,
  initialHasMore = false,
  initialLoadFailed = false,
}: BukuTamuProps) {
  // Dipangkas ke batas server: nilai bawaan kolom ini di-set program
  // ("Bapak/Ibu " + nama tamu), dan atribut `maxLength` hanya membatasi
  // pengetikan manusia — ia tidak memangkas nilai awal. Tanpa pemangkasan,
  // tamu bernama panjang ditolak server untuk teks yang tidak ia ketik.
  const [name, setName] = useState(() =>
    guestName.slice(0, guestBookConfig.maxNameLength)
  );
  const [msg, setMsg] = useState("");
  const [entries, setEntries] = useState<GuestBookEntry[]>(() => [
    ...(initialEntries ?? []),
  ]);
  const [hasMore, setHasMore] = useState(initialHasMore);
  // Jumlah ucapan yang sedang ditampilkan dari puncak daftar. Tipe eksplisit
  // karena `guestBookConfig` bertanda `as const`, sehingga tanpa ini React
  // menyimpulkan tipe literal `10` dan menolak penambahan halaman.
  const [loadedCount, setLoadedCount] = useState<number>(
    guestBookConfig.pageSize
  );

  // State, bukan prop yang dibaca langsung saat render. Sebagai prop, nilainya
  // tidak pernah berubah: buku tamu yang gagal dibaca di server lalu berhasil
  // dipulihkan dan memang kosong (keadaan normal sebelum ada tamu menulis)
  // akan merender NIHIL — tanpa daftar, tanpa empty state, tanpa penjelasan.
  const [loadFailed, setLoadFailed] = useState(initialLoadFailed);
  const [error, setError] = useState<string | null>(null);
  // Galat paginasi dipisahkan dari galat formulir. Keduanya pernah memakai satu
  // state, dan akibatnya galat "Muat Ucapan Lainnya" dirender di dalam <form>
  // jauh di atas tombol yang memicunya — lalu tidak dirender sama sekali begitu
  // jatah tamu habis dan formulirnya di-unmount.
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [quotaExhausted, setQuotaExhausted] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Acuan waktu tunggal untuk seluruh baris daftar, disegarkan tiap penyegaran
  // berkala. Nilai awalnya dihitung juga saat render server, sehingga penanda
  // waktu bisa berbeda beberapa milidetik dari hasil hidrasi klien —
  // ditangani `suppressHydrationWarning` pada elemennya.
  const [nowMs, setNowMs] = useState(() => Date.now());

  const sectionRef = useRef<HTMLElement | null>(null);
  const loadedCountRef = useRef(loadedCount);
  const entriesRef = useRef(entries);
  // Kegagalan render server perlu satu percobaan ulang. Dipicu saat seksi
  // pertama kali terlihat, bukan saat mount: tamu yang tidak pernah sampai ke
  // seksi ini tidak perlu dibayari pembacaan Firestore, dan pemulihannya tidak
  // boleh menunggu siklus penyegaran pertama 20 detik kemudian.
  const needsRecoveryRef = useRef(initialLoadFailed);
  // Menahan penyegaran berkala selama ada pengiriman atau pemuatan berjalan,
  // supaya hasil yang lebih lama tidak menimpa daftar yang lebih baru.
  const isBusyRef = useRef(false);

  const nameId = useId();
  const msgId = useId();
  const errorId = useId();

  // Satu kunci per naskah ucapan, dipakai server sebagai ID dokumen. Kirim
  // ulang naskah yang sama memakai kunci yang sama, sehingga transaksi yang
  // sudah commit tetapi responsnya hilang di jaringan TIDAK menghasilkan
  // ucapan kedua yang identik. Direset hanya setelah pengiriman berhasil.
  const clientKeyRef = useRef<string | null>(null);
  const takeClientKey = () => {
    if (!clientKeyRef.current) {
      clientKeyRef.current =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID().replace(/-/g, "")
          : null;
    }
    return clientKeyRef.current ?? undefined;
  };

  // Tanpa fullSlug tidak ada tamu untuk diidentifikasi, jadi pengiriman,
  // paginasi, dan penyegaran semuanya dimatikan.
  const isPreview = !fullSlug;

  const showForm = !quotaExhausted;

  // Disinkronkan lewat efek, bukan saat render: siklus penyegaran berjalan di
  // luar render dan hanya butuh nilai terbaru, sementara menulis ref saat
  // render adalah efek samping yang dilarang React.
  useEffect(() => {
    loadedCountRef.current = loadedCount;
  }, [loadedCount]);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    isBusyRef.current = isPending || isLoadingMore;
  }, [isPending, isLoadingMore]);

  /**
   * Mengambil ulang daftar dari puncak sebanyak yang sedang ditampilkan.
   * Mengembalikan `null` bila gagal, supaya pemanggil bisa memutuskan sendiri
   * apakah kegagalan itu perlu diberitahukan ke tamu; bila berhasil,
   * mengembalikan JUMLAH BARIS yang benar-benar dilayani server — bukan jumlah
   * yang diminta. Pemanggil tidak boleh mengasumsikan permintaannya dipenuhi.
   */
  const reload = useCallback(
    async (count: number): Promise<{ served: number } | null> => {
      if (!fullSlug) return null;
      try {
        const result = await fetchGuestMessagesAction({
          fullSlug,
          limit: count,
        });
        if (!result.success) return null;

        setEntries(result.entries);
        setHasMore(result.hasMore);
        setNowMs(Date.now());
        setLoadFailed(false);
        return { served: result.entries.length };
      } catch (err) {
        // Penyegaran yang gagal tidak boleh mengosongkan daftar yang sudah
        // terbaca tamu, dan tidak perlu memunculkan galat: tamu tidak meminta
        // apa pun. Cukup dicatat lalu dicoba lagi pada siklus berikutnya.
        console.warn("Gagal menyegarkan daftar ucapan:", err);
        return null;
      }
    },
    [fullSlug]
  );

  /**
   * Penyegaran berkala (PRD §4.4 "ucapan baru muncul tanpa memuat ulang").
   * Sengaja hanya berjalan saat seksi terlihat di layar DAN tab sedang aktif:
   * tamu melewati seksi ini sebentar saja, dan setiap siklus adalah pembacaan
   * Firestore yang nyata untuk 150 tamu.
   */
  useEffect(() => {
    if (!fullSlug) return;

    const el = sectionRef.current;
    if (!el) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    let isOnScreen = false;

    const stop = () => {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    };

    const start = () => {
      if (timer !== null) return;
      timer = setInterval(() => {
        if (isBusyRef.current) return;
        // Tamu yang sudah menekan "Muat Ucapan Lainnya" berkali-kali sedang
        // membaca arsip, bukan menunggu ucapan baru. Menyegarkan jendela
        // sebesar itu tiap 20 detik hanya membakar kuota baca Firestore.
        //
        // Diukur terhadap baris yang BENAR-BENAR tampil, bukan terhadap jumlah
        // yang diminta: permintaan bisa jauh melebihi data yang ada (tamu
        // menekan muat-lebih sampai habis), dan memakai angka permintaan
        // mematikan penyegaran untuk tamu yang sebenarnya hanya melihat
        // sedikit baris.
        if (entriesRef.current.length > guestBookConfig.maxPollWindow) return;
        void reload(loadedCountRef.current);
      }, guestBookConfig.pollIntervalMs);
    };

    const sync = () => {
      if (isOnScreen && document.visibilityState === "visible") {
        if (needsRecoveryRef.current) {
          needsRecoveryRef.current = false;
          void reload(guestBookConfig.pageSize);
        }
        start();
      } else {
        stop();
      }
    };

    // rootMargin memberi sedikit awalan sebelum seksi benar-benar masuk layar,
    // supaya daftar sudah segar begitu tamu sampai.
    const observer = new IntersectionObserver(
      (observed) => {
        isOnScreen = observed.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);

    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, [fullSlug, reload]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    setError(null);
    setLoadMoreError(null);
    setNotice(null);

    // Mode pratinjau ("/" tanpa data tamu). Tombol kirim sudah dinonaktifkan,
    // ini penjaga terakhir: jangan pernah menampilkan ucapan sebagai terkirim
    // kalau tidak ada yang ditulis ke mana pun.
    if (!fullSlug) return;

    const trimmedName = name.trim();
    const trimmedMsg = msg.trim();

    if (!trimmedName) {
      setError(guestBookConfig.errorNameRequired);
      return;
    }
    if (!trimmedMsg) {
      setError(guestBookConfig.errorMessageRequired);
      return;
    }

    startTransition(async () => {
      // Wajib ditangkap di sini. Server Action punya try/catch sendiri, tetapi
      // kegagalan transport (tamu kehilangan sinyal di tengah kirim) menolak
      // promise-nya sebelum kode server sempat jalan. Rejeksi yang lolos dari
      // startTransition diperlakukan React sebagai galat render dan MENGGANTI
      // seluruh halaman undangan dengan layar galat — bukan hanya seksi ini.
      try {
        const result = await submitGuestMessageAction({
          fullSlug,
          name: trimmedName,
          message: trimmedMsg,
          clientKey: takeClientKey(),
        });

        if (!result.success) {
          if (result.reason === "limit_reached") {
            // Sengaja TIDAK menyetel `error`. Menyetelnya berarti merender
            // notice galat di dalam <form> yang justru di-unmount pada render
            // yang sama — jadi ia dirender nol kali, sekaligus mengunci
            // `error` pada nilai non-null selamanya karena kedua input yang
            // membersihkannya sudah tidak ada. Keterangan jatah yang
            // menggantikan formulir sudah menyampaikan hal yang sama.
            setError(null);
            setQuotaExhausted(true);
            return;
          }
          setError(result.error);
          return;
        }

        // Tampilkan seketika di puncak, lalu naikkan jumlah yang ditampilkan
        // satu baris supaya ucapan terlama tidak terdorong keluar layar oleh
        // ucapan tamu sendiri.
        setEntries((prev) => [result.entry, ...prev]);
        setLoadedCount((prev) => prev + 1);
        setNowMs(Date.now());
        setMsg("");
        setNotice(guestBookConfig.successNotice);
        // Naskah ini selesai; naskah berikutnya berhak atas kuncinya sendiri.
        clientKeyRef.current = null;

        if (result.remaining <= 0) {
          setQuotaExhausted(true);
        }
      } catch (err) {
        console.warn("Gagal mengirim ucapan:", err);
        setError(guestBookConfig.errorGeneric);
      }
    });
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !fullSlug) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    const shownBefore = entriesRef.current.length;
    const nextCount = loadedCountRef.current + guestBookConfig.pageSize;
    const result = await reload(nextCount);

    if (result) {
      setLoadedCount(nextCount);

      // Penjaga struktural terhadap tombol yang berbohong. Server boleh
      // menjepit permintaan kapan saja (batas pertahanannya sendiri, atau
      // ucapan yang baru disembunyikan admin), dan `hasMore` yang ia hitung
      // bisa tetap `true` padahal barisnya tidak bertambah. Tanpa ini,
      // tombolnya tampil selamanya sambil menjanjikan halaman yang tidak
      // pernah datang — dan setiap klik mati tetap dibayar pembacaan Firestore.
      if (result.served <= shownBefore) {
        setHasMore(false);
      }
    } else {
      setLoadMoreError(guestBookConfig.errorLoadMore);
    }
    setIsLoadingMore(false);
  };

  return (
    <section
      ref={sectionRef}
      id="buku-tamu"
      aria-labelledby="buku-tamu-title"
      className="relative overflow-hidden border-t border-gold-bright/35 bg-cream-secondary"
    >
      {/* Ornamen sulur pojok kiri bawah (khusus ponsel) */}
      <svg
        className="pointer-events-none absolute bottom-[6px] -left-[10px] h-[110px] w-[110px] -scale-y-100 opacity-40 lg:hidden"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Ornamen sulur kiri & kanan bawah (khusus desktop) */}
      <svg
        className="pointer-events-none absolute bottom-[6px] -left-[10px] hidden h-[170px] w-[170px] -scale-y-100 opacity-34 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="pointer-events-none absolute bottom-[6px] -right-[10px] hidden h-[170px] w-[170px] -scale-x-100 -scale-y-100 opacity-34 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Konten Seksi */}
      <div className="relative flex flex-col gap-[22px] px-[30px] pt-[52px] pb-[56px] lg:items-center lg:gap-[34px] lg:px-[40px] lg:pt-[88px] lg:pb-[96px]">
        {/* Header Seksi */}
        <div className="flex flex-col items-center gap-[10px] lg:gap-[14px]">
          <svg
            className="h-[18px] w-[140px] opacity-85 lg:h-[24px] lg:w-[200px]"
            aria-hidden="true"
          >
            <use href="#orn" />
          </svg>
          <h2
            id="buku-tamu-title"
            className="text-section-label lg:text-section-label-lg indent-[0.4em] text-ink-soft lg:indent-[0.48em]"
          >
            {guestBookConfig.title}
          </h2>
        </div>

        {showForm ? (
          /* Formulir Buku Tamu */
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-[14px] lg:max-w-[560px] lg:gap-[16px]"
          >
            <input
              id={nameId}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder={guestBookConfig.namePlaceholder}
              aria-label={guestBookConfig.namePlaceholder}
              required
              maxLength={guestBookConfig.maxNameLength}
              className="border-0 border-b border-gold-bright/75 bg-transparent p-[11px_2px] text-buku-input text-ink outline-none transition-colors placeholder:text-ink-soft/40 focus:border-gold-deep lg:p-[12px_2px] lg:text-buku-input-lg"
            />

            <textarea
              id={msgId}
              rows={3}
              value={msg}
              onChange={(e) => {
                setMsg(e.target.value);
                if (error) setError(null);
                if (notice) setNotice(null);
              }}
              placeholder={guestBookConfig.messagePlaceholder}
              aria-label={guestBookConfig.messagePlaceholder}
              maxLength={guestBookConfig.maxMessageLength}
              required
              className="border border-gold-bright/65 bg-white/50 p-[12px] text-buku-textarea text-ink outline-none transition-colors resize-y placeholder:text-ink-soft/40 focus:border-gold-deep lg:p-[14px] lg:text-buku-textarea-lg"
            />

            {/* Pesan galat — memakai aksen emas, bukan warna galat baru di luar palet */}
            {error && (
              <p
                id={errorId}
                role="alert"
                className="border border-gold-deep bg-white/70 p-[12px_14px] text-center text-buku-msg text-ink text-pretty lg:p-[14px_16px] lg:text-buku-msg-lg"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || isPreview}
              aria-busy={isPending}
              aria-describedby={error ? errorId : undefined}
              className="cursor-pointer border border-gold-deep bg-transparent p-[15px] text-buku-btn tracking-[0.32em] text-ink uppercase indent-[0.32em] transition-colors duration-300 hover:bg-gold-deep hover:text-on-photo disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-transparent disabled:hover:text-ink lg:self-center lg:p-[16px_40px] lg:text-buku-btn-lg lg:tracking-[0.36em] lg:indent-[0.36em]"
            >
              {isPending
                ? guestBookConfig.submittingLabel
                : guestBookConfig.submitButtonLabel}
            </button>

            {/* Hanya terlihat di "/" — tamu sungguhan selalu punya link pribadi */}
            {isPreview && (
              <p className="text-center text-buku-msg text-ink-soft text-pretty lg:text-buku-msg-lg">
                {guestBookConfig.previewNotice}
              </p>
            )}
          </form>
        ) : (
          /* Jatah 3 ucapan sudah habis (PRD §4.4) */
          <p
            aria-live="polite"
            className="w-full border border-gold-bright/70 bg-white/60 p-[16px_18px] text-center text-buku-msg text-ink-soft text-pretty lg:max-w-[560px] lg:p-[18px_22px] lg:text-buku-msg-lg"
          >
            {guestBookConfig.quotaReachedNotice}
          </p>
        )}

        {/* Konfirmasi tersimpan. Sengaja DI LUAR <form>: pada ucapan ketiga,
            simpan-berhasil dan jatah-habis di-set pada render yang sama, jadi
            notice yang dirender di dalam form ikut hilang bersama formnya dan
            tamu tidak pernah melihat konfirmasi apa pun. */}
        {notice && !error && (
          <p
            aria-live="polite"
            className="w-full border border-gold-bright/70 bg-white/60 p-[12px_14px] text-center text-buku-msg text-ink-soft text-pretty lg:max-w-[560px] lg:p-[14px_16px] lg:text-buku-msg-lg"
          >
            {notice}
          </p>
        )}

        {/* Daftar Ucapan */}
        {entries.length > 0 ? (
          <div className="flex w-full flex-col gap-0 lg:max-w-[720px]">
            {entries.map((entry, index) => (
              <div
                key={entry.id ?? `${entry.name}-${index}`}
                className="border-t border-gold-bright/40 py-[18px] lg:py-[22px]"
              >
                <div className="flex items-baseline justify-between gap-[10px] lg:gap-[14px]">
                  {/* min-w-0 + break-words: tanpa keduanya, nama panjang tanpa
                      spasi memaksa lebar item flex melewati kontainer dan
                      terpotong diam-diam oleh overflow-hidden seksi. */}
                  <span className="text-buku-name lg:text-buku-name-lg min-w-0 text-ink break-words">
                    {entry.name}
                  </span>
                  <span
                    suppressHydrationWarning
                    className="text-buku-when lg:text-buku-when-lg text-ink-soft shrink-0"
                  >
                    {entry.when ??
                      formatRelativeTimeId(
                        entry.createdAt,
                        nowMs,
                        guestBookConfig.justNowLabel
                      )}
                  </span>
                </div>
                {/* break-words menangani tempelan tautan panjang atau teks
                    tanpa spasi; text-pretty saja tidak memecah kata tunggal. */}
                <p className="mt-[6px] text-buku-msg text-ink-soft text-pretty break-words lg:mt-[7px] lg:max-w-[620px] lg:text-buku-msg-lg">
                  {entry.msg}
                </p>
              </div>
            ))}
          </div>
        ) : loadFailed ? null : (
          /* Hanya ditampilkan bila daftar memang berhasil dibaca dan kosong.
             Saat pembacaan gagal, mengaku "belum ada ucapan" adalah klaim
             palsu — biarkan kosong sampai pemulihan otomatis mengisinya. */
          <p className="w-full border-t border-gold-bright/40 pt-[22px] text-center text-buku-msg text-ink-soft text-pretty lg:max-w-[720px] lg:pt-[26px] lg:text-buku-msg-lg">
            {guestBookConfig.emptyStateText}
          </p>
        )}

        {/* Galat paginasi, tepat di atas tombol yang memicunya — bukan di dalam
            formulir jauh di puncak seksi. */}
        {loadMoreError && (
          <p
            role="alert"
            className="w-full self-center border border-gold-deep bg-white/70 p-[12px_14px] text-center text-buku-msg text-ink text-pretty lg:max-w-[560px] lg:p-[14px_16px] lg:text-buku-msg-lg"
          >
            {loadMoreError}
          </p>
        )}

        {/* Paginasi (PRD §4.4) — hanya bermakna di rute tamu */}
        {hasMore && !isPreview && (
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            aria-busy={isLoadingMore}
            className="cursor-pointer self-center border border-gold-deep/60 bg-transparent p-[13px_26px] text-buku-btn tracking-[0.28em] text-ink-soft uppercase indent-[0.28em] transition-colors duration-300 hover:border-gold-deep hover:bg-gold-deep hover:text-on-photo disabled:cursor-not-allowed disabled:opacity-55 lg:p-[14px_34px] lg:text-buku-btn-lg"
          >
            {isLoadingMore
              ? guestBookConfig.loadingMoreLabel
              : guestBookConfig.loadMoreLabel}
          </button>
        )}
      </div>
    </section>
  );
}
