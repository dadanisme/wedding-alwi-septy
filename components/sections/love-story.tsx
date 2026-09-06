import Image from "next/image";
import { loveStoryConfig } from "@/lib/event-config";

export function LoveStory() {
  return (
    <section
      id="love-story"
      aria-label="Love Story"
      className="relative overflow-hidden border-t border-gold-bright/35 bg-cream-secondary"
    >
      {/* Sulur sudut ponsel: kiri atas */}
      <svg
        className="pointer-events-none absolute -top-2.5 -left-4.5 h-[112px] w-[112px] opacity-40 lg:hidden"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Sulur sudut desktop: kiri atas & kanan bawah (rotasi 180°) */}
      <svg
        className="pointer-events-none absolute -top-5 -left-2.5 hidden h-[180px] w-[180px] opacity-[0.34] lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="pointer-events-none absolute -bottom-5 -right-2.5 hidden h-[180px] w-[180px] rotate-180 opacity-[0.34] lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Konten utama */}
      <div className="relative mx-auto flex max-w-page flex-col items-center gap-[26px] px-7.5 pt-[52px] pb-14 lg:gap-[52px] lg:px-28 lg:pt-[88px] lg:pb-24">
        {/* Header judul seksi */}
        <div className="flex flex-col items-center gap-2.5 lg:gap-3.5">
          <svg
            className="h-[18px] w-[140px] text-gold-bright lg:h-[24px] lg:w-[200px]"
            aria-hidden="true"
          >
            <use href="#orn" />
          </svg>
          <h2 className="text-section-label lg:text-section-label-lg text-ink-soft text-center indent-[0.4em] lg:indent-[0.48em]">
            {loveStoryConfig.sectionLabel}
          </h2>
        </div>

        {/* Linimasa Ponsel (< lg) */}
        <div className="flex w-full flex-col gap-[26px] lg:hidden">
          {loveStoryConfig.moments.map((moment) => (
            <div key={moment.year} className="flex items-start gap-4">
              {moment.photo ? (
                <div className="relative aspect-square w-[78px] shrink-0 overflow-hidden border border-gold-bright/80">
                  <Image
                    src={moment.photo}
                    alt={moment.title}
                    fill
                    className="object-cover"
                    sizes="78px"
                  />
                </div>
              ) : (
                <div
                  className="bg-story-placeholder flex aspect-square w-[78px] shrink-0 items-end border border-gold-bright/80 p-2"
                  role="img"
                  aria-label={`Placeholder foto ${moment.title}`}
                >
                  <span className="text-story-placeholder text-ink-soft">
                    {moment.placeholderText ?? `${moment.year} · 1:1`}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <span className="text-story-year text-gold-deep">{moment.year}</span>
                <h3 className="text-story-title text-ink">{moment.title}</h3>
                <p className="text-story-desc text-ink-soft">{moment.mobileDescription}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Linimasa Desktop (>= lg) */}
        <div className="relative hidden w-full flex-col gap-11 lg:flex">
          {/* Garis vertikal tengah linimasa */}
          <span
            className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-gold-bright/0 via-gold-bright/60 to-gold-bright/0"
            aria-hidden="true"
          />

          {loveStoryConfig.moments.map((moment, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={moment.year}
                className="grid grid-cols-[1fr_96px_1fr] items-center"
              >
                {isEven ? (
                  <>
                    {/* Kolom Kiri: Teks rata kanan */}
                    <div className="flex flex-col items-end gap-2 text-right">
                      <span className="text-story-year-lg text-gold-deep">
                        {moment.year}
                      </span>
                      <h3 className="text-story-title-lg text-ink">
                        {moment.title}
                      </h3>
                      <p className="text-story-desc-lg text-ink-soft max-w-[400px]">
                        {moment.desktopDescription}
                      </p>
                    </div>

                    {/* Kolom Tengah: Penanda diamond */}
                    <div className="flex items-center justify-center">
                      <span
                        className="h-[9px] w-[9px] rotate-45 bg-gold-deep"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Kolom Kanan: Foto rata kiri */}
                    <div className="flex justify-start">
                      {moment.photo ? (
                        <div className="relative aspect-4/3 w-[230px] overflow-hidden border border-gold-bright/80">
                          <Image
                            src={moment.photo}
                            alt={moment.title}
                            fill
                            className="object-cover"
                            sizes="230px"
                          />
                        </div>
                      ) : (
                        <div
                          className="bg-story-placeholder lg:bg-story-placeholder-lg flex aspect-4/3 w-[230px] items-end border border-gold-bright/80 p-2.5"
                          role="img"
                          aria-label={`Placeholder foto ${moment.title}`}
                        >
                          <span className="text-story-placeholder text-ink-soft">
                            {moment.placeholderDesktopText ?? `${moment.year} · 4:3`}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Kolom Kiri: Foto rata kanan */}
                    <div className="flex justify-end">
                      {moment.photo ? (
                        <div className="relative aspect-4/3 w-[230px] overflow-hidden border border-gold-bright/80">
                          <Image
                            src={moment.photo}
                            alt={moment.title}
                            fill
                            className="object-cover"
                            sizes="230px"
                          />
                        </div>
                      ) : (
                        <div
                          className="bg-story-placeholder lg:bg-story-placeholder-lg flex aspect-4/3 w-[230px] items-end border border-gold-bright/80 p-2.5"
                          role="img"
                          aria-label={`Placeholder foto ${moment.title}`}
                        >
                          <span className="text-story-placeholder text-ink-soft">
                            {moment.placeholderDesktopText ?? `${moment.year} · 4:3`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Kolom Tengah: Penanda diamond */}
                    <div className="flex items-center justify-center">
                      <span
                        className="h-[9px] w-[9px] rotate-45 bg-gold-deep"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Kolom Kanan: Teks rata kiri */}
                    <div className="flex flex-col items-start gap-2 text-left">
                      <span className="text-story-year-lg text-gold-deep">
                        {moment.year}
                      </span>
                      <h3 className="text-story-title-lg text-ink">
                        {moment.title}
                      </h3>
                      <p className="text-story-desc-lg text-ink-soft max-w-[400px]">
                        {moment.desktopDescription}
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Catatan bahwa linimasa dan teks bersifat sementara */}
        <p className="text-caption-italic text-ink-soft/75 text-center max-w-reading text-xs lg:text-sm">
          {loveStoryConfig.temporaryNote}
        </p>
      </div>
    </section>
  );
}
