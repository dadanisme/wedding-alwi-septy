import type { Guest } from '../types/database';
import type { BatchImportGuestItem } from './db/guests';

/**
 * Format label grup tamu yang ramah dibaca manusia.
 */
export function formatGuestGroup(group: string): string {
  const map: Record<string, string> = {
    keluarga_pria: 'Keluarga Pria',
    keluarga_wanita: 'Keluarga Wanita',
    teman_alwi: 'Teman Alwi',
    teman_septy: 'Teman Septy',
    teman_kerja: 'Teman Kerja',
    teman_kuliah: 'Teman Kuliah',
    teman_sekolah: 'Teman Sekolah',
    vip: 'VIP',
    tamu_undangan: 'Tamu Undangan',
  };

  if (map[group]) return map[group];
  // Fallback: ubah underscore/dash jadi spasi dan capitalize
  return group
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Menghasilkan template pesan WhatsApp resmi sesuai PRD Lampiran B.
 */
export function generateWhatsAppInvitation(guest: Guest, origin: string): string {
  const salutation = guest.salutation?.trim() || 'Bapak/Ibu';
  const name = guest.name?.trim() || '';
  const guestLink = `${origin.replace(/\/+$/, '')}/${guest.fullSlug}`;

  return `Assalamualaikum Wr. Wb.

Dengan penuh sukacita, kami mengundang ${salutation} ${name}
untuk hadir dan memberikan doa restu pada acara pernikahan kami.

Alwi & Septy
Sabtu, 10 Oktober 2026
Akad 08.00 WIB · Resepsi 11.00–14.00 WIB
Steikhaus (Area Pabrik Bajoe), Bandung

Undangan lengkap dapat dibuka di tautan berikut:
${guestLink}

Tautan ini bersifat pribadi dan hanya berlaku untuk ${salutation} ${name}.

Merupakan suatu kehormatan dan kebahagiaan bagi kami
apabila ${salutation} berkenan hadir.

Terima kasih.
Wassalamualaikum Wr. Wb.`;
}

/**
 * Menghasilkan template pesan WhatsApp pengingat (reminder) santun untuk tamu yang belum respons.
 * Menyebutkan batas anjuran 26 September 2026 sesuai PRD §4.7.
 */
export function generateWhatsAppReminder(guest: Guest, origin: string): string {
  const salutation = guest.salutation?.trim() || 'Bapak/Ibu';
  const name = guest.name?.trim() || '';
  const guestLink = `${origin.replace(/\/+$/, '')}/${guest.fullSlug}`;

  return `Assalamualaikum Wr. Wb.

Yth. ${salutation} ${name},

Mengingat semakin dekatnya hari bahagia pernikahan kami dan batas anjuran konfirmasi kehadiran (RSVP) pada Sabtu, 26 September 2026 demi kelancaran persiapan katering & tata tempat:

Mohon kesediaan ${salutation} untuk menyampaikan konfirmasi kehadiran melalui tautan undangan pribadi berikut:
${guestLink}

Kehadiran dan doa restu ${salutation} sangat berarti bagi kami berdua.

Terima kasih banyak atas perhatian dan kesediaannya.
Wassalamualaikum Wr. Wb.

Alwi & Septy`;
}

/**
 * Parser berkas CSV dengan auto-detection delimiter (, atau ;) dan toleransi variasi header.
 */
export interface CsvParseResult {
  valid: BatchImportGuestItem[];
  errors: Array<{ row: number; error: string; raw: string }>;
}

export function parseGuestsCsv(csvText: string): CsvParseResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { valid: [], errors: [{ row: 1, error: 'Berkas CSV kosong.', raw: '' }] };
  }

  // Auto-detect delimiter dari baris header: hitung kemunculan koma vs titik koma
  const headerLine = lines[0];
  const commaCount = (headerLine.match(/,/g) || []).length;
  const semicolonCount = (headerLine.match(/;/g) || []).length;
  const delimiter = semicolonCount > commaCount ? ';' : ',';

  // Helper tokenize baris CSV dengan dukungan tanda kutip
  const tokenize = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = tokenize(headerLine).map((h) => h.toLowerCase().replace(/[\s_-]+/g, ''));

  // Cari indeks kolom
  const nameIdx = headers.findIndex((h) => ['name', 'nama', 'namatamu', 'guestname'].includes(h));
  const salutationIdx = headers.findIndex((h) => ['salutation', 'sapaan', 'gelar'].includes(h));
  const groupIdx = headers.findIndex((h) => ['guestgroup', 'group', 'grup', 'kategori', 'category'].includes(h));

  if (nameIdx === -1) {
    return {
      valid: [],
      errors: [
        {
          row: 1,
          error: 'Kolom "name" atau "nama" tidak ditemukan pada baris judul CSV.',
          raw: headerLine,
        },
      ],
    };
  }

  const valid: BatchImportGuestItem[] = [];
  const errors: Array<{ row: number; error: string; raw: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const cols = tokenize(rawLine);

    const name = cols[nameIdx] ? cols[nameIdx].trim().replace(/^"|"$/g, '') : '';
    if (!name) {
      errors.push({
        row: i + 1,
        error: 'Kolom nama kosong.',
        raw: rawLine,
      });
      continue;
    }

    if (name.length > 100) {
      errors.push({
        row: i + 1,
        error: 'Nama melebihi batas 100 karakter.',
        raw: rawLine,
      });
      continue;
    }

    const salutation =
      salutationIdx !== -1 && cols[salutationIdx]
        ? cols[salutationIdx].trim().replace(/^"|"$/g, '')
        : 'Bapak/Ibu';

    const guestGroup =
      groupIdx !== -1 && cols[groupIdx]
        ? cols[groupIdx].trim().replace(/^"|"$/g, '')
        : 'tamu_undangan';

    valid.push({
      name,
      salutation: salutation || 'Bapak/Ibu',
      guestGroup: guestGroup || 'tamu_undangan',
    });
  }

  return { valid, errors };
}

/**
 * Helper pembungkus nilai CSV dengan escape quote aman
 */
function escapeCsvCell(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Menghasilkan file CSV dari daftar tamu lengkap untuk kebutuhan katering dan tata kursi (PRD §4.7).
 */
export function exportGuestsToCsv(guests: Guest[], origin: string): void {
  const headers = [
    'No',
    'Nama Tamu',
    'Sapaan',
    'Kategori Grup',
    'Status Buka',
    'Frekuensi Buka',
    'Jumlah Perangkat',
    'Status RSVP',
    'Estimasi Kursi',
    'Bawa Pendamping',
    'Nama Pendamping',
    'Catatan / Alergi',
    'Link Undangan Personal',
    'Waktu Konfirmasi RSVP',
    'Waktu Pertama Buka',
  ];

  const rows = guests.map((g, idx) => {
    // Estimasi kursi: 2 jika hadir + bawa pendamping, 1 jika hadir tanpa pendamping, 0 jika absen/pending
    let seatCount = 0;
    if (g.rsvpStatus === 'attending') {
      seatCount = g.rsvp?.plusOne ? 2 : 1;
    }

    const rsvpStatusLabel =
      g.rsvpStatus === 'attending'
        ? 'Hadir'
        : g.rsvpStatus === 'not_attending'
        ? 'Tidak Hadir'
        : 'Belum Konfirmasi';

    const openStatusLabel = g.openedAt || g.openCount > 0 ? 'Sudah Buka' : 'Belum Buka';
    const plusOneLabel = g.rsvp ? (g.rsvp.plusOne ? 'Ya' : 'Tidak') : '-';
    const guestLink = `${origin.replace(/\/+$/, '')}/${g.fullSlug}`;

    return [
      idx + 1,
      escapeCsvCell(g.name),
      escapeCsvCell(g.salutation),
      escapeCsvCell(formatGuestGroup(g.guestGroup)),
      escapeCsvCell(openStatusLabel),
      g.openCount || 0,
      g.uniqueDevices?.length || 0,
      escapeCsvCell(rsvpStatusLabel),
      seatCount,
      escapeCsvCell(plusOneLabel),
      escapeCsvCell(g.rsvp?.plusOneName || '-'),
      escapeCsvCell(g.rsvp?.notes || '-'),
      escapeCsvCell(guestLink),
      escapeCsvCell(g.rsvp?.updatedAt || g.rsvp?.submittedAt || '-'),
      escapeCsvCell(g.openedAt || '-'),
    ].join(',');
  });

  // UTF-8 BOM (\uFEFF) untuk kompatibilitas sempurna dengan Microsoft Excel di Mac & Windows
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  a.download = `daftar-tamu-alwi-septy-${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
