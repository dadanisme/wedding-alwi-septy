"use client";

import { useState, useEffect } from "react";
import { giftConfig } from "@/lib/event-config";
import { ScrollReveal } from "@/components/scroll-reveal";

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
      {/* Header seksi */}
      <ScrollReveal animation="fade-down" delay={100} className="flex flex-col items-center gap-[14px]">
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
      </ScrollReveal>

      {/* Kartu informasi rekening */}
      <ScrollReveal animation="zoom-in" delay={250} className="w-full max-w-[520px]">
        <div className="w-full border-y border-gold-bright/55 py-[20px] lg:py-[28px] px-1 flex flex-col items-center gap-[7px] lg:gap-[9px] transition-all duration-500 hover:shadow-[0_0_25px_rgba(201,162,39,0.25)]">
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
            className="group relative mt-2 lg:mt-[10px] border border-gold-deep bg-transparent text-ink hover:bg-gold-deep hover:text-on-photo text-hadiah-btn lg:text-hadiah-btn-lg py-[12px] px-[22px] lg:py-[13px] lg:px-[30px] indent-[0.3em] lg:indent-[0.34em] transition-all duration-300 hover:scale-[1.03] active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:outline-none flex items-center justify-center gap-2"
          >
            {copied ? (
              <span className="flex items-center gap-1.5 animate-fade-in text-gold-deep group-hover:text-on-photo">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 stroke-current fill-none stroke-2"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{giftConfig.copiedButtonLabel}</span>
              </span>
            ) : (
              <span>{giftConfig.copyButtonLabel}</span>
            )}
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
