"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { galleryPhotos } from "@/lib/event-config";
import { ScrollReveal } from "@/components/scroll-reveal";

const TOTAL = galleryPhotos.length;

type GalleryTile = (typeof galleryPhotos)[number] & {
  span: 1 | 2;
  aspect: string;
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
 * seperti algoritma auto-placement asli — untuk memverifikasi tidak ada
 * baris yang menyisakan sel kosong sebelum baris berikutnya dimulai.
 * Baris TERAKHIR boleh tidak penuh (itu wajar, bukan bug). Dipanggil untuk
 * 2 kolom (ponsel) dan 4 kolom (desktop) saat modul dimuat, supaya kalau
 * `galleryPhotos` diedit dan heuristik promosi run-ganjil di atas ternyata
 * tidak cukup untuk susunan barunya, build gagal keras dengan pesan yang
 * jelas — bukan diam-diam menampilkan sel kosong seperti bug yang baru
 * ditemukan sesi ini.
 */
function assertNoGridGaps(tiles: GalleryTile[], columns: number) {
  let used = 0;
  for (const tile of tiles) {
    if (used + tile.span > columns) {
      if (used !== columns) {
        throw new Error(
          `Galeri: susunan galleryPhotos menyisakan gap ${columns - used} kolom pada grid ${columns}-kolom sebelum baris berikutnya dimulai — buildGalleryTiles() perlu disesuaikan. Lihat docs/DECISIONS.md.`,
        );
      }
      used = 0;
    }
    used += tile.span;
  }
}

const galleryTiles = buildGalleryTiles(galleryPhotos);
assertNoGridGaps(galleryTiles, 2);
assertNoGridGaps(galleryTiles, 4);

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
            <button
              ref={(el) => {
                triggerRefs.current[index] = el;
              }}
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`Perbesar foto ${index + 1} dari ${TOTAL}`}
              className={`group relative w-full overflow-hidden focus-visible:z-10 cursor-pointer ${photo.aspect}`}
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
          className="bg-espresso/95 fixed inset-0 z-50 flex items-center justify-center px-4 py-6 lg:px-10"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const deltaX = event.changedTouches[0].clientX - touchStartX.current;
            if (deltaX > 48) showPrev();
            else if (deltaX < -48) showNext();
            touchStartX.current = null;
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Tutup"
            className="border-gold-bright/70 text-on-photo hover:border-gold-bright hover:bg-espresso absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:top-6 lg:right-6"
          >
            <CloseIcon />
          </button>

          <button
            type="button"
            onClick={showPrev}
            aria-label="Foto sebelumnya"
            className="border-gold-bright/70 text-on-photo hover:border-gold-bright hover:bg-espresso absolute left-2 flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:left-6 lg:h-12 lg:w-12"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Foto berikutnya"
            className="border-gold-bright/70 text-on-photo hover:border-gold-bright hover:bg-espresso absolute right-2 flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:right-6 lg:h-12 lg:w-12"
          >
            <ChevronIcon direction="right" />
          </button>

          <div className="relative h-full max-h-[80vh] w-full max-w-4xl">
            <Image
              key={activePhoto.src}
              src={activePhoto.src}
              alt={activePhoto.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <span className="text-on-photo/80 absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.3em] uppercase lg:bottom-6 lg:text-[12px]">
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
