import Image from "next/image";
import { openingGreeting, openingPhotos } from "@/lib/event-config";

/**
 * Seksi Pembuka — salam pembuka & kalimat pengantar di atas foto adat Sunda
 * bernuansa gelap, di antara Ayat dan Mempelai. Diporting dari mockup yang
 * diapprove (docs/mockup/Undangan Alwi & Septy.html, seksi 3 · PEMBUKA).
 * Beda dari Sampul: ponsel & desktop memakai foto berbeda (potret vs
 * lanskap asli), bukan satu foto yang di-crop ulang — lihat
 * docs/DECISIONS.md.
 */
export function Pembuka() {
  return (
    <section className="relative min-h-[620px] overflow-hidden bg-espresso lg:min-h-[660px]">
      <div className="absolute inset-0 lg:hidden">
        <Image
          src={openingPhotos.portrait}
          alt="Alwi & Septy — busana adat Sunda"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src={openingPhotos.landscape}
          alt="Alwi & Septy — busana adat Sunda"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-pembuka-scrim lg:hidden" />
      <div className="absolute inset-0 hidden bg-pembuka-scrim-lg lg:block" />

      <svg
        className="absolute top-[-1px] left-0 block h-[66px] w-full -scale-y-100 lg:h-[110px]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        aria-hidden="true"
      >
        <use href="#wave" width="1440" height="120" />
      </svg>
      <svg
        className="absolute bottom-[-1px] left-0 block h-[66px] w-full lg:h-[110px]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        aria-hidden="true"
      >
        <use href="#wave" width="1440" height="120" />
      </svg>

      <svg
        className="absolute bottom-0 left-0 h-[126px] w-[126px] -scale-y-100 opacity-80 lg:h-[180px] lg:w-[180px] lg:opacity-75"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="absolute right-0 bottom-0 h-[126px] w-[126px] -scale-100 opacity-80 lg:h-[180px] lg:w-[180px] lg:opacity-75"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      <div className="relative flex h-full flex-col items-center justify-end gap-4 px-8 pb-[84px] lg:gap-5 lg:px-10 lg:pb-32">
        <span className="text-label-small lg:text-label-small-lg text-label-on-dark indent-[0.44em] lg:indent-[0.5em]">
          {openingGreeting.bismillah}
        </span>
        <p className="text-pembuka-greeting lg:text-pembuka-greeting-lg text-on-photo text-center text-pretty">
          {openingGreeting.salutation}
        </p>
        <svg className="h-4 w-[120px] lg:h-[22px] lg:w-[180px]" aria-hidden="true">
          <use href="#orn" />
        </svg>
        <p className="text-pembuka lg:text-pembuka-lg text-warm-white/90 text-center text-pretty lg:max-w-reading-lg lg:text-warm-white/92">
          {openingGreeting.body}
        </p>
      </div>
    </section>
  );
}
