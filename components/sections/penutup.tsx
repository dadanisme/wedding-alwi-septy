import Image from "next/image";
import { closingConfig, monogram } from "@/lib/event-config";

/**
 * Seksi 11 · Penutup (PRD §4.2 item 11).
 * Ucapan terima kasih, permohonan doa restu, salam penutup, monogram berapit spray,
 * dan nama kedua keluarga mempelai di atas latar gelap espresso.
 * Ditranskrip persis dari mockup yang diapprove (Undangan Alwi & Septy.html).
 */
export function Penutup() {
  return (
    <section
      id="penutup"
      aria-label="Penutup"
      className="relative overflow-hidden bg-espresso px-8 pt-[60px] pb-[66px] lg:px-10 lg:pt-24 lg:pb-[104px]"
    >
      {/* Ornamen sulur sudut: ponsel pakai 2 sudut diagonal (kiri atas & kanan bawah), desktop pakai 4 sudut simetris */}
      <svg
        className="absolute top-0 left-0 h-[120px] w-[120px] opacity-45 lg:h-[180px] lg:w-[180px]"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="absolute top-0 right-0 hidden h-[180px] w-[180px] -scale-x-100 opacity-45 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="absolute bottom-0 left-0 hidden h-[150px] w-[150px] -scale-y-100 opacity-35 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 h-[120px] w-[120px] rotate-180 opacity-45 lg:h-[150px] lg:w-[150px] lg:opacity-35"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      <div className="relative flex flex-col items-center gap-[18px] lg:gap-6">
        {/* Pembatas ornamen */}
        <svg
          className="h-[20px] w-[150px] lg:h-[26px] lg:w-[210px]"
          aria-hidden="true"
        >
          <use href="#orn" />
        </svg>

        {/* Ucapan terima kasih & doa restu */}
        <p className="text-penutup-msg lg:text-penutup-msg-lg max-w-[600px] text-center text-pretty text-label-on-dark">
          {closingConfig.message}
        </p>

        {/* Salam wassalam */}
        <p className="text-penutup-wassalam lg:text-penutup-wassalam-lg text-center text-tertiary-on-dark">
          {closingConfig.wassalam}
        </p>

        {/* Monogram A&S diapit ornamen spray */}
        <div className="mt-1.5 flex items-center gap-2 lg:mt-2.5 lg:gap-[14px]">
          <svg
            className="h-[28px] w-[56px] -scale-x-100 opacity-90 lg:h-[54px] lg:w-[110px]"
            aria-hidden="true"
          >
            <use href="#spray" />
          </svg>
          <Image
            src={monogram.white}
            alt={closingConfig.monogramAlt}
            width={1254}
            height={1254}
            className="h-[49px] w-auto lg:h-[87px]"
          />
          <svg
            className="h-[28px] w-[56px] opacity-90 lg:h-[54px] lg:w-[110px]"
            aria-hidden="true"
          >
            <use href="#spray" />
          </svg>
        </div>

        {/* Nama keluarga mempelai */}
        <span className="text-penutup-family lg:text-penutup-family-lg text-center text-label-on-dark">
          {closingConfig.familySignature}
        </span>
      </div>
    </section>
  );
}
