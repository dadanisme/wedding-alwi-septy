"use client";

import { useEffect, useRef, useState } from "react";
import { backgroundMusic } from "@/lib/event-config";
import { MusicPlayer } from "@/components/music-player";
import { Sampul } from "@/components/sections/sampul";
import { Ayat } from "@/components/sections/ayat";
import { Pembuka } from "@/components/sections/pembuka";
import { Mempelai } from "@/components/sections/mempelai";
import { Galeri } from "@/components/sections/galeri";
import { Acara } from "@/components/sections/acara";
import { Rsvp } from "@/components/sections/rsvp";
import { BukuTamu } from "@/components/sections/buku-tamu";
import { Hadiah } from "@/components/sections/hadiah";
import { Penutup } from "@/components/sections/penutup";
import { AmbientPetals } from "@/components/ambient-petals";

import { trackGuestOpenAction } from "@/app/actions/tracking";
import { getClientDeviceId } from "@/lib/device";
import type { RsvpEntry, RsvpStatus } from "@/types/database";
import type { GuestBookEntry } from "@/lib/event-config";

export interface GuestInfo {
  id: string;
  name: string;
  salutation: string;
  displayName: string;
  fullSlug: string;
  rsvpStatus?: RsvpStatus;
  rsvp?: RsvpEntry | null;
}

interface InvitationExperienceProps {
  guest?: GuestInfo | null;
  guestName?: string;
  /**
   * Halaman pertama ucapan Buku Tamu. Rute tamu mengisinya dari Firestore;
   * rute pratinjau "/" mengisinya dengan data contoh mockup.
   */
  guestBookEntries?: readonly GuestBookEntry[];
  guestBookHasMore?: boolean;
  /** Pengambilan halaman pertama Buku Tamu di server gagal. */
  guestBookLoadFailed?: boolean;
}

/**
 * Pengelola interaksi utama undangan:
 * 1. Gerbang Sampul: mengunci scroll sebelum tombol "Buka Undangan" ditekan (PRD §4.2).
 * 2. Transisi pembukaan: membuka kunci scroll dan smooth-scroll ke seksi Ayat.
 * 3. Pemutar musik latar: memutar audio setelah gestur pengguna dan menampilkan tombol kontrol mengambang (PRD §7.1 & §7.3).
 * 4. Pelacakan pembukaan nyata ke basis data saat tamu menekan tombol buka (PRD §4.5).
 */
export function InvitationExperience({
  guest,
  guestName = "Bapak/Ibu Budi Santoso",
  guestBookEntries,
  guestBookHasMore = false,
  guestBookLoadFailed = false,
}: InvitationExperienceProps) {
  const effectiveGuestName = guest?.displayName || guest?.name || guestName;
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Kunci scroll di awal sebelum tamu menekan "Buka Undangan"
  useEffect(() => {
    if (!isOpened) {
      // Pastikan posisi awal di puncak
      window.scrollTo(0, 0);

      const preventTouch = (e: TouchEvent) => {
        if (e.target instanceof Element && e.target.closest("button")) return;
        e.preventDefault();
      };

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.addEventListener("touchmove", preventTouch, { passive: false });

      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        window.removeEventListener("touchmove", preventTouch);
      };
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [isOpened]);

  const handleOpen = () => {
    // Buka kunci scroll terlebih dahulu
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    setIsOpened(true);

    // Pelacakan pembukaan nyata oleh tamu ke basis data (PRD §4.5)
    if (guest?.id) {
      const clientDeviceId = getClientDeviceId();
      trackGuestOpenAction(guest.id, clientDeviceId).catch((err) => {
        console.warn("Gagal melacak pembukaan undangan:", err);
      });
    }

    // Putar musik latar dari gestur klik tombol (diizinkan oleh kebijakan autoplay browser/iOS Safari)
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Autoplay musik dicegah oleh browser:", err);
        });
    }

    // Gulir halus sinematik (spring-like ease-in-out) ke seksi berikutnya (Ayat)
    setTimeout(() => {
      const ayatEl = document.getElementById("ayat");
      if (ayatEl) {
        const targetY = ayatEl.getBoundingClientRect().top + window.scrollY;
        const startY = window.scrollY || window.pageYOffset;
        const diff = targetY - startY;
        const duration = 1500; // 1,5 detik untuk transisi lembut, elegan, dan megah
        const startTime = performance.now();
        let animationFrameId: number;

        // Kurva ease-in-out cubic: akselerasi lembut di awal, meluncur megah, lalu deselerasi panjang
        const easeInOutCubic = (t: number): number => {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const cancel = () => {
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener("wheel", cancel);
          window.removeEventListener("touchstart", cancel);
        };

        window.addEventListener("wheel", cancel, { passive: true });
        window.addEventListener("touchstart", cancel, { passive: true });

        const step = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = easeInOutCubic(progress);

          window.scrollTo(0, startY + diff * ease);

          if (progress < 1) {
            animationFrameId = requestAnimationFrame(step);
          } else {
            window.removeEventListener("wheel", cancel);
            window.removeEventListener("touchstart", cancel);
          }
        };

        animationFrameId = requestAnimationFrame(step);
      }
    }, 50);
  };

  const handleToggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Gagal memutar audio:", err);
        });
    }
  };

  return (
    <>
      {/*
       * Elemen audio latar: preload="none" agar berkas musik baru diunduh setelah
       * tamu menekan tombol sampul, sesuai PRD §7.1 (performa 4G).
       */}
      <audio
        ref={audioRef}
        src={backgroundMusic.src}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <main
        className={`relative mx-auto min-h-dvh w-full max-w-page overflow-x-clip bg-cream shadow-page ${
          !isOpened ? "h-dvh overflow-hidden" : ""
        }`}
      >
        <Sampul guestName={effectiveGuestName} onOpen={handleOpen} />
        <Ayat />
        <Pembuka />
        <Mempelai />
        <Acara />
        <Rsvp fullSlug={guest?.fullSlug} initialRsvp={guest?.rsvp ?? null} />
        <BukuTamu
          guestName={effectiveGuestName}
          fullSlug={guest?.fullSlug}
          initialEntries={guestBookEntries}
          initialHasMore={guestBookHasMore}
          initialLoadFailed={guestBookLoadFailed}
        />
        <Hadiah />
        <Galeri />
        <Penutup />
      </main>

      <MusicPlayer
        isPlaying={isPlaying}
        onToggle={handleToggleAudio}
        isVisible={isOpened}
      />

      {/* Partikel kelopak melati dan debu emas melayang */}
      <AmbientPetals />
    </>
  );
}
