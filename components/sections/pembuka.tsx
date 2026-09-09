"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { openingGreeting, openingPhotos } from "@/lib/event-config";
import { ScrollReveal } from "@/components/scroll-reveal";

/**
 * Seksi Pembuka — salam pembuka & kalimat pengantar di atas foto adat Sunda
 * bernuansa gelap, di antara Ayat dan Mempelai. Diporting dari mockup yang
 * diapprove (docs/mockup/Undangan Alwi & Septy.html, seksi 3 · PEMBUKA).
 *
 * Menggunakan efek Parallax Scroll GPU-accelerated yang mulus pada foto latar,
 * meluncur anggun di balik bingkai pembatas bergelombang (wave divider)
 * tanpa membebani render React.
 */
export function Pembuka() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Hormati preferensi aksesibilitas jika pengguna memilih reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    let isVisible = false;
    let rafId: number | null = null;

    const updateParallax = () => {
      if (!isVisible) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Jarak titik tengah seksi terhadap pusat viewport
      const sectionCenter = rect.top + rect.height / 2;
      const screenCenter = viewportHeight / 2;
      const distanceFromCenter = sectionCenter - screenCenter;

      // Kecepatan paralaks 0.18x memberikan ilusi kedalaman 3D yang megah & tenang
      const offset = distanceFromCenter * 0.18;
      const transformValue = `translate3d(0, ${offset.toFixed(1)}px, 0)`;

      if (photoRef.current) {
        photoRef.current.style.transform = transformValue;
      }
    };

    const handleScroll = () => {
      if (!isVisible) return;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateParallax();
          rafId = null;
        });
      }
    };

    // IntersectionObserver: Hanya aktifkan komputasi scroll saat seksi berada di dekat layar
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          updateParallax();
        }
      },
      { rootMargin: "150px 0px 150px 0px" }
    );

    observer.observe(section);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    updateParallax();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pembuka"
      className="relative flex min-h-[620px] flex-col justify-end overflow-hidden bg-espresso lg:min-h-[660px]"
    >
      {/* Latar Parallax Foto */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          ref={photoRef}
          className="absolute -top-[70px] -bottom-[70px] inset-x-0 will-change-transform lg:-top-[90px] lg:-bottom-[90px]"
        >
          <Image
            src={openingPhotos.landscape}
            alt="Alwi & Septy — busana adat Sunda"
            fill
            sizes="(min-width: 1440px) 1440px, 100vw"
            className="object-cover object-[center_20%] animate-ken-burns"
          />
        </div>
        <div className="absolute inset-0 bg-pembuka-scrim pointer-events-none lg:bg-pembuka-scrim-lg" />
      </div>

      {/* Pembatas Wave Atas */}
      <svg
        className="pointer-events-none absolute top-[-1px] left-0 z-10 block h-[66px] w-full -scale-y-100 lg:h-[110px]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        aria-hidden="true"
      >
        <use href="#wave" width="1440" height="120" />
      </svg>

      {/* Pembatas Wave Bawah */}
      <svg
        className="pointer-events-none absolute bottom-[-1px] left-0 z-10 block h-[66px] w-full lg:h-[110px]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        aria-hidden="true"
      >
        <use href="#wave" width="1440" height="120" />
      </svg>

      {/* Sulur Ornamen Sudut Bawah */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-[126px] w-[126px] -scale-y-100 opacity-80 transition-transform duration-1000 lg:h-[180px] lg:w-[180px] lg:opacity-75"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="pointer-events-none absolute right-0 bottom-0 z-10 h-[126px] w-[126px] -scale-100 opacity-80 transition-transform duration-1000 lg:h-[180px] lg:w-[180px] lg:opacity-75"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Konten Teks Salam Pembuka */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-8 pb-[84px] lg:gap-5 lg:px-10 lg:pb-32">
        <ScrollReveal animation="fade-down" delay={100}>
          <span className="text-label-small lg:text-label-small-lg text-label-on-dark indent-[0.44em] lg:indent-[0.5em]">
            {openingGreeting.bismillah}
          </span>
        </ScrollReveal>

        <ScrollReveal animation="blur-in" delay={250} duration={1000}>
          <p className="text-pembuka-greeting lg:text-pembuka-greeting-lg text-on-photo text-center text-pretty">
            {openingGreeting.salutation}
          </p>
        </ScrollReveal>

        <ScrollReveal animation="zoom-in" delay={380}>
          <svg className="h-4 w-[120px] lg:h-[22px] lg:w-[180px]" aria-hidden="true">
            <use href="#orn" />
          </svg>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={500} duration={1000}>
          <p className="text-pembuka lg:text-pembuka-lg text-warm-white/90 text-center text-pretty lg:max-w-reading-lg lg:text-warm-white/92">
            {openingGreeting.body}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}


