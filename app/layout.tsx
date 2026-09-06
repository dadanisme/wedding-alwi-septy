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

export const metadata: Metadata = {
  title: "Undangan Pernikahan Alwi & Septy",
  description: "Sabtu, 10 Oktober 2026 — Steikhaus, Bandung",
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
