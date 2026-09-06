import Image from "next/image";
import { coverPhotos, monogram } from "@/lib/event-config";

/**
 * Layar sampul — gerbang wajib sebelum isi undangan (izin musik, penyaring
 * bot WhatsApp, momen pembukaan personal). Lihat CLAUDE.md § Keputusan
 * Produk. Diporting dari mockup yang diapprove: ponsel memakai satu foto
 * potret penuh, desktop membelahnya jadi dua panel (modern + adat Sunda).
 *
 * Tombol "Buka Undangan" memicu onOpen (membuka kunci scroll, smooth scroll
 * ke seksi Ayat, dan memutar musik latar).
 */
export function Sampul({
  guestName = "Bapak/Ibu/Saudara/i",
  onOpen,
}: {
  guestName?: string;
  onOpen?: () => void;
}) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-espresso">
      <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
        <div className="relative overflow-hidden">
          <Image
            src={coverPhotos.modern}
            alt="Alwi & Septy — potret modern"
            fill
            priority
            sizes="(min-width: 1440px) 720px, (min-width: 1024px) 50vw, 100vw"
            className="object-cover animate-ken-burns"
          />
        </div>
        <div className="relative hidden overflow-hidden lg:block">
          <Image
            src={coverPhotos.adatSunda}
            alt="Alwi & Septy — potret adat Sunda"
            fill
            sizes="(min-width: 1440px) 720px, 50vw"
            className="object-cover animate-ken-burns"
          />
        </div>
      </div>

      <span className="absolute inset-y-0 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-gold-bright/55 to-transparent lg:block" />

      <div className="absolute inset-0 bg-cover-scrim lg:hidden" />
      <div className="absolute inset-0 hidden bg-cover-scrim-radial lg:block" />
      <div className="absolute inset-0 hidden bg-cover-scrim-linear lg:block" />

      <svg
        className="absolute bottom-[-1px] left-0 block h-[66px] w-full lg:h-[120px]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        aria-hidden="true"
      >
        <use href="#wave" width="1440" height="120" />
      </svg>

      <svg
        className="absolute top-0 left-0 h-[132px] w-[132px] opacity-85 transition-opacity duration-1000 lg:h-[196px] lg:w-[196px]"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="absolute top-0 right-0 h-[132px] w-[132px] -scale-x-100 opacity-85 transition-opacity duration-1000 lg:h-[196px] lg:w-[196px]"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="absolute bottom-0 left-0 hidden h-[170px] w-[170px] -scale-y-100 opacity-60 transition-opacity duration-1000 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 hidden h-[170px] w-[170px] -scale-100 opacity-60 transition-opacity duration-1000 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-between px-[26px] pt-[52px] pb-[108px] lg:px-10 lg:pt-[56px] lg:pb-[156px]">
        <span className="text-label-on-dark text-[10px] leading-none font-semibold tracking-[0.5em] indent-[0.5em] uppercase transition-all duration-700 lg:text-[12px] lg:tracking-[0.62em] lg:indent-[0.62em]">
          The Wedding Of
        </span>

        <div className="flex flex-col items-center gap-[14px] animate-float-slow lg:gap-5">
          <div className="flex items-center gap-[6px] lg:gap-4">
            <svg
              className="h-[34px] w-[70px] -scale-x-100 transition-transform duration-500 hover:scale-105 lg:h-[72px] lg:w-[150px]"
              aria-hidden="true"
            >
              <use href="#spray" />
            </svg>
            <Image
              src={monogram.white}
              alt="Monogram Alwi & Septy"
              width={1254}
              height={1254}
              className="h-24 w-24 drop-shadow-[0_0_16px_rgba(255,255,255,0.25)] transition-transform duration-700 hover:scale-105 lg:h-[174px] lg:w-[174px]"
            />
            <svg
              className="h-[34px] w-[70px] transition-transform duration-500 hover:scale-105 lg:h-[72px] lg:w-[150px]"
              aria-hidden="true"
            >
              <use href="#spray" />
            </svg>
          </div>
          <h1 className="text-bride-name lg:text-bride-name-lg text-on-photo text-center indent-[0.2em] lg:indent-[0.3em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Alwi &amp; Septy
          </h1>
          <div className="flex items-center gap-3 lg:gap-5">
            <span className="h-px w-[26px] bg-gradient-to-r from-transparent to-gold-bright lg:w-[58px]" />
            <span className="text-label-on-dark text-[13px] leading-none tracking-[0.34em] lg:text-[18px] lg:tracking-[0.4em]">
              10 . 10 . 2026
            </span>
            <span className="h-px w-[26px] bg-gradient-to-l from-transparent to-gold-bright lg:w-[58px]" />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-[22px] lg:gap-[26px]">
          <div className="flex w-full flex-col items-center gap-[11px] lg:gap-[14px]">
            <div className="flex items-center justify-center gap-[11px] lg:gap-4">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-bright lg:w-[52px]" />
              <span className="text-label-small lg:text-label-small-lg text-label-on-dark indent-[0.44em] lg:indent-[0.5em]">
                Kepada Yth.
              </span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-bright lg:w-[52px]" />
            </div>
            <p className="text-guest-name lg:text-guest-name-lg text-on-photo max-w-[296px] text-center text-balance lg:max-w-reading-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {guestName}
            </p>
            <p className="text-caption-italic lg:text-caption-italic-lg text-label-on-dark/86 text-center lg:text-label-on-dark/88">
              Mohon berkenan hadir &amp; memberi doa restu
            </p>
          </div>
          <button
            type="button"
            onClick={onOpen}
            className="group relative overflow-hidden border border-gold-bright bg-espresso/45 text-on-photo hover:bg-gold-deep hover:border-gold-deep cursor-pointer px-[32px] py-[16px] text-[10px] font-semibold tracking-[0.34em] indent-[0.34em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_24px_rgba(0,0,0,0.5)] lg:px-[44px] lg:py-[18px] lg:text-[11px] lg:tracking-[0.38em] lg:indent-[0.38em]"
          >
            {/* Gelombang denyut beacon keluar dari tombol */}
            <span
              className="pointer-events-none absolute inset-0 border border-gold-bright/60 animate-beacon"
              aria-hidden="true"
            />
            {/* Sapuan kilau cahaya emas */}
            <span
              className="pointer-events-none absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer"
              aria-hidden="true"
            />
            <span className="relative z-10">Buka Undangan</span>
          </button>
        </div>
      </div>
    </section>
  );
}
