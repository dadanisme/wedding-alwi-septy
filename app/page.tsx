import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-label-small text-gold-deep">Undangan Alwi &amp; Septy</span>
      <p className="text-body text-ink-soft max-w-reading">
        Halaman undangan belum diimplementasikan. Lihat token desain yang sudah dikunci di{" "}
        <Link href="/styleguide" className="text-ink underline decoration-gold-bright">
          /styleguide
        </Link>
        .
      </p>
    </main>
  );
}
