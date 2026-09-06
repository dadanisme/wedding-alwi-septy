"use client";

import { useEffect, useRef, useState } from "react";
import { backgroundMusic } from "@/lib/event-config";
import { MusicPlayer } from "@/components/music-player";
import { Sampul } from "@/components/sections/sampul";
import { Ayat } from "@/components/sections/ayat";
import { Pembuka } from "@/components/sections/pembuka";
import { Galeri } from "@/components/sections/galeri";
import { Acara } from "@/components/sections/acara";
import { Rsvp } from "@/components/sections/rsvp";

interface InvitationExperienceProps {
  guestName?: string;
}

/**
 * Pengelola interaksi utama undangan:
 * 1. Gerbang Sampul: mengunci scroll sebelum tombol "Buka Undangan" ditekan (PRD §4.2).
 * 2. Transisi pembukaan: membuka kunci scroll dan smooth-scroll ke seksi Ayat.
 * 3. Pemutar musik latar: memutar audio setelah gestur pengguna dan menampilkan tombol kontrol mengambang (PRD §7.1 & §7.3).
 */
export function InvitationExperience({
  guestName = "Bapak/Ibu Budi Santoso",
}: InvitationExperienceProps) {
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

    // Gulir halus (smooth scroll) ke seksi berikutnya (Ayat) setelah layout re-render
    setTimeout(() => {
      const ayatEl = document.getElementById("ayat");
      if (ayatEl) {
        ayatEl.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <Sampul guestName={guestName} onOpen={handleOpen} />
        <Ayat />
        <Pembuka />
        <Galeri />
        <Acara />
        <Rsvp />
      </main>

      <MusicPlayer
        isPlaying={isPlaying}
        onToggle={handleToggleAudio}
        isVisible={isOpened}
      />
    </>
  );
}
