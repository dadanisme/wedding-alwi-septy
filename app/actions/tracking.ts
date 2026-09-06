"use server";

import { headers } from "next/headers";
import crypto from "crypto";
import { recordGuestOpen } from "@/lib/db/guests";
import { isBotUserAgent } from "@/lib/bot-detection";

export interface TrackOpenResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action untuk mencatat pembukaan nyata saat tamu menekan tombol "Buka Undangan".
 * Sesuai PRD §4.5:
 * 1. Bot WhatsApp/crawler diabaikan (hanya interaksi manusia yang dihitung).
 * 2. Mencatat waktu pembukaan (openedAt & lastOpenedAt).
 * 3. Menghasilkan anonymous device hash untuk menghitung unique devices (indikator penerusan link).
 */
export async function trackGuestOpenAction(
  guestId: string,
  clientDeviceId?: string
): Promise<TrackOpenResult> {
  if (!guestId) {
    return { success: false, error: "Guest ID tidak valid" };
  }

  try {
    let userAgent = "";
    let ip = "unknown-ip";

    try {
      const headerList = await headers();
      userAgent = headerList.get("user-agent") || "";

      // Abaikan jika aksi dipicu oleh bot/crawler
      if (isBotUserAgent(userAgent)) {
        return { success: false, error: "Bot detected" };
      }

      const forwardedFor = headerList.get("x-forwarded-for");
      const realIp = headerList.get("x-real-ip");
      ip = forwardedFor
        ? forwardedFor.split(",")[0].trim()
        : realIp || "unknown-ip";
    } catch {
      // Fallback aman jika dipanggil di luar konteks request Next.js (mis. testing)
    }

    // Buat anonymous hash perangkat (PRD §4.5) tanpa menyimpan PII
    const rawFingerprint = `${clientDeviceId || ""}|${ip}|${userAgent}`;
    const deviceHash = crypto
      .createHash("sha256")
      .update(rawFingerprint)
      .digest("hex")
      .slice(0, 16);

    const updated = await recordGuestOpen(guestId, deviceHash);
    return { success: updated };
  } catch (error) {
    console.error("Error tracking guest open:", error);
    return { success: false, error: "Gagal mencatat pembukaan" };
  }
}
