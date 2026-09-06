import { Ayat } from "@/components/sections/ayat";
import { Galeri } from "@/components/sections/galeri";
import { Pembuka } from "@/components/sections/pembuka";
import { Sampul } from "@/components/sections/sampul";

export default function Home() {
  return (
    <main>
      <Sampul guestName="Bapak/Ibu Budi Santoso" />
      <Ayat />
      <Pembuka />
      <Galeri />
    </main>
  );
}
