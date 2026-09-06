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
        className={`group relative flex h-12 w-12 items-center justify-center rounded-full border border-gold-bright/70 bg-espresso/90 backdrop-blur-md transition-all duration-500 hover:scale-110 active:scale-95 cursor-pointer lg:h-14 lg:w-14 ${
          isPlaying
            ? "shadow-[0_0_22px_rgba(201,162,39,0.45)] border-gold-bright"
            : "shadow-lg shadow-black/50"
        }`}
      >
        {/* Lingkaran alur piringan hitam / vinyl berputar saat lagu aktif */}
        <span
          className={`absolute inset-[-4px] rounded-full border border-dashed border-gold-bright/40 transition-opacity duration-700 ${
            isPlaying ? "opacity-100 animate-spin-vinyl" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {/* Aura gelombang denyut luar (beacon) */}
        <span
          className={`absolute inset-0 rounded-full border border-gold-bright/50 transition-opacity duration-500 ${
            isPlaying ? "opacity-100 animate-beacon" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {isPlaying ? (
          /* Equalizer Gelombang Suara Berdansa (4 bar vertical) */
          <div
            className="flex items-end justify-center gap-[3px] h-[18px] w-[20px]"
            aria-hidden="true"
          >
            <span
              className="w-[2.5px] rounded-full bg-gold-bright"
              style={{
                animation: "soundwave-1 1s ease-in-out infinite alternate",
              }}
            />
            <span
              className="w-[2.5px] rounded-full bg-gold-bright"
              style={{
                animation: "soundwave-2 0.8s ease-in-out infinite alternate 0.15s",
              }}
            />
            <span
              className="w-[2.5px] rounded-full bg-gold-bright"
              style={{
                animation: "soundwave-3 1.1s ease-in-out infinite alternate 0.3s",
              }}
            />
            <span
              className="w-[2.5px] rounded-full bg-gold-bright"
              style={{
                animation: "soundwave-4 0.9s ease-in-out infinite alternate 0.2s",
              }}
            />
          </div>
        ) : (
          /* Speaker terjeda dengan garis silang tenang */
          <svg
            className="h-5 w-5 text-gold-bright/70 transition-transform duration-300 group-hover:scale-110 lg:h-6 lg:w-6"
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
            {/* Garis silang jeda */}
            <line x1="22" y1="2" x2="2" y2="22" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
      </button>
    </div>
  );
}

