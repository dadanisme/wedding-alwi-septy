import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan — Undangan Pernikahan Alwi & Septy",
  description: "Tautan undangan yang Anda tuju tidak tersedia atau tidak valid.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Halaman 404 generik sesuai PRD §4.1:
 * "Link tidak valid: Menampilkan halaman 'tidak ditemukan' yang generik, tanpa membocorkan apakah link pernah ada."
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-cream px-6 py-12 text-center">
      {/* Latar damask botani melati berulang */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-6"
        aria-hidden="true"
      >
        <rect width="100%" height="100%" fill="url(#damaskPat)" />
      </svg>

      <div className="relative z-10 flex max-w-[480px] flex-col items-center gap-4">
        {/* Ornamen pemisah */}
        <svg
          className="h-[18px] w-[140px] opacity-85 lg:h-[22px] lg:w-[180px]"
          aria-hidden="true"
        >
          <use href="#orn" />
        </svg>

        <span className="text-[11px] font-semibold uppercase tracking-[0.45em] text-ink-soft indent-[0.45em]">
          404 · Tidak Ditemukan
        </span>

        <h1 className="font-display text-3xl font-light text-ink lg:text-4xl">
          Tautan Tidak Valid
        </h1>

        <p className="font-body text-[16px] leading-relaxed text-ink-soft lg:text-[18px]">
          Tautan undangan yang Anda tuju tidak tersedia atau tidak valid. Silakan
          periksa kembali tautan pribadi yang Anda terima dari kedua mempelai.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-bright lg:w-12" />
          <span className="text-[12px] tracking-[0.3em] text-gold-deep uppercase indent-[0.3em]">
            Alwi &amp; Septy
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-bright lg:w-12" />
        </div>
      </div>
    </main>
  );
}
