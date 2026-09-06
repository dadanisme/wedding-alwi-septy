import type { Metadata } from "next";
import { Cormorant_Garamond, Crimson_Pro } from "next/font/google";
import { OrnamentDefs } from "@/components/ornaments";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const crimson = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Undangan Pernikahan Alwi & Septy",
  description: "Sabtu, 10 Oktober 2026 — Steikhaus, Bandung",
  openGraph: {
    title: "Undangan Pernikahan Alwi & Septy",
    description:
      "Sabtu, 10 Oktober 2026 · Akad 08.00 WIB · Resepsi 11.00–14.00 WIB · Steikhaus (Area Pabrik Bajoe), Bandung",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Undangan Pernikahan Alwi & Septy",
    description:
      "Sabtu, 10 Oktober 2026 · Akad 08.00 WIB · Resepsi 11.00–14.00 WIB · Steikhaus (Area Pabrik Bajoe), Bandung",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${cormorant.variable} ${crimson.variable}`}>
      <body className="font-body antialiased">
        <OrnamentDefs />
        {children}
      </body>
    </html>
  );
}
