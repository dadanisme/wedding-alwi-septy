"use client";

import { useState, useEffect } from "react";
import { giftConfig } from "@/lib/event-config";

/**
 * Seksi 10 · Hadiah (Tanda Kasih).
 * Ditranskrip persis dari mockup yang diapprove mempelai
 * (docs/mockup/Undangan Alwi & Septy.html, seksi 10).
 *
 * Menampilkan informasi rekening statis dengan tombol salin
 * nomor rekening dan umpan balik visual (PRD §4.8).
 */
export function Hadiah() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => {
      setCopied(false);
    }, giftConfig.feedbackDurationMs);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(giftConfig.account.accountNumber);
      } else if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = giftConfig.account.accountNumber;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
    } catch {
      // Jika clipboard API diblokir browser, fallback tetap aktifkan state
      setCopied(true);
    }
  };

  return (
    <section
      id="hadiah"
      aria-label="Tanda Kasih dan Hadiah"
      className="bg-cream py-[52px] px-[30px] pb-[56px] lg:py-[88px] lg:px-[40px] lg:pb-[96px] flex flex-col items-center gap-[18px] lg:gap-[22px]"
    >
      {/* Ornamen atas */}
      <svg
        className="w-[110px] h-[16px] lg:w-[160px] lg:h-[20px] opacity-85 text-gold-deep"
        aria-hidden="true"
      >
        <use href="#orn" />
      </svg>

      {/* Judul seksi */}
      <h2 className="text-hadiah-title lg:text-hadiah-title-lg text-ink-soft text-center indent-[0.4em] lg:indent-[0.48em] m-0">
        {giftConfig.title}
      </h2>

      {/* Kalimat pengantar santun */}
      <p className="text-hadiah-desc lg:text-hadiah-desc-lg text-ink-soft text-center max-w-[290px] lg:max-w-[560px] text-pretty m-0">
        {giftConfig.description}
      </p>

      {/* Kartu informasi rekening */}
      <div className="w-full max-w-[520px] border-y border-gold-bright/55 py-[20px] lg:py-[28px] px-1 flex flex-col items-center gap-[7px] lg:gap-[9px]">
        <span className="text-hadiah-bank lg:text-hadiah-bank-lg text-ink-soft">
          {giftConfig.account.bankDisplay}
        </span>
        <span className="text-hadiah-account lg:text-hadiah-account-lg text-ink select-all">
          {giftConfig.account.accountNumber}
        </span>
        <span className="text-hadiah-holder lg:text-hadiah-holder-lg text-ink-soft">
          {giftConfig.account.accountHolderDisplay}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-live="polite"
          className="mt-2 lg:mt-[10px] border border-gold-deep bg-transparent text-ink hover:bg-gold-deep hover:text-on-photo text-hadiah-btn lg:text-hadiah-btn-lg py-[12px] px-[22px] lg:py-[13px] lg:px-[30px] indent-[0.3em] lg:indent-[0.34em] transition-colors duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:outline-none"
        >
          {copied ? giftConfig.copiedButtonLabel : giftConfig.copyButtonLabel}
        </button>
      </div>
    </section>
  );
}
