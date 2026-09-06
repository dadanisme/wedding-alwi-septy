"use client";

import { useState } from "react";
import {
  guestBookConfig,
  guestBookInitialEntries,
  type GuestBookEntry,
} from "@/lib/event-config";

interface BukuTamuProps {
  guestName?: string;
}

/**
 * Seksi 9: Buku Tamu
 * Ditranskrip dari mockup yang diapprove mempelai (docs/mockup/Undangan Alwi & Septy.html, seksi 9).
 * Menampilkan:
 * 1. Judul seksi "BUKU TAMU" dengan ornamen emas (#orn)
 * 2. Formulir ucapan: input nama (default ke guestName jika tersedia) & textarea pesan/doa
 * 3. Tombol submit "Kirim Ucapan"
 * 4. Daftar ucapan terbaru dengan atribusi nama, penanda waktu, dan isi doa
 * 5. Ornamen sulur di sudut bawah (1 di ponsel, 2 di desktop)
 */
export function BukuTamu({ guestName = "" }: BukuTamuProps) {
  const [name, setName] = useState(guestName);
  const [msg, setMsg] = useState("");
  const [entries, setEntries] = useState<GuestBookEntry[]>(
    () => [...guestBookInitialEntries]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMsg = msg.trim();

    if (!trimmedName || !trimmedMsg) return;

    const newEntry: GuestBookEntry = {
      name: trimmedName,
      when: "Baru saja",
      msg: trimmedMsg,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setMsg("");
  };

  return (
    <section
      id="buku-tamu"
      aria-labelledby="buku-tamu-title"
      className="relative overflow-hidden border-t border-gold-bright/35 bg-cream-secondary"
    >
      {/* Ornamen sulur pojok kiri bawah (khusus ponsel) */}
      <svg
        className="pointer-events-none absolute -bottom-[12px] -left-[18px] h-[110px] w-[110px] -scale-y-100 opacity-40 lg:hidden"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Ornamen sulur kiri & kanan bawah (khusus desktop) */}
      <svg
        className="pointer-events-none absolute -bottom-[16px] -left-[10px] hidden h-[170px] w-[170px] -scale-y-100 opacity-34 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="pointer-events-none absolute -bottom-[16px] -right-[10px] hidden h-[170px] w-[170px] -scale-x-100 -scale-y-100 opacity-34 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Konten Seksi */}
      <div className="relative flex flex-col gap-[22px] px-[30px] pt-[52px] pb-[56px] lg:items-center lg:gap-[34px] lg:px-[40px] lg:pt-[88px] lg:pb-[96px]">
        {/* Header Seksi */}
        <div className="flex flex-col items-center gap-[10px] lg:gap-[14px]">
          <svg
            className="h-[18px] w-[140px] opacity-85 lg:h-[24px] lg:w-[200px]"
            aria-hidden="true"
          >
            <use href="#orn" />
          </svg>
          <h2
            id="buku-tamu-title"
            className="text-section-label lg:text-section-label-lg indent-[0.4em] text-ink-soft lg:indent-[0.48em]"
          >
            {guestBookConfig.title}
          </h2>
        </div>

        {/* Formulir Buku Tamu */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-[14px] lg:max-w-[560px] lg:gap-[16px]"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={guestBookConfig.namePlaceholder}
            aria-label={guestBookConfig.namePlaceholder}
            required
            className="border-0 border-b border-gold-bright/75 bg-transparent p-[11px_2px] text-buku-input text-ink outline-none transition-colors placeholder:text-ink-soft/40 focus:border-gold-deep lg:p-[12px_2px] lg:text-buku-input-lg"
          />

          <textarea
            rows={3}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={guestBookConfig.messagePlaceholder}
            aria-label={guestBookConfig.messagePlaceholder}
            maxLength={guestBookConfig.maxMessageLength}
            required
            className="border border-gold-bright/65 bg-white/50 p-[12px] text-buku-textarea text-ink outline-none transition-colors resize-y placeholder:text-ink-soft/40 focus:border-gold-deep lg:p-[14px] lg:text-buku-textarea-lg"
          />

          <button
            type="submit"
            className="cursor-pointer border border-gold-deep bg-transparent p-[15px] text-buku-btn tracking-[0.32em] text-ink uppercase indent-[0.32em] transition-colors duration-300 hover:bg-gold-deep hover:text-on-photo lg:self-center lg:p-[16px_40px] lg:text-buku-btn-lg lg:tracking-[0.36em] lg:indent-[0.36em]"
          >
            {guestBookConfig.submitButtonLabel}
          </button>
        </form>

        {/* Daftar Ucapan */}
        <div className="flex w-full flex-col gap-0 lg:max-w-[720px]">
          {entries.map((entry, index) => (
            <div
              key={`${entry.name}-${index}`}
              className="border-t border-gold-bright/40 py-[18px] lg:py-[22px]"
            >
              <div className="flex items-baseline justify-between gap-[10px] lg:gap-[14px]">
                <span className="text-buku-name lg:text-buku-name-lg text-ink">
                  {entry.name}
                </span>
                <span className="text-buku-when lg:text-buku-when-lg text-ink-soft shrink-0">
                  {entry.when}
                </span>
              </div>
              <p className="mt-[6px] text-buku-msg text-ink-soft text-pretty lg:mt-[7px] lg:max-w-[620px] lg:text-buku-msg-lg">
                {entry.msg}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
