import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { getGuestByFullSlug, recordGuestBotVisit } from "@/lib/db/guests";
import { getVisibleMessages } from "@/lib/db/messages";
import { guestBookConfig, type GuestBookEntry } from "@/lib/event-config";
import { isBotUserAgent } from "@/lib/bot-detection";
import { InvitationExperience } from "@/components/invitation-experience";

interface PageProps {
  params: Promise<{ guestSlug: string }>;
}

/**
 * Metadata dinamis untuk pratinjau WhatsApp & media sosial (PRD §4.6).
 * Dibuat per tamu, menyertakan nama tamu dan tanggal acara.
 * Perlindungan SEO: noindex, nofollow (PRD §4.1).
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { guestSlug } = await params;
  const guest = await getGuestByFullSlug(guestSlug);

  if (!guest) {
    return {
      title: "Undangan Pernikahan Alwi & Septy",
      description: "Sabtu, 10 Oktober 2026 — Steikhaus, Bandung",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const displayName = guest.salutation
    ? `${guest.salutation} ${guest.name}`
    : guest.name;

  return {
    title: `Undangan Pernikahan Alwi & Septy — Kepada Yth. ${displayName}`,
    description:
      "Sabtu, 10 Oktober 2026 · Akad 08.00 WIB · Resepsi 11.00–14.00 WIB · Steikhaus (Area Pabrik Bajoe), Bandung",
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
    openGraph: {
      title: `Undangan Pernikahan Alwi & Septy`,
      description: `Kepada Yth. ${displayName} — Sabtu, 10 Oktober 2026 di Steikhaus Bandung`,
      type: "website",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: `Undangan Pernikahan Alwi & Septy`,
      description: `Kepada Yth. ${displayName} — Sabtu, 10 Oktober 2026 di Steikhaus Bandung`,
    },
  };
}

/**
 * Halaman rute dinamis link tamu privat (PRD §4.1).
 * Format URL: /{slug-nama}-{token-acak} (misal: /budi-santoso-a7f3k9m2).
 */
export default async function GuestInvitationPage({ params }: PageProps) {
  const { guestSlug } = await params;
  const guest = await getGuestByFullSlug(guestSlug);

  // Link tidak valid -> tampilkan 404 generik tanpa membocorkan data (PRD §4.1)
  if (!guest) {
    notFound();
  }

  // Deteksi kunjungan bot WhatsApp preview / perayap (PRD §4.5)
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "";
  const isBot = isBotUserAgent(userAgent);

  if (isBot) {
    try {
      await recordGuestBotVisit(guest.id);
    } catch (err) {
      console.error("Gagal mencatat kunjungan bot WhatsApp:", err);
    }
  }

  const displayName = guest.salutation
    ? `${guest.salutation} ${guest.name}`
    : guest.name;

  // Halaman pertama Buku Tamu dirender di server supaya daftar sudah terisi
  // saat tamu sampai ke seksinya, bukan berkedip kosong dulu (PRD §4.4).
  //
  // Dilewati untuk kunjungan bot: perayap pratinjau WhatsApp mengambil halaman
  // ini setiap kali link diteruskan di chat, dan ia tidak pernah merender
  // daftarnya. Membacanya berarti membayar ~11 pembacaan Firestore per
  // penerusan link untuk sesuatu yang tidak dilihat siapa pun. Konsisten
  // dengan pemisahan bot yang sudah ada di berkas ini (PRD §4.5).
  //
  // Kegagalan di sini tidak boleh menjatuhkan seluruh undangan: seksi cukup
  // tampil tanpa daftar, lalu memulihkan diri saat tamu sampai ke seksinya.
  let guestBookEntries: GuestBookEntry[] = [];
  let guestBookHasMore = false;
  let guestBookLoadFailed = false;
  if (!isBot) {
    try {
      const page = await getVisibleMessages(guestBookConfig.pageSize);
      guestBookEntries = page.messages.map((message) => ({
        id: message.id,
        name: message.guestName,
        msg: message.message,
        createdAt: message.createdAt,
      }));
      guestBookHasMore = page.hasMore;
    } catch (err) {
      console.error("Gagal memuat halaman pertama Buku Tamu:", err);
      guestBookLoadFailed = true;
    }
  }

  return (
    <>
      {/*
       * Latar damask berulang di area luar (gutter) untuk layar ultrawide (>1440px).
       * Tersembunyi di layar normal/ponsel (<=1440px) agar tidak membebani rendering.
       */}
      <div
        className="fixed inset-0 -z-10 hidden bg-matte min-[1441px]:block"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-[url('/patterns/botanical-damask.jpg')] bg-[size:420px_420px] bg-repeat opacity-50 mix-blend-multiply"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-matte/50 via-transparent to-matte/50"
          aria-hidden="true"
        />
      </div>

      <InvitationExperience
        guest={{
          id: guest.id,
          name: guest.name,
          salutation: guest.salutation,
          displayName,
          fullSlug: guest.fullSlug,
          rsvpStatus: guest.rsvpStatus,
          rsvp: guest.rsvp,
        }}
        guestBookEntries={guestBookEntries}
        guestBookHasMore={guestBookHasMore}
        guestBookLoadFailed={guestBookLoadFailed}
      />
    </>
  );
}
