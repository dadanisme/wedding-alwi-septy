import Image from "next/image";

const PALETTE = [
  { hex: "#F7EFE1", token: "cream", label: "Krem gading — latar seksi teks", contrast: "dasar" },
  { hex: "#F2E8D8", token: "cream-secondary", label: "Krem sekunder (Love Story, Buku Tamu)", contrast: "dasar" },
  { hex: "#3A2A1C", token: "ink", label: "Teks utama di atas krem", contrast: "11.9 : 1 AAA" },
  { hex: "#6B5236", token: "ink-soft", label: "Teks sekunder & label di atas krem", contrast: "6.3 : 1 AA" },
  { hex: "#1A120B", token: "espresso", label: "Cokelat gelap — bar acara & penutup", contrast: "dasar" },
  { hex: "#F6EFE6", token: "warm-white", label: "Putih hangat di atas gelap", contrast: "16.2 : 1 AAA" },
  { hex: "#E8DCC4", token: "label-on-dark", label: "Label di atas gelap", contrast: "13.7 : 1 AAA" },
  { hex: "#C6B79B", token: "tertiary-on-dark", label: "Teks tersier di atas gelap (alamat, tanggal)", contrast: "8.4 : 1 AAA" },
  { hex: "#FDFAF4", token: "on-photo", label: "Teks di atas foto (lapisan gelap ≥ 0.62)", contrast: "≥ 9.6 : 1 AAA" },
  { hex: "#8A6A22", token: "gold-deep", label: "Emas tua — isian ornamen & latar tombol (teks on-photo)", contrast: "4.6 : 1 AA" },
  { hex: "#C9A227", token: "gold-bright", label: "Emas terang — garis, ikon, sulur. HANYA di atas gelap (2.1:1 di krem)", contrast: "7.6 : 1 (gelap)" },
] as const;

const TYPE_SCALE = [
  { name: "Nama tamu", mobile: "27px / 1.22", desktop: "42px / 1.22", cls: "text-guest-name", clsLg: "lg:text-guest-name-lg" },
  { name: "Nama mempelai (sampul)", mobile: "25px / .20em", desktop: "46px / .30em", cls: "text-bride-name", clsLg: "lg:text-bride-name-lg" },
  { name: "Judul seksi (label)", mobile: "12px / .40em", desktop: "14px / .48em", cls: "text-section-label", clsLg: "lg:text-section-label-lg" },
  { name: "Nama lengkap mempelai", mobile: "25px", desktop: "34px", cls: "text-full-name", clsLg: "lg:text-full-name-lg" },
  { name: "Label kecil", mobile: "9px / .44em", desktop: "11px / .50em", cls: "text-label-small", clsLg: "lg:text-label-small-lg" },
] as const;

const ORNAMENTS = [
  { id: "sulur", label: "Sulur botani sudut", box: "0 0 170 170", w: 96, h: 96 },
  { id: "spray", label: "Aksen daun pengapit monogram", box: "0 0 130 64", w: 130, h: 64 },
  { id: "orn", label: "Pemisah antar blok teks", box: "0 0 200 26", w: 160, h: 21 },
  { id: "wave", label: "Pembatas bergelombang foto → krem", box: "0 0 1440 120", w: 220, h: 18 },
  { id: "ico-cal", label: "Ikon tanggal", box: "0 0 24 24", w: 28, h: 28 },
  { id: "ico-rings", label: "Ikon cincin", box: "0 0 24 24", w: 28, h: 28 },
  { id: "ico-pin", label: "Ikon lokasi", box: "0 0 24 24", w: 28, h: 28 },
] as const;

const LOGOS = [
  { src: "/logo/monogram-white.png", label: "Putih transparan", bg: "bg-espresso", note: "Untuk latar gelap (sampul, penutup)" },
  { src: "/logo/monogram-black.png", label: "Hitam", bg: "bg-cream", note: "Untuk latar terang" },
  { src: "/logo/monogram-gold.png", label: "Emas", bg: "bg-cream", note: "Aksen / ikon, belum dipakai" },
] as const;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-section-label text-gold-deep border-b border-gold-bright/30 pb-3">
      {children}
    </h2>
  );
}

export default function StyleguidePage() {
  return (
    <main className="mx-auto flex max-w-[900px] flex-col gap-16 px-6 py-16 lg:px-12">
      <header className="flex flex-col gap-3 border-b border-gold-bright/30 pb-8">
        <span className="text-label-small text-gold-deep">Design System</span>
        <h1 className="text-full-name lg:text-full-name-lg text-ink">Undangan Alwi &amp; Septy</h1>
        <p className="text-body text-ink-soft max-w-reading lg:max-w-reading-lg">
          Token warna, tipografi, ornamen, dan logo — dikunci dari mockup yang sudah diapprove
          mempelai. Jangan menulis nilai mentah di komponen; selalu pakai kelas/token di halaman
          ini.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <SectionTitle>Palet &amp; rasio kontras</SectionTitle>
        <div className="flex flex-col">
          {PALETTE.map((c) => (
            <div
              key={c.token}
              className="grid grid-cols-[40px_1fr_auto] items-center gap-4 border-b border-gold-bright/20 py-3"
            >
              <span
                className="h-10 w-10 shrink-0 rounded-sm border border-ink/10"
                style={{ backgroundColor: c.hex }}
                aria-hidden
              />
              <span className="text-body text-ink">
                <span className="font-medium">{c.hex}</span> — {c.label}
                <span className="text-ink-soft"> ({c.token})</span>
              </span>
              <span className="text-label-small text-ink-soft whitespace-nowrap">{c.contrast}</span>
            </div>
          ))}
        </div>
        <p className="text-body text-ink-soft">
          Emas terang (<code>gold-bright</code>) hanya mencapai 2.1:1 di atas krem, jadi tidak
          pernah dipakai sebagai warna teks isi di mana pun — hanya garis, ikon, dan sulur.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <SectionTitle>Font &amp; skala</SectionTitle>
        <p className="text-body text-ink-soft">
          <span className="font-display text-xl italic">Cormorant Garamond</span> (300–500) untuk
          monogram, nama, judul, dan angka besar. Crimson Pro (300/400/600) untuk teks isi, label
          berspasi lebar, dan antarmuka formulir.
        </p>

        <div className="flex flex-col gap-8">
          {TYPE_SCALE.map((t) => (
            <div key={t.name} className="flex flex-col gap-1 border-b border-gold-bright/20 pb-6">
              <div className="text-label-small text-ink-soft flex justify-between">
                <span>{t.name}</span>
                <span>
                  390px: {t.mobile} · 1280px: {t.desktop}
                </span>
              </div>
              <span className={`${t.cls} ${t.clsLg} text-ink`}>Alwi &amp; Septy</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-label-small text-ink-soft">
            Uji wajib — nama lengkap bergelar pada 390px
          </span>
          <p className="text-full-name max-w-[290px] text-ink text-balance">
            Mochamad Ilham Alwi<span className="whitespace-nowrap"> Rifa, S.T.</span>
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionTitle>Ornamen</SectionTitle>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {ORNAMENTS.map((o) => (
            <div key={o.id} className="flex flex-col items-center gap-3">
              <svg viewBox={o.box} style={{ width: o.w, height: o.h }} className="text-gold-bright">
                <use href={`#${o.id}`} />
              </svg>
              <span className="text-label-small text-ink-soft text-center">{o.label}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-cream h-24 w-24 overflow-hidden rounded-sm border border-ink/10">
              <svg width="100%" height="100%">
                <rect width="100%" height="100%" fill="url(#damaskPat)" opacity={0.5} />
              </svg>
            </div>
            <span className="text-label-small text-ink-soft text-center">
              Tekstur damask (latar krem)
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionTitle>Logo / Monogram</SectionTitle>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {LOGOS.map((l) => (
            <div key={l.src} className="flex flex-col gap-3">
              <div className={`flex h-48 items-center justify-center rounded-sm ${l.bg}`}>
                <Image src={l.src} alt={`Monogram ${l.label}`} width={120} height={132} className="h-32 w-auto" />
              </div>
              <span className="text-label-small text-ink-soft text-center">
                {l.label} — {l.note}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
