"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { galleryPhotos } from "@/lib/event-config";
import { ScrollReveal } from "@/components/scroll-reveal";

const TOTAL = galleryPhotos.length;

type GalleryTile = (typeof galleryPhotos)[number] & {
  span: 1 | 2;
  aspect: string;
  /**
   * true = tile ini ikut stretch mengisi tinggi baris grid mulai breakpoint
   * `lg`, bukan pakai `aspect` tetap — lihat `matchRowHeightsAtLg()`. JSX
   * merender ini lewat ternary literal ("lg:aspect-auto lg:h-full"), bukan
   * class yang dirakit dari potongan string, karena Tailwind men-scan teks
   * sumber untuk nama class UTUH — potongan yang digabung saat runtime
   * tidak akan terdeteksi, jadi CSS-nya tidak akan pernah ter-generate
   * meski logikanya benar.
   */
  stretchAtLg?: boolean;
};

/**
 * Foto lanskap span-2, foto potret span-1 — KECUALI foto potret terakhir
 * dalam rangkaian (run) yang panjangnya ganjil: rangkaian ganjil dari tile
 * span-1 tidak selalu pas mengisi baris grid (2 kolom ponsel / 4 kolom
 * desktop) berdampingan dengan tile span-2, menyisakan satu sel kosong yang
 * tidak bisa diisi CSS grid apa pun (termasuk `dense`, karena tidak ada tile
 * span-1 lain sesudahnya untuk mengisi sisa itu). Ditemukan lewat
 * verifikasi visual di 390px — satu foto adat Sunda tampil sendirian
 * dengan ruang kosong di sampingnya.
 *
 * PENTING — heuristik ini HANYA menjaga paritas rangkaian potret. Rangkaian
 * lanskap yang panjangnya ganjil bisa saja menghasilkan gap serupa di grid
 * 4-kolom (desktop), tergantung apa yang datang sesudahnya — kasus itu
 * TIDAK ditangani di sini karena data 21 foto saat ini kebetulan tidak
 * pernah punya rangkaian lanskap ganjil. Makanya ada `assertNoGridGaps` di
 * bawah: kalau `galleryPhotos` diedit nanti (foto ditambah/dikurangi/
 * diurut ulang) dan itu memunculkan gap yang heuristik ini tidak tangani,
 * build akan gagal keras alih-alih diam-diam menampilkan bug visual yang
 * sama seperti yang baru ditemukan sesi ini. Lihat docs/DECISIONS.md.
 *
 * Tile yang dipromosikan span-2 dirender dengan rasio 4:3 (bukan 4:5)
 * SUPAYA TINGGINYA SAMA PERSIS dengan tile potret span-1 di baris yang
 * sama: tile potret 2:3 pada lebar 1 kolom punya tinggi 1.5×lebar-kolom;
 * tile span-2 pada lebar 2 kolom butuh rasio 4:3 (bukan 4:5) supaya
 * tingginya juga 1.5×lebar-kolom. Sempat salah pakai 4:5 (lebih tinggi
 * dari tile potret di sebelahnya) — baris grid melar mengikuti tile
 * tertinggi, dan tile potret yang lebih pendek (punya aspect-ratio
 * tetap, tidak stretch) menyisakan ruang kosong kentara di bawahnya.
 * Ketahuan dari screenshot manusia di lebar desktop, bukan lewat kode.
 * Lihat docs/DECISIONS.md.
 */
function buildGalleryTiles(photos: typeof galleryPhotos): GalleryTile[] {
  const tiles: GalleryTile[] = [];
  let i = 0;
  while (i < photos.length) {
    if (photos[i].orientation === "landscape") {
      tiles.push({ ...photos[i], span: 2, aspect: "aspect-[3/2]" });
      i++;
      continue;
    }
    let runEnd = i;
    while (runEnd < photos.length && photos[runEnd].orientation === "portrait") {
      runEnd++;
    }
    const runLength = runEnd - i;
    for (let k = i; k < runEnd; k++) {
      const isLastOfOddRun = runLength % 2 === 1 && k === runEnd - 1;
      tiles.push({
        ...photos[k],
        span: isLastOfOddRun ? 2 : 1,
        aspect: isLastOfOddRun ? "aspect-[4/3]" : "aspect-[2/3]",
      });
    }
    i = runEnd;
  }
  return tiles;
}

/**
 * Simulasi penempatan grid CSS row-major (sparse, tanpa `dense`) — sama
 * seperti algoritma auto-placement asli. Dipakai baik untuk deteksi gap
 * maupun deteksi baris yang mencampur tile span-1 dan span-2 (lihat
 * `matchRowHeightsAtLg` dan `assertRowHeightsMatch` di bawah).
 */
function simulateRows(tiles: GalleryTile[], columns: number): GalleryTile[][] {
  const rows: GalleryTile[][] = [[]];
  let used = 0;
  for (const tile of tiles) {
    if (used + tile.span > columns) {
      rows.push([]);
      used = 0;
    }
    rows[rows.length - 1].push(tile);
    used += tile.span;
  }
  return rows;
}

/**
 * Baris TERAKHIR boleh tidak penuh (itu wajar, bukan bug). Dipanggil untuk
 * 2 kolom (ponsel) dan 4 kolom (desktop) saat modul dimuat, supaya kalau
 * `galleryPhotos` diedit dan heuristik promosi run-ganjil di atas ternyata
 * tidak cukup untuk susunan barunya, build gagal keras dengan pesan yang
 * jelas — bukan diam-diam menampilkan sel kosong seperti bug yang baru
 * ditemukan sesi ini.
 */
function assertNoGridGaps(tiles: GalleryTile[], columns: number) {
  const rows = simulateRows(tiles, columns);
  rows.forEach((row, index) => {
    const used = row.reduce((sum, tile) => sum + tile.span, 0);
    const isLastRow = index === rows.length - 1;
    if (used !== columns && !isLastRow) {
      throw new Error(
        `Galeri: susunan galleryPhotos menyisakan gap ${columns - used} kolom pada grid ${columns}-kolom sebelum baris berikutnya dimulai — buildGalleryTiles() perlu disesuaikan. Lihat docs/DECISIONS.md.`,
      );
    }
  });
}

/**
 * Tile span-2 mana pun (baik lanskap murni aspect 3:2, maupun potret yang
 * dipromosikan aspect 4:3 di atas) yang kebetulan mendarat sebaris dengan
 * tile potret span-1 (aspect 2:3) di grid 4-kolom (desktop) TIDAK akan
 * setinggi tile potret di sebelahnya kalau cuma mengandalkan rasio tetap:
 * lebar sel span-2 sebenarnya `2×lebar-kolom + 1×gap` (bukan persis
 * `2×lebar-kolom`), jadi rasio aspect manapun yang dipilih untuk
 * mendekati "tinggi 1.5×lebar-kolom" akan selalu meleset beberapa piksel
 * (lebih terlihat di layar lebar, karena gap makin kecil secara
 * proporsional). Ditemukan dari screenshot manusia di dua breakpoint
 * (1280px meleset ~7px, 2200px meleset ~8px) — percobaan pertama pakai
 * `aspect-[4/3]` (rasio yang sama dipakai tile potret yang dipromosikan)
 * MENGURANGI gap dari ~48px jadi ~7-8px tapi tidak menghilangkannya sama
 * sekali, dan pengguna masih melihatnya sebagai "belum sama".
 *
 * Perbaikan yang benar-benar presisi piksel: BUKAN menebak rasio yang
 * lebih cocok, tapi melepas aspect-ratio tetap tile itu sepenuhnya
 * (`aspect-auto`) dan biarkan CSS Grid men-stretch tingginya (`h-full`)
 * mengikuti baris — perilaku bawaan `align-items: stretch` pada grid item
 * yang TIDAK punya ukuran intrinsik sendiri. Ini exact by construction,
 * bukan pendekatan, karena tinggi baris itu sendiri ditentukan oleh tile
 * potret (aspect tetap) di baris yang sama — lihat `matchRowHeightsAtLg`.
 *
 * Override ini HANYA dipasang mulai breakpoint `lg` karena di grid
 * 2-kolom (ponsel) tile span-2 SELALU sendirian di barisnya (span 2 ==
 * kolom 2, tidak ada tile potret sebaris untuk di-stretch-kan), jadi tidak
 * pernah butuh koreksi — foto tetap tampil di rasio aslinya (3:2 atau 4:3)
 * di ponsel, tidak berubah.
 *
 * PENYEBAB KEDUA yang baru ketahuan sesi ini juga (bukan cuma soal rasio
 * di atas): `<button>` defaultnya `display: inline-block`. Sebuah elemen
 * inline-block, WALAUPUN tingginya sudah dipatok tepat via aspect-ratio,
 * tetap "memesan" beberapa piksel ekstra di bawah dirinya pada wrapper-nya
 * (`ScrollReveal`, block biasa) — sisa ruang untuk descender font pada
 * garis-teks tak terlihat yang otomatis dibuat elemen inline dalam
 * konteks block (efek klasik "extra space below image/inline-block").
 * Ini SERAGAM di semua baris (potret maupun lanskap) ±7px pada 1280px,
 * makanya sebelumnya tidak pernah ketahuan — semua tile di baris yang
 * sama diam-diam kehilangan tinggi yang identik, jadi tidak ada yang
 * kelihatan "beda". Begitu `matchRowHeightsAtLg` membuat satu tile
 * benar-benar stretch mengikuti TINGGI WRAPPER (yang masih termasuk
 * ekstra ~7px itu), sementara tile potret di sebelahnya TETAP memesan
 * ekstra ~7px yang sama tapi tidak pernah mengisinya (karena aspect-ratio
 * tetap tidak stretch), selisihnya baru kelihatan sebagai baris yang
 * "masih ga sama tingginya" — dilaporkan pengguna bahkan SETELAH fix
 * stretch di atas dipasang. Diverifikasi lewat `getComputedStyle().height`
 * langsung di browser (bukan tebakan): SEMUA baris kelebihan ~7px yang
 * identik sebelum diperbaiki, nol setelah `<button>` diberi `block`
 * (lihat className di JSX) alih-alih inline-block bawaan browser.
 */
function matchRowHeightsAtLg(tiles: GalleryTile[]) {
  for (const row of simulateRows(tiles, 4)) {
    const hasSpan1 = row.some((tile) => tile.span === 1);
    if (!hasSpan1) continue;
    for (const tile of row) {
      if (tile.span === 2) {
        tile.stretchAtLg = true;
      }
    }
  }
}

function aspectHeightUnits(tile: GalleryTile): number {
  const match = tile.aspect.match(/aspect-\[(\d+)\/(\d+)\]/);
  if (!match) {
    throw new Error(`Galeri: format aspect tidak dikenali: ${tile.aspect}`);
  }
  const widthOverHeight = Number(match[1]) / Number(match[2]);
  return tile.span / widthOverHeight;
}

/**
 * Verifikasi tambahan: setiap baris (hasil simulasi yang sama dengan
 * `assertNoGridGaps`) tidak boleh berisi tile dengan tinggi relatif
 * (dalam satuan lebar-kolom, dihitung dari `aspect` MASING-MASING tile)
 * yang beda — kalau beda, tile yang lebih pendek akan menyisakan ruang
 * kosong di bawahnya. Tile yang sudah ditandai `stretchAtLg` dilewati saat
 * memeriksa breakpoint `lg` karena tingginya dijamin cocok oleh CSS
 * stretch, bukan oleh kesamaan rasio — lihat `matchRowHeightsAtLg`.
 * Dipanggil untuk kedua breakpoint supaya kombinasi baru yang tidak
 * tertangani `matchRowHeightsAtLg` (misal dua tile span-2 dengan aspect
 * berbeda mendarat sebaris TANPA tile potret span-1 di antaranya, jadi
 * tidak ada yang di-stretch) gagal keras saat build, bukan diam-diam
 * menampilkan gap visual.
 */
function assertRowHeightsMatch(tiles: GalleryTile[], columns: number, isLg: boolean) {
  for (const row of simulateRows(tiles, columns)) {
    const measured = row.filter((tile) => !(isLg && tile.stretchAtLg));
    if (measured.length < 2) continue;
    const heights = measured.map((tile) => aspectHeightUnits(tile));
    const [first, ...rest] = heights;
    if (rest.some((h) => Math.abs(h - first) > 0.01)) {
      throw new Error(
        `Galeri: baris grid ${columns}-kolom (${isLg ? "lg" : "dasar"}) punya tile dengan tinggi tidak sama (${row.map((t) => t.src).join(", ")}) — akan menyisakan ruang kosong di bawah tile yang lebih pendek. Lihat docs/DECISIONS.md.`,
      );
    }
  }
}

const galleryTiles = buildGalleryTiles(galleryPhotos);
matchRowHeightsAtLg(galleryTiles);
assertNoGridGaps(galleryTiles, 2);
assertNoGridGaps(galleryTiles, 4);
assertRowHeightsMatch(galleryTiles, 2, false);
assertRowHeightsMatch(galleryTiles, 4, true);

/**
 * Seksi Galeri — grid seluruh 21 foto klien dengan "tampilan perbesar"
 * (PRD §4.2 seksi 6). Rasio tile per foto mengikuti orientasi asli
 * (`galleryPhotos[].orientation`), bukan dipaksa satu rasio potret seperti
 * wireframe mockup — lihat docs/DECISIONS.md untuk alasan penyimpangan ini
 * dari mockup (mockup hanya menampilkan penampung, mayoritas foto asli
 * ternyata berorientasi lanskap).
 */
export function Galeri() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwipingRef = useRef(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastOpenedIndexRef = useRef<number | null>(null);

  function openLightbox(index: number) {
    lastOpenedIndexRef.current = index;
    setActiveIndex(index);
  }

  function close() {
    setActiveIndex(null);
  }

  function showPrev() {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + TOTAL) % TOTAL,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % TOTAL,
    );
  }

  const isOpen = activeIndex !== null;

  // Depend on `isOpen` (not `activeIndex`) — this must only run once per
  // open/close transition. Depending on `activeIndex` directly re-ran this
  // on every prev/next step, yanking focus back to the Close button after
  // each navigation and breaking Tab-driven keyboard use (a Tab+Enter to
  // "next" would land back on Close, so the following Enter closed the
  // lightbox instead of advancing again). Found by /code-review.
  useEffect(() => {
    if (!isOpen) {
      if (lastOpenedIndexRef.current !== null) {
        triggerRefs.current[lastOpenedIndexRef.current]?.focus();
        lastOpenedIndexRef.current = null;
      }
      return;
    }

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const activePhoto = activeIndex === null ? null : galleryPhotos[activeIndex];

  return (
    <section className="relative bg-cream">
      <ScrollReveal animation="fade-down" delay={100}>
        <div className="flex flex-col items-center gap-[10px] px-[30px] pt-[52px] pb-6 lg:gap-[14px] lg:px-10 lg:pt-[88px] lg:pb-10">
          <svg className="h-[18px] w-[140px] lg:h-6 lg:w-[200px]" aria-hidden="true">
            <use href="#orn" />
          </svg>
          <h2 className="text-section-label lg:text-section-label-lg text-ink-soft indent-[0.4em] lg:indent-[0.48em]">
            Galeri
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 gap-1.5 px-1.5 pb-[56px] lg:grid-cols-4 lg:gap-2.5 lg:px-2.5 lg:pb-[96px]">
        {galleryTiles.map((photo, index) => (
          <ScrollReveal
            key={photo.src}
            animation="zoom-in"
            delay={(index % 4) * 75}
            duration={700}
            className={`${photo.span === 2 ? "col-span-2" : ""}`}
          >
            {/* `block` (bukan inline-block bawaan browser untuk <button>) menghilangkan
                celah descender-font tak terlihat di bawah tile — lihat komentar
                matchRowHeightsAtLg() di atas. */}
            <button
              ref={(el) => {
                triggerRefs.current[index] = el;
              }}
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`Perbesar foto ${index + 1} dari ${TOTAL}`}
              className={`group relative block w-full overflow-hidden focus-visible:z-10 cursor-pointer ${photo.aspect} ${photo.stretchAtLg ? "lg:aspect-auto lg:h-full" : ""}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={
                  photo.span === 2
                    ? "(min-width: 1440px) 720px, (min-width: 1024px) 50vw, 100vw"
                    : "(min-width: 1440px) 360px, (min-width: 1024px) 25vw, 50vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <span className="bg-espresso/0 group-hover:bg-espresso/15 absolute inset-0 transition-colors duration-300" />
            </button>
          </ScrollReveal>
        ))}
      </div>

      {activePhoto && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${activeIndex + 1} dari ${TOTAL}`}
          className="bg-espresso/95 fixed inset-0 z-50 flex items-center justify-center px-4 py-6 cursor-pointer lg:px-10"
          onClick={() => {
            if (isSwipingRef.current) {
              isSwipingRef.current = false;
              return;
            }
            close();
          }}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0].clientX;
            touchStartY.current = event.touches[0].clientY;
            isSwipingRef.current = false;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const deltaX = event.changedTouches[0].clientX - touchStartX.current;
            const deltaY =
              event.changedTouches[0].clientY -
              (touchStartY.current ?? event.changedTouches[0].clientY);
            if (Math.hypot(deltaX, deltaY) > 10) {
              isSwipingRef.current = true;
            }
            if (deltaX > 48) showPrev();
            else if (deltaX < -48) showNext();
            touchStartX.current = null;
            touchStartY.current = null;
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Tutup"
            className="border-gold-bright/70 text-on-photo hover:border-gold-bright hover:bg-espresso absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors lg:top-6 lg:right-6"
          >
            <CloseIcon />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Foto sebelumnya"
            className="border-gold-bright/70 text-on-photo hover:border-gold-bright hover:bg-espresso absolute left-2 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors lg:left-6 lg:h-12 lg:w-12"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Foto berikutnya"
            className="border-gold-bright/70 text-on-photo hover:border-gold-bright hover:bg-espresso absolute right-2 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors lg:right-6 lg:h-12 lg:w-12"
          >
            <ChevronIcon direction="right" />
          </button>

          <Image
            key={activePhoto.src}
            src={activePhoto.src}
            alt={activePhoto.alt}
            width={activePhoto.width}
            height={activePhoto.height}
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] w-auto max-w-[calc(100vw-2rem)] cursor-default select-none object-contain shadow-2xl lg:max-w-4xl"
          />

          <span className="text-on-photo/80 pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 select-none text-[11px] uppercase tracking-[0.3em] lg:bottom-6 lg:text-[12px]">
            {activeIndex + 1} / {TOTAL}
          </span>
        </div>
      )}
    </section>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 lg:h-5 lg:w-5" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 lg:h-5 lg:w-5 ${direction === "right" ? "-scale-x-100" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M15 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
