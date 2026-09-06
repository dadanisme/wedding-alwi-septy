/**
 * Sistem ornamen — digambar khusus untuk proyek ini sebagai SVG inline
 * (bukan aset raster/vektor stok), hak milik klien. Diporting persis dari
 * mockup yang sudah diapprove (Undangan Alwi & Septy.html).
 *
 * Pakai: taruh <OrnamentDefs /> sekali (mis. di root layout), lalu di mana
 * pun referensikan lewat <svg><use href="#sulur" /></svg> dst.
 *
 * Simbol tersedia: sulur, spray, orn, wave, ico-cal, ico-rings, ico-pin,
 * plus pattern damaskPat untuk tekstur latar krem opasitas rendah.
 */
export function OrnamentDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute", overflow: "hidden" }}>
      <defs>
        <g id="leafShape">
          <path d="M0 0 C 9 -11 24 -12 34 -1 C 24 11 9 11 0 0 Z" fill="none" stroke="#C9A227" strokeWidth="1.1" />
          <path d="M2 0 L 30 -1" fill="none" stroke="#C9A227" strokeWidth="0.7" opacity="0.75" />
        </g>
        <g id="leafSolid">
          <path d="M0 0 C 8 -10 21 -10 30 0 C 21 9 8 9 0 0 Z" fill="#8A6A22" opacity="0.85" />
        </g>
        <g id="jasmine">
          <circle cx="0" cy="-7" r="3.3" fill="none" stroke="#C9A227" strokeWidth="1" />
          <circle cx="6.7" cy="-2.2" r="3.3" fill="none" stroke="#C9A227" strokeWidth="1" />
          <circle cx="4.1" cy="5.7" r="3.3" fill="none" stroke="#C9A227" strokeWidth="1" />
          <circle cx="-4.1" cy="5.7" r="3.3" fill="none" stroke="#C9A227" strokeWidth="1" />
          <circle cx="-6.7" cy="-2.2" r="3.3" fill="none" stroke="#C9A227" strokeWidth="1" />
          <circle cx="0" cy="0" r="1.6" fill="#8A6A22" />
        </g>
        <g id="padi">
          <path d="M0 0 C 6 -14 10 -26 10 -38" fill="none" stroke="#C9A227" strokeWidth="1" />
          <g fill="#8A6A22" opacity="0.8">
            <ellipse cx="4" cy="-9" rx="2" ry="3.6" transform="rotate(24 4 -9)" />
            <ellipse cx="6.4" cy="-17" rx="2" ry="3.6" transform="rotate(20 6.4 -17)" />
            <ellipse cx="8.4" cy="-25" rx="2" ry="3.6" transform="rotate(14 8.4 -25)" />
            <ellipse cx="9.6" cy="-33" rx="1.8" ry="3.2" transform="rotate(8 9.6 -33)" />
          </g>
        </g>

        <pattern id="damaskPat" width="150" height="150" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#8A6A22" strokeWidth="1.15">
            <circle cx="75" cy="75" r="5.5" />
            <path d="M75 69 C 62 46 62 28 75 10 C 88 28 88 46 75 69 Z" />
            <path d="M75 81 C 62 104 62 122 75 140 C 88 122 88 104 75 81 Z" />
            <path d="M69 75 C 46 62 28 62 10 75 C 28 88 46 88 69 75 Z" />
            <path d="M81 75 C 104 62 122 62 140 75 C 122 88 104 88 81 75 Z" />
            <path d="M96 54 C 108 42 118 38 126 38 C 126 47 121 57 108 66" opacity="0.75" />
            <path d="M54 96 C 42 108 38 118 38 126 C 47 126 57 121 66 108" opacity="0.75" />
            <circle cx="0" cy="0" r="4" />
            <circle cx="150" cy="0" r="4" />
            <circle cx="0" cy="150" r="4" />
            <circle cx="150" cy="150" r="4" />
          </g>
        </pattern>

        <symbol id="sulur" viewBox="0 0 170 170">
          <path d="M4 4 C 34 26 52 52 62 84 C 70 110 68 138 60 166" fill="none" stroke="#C9A227" strokeWidth="1.3" />
          <path d="M8 10 C 40 18 74 30 104 48 C 132 65 150 84 164 108" fill="none" stroke="#C9A227" strokeWidth="1" />
          <path d="M30 24 C 44 40 46 56 40 74" fill="none" stroke="#C9A227" strokeWidth="0.8" opacity="0.8" />
          <use href="#leafShape" transform="translate(44,44) rotate(38) scale(0.95)" />
          <use href="#leafShape" transform="translate(58,88) rotate(72) scale(0.8)" />
          <use href="#leafShape" transform="translate(78,36) rotate(8) scale(0.85)" />
          <use href="#leafShape" transform="translate(112,62) rotate(24) scale(0.7)" />
          <use href="#leafSolid" transform="translate(36,66) rotate(112) scale(0.55)" />
          <use href="#leafSolid" transform="translate(96,50) rotate(-16) scale(0.5)" />
          <use href="#jasmine" transform="translate(24,20) scale(1.05)" />
          <use href="#jasmine" transform="translate(66,116) scale(0.85)" />
          <use href="#padi" transform="translate(130,96) rotate(-12) scale(0.9)" />
          <g stroke="#C9A227" strokeWidth="0.9" fill="none" opacity="0.7">
            <path d="M146 132 L 146 168" />
            <path d="M158 140 L 158 168" />
            <path d="M141 146 L 151 146 M141 158 L 151 158 M153 152 L 163 152" />
          </g>
        </symbol>

        <symbol id="spray" viewBox="0 0 130 64">
          <path d="M128 32 C 100 28 76 20 52 8" fill="none" stroke="#C9A227" strokeWidth="1.1" />
          <path d="M128 32 C 102 38 78 48 58 60" fill="none" stroke="#C9A227" strokeWidth="1.1" />
          <path d="M128 32 C 104 32 80 32 56 33" fill="none" stroke="#C9A227" strokeWidth="0.85" opacity="0.8" />
          <use href="#leafShape" transform="translate(94,24) rotate(-24) scale(0.8)" />
          <use href="#leafShape" transform="translate(94,42) rotate(24) scale(0.8)" />
          <use href="#leafSolid" transform="translate(70,16) rotate(-32) scale(0.62)" />
          <use href="#leafSolid" transform="translate(70,50) rotate(32) scale(0.62)" />
          <use href="#leafShape" transform="translate(64,33) rotate(0) scale(0.62)" />
          <use href="#jasmine" transform="translate(46,10) scale(0.85)" />
          <use href="#jasmine" transform="translate(50,58) scale(0.75)" />
        </symbol>

        <symbol id="orn" viewBox="0 0 200 26">
          <g fill="none" stroke="#C9A227" strokeWidth="1.1">
            <path d="M4 13 L 66 13" />
            <path d="M134 13 L 196 13" />
            <path d="M100 4 L 109 13 L 100 22 L 91 13 Z" />
            <path d="M78 13 C 84 7 84 19 78 13" />
            <path d="M122 13 C 116 7 116 19 122 13" />
          </g>
          <circle cx="100" cy="13" r="2.2" fill="#8A6A22" />
          <circle cx="70" cy="13" r="1.6" fill="#8A6A22" />
          <circle cx="130" cy="13" r="1.6" fill="#8A6A22" />
        </symbol>

        <symbol id="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0 120 L0 64 C 190 6 330 104 520 74 C 700 46 800 6 980 40 C 1140 70 1290 106 1440 58 L1440 120 Z"
            fill="#F7EFE1"
          />
          <path
            d="M0 64 C 190 6 330 104 520 74 C 700 46 800 6 980 40 C 1140 70 1290 106 1440 58"
            fill="none"
            stroke="#C9A227"
            strokeWidth="1.6"
            opacity="0.55"
          />
        </symbol>

        <symbol id="ico-cal" viewBox="0 0 24 24">
          <g fill="none" stroke="#C9A227" strokeWidth="1.2">
            <rect x="3" y="5.5" width="18" height="15" rx="1.5" />
            <path d="M3 10.5 H21 M7.5 3 V7 M16.5 3 V7" />
            <path d="M7 14.5 H9 M11 14.5 H13 M15 14.5 H17 M7 17.5 H9 M11 17.5 H13" />
          </g>
        </symbol>
        <symbol id="ico-rings" viewBox="0 0 24 24">
          <g fill="none" stroke="#C9A227" strokeWidth="1.2">
            <circle cx="9" cy="15" r="6" />
            <circle cx="15.5" cy="15" r="6" />
            <path d="M12.2 5.5 L 9.4 9 H15 Z" />
          </g>
        </symbol>
        <symbol id="ico-pin" viewBox="0 0 24 24">
          <g fill="none" stroke="#C9A227" strokeWidth="1.2">
            <path d="M12 21.5 C 12 21.5 19 14.6 19 9.6 A 7 7 0 0 0 5 9.6 C 5 14.6 12 21.5 12 21.5 Z" />
            <circle cx="12" cy="9.6" r="2.6" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}
