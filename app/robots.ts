import type { MetadataRoute } from "next";

/**
 * Konfigurasi robots.txt untuk mencegah pengindeksan oleh mesin pencari (PRD §4.1).
 * "Mesin pencari: Seluruh halaman undangan tidak boleh terindeks"
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
