import { Ayat } from "@/components/sections/ayat";
import { Sampul } from "@/components/sections/sampul";

export default function Home() {
  return (
    <main>
      <Sampul guestName="Bapak/Ibu Budi Santoso" />
      <Ayat />
    </main>
  );
}
