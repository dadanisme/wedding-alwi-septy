import { Ayat } from "@/components/sections/ayat";
import { Galeri } from "@/components/sections/galeri";
import { Pembuka } from "@/components/sections/pembuka";
import { Sampul } from "@/components/sections/sampul";

export default function Home() {
  return (
    <>
      {/*
       * Latar damask berulang di area luar (gutter) untuk layar ultrawide (>1440px).
       * Tersembunyi di layar normal/ponsel (<=1440px) agar tidak membebani komposit rendering.
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

      <main className="relative mx-auto min-h-dvh w-full max-w-page overflow-x-clip bg-cream shadow-page">
        <Sampul guestName="Bapak/Ibu Budi Santoso" />
        <Ayat />
        <Pembuka />
        <Galeri />
      </main>
    </>
  );
}
