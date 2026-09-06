"use client";

import { useEffect, useRef, useState } from "react";
import { eventSchedule, venue } from "@/lib/event-config";

/**
 * Seksi Detail Acara — Akad, Resepsi, Lokasi, Peta Tersemat, dan Tombol Arah & Kalender.
 * Diporting persis dari mockup yang sudah diapprove klien
 * (docs/mockup/Undangan Alwi & Septy.html, seksi 7 · DETAIL ACARA).
 */
export function Acara() {
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Pernikahan Alwi & Septy"
  )}&dates=20261010T010000Z/20261010T070000Z&details=${encodeURIComponent(
    "Akad Nikah: 08.00 WIB\nResepsi: 11.00 – 14.00 WIB\n\nSteikhaus (Area Pabrik Bajoe), Bandung"
  )}&location=${encodeURIComponent(
    `${venue.name}, ${venue.address}`
  )}`;

  function handleDownloadIcs() {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Alwi & Septy Wedding//ID",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "SUMMARY:Pernikahan Alwi & Septy",
      "UID:wedding-alwi-septy-20261010@alwisepty.wedding",
      "DTSTAMP:20260906T000000Z",
      "DTSTART:20261010T010000Z",
      "DTEND:20261010T070000Z",
      "DESCRIPTION:Akad Nikah: 08.00 WIB\\nResepsi: 11.00 – 14.00 WIB\\n\\nSteikhaus (Area Pabrik Bajoe), Bandung",
      `LOCATION:${venue.name}, ${venue.address}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pernikahan-alwi-septy.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setCalendarMenuOpen(false);
  }

  // Tutup menu kalender saat klik di luar atau tombol Escape ditekan
  useEffect(() => {
    if (!calendarMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(target)
      ) {
        setCalendarMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCalendarMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [calendarMenuOpen]);

  return (
    <section
      id="acara"
      data-screen-label="Detail Acara"
      className="relative overflow-hidden bg-espresso text-warm-white"
    >
      {/* Sulur Ornamen — Ponsel (2 sudut) */}
      <svg
        className="pointer-events-none absolute top-0 left-0 h-[120px] w-[120px] opacity-50 lg:hidden"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="pointer-events-none absolute right-0 bottom-0 h-[120px] w-[120px] rotate-180 opacity-50 lg:hidden"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Sulur Ornamen — Desktop (4 sudut) */}
      <svg
        className="pointer-events-none absolute top-0 left-0 hidden h-[180px] w-[180px] opacity-45 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="pointer-events-none absolute top-0 right-0 hidden h-[180px] w-[180px] -scale-x-100 opacity-45 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="pointer-events-none absolute bottom-0 left-0 hidden h-[150px] w-[150px] -scale-y-100 opacity-35 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="pointer-events-none absolute right-0 bottom-0 hidden h-[150px] w-[150px] -scale-100 opacity-35 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Konten Utama */}
      <div className="relative z-10 flex flex-col gap-[30px] px-[26px] pt-[48px] pb-[52px] lg:gap-[48px] lg:px-[120px] lg:pt-[80px] lg:pb-[88px]">
        {/* Header Seksi */}
        <div className="flex flex-col items-center gap-[10px] lg:gap-[14px]">
          <svg className="h-[20px] w-[150px] lg:h-[24px] lg:w-[200px]" aria-hidden="true">
            <use href="#orn" />
          </svg>
          <h2 className="text-section-label lg:text-section-label-lg text-label-on-dark indent-[0.4em] lg:indent-[0.48em] text-center">
            Detail Acara
          </h2>
          <p className="font-body font-light text-[15px] leading-[1.6] text-label-on-dark text-center lg:text-[19px]">
            {eventSchedule.dayLabel}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* LAYOUT PONSEL (<1024px)                                                   */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-[26px] lg:hidden">
          {/* Bar Waktu: Akad & Resepsi Berdampingan */}
          <div className="grid grid-cols-[1fr_1px_1fr] items-start gap-[16px]">
            {/* Akad Nikah */}
            <div className="flex flex-col items-center gap-[9px] text-center">
              <svg className="h-[26px] w-[26px]" aria-hidden="true">
                <use href="#ico-cal" />
              </svg>
              <span className="text-label-small indent-[0.32em] tracking-[0.32em] text-label-on-dark">
                Akad Nikah
              </span>
              <span className="text-acara-time text-warm-white">
                {eventSchedule.akad.label}
              </span>
              <span className="text-acara-sub text-tertiary-on-dark">
                {eventSchedule.dayLabelShort}
              </span>
            </div>

            {/* Pemisah Vertikal Gradien Emas */}
            <span
              className="h-full min-h-[96px] bg-gradient-to-b from-[rgba(201,162,39,0)] via-[rgba(201,162,39,0.6)] to-[rgba(201,162,39,0)]"
              aria-hidden="true"
            />

            {/* Resepsi */}
            <div className="flex flex-col items-center gap-[9px] text-center">
              <svg className="h-[26px] w-[26px]" aria-hidden="true">
                <use href="#ico-rings" />
              </svg>
              <span className="text-label-small indent-[0.32em] tracking-[0.32em] text-label-on-dark">
                Resepsi
              </span>
              <span className="text-acara-time text-warm-white">
                {eventSchedule.resepsi.label}
              </span>
              <span className="text-acara-sub text-tertiary-on-dark">
                {eventSchedule.dayLabelShort}
              </span>
            </div>
          </div>

          {/* Pemisah Horizontal Gradien Emas */}
          <span
            className="h-[1px] w-full bg-gradient-to-r from-[rgba(201,162,39,0)] via-[rgba(201,162,39,0.55)] to-[rgba(201,162,39,0)]"
            aria-hidden="true"
          />

          {/* Blok Lokasi Ponsel */}
          <div className="flex flex-col items-center gap-[10px] text-center">
            <svg className="h-[26px] w-[26px]" aria-hidden="true">
              <use href="#ico-pin" />
            </svg>
            <span className="text-label-small indent-[0.32em] tracking-[0.32em] text-label-on-dark">
              Lokasi
            </span>
            <span className="text-acara-venue text-warm-white">
              {venue.nameOnly}
              <br />
              <span className="text-[0.78em] text-label-on-dark">{venue.subName}</span>
            </span>
            <p className="text-acara-address text-tertiary-on-dark max-w-[290px]">
              {venue.address}
            </p>

            {/* Peta Tersemat Ponsel */}
            <div
              className="relative mt-[6px] aspect-video w-full overflow-hidden border border-[rgba(201,162,39,0.45)] bg-[#2A1F15]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(118deg,rgba(201,162,39,.1) 0 8px,rgba(0,0,0,0) 8px 18px)",
              }}
            >
              <iframe
                title="Peta Lokasi Steikhaus Bandung"
                src={venue.mapsEmbedUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Tombol Aksi Ponsel */}
            <div ref={mobileMenuRef} className="relative mt-[8px] flex w-full flex-col gap-[9px]">
              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-acara-btn border border-gold-bright bg-gold-deep px-[18px] py-[14px] text-center text-on-photo indent-[0.3em] transition-colors duration-300 hover:bg-[#A07C28]"
              >
                Petunjuk Arah
              </a>
              <button
                type="button"
                aria-expanded={calendarMenuOpen}
                aria-haspopup="menu"
                onClick={() => setCalendarMenuOpen((prev) => !prev)}
                className="text-acara-btn cursor-pointer border border-[rgba(201,162,39,0.7)] bg-transparent px-[18px] py-[14px] text-center text-warm-white indent-[0.3em] transition-colors duration-300 hover:bg-[rgba(201,162,39,0.16)]"
              >
                Simpan ke Kalender
              </button>

              {/* Menu Pilihan Kalender Ponsel */}
              {calendarMenuOpen && (
                <div
                  role="menu"
                  className="border-gold-bright/60 bg-espresso/95 shadow-page absolute bottom-full left-0 z-30 mb-2 flex w-full flex-col gap-1 border p-2 backdrop-blur-md"
                >
                  <a
                    role="menuitem"
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setCalendarMenuOpen(false)}
                    className="text-acara-btn hover:bg-gold-deep/30 px-3 py-2.5 text-center text-warm-white transition-colors"
                  >
                    Google Calendar
                  </a>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleDownloadIcs}
                    className="text-acara-btn hover:bg-gold-deep/30 cursor-pointer px-3 py-2.5 text-center text-warm-white transition-colors"
                  >
                    Apple Calendar / Outlook (.ics)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LAYOUT DESKTOP (≥1024px)                                                  */}
        {/* ========================================================================= */}
        <div className="hidden flex-col gap-[48px] lg:flex">
          {/* Bar 3 Kolom: Akad Nikah | Resepsi | Lokasi */}
          <div className="grid w-full grid-cols-[1fr_1px_1fr_1px_1.25fr] items-start gap-[44px]">
            {/* Kolom 1: Akad Nikah */}
            <div className="flex flex-col items-center gap-[12px] text-center">
              <svg className="h-[34px] w-[34px]" aria-hidden="true">
                <use href="#ico-cal" />
              </svg>
              <span className="text-label-small-lg indent-[0.4em] tracking-[0.4em] text-label-on-dark">
                Akad Nikah
              </span>
              <span className="text-acara-time-lg text-warm-white">
                {eventSchedule.akad.label}
              </span>
              <span className="text-acara-sub-lg text-tertiary-on-dark">
                {eventSchedule.dayLabel}
              </span>
            </div>

            {/* Pemisah Vertikal 1 */}
            <span
              className="h-full min-h-[150px] bg-gradient-to-b from-[rgba(201,162,39,0)] via-[rgba(201,162,39,0.55)] to-[rgba(201,162,39,0)]"
              aria-hidden="true"
            />

            {/* Kolom 2: Resepsi */}
            <div className="flex flex-col items-center gap-[12px] text-center">
              <svg className="h-[34px] w-[34px]" aria-hidden="true">
                <use href="#ico-rings" />
              </svg>
              <span className="text-label-small-lg indent-[0.4em] tracking-[0.4em] text-label-on-dark">
                Resepsi
              </span>
              <span className="text-acara-time-lg text-warm-white">
                {eventSchedule.resepsi.label}
              </span>
              <span className="text-acara-sub-lg text-tertiary-on-dark">
                {eventSchedule.dayLabel}
              </span>
            </div>

            {/* Pemisah Vertikal 2 */}
            <span
              className="h-full min-h-[150px] bg-gradient-to-b from-[rgba(201,162,39,0)] via-[rgba(201,162,39,0.55)] to-[rgba(201,162,39,0)]"
              aria-hidden="true"
            />

            {/* Kolom 3: Lokasi */}
            <div className="flex flex-col items-center gap-[12px] text-center">
              <svg className="h-[34px] w-[34px]" aria-hidden="true">
                <use href="#ico-pin" />
              </svg>
              <span className="text-label-small-lg indent-[0.4em] tracking-[0.4em] text-label-on-dark">
                Lokasi
              </span>
              <span className="text-acara-venue-lg text-warm-white">
                {venue.nameOnly}{" "}
                <span className="text-[0.68em] text-label-on-dark">{venue.subName}</span>
              </span>
              <p className="text-acara-address-lg text-tertiary-on-dark max-w-[330px]">
                {venue.address}
              </p>

              {/* Tombol Aksi Desktop (Berdampingan) */}
              <div ref={desktopMenuRef} className="relative mt-[6px] flex gap-[10px]">
                <a
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-acara-btn border border-gold-bright bg-gold-deep px-[20px] py-[14px] text-center text-on-photo indent-[0.3em] transition-colors duration-300 hover:bg-[#A07C28]"
                >
                  Petunjuk Arah
                </a>
                <button
                  type="button"
                  aria-expanded={calendarMenuOpen}
                  aria-haspopup="menu"
                  onClick={() => setCalendarMenuOpen((prev) => !prev)}
                  className="text-acara-btn cursor-pointer border border-[rgba(201,162,39,0.7)] bg-transparent px-[20px] py-[14px] text-center text-warm-white indent-[0.3em] transition-colors duration-300 hover:bg-[rgba(201,162,39,0.16)]"
                >
                  Simpan ke Kalender
                </button>

                {/* Menu Pilihan Kalender Desktop */}
                {calendarMenuOpen && (
                  <div
                    role="menu"
                    className="border-gold-bright/60 bg-espresso/95 shadow-page absolute top-full right-0 z-30 mt-2 flex w-[240px] flex-col gap-1 border p-2 backdrop-blur-md"
                  >
                    <a
                      role="menuitem"
                      href={googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setCalendarMenuOpen(false)}
                      className="text-acara-btn hover:bg-gold-deep/30 px-3 py-2.5 text-center text-warm-white transition-colors"
                    >
                      Google Calendar
                    </a>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleDownloadIcs}
                      className="text-acara-btn hover:bg-gold-deep/30 cursor-pointer px-3 py-2.5 text-center text-warm-white transition-colors"
                    >
                      Apple Calendar / Outlook (.ics)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Peta Tersemat Desktop Selebar Kontainer */}
          <div
            className="relative h-[280px] w-full overflow-hidden border border-[rgba(201,162,39,0.45)] bg-[#2A1F15]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(118deg,rgba(201,162,39,.09) 0 10px,rgba(0,0,0,0) 10px 22px)",
            }}
          >
            <iframe
              title="Peta Lokasi Steikhaus Bandung"
              src={venue.mapsEmbedUrl}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
