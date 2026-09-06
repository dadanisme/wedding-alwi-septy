"use client";

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  isVisible: boolean;
}

/**
 * Tombol mengambang (floating) untuk kontrol musik latar.
 * Muncul setelah undangan dibuka (PRD §4.2 & §7.3).
 * Menyesuaikan tata letak ponsel, desktop, dan ultrawide (>1440px).
 */
export function MusicPlayer({ isPlaying, onToggle, isVisible }: MusicPlayerProps) {
  return (
    <div
      className={`fixed bottom-5 right-5 z-40 lg:bottom-8 lg:right-8 min-[1441px]:right-[calc((100vw-1440px)/2+2rem)] transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? "Matikan musik latar" : "Putar musik latar"}
        title={isPlaying ? "Matikan musik latar (Sabilulungan)" : "Putar musik latar (Sabilulungan)"}
        className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-gold-bright/70 bg-espresso/85 shadow-lg shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-gold-bright active:scale-95 cursor-pointer lg:h-12 lg:w-12"
      >
        {/* Lingkaran aksen ornamen halus */}
        <span
          className={`absolute inset-[-3px] rounded-full border border-gold-bright/25 transition-opacity duration-500 ${
            isPlaying ? "opacity-100 animate-pulse" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {isPlaying ? (
          /* Speaker aktif dengan gelombang suara */
          <svg
            className="h-5 w-5 text-gold-bright transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Badan speaker */}
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {/* Gelombang suara 1 */}
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            {/* Gelombang suara 2 */}
            <path d="M19 5a9.5 9.5 0 0 1 0 14" />
          </svg>
        ) : (
          /* Speaker mati / terjeda dengan garis silang */
          <svg
            className="h-5 w-5 text-gold-bright/70 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Badan speaker */}
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {/* Garis silang mati */}
            <line x1="22" y1="2" x2="2" y2="22" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
      </button>
    </div>
  );
}
