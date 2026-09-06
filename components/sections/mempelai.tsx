import Image from "next/image";
import { couple, mempelaiConfig } from "@/lib/event-config";
import { ScrollReveal } from "@/components/scroll-reveal";

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
            {couple.groom.photo ? (
              <div className="relative aspect-3/4 w-[196px] overflow-hidden border border-gold-bright transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(201,162,39,0.35)] lg:w-[290px] lg:outline lg:outline-1 lg:outline-gold-bright/35 lg:outline-offset-8">
                <Image
                  src={couple.groom.photo}
                  alt={couple.groom.fullName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 196px, 290px"
                />
              </div>
            ) : (
              <div
                className="bg-mempelai-placeholder lg:bg-mempelai-placeholder-lg flex aspect-3/4 w-[196px] items-center justify-center border border-gold-bright p-3.5 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(201,162,39,0.35)] lg:w-[290px] lg:outline lg:outline-1 lg:outline-gold-bright/35 lg:outline-offset-8"
                role="img"
                aria-label="Placeholder foto mempelai pria"
              >
                <span className="text-mempelai-note lg:text-mempelai-note-lg text-ink-soft text-center">
                  <span className="lg:hidden">{couple.groom.photoPlaceholderText}</span>
                  <span className="hidden lg:inline">{couple.groom.photoPlaceholderDesktopText}</span>
                  <br />
                  <span className="mt-1 inline-block opacity-75">(sementara)</span>
                </span>
              </div>
            )}

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
            {couple.bride.photo ? (
              <div className="relative aspect-3/4 w-[196px] overflow-hidden border border-gold-bright transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(201,162,39,0.35)] lg:w-[290px] lg:outline lg:outline-1 lg:outline-gold-bright/35 lg:outline-offset-8">
                <Image
                  src={couple.bride.photo}
                  alt={couple.bride.fullName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 196px, 290px"
                />
              </div>
            ) : (
              <div
                className="bg-mempelai-placeholder lg:bg-mempelai-placeholder-lg flex aspect-3/4 w-[196px] items-center justify-center border border-gold-bright p-3.5 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(201,162,39,0.35)] lg:w-[290px] lg:outline lg:outline-1 lg:outline-gold-bright/35 lg:outline-offset-8"
                role="img"
                aria-label="Placeholder foto mempelai wanita"
              >
                <span className="text-mempelai-note lg:text-mempelai-note-lg text-ink-soft text-center">
                  <span className="lg:hidden">{couple.bride.photoPlaceholderText}</span>
                  <span className="hidden lg:inline">{couple.bride.photoPlaceholderDesktopText}</span>
                  <br />
                  <span className="mt-1 inline-block opacity-75">(sementara)</span>
                </span>
              </div>
            )}

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

        {/* Catatan bahwa foto dan data sementara */}
        <ScrollReveal animation="fade-up" delay={500}>
          <p className="text-caption-italic text-ink-soft/75 text-center max-w-reading text-xs lg:text-sm">
            {mempelaiConfig.temporaryNote}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

