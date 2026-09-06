"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type RevealAnimation =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-in"
  | "zoom-in"
  | "blur-in";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: RevealAnimation;
  delay?: number; // ms
  duration?: number; // ms
  className?: string;
  threshold?: number;
  /** Bila true, animasi langsung visible tanpa menunggu scroll (misal untuk cover) */
  immediate?: boolean;
}

/**
 * Komponen ScrollReveal:
 * Menampilkan elemen secara sinematik dan anggun saat digulir ke dalam viewport.
 * Memakai IntersectionObserver dan transform/opacity untuk performa 60fps tanpa beban runtime eksternal.
 */
export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 900,
  className = "",
  threshold = 0.15,
  immediate = false,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(immediate);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (immediate) return;

    // Hormati preferensi aksesibilitas pengguna
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const rafId = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(rafId);
    }

    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, immediate]);

  // Gaya awal berdasarkan jenis animasi
  const getInitialStyle = (): { transform?: string; filter?: string; opacity: number } => {
    if (isVisible) {
      return {
        opacity: 1,
        transform: "none",
        filter: "none",
      };
    }

    switch (animation) {
      case "fade-up":
        return { opacity: 0, transform: "translate3d(0, 26px, 0)" };
      case "fade-down":
        return { opacity: 0, transform: "translate3d(0, -26px, 0)" };
      case "fade-left":
        return { opacity: 0, transform: "translate3d(32px, 0, 0)" };
      case "fade-right":
        return { opacity: 0, transform: "translate3d(-32px, 0, 0)" };
      case "zoom-in":
        return { opacity: 0, transform: "scale3d(0.93, 0.93, 1)" };
      case "blur-in":
        return { opacity: 0, transform: "translate3d(0, 14px, 0)", filter: "blur(6px)" };
      case "fade-in":
      default:
        return { opacity: 0 };
    }
  };

  const initial = getInitialStyle();

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...initial,
        transitionProperty: "opacity, transform, filter",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
