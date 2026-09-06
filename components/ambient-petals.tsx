"use client";

import { useSyncExternalStore } from "react";

interface PetalSpec {
  id: number;
  left: number; // 0 - 100%
  size: number; // px
  duration: number; // s
  delay: number; // s
  driftX: number; // px
  rot: number; // deg
  opacity: number;
  type: "petal" | "sparkle";
}

// 14 partikel unik yang terdistribusi harmonis dan tidak berdesakan
const PETAL_SPECS: PetalSpec[] = [
  { id: 1, left: 8, size: 14, duration: 13, delay: 0, driftX: 35, rot: 340, opacity: 0.55, type: "petal" },
  { id: 2, left: 22, size: 6, duration: 11, delay: 3, driftX: -25, rot: 180, opacity: 0.7, type: "sparkle" },
  { id: 3, left: 35, size: 17, duration: 16, delay: 1, driftX: 45, rot: 420, opacity: 0.5, type: "petal" },
  { id: 4, left: 48, size: 5, duration: 12, delay: 5, driftX: -20, rot: 120, opacity: 0.65, type: "sparkle" },
  { id: 5, left: 62, size: 15, duration: 14, delay: 2, driftX: -40, rot: 280, opacity: 0.6, type: "petal" },
  { id: 6, left: 74, size: 7, duration: 10, delay: 4, driftX: 30, rot: 200, opacity: 0.75, type: "sparkle" },
  { id: 7, left: 88, size: 16, duration: 15, delay: 0.5, driftX: -35, rot: 360, opacity: 0.5, type: "petal" },
  { id: 8, left: 15, size: 12, duration: 12, delay: 6, driftX: 25, rot: 250, opacity: 0.45, type: "petal" },
  { id: 9, left: 28, size: 5, duration: 9, delay: 7, driftX: -15, rot: 90, opacity: 0.6, type: "sparkle" },
  { id: 10, left: 54, size: 13, duration: 14, delay: 8, driftX: 30, rot: 310, opacity: 0.5, type: "petal" },
  { id: 11, left: 68, size: 6, duration: 11, delay: 6.5, driftX: 20, rot: 160, opacity: 0.65, type: "sparkle" },
  { id: 12, left: 82, size: 18, duration: 17, delay: 4.5, driftX: -50, rot: 390, opacity: 0.45, type: "petal" },
  { id: 13, left: 93, size: 5, duration: 10, delay: 8.5, driftX: 15, rot: 110, opacity: 0.7, type: "sparkle" },
  { id: 14, left: 42, size: 13, duration: 13, delay: 9.5, driftX: -30, rot: 290, opacity: 0.5, type: "petal" },
];

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * AmbientPetals:
 * Partikel kelopak melati putih & stardust emas yang melayang lembut ke bawah.
 * Menguatkan nuansa romantis khas pernikahan adat Sunda tanpa mengganggu keterbacaan teks.
 */
export function AmbientPetals() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none"
      aria-hidden="true"
    >
      {PETAL_SPECS.map((spec) => (
        <span
          key={spec.id}
          className="absolute block"
          style={
            {
              left: `${spec.left}%`,
              top: 0,
              width: `${spec.size}px`,
              height: `${spec.size}px`,
              animationName: "petal-fall",
              animationDuration: `${spec.duration}s`,
              animationDelay: `${spec.delay}s`,
              animationTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              animationIterationCount: "infinite",
              "--drift-x": `${spec.driftX}px`,
              "--rot": `${spec.rot}deg`,
              "--petal-opacity": spec.opacity,
            } as React.CSSProperties
          }
        >
          {spec.type === "petal" ? (
            /* Siluet Kelopak Melati Lembut */
            <svg
              viewBox="0 0 24 24"
              className="h-full w-full drop-shadow-[0_2px_4px_rgba(40,26,14,0.15)]"
              fill="none"
            >
              <path
                d="M12 2C7 6 3 13 4 18C5 21 8 22 12 22C16 22 19 21 20 18C21 13 17 6 12 2Z"
                fill="#FFFDF9"
                stroke="#C9A227"
                strokeWidth="0.4"
                strokeOpacity="0.4"
              />
              <path
                d="M12 4C12 9 12 16 12 20"
                stroke="#C9A227"
                strokeWidth="0.3"
                strokeOpacity="0.3"
              />
            </svg>
          ) : (
            /* Kilau Debu Emas / Stardust */
            <svg
              viewBox="0 0 16 16"
              className="h-full w-full drop-shadow-[0_0_6px_rgba(201,162,39,0.8)]"
              fill="none"
            >
              <circle cx="8" cy="8" r="3" fill="#C9A227" opacity="0.9" />
              <circle cx="8" cy="8" r="6" stroke="#C9A227" strokeWidth="0.5" opacity="0.4" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}
