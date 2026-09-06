import { openingVerse } from "@/lib/event-config";
import { ScrollReveal } from "@/components/scroll-reveal";

/**
 * Seksi Ayat — kutipan Al-Qur'an di atas latar krem berornamen, tampil
 * setelah Sampul. Diporting persis dari mockup yang diapprove
 * (docs/mockup/Undangan Alwi & Septy.html, seksi 2 · AYAT).
 */
export function Ayat() {
  return (
    <section id="ayat" className="relative overflow-hidden bg-cream scroll-mt-0">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.13] lg:opacity-[0.12]"
        aria-hidden="true"
      >
        <rect width="100%" height="100%" fill="url(#damaskPat)" />
      </svg>

      <svg
        className="absolute top-[44px] left-[-14px] h-[118px] w-[118px] opacity-50 transition-transform duration-1000 lg:hidden"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="absolute right-[-14px] bottom-[24px] h-[118px] w-[118px] rotate-180 opacity-50 transition-transform duration-1000 lg:hidden"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      <svg
        className="absolute top-[70px] left-[6px] hidden h-[200px] w-[200px] opacity-50 transition-transform duration-1000 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="absolute top-[70px] right-[6px] hidden h-[200px] w-[200px] -scale-x-100 opacity-50 transition-transform duration-1000 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="absolute bottom-[20px] left-[60px] hidden h-[150px] w-[150px] -scale-y-100 opacity-[0.32] transition-transform duration-1000 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="absolute right-[60px] bottom-[20px] hidden h-[150px] w-[150px] -scale-100 opacity-[0.32] transition-transform duration-1000 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      <div className="relative z-10 flex flex-col items-center gap-[18px] px-[34px] pt-[34px] pb-[56px] lg:gap-[26px] lg:px-[40px] lg:pt-[40px] lg:pb-[96px]">
        <ScrollReveal animation="zoom-in" duration={800}>
          <svg className="h-[20px] w-[150px] lg:h-[28px] lg:w-[230px]" aria-hidden="true">
            <use href="#orn" />
          </svg>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150}>
          <h2 className="text-ayat-title lg:text-ayat-title-lg text-ink text-center">
            {openingVerse.reference}
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="blur-in" delay={300} duration={1200}>
          <p className="text-ayat lg:text-ayat-lg text-ink text-center text-pretty lg:max-w-reading-lg">
            {openingVerse.translation}
          </p>
        </ScrollReveal>

        <ScrollReveal animation="zoom-in" delay={450} duration={800}>
          <svg
            className="h-[16px] w-[110px] opacity-80 lg:h-[20px] lg:w-[160px]"
            aria-hidden="true"
          >
            <use href="#orn" />
          </svg>
        </ScrollReveal>
      </div>
    </section>
  );
}

