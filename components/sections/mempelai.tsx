import { couple, mempelaiConfig } from "@/lib/event-config";
import { ScrollReveal } from "@/components/scroll-reveal";

/**
 * Pengganti foto profil (keputusan klien 12 Sep 2026, diteruskan dari
 * diskusi dengan Alwi: "nama mempelai ga usah ada foto aja") — ikon cincin
 * kawin dari sistem ornamen proyek (#ico-rings) di atas inisial nama
 * panggilan, menggantikan kotak placeholder foto 3:4. Lihat docs/DECISIONS.md.
 */
function MempelaiPortraitPanel({ nickname }: { nickname: string }) {
  return (
    <div
      className="bg-cream-secondary flex aspect-3/4 w-[196px] flex-col items-center justify-center gap-3 border border-gold-bright p-3.5 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(201,162,39,0.35)] lg:w-[290px] lg:gap-4 lg:outline lg:outline-1 lg:outline-gold-bright/35 lg:outline-offset-8"
      aria-hidden="true"
    >
      <svg className="h-10 w-10 opacity-90 lg:h-14 lg:w-14" aria-hidden="true">
        <use href="#ico-rings" />
      </svg>
      <span className="text-mempelai-initial lg:text-mempelai-initial-lg text-gold-deep">
        {nickname.charAt(0)}
      </span>
    </div>
  );
}

export function Mempelai() {
  return (
    <section
      id="mempelai"
      aria-label="Mempelai"
      className="relative z-[2] overflow-hidden bg-cream"
    >
      {/* Motif damask botani latar */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09] lg:opacity-[0.08]"
        aria-hidden="true"
      >
        <rect width="100%" height="100%" fill="url(#damaskPat)" />
      </svg>

      {/* Sulur sudut ponsel: kanan atas (flipped) */}
      <svg
        className="pointer-events-none absolute top-[70px] -right-4 h-[110px] w-[110px] -scale-x-100 opacity-45 transition-transform duration-1000 lg:hidden"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Sulur sudut desktop: kiri atas & kanan atas */}
      <svg
        className="pointer-events-none absolute top-[120px] left-0 hidden h-[170px] w-[170px] opacity-40 transition-transform duration-1000 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="pointer-events-none absolute top-[120px] right-0 hidden h-[170px] w-[170px] -scale-x-100 opacity-40 transition-transform duration-1000 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Konten utama */}
      <div className="relative mx-auto flex max-w-page flex-col items-center gap-[34px] px-7 pt-7 pb-14 lg:gap-[52px] lg:px-28 lg:pt-9 lg:pb-24">
        {/* Header judul seksi */}
        <ScrollReveal animation="fade-down" delay={100}>
          <div className="flex flex-col items-center gap-2.5 lg:gap-3.5">
            <svg
              className="h-[18px] w-[140px] text-gold-bright lg:h-[24px] lg:w-[200px]"
              aria-hidden="true"
            >
              <use href="#orn" />
            </svg>
            <h2 className="text-section-label lg:text-section-label-lg text-ink-soft text-center indent-[0.4em] lg:indent-[0.48em]">
              {mempelaiConfig.sectionLabel}
            </h2>
          </div>
        </ScrollReveal>

        {/* Layout Mempelai: 1 kolom di ponsel, 3 kolom di desktop */}
        <div className="flex w-full flex-col items-center gap-[34px] lg:grid lg:grid-cols-[1fr_88px_1fr] lg:items-start lg:gap-0">
          {/* Mempelai Pria */}
          <ScrollReveal
            animation="fade-right"
            delay={200}
            duration={1000}
            className="flex w-full flex-col items-center gap-3.5 lg:gap-5"
          >
            <MempelaiPortraitPanel nickname={couple.groom.nickname} />

            <h3 className="text-full-name lg:text-full-name-lg text-ink text-center max-w-[290px] text-balance lg:max-w-[340px]">
              {couple.groom.firstNamePart}{" "}
              <span className="whitespace-nowrap">{couple.groom.titlePart}</span>
            </h3>

            <span className="text-mempelai-nickname text-gold-deep italic text-center">
              {couple.groom.nickname}
            </span>

            <p className="text-mempelai-parents text-mempelai-parents-lg text-ink-soft text-center max-w-[280px] lg:max-w-[300px] whitespace-pre-line">
              {couple.groom.parentLabel}
            </p>
          </ScrollReveal>

          {/* Pemisah antara Pria & Wanita */}
          {/* Versi Ponsel (horizontal) */}
          <div className="flex w-full items-center gap-3.5 lg:hidden" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-gold-bright/0 to-gold-bright/70" />
            <span className="text-mempelai-ampersand text-gold-deep italic inline-block animate-heartbeat-gold">
              &amp;
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-gold-bright/0 to-gold-bright/70" />
          </div>

          {/* Versi Desktop (vertikal di kolom tengah) */}
          <div
            className="hidden lg:flex flex-col items-center gap-3.5 pt-[150px]"
            aria-hidden="true"
          >
            <span className="h-20 w-px bg-gradient-to-b from-gold-bright/0 to-gold-bright/70" />
            <span className="text-mempelai-ampersand text-mempelai-ampersand-lg text-gold-deep italic inline-block animate-heartbeat-gold">
              &amp;
            </span>
            <span className="h-20 w-px bg-gradient-to-t from-gold-bright/0 to-gold-bright/70" />
          </div>

          {/* Mempelai Wanita */}
          <ScrollReveal
            animation="fade-left"
            delay={350}
            duration={1000}
            className="flex w-full flex-col items-center gap-3.5 lg:gap-5"
          >
            <MempelaiPortraitPanel nickname={couple.bride.nickname} />

            <h3 className="text-full-name lg:text-full-name-lg text-ink text-center max-w-[290px] text-balance lg:max-w-[340px]">
              {couple.bride.firstNamePart}{" "}
              <span className="whitespace-nowrap">{couple.bride.titlePart}</span>
            </h3>

            <span className="text-mempelai-nickname text-gold-deep italic text-center">
              {couple.bride.nickname}
            </span>

            <p className="text-mempelai-parents text-mempelai-parents-lg text-ink-soft text-center max-w-[280px] lg:max-w-[300px] whitespace-pre-line">
              {couple.bride.parentLabel}
            </p>
          </ScrollReveal>
        </div>

        {/* Catatan bahwa detail profil masih bisa berubah */}
        <ScrollReveal animation="fade-up" delay={500}>
          <p className="text-caption-italic text-ink-soft/75 text-center max-w-reading text-xs lg:text-sm">
            {mempelaiConfig.temporaryNote}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

