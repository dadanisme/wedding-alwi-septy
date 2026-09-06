import { describe, it, expect } from 'bun:test';
import {
  parseGuestsCsv,
  formatGuestGroup,
  generateWhatsAppInvitation,
  generateWhatsAppReminder,
} from '../lib/guest-utils';
import { generateGuestSlug } from '../lib/db/guests';
import type { Guest } from '../types/database';
import {
  createGuestAction,
  updateGuestAction,
  deleteGuestAction,
  importGuestsAction,
} from '../app/actions/guests';

describe('Manajemen Tamu: parseGuestsCsv', () => {
  it('berhasil mem-parsing format standar PRD Lampiran A dengan koma', () => {
    const csv = `name,salutation,guest_group,plus_one_allowed
Budi Santoso,Bapak,teman_kerja,true
Ani Wijaya,Ibu,keluarga_wanita,true
Rina Kusuma,Sdri,teman_kuliah,true`;

    const res = parseGuestsCsv(csv);
    expect(res.errors.length).toBe(0);
    expect(res.valid.length).toBe(3);
    expect(res.valid[0].name).toBe('Budi Santoso');
    expect(res.valid[0].salutation).toBe('Bapak');
    expect(res.valid[0].guestGroup).toBe('teman_kerja');
    expect(res.valid[1].name).toBe('Ani Wijaya');
    expect(res.valid[2].salutation).toBe('Sdri');
  });

  it('mendukung pemisah titik koma (Excel Indonesia)', () => {
    const csv = `nama;sapaan;kategori
Budi Santoso;Bapak;teman_kerja
Ani Wijaya;Ibu;keluarga_wanita`;

    const res = parseGuestsCsv(csv);
    expect(res.errors.length).toBe(0);
    expect(res.valid.length).toBe(2);
    expect(res.valid[0].name).toBe('Budi Santoso');
    expect(res.valid[0].salutation).toBe('Bapak');
    expect(res.valid[0].guestGroup).toBe('teman_kerja');
  });

  it('menangani tanda kutip dengan koma di dalam nama', () => {
    const csv = `name,salutation,guest_group
"Santoso, Budi",Bapak,teman_kerja`;

    const res = parseGuestsCsv(csv);
    expect(res.errors.length).toBe(0);
    expect(res.valid.length).toBe(1);
    expect(res.valid[0].name).toBe('Santoso, Budi');
  });

  it('mendeteksi baris galat saat nama kosong', () => {
    const csv = `name,salutation,guest_group
,Bapak,teman_kerja
Budi Santoso,Bapak,teman_kerja`;

    const res = parseGuestsCsv(csv);
    expect(res.valid.length).toBe(1);
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].row).toBe(2);
    expect(res.errors[0].error).toContain('Kolom nama kosong');
  });

  it('menolak CSV jika kolom name tidak ditemukan di header', () => {
    const csv = `email,telepon,alamat
budi@gmail.com,0812345,Bandung`;

    const res = parseGuestsCsv(csv);
    expect(res.valid.length).toBe(0);
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].error).toContain('tidak ditemukan pada baris judul');
  });
});

describe('Manajemen Tamu: Slug Generator', () => {
  it('membersihkan karakter aksen dan tanda baca', () => {
    expect(generateGuestSlug('Mochamad Ilham Alwi')).toBe('mochamad-ilham-alwi');
    expect(generateGuestSlug('Dr. Budi Santoso, S.T.')).toBe('dr-budi-santoso-s-t');
    expect(generateGuestSlug('Renée & Chloë')).toBe('renee-chloe');
  });

  it('memberikan fallback tamu jika nama hanya karakter spesial', () => {
    expect(generateGuestSlug('!@#$%^&*()')).toBe('tamu');
  });
});

describe('Manajemen Tamu: Label Format Kategori', () => {
  it('memformat kategori standar dan custom', () => {
    expect(formatGuestGroup('keluarga_pria')).toBe('Keluarga Pria');
    expect(formatGuestGroup('teman_alwi')).toBe('Teman Alwi');
    expect(formatGuestGroup('vip')).toBe('VIP');
    expect(formatGuestGroup('komunitas_gowes_bandung')).toBe('Komunitas Gowes Bandung');
  });
});

describe('Manajemen Tamu: Template Pesan WhatsApp', () => {
  const dummyGuest: Guest = {
    id: 'g-123',
    name: 'Budi Santoso',
    salutation: 'Bapak',
    guestGroup: 'teman_kerja',
    plusOneAllowed: true,
    slug: 'budi-santoso',
    token: 'a7f3k9m2',
    fullSlug: 'budi-santoso-a7f3k9m2',
    openedAt: null,
    lastOpenedAt: null,
    openCount: 0,
    uniqueDevices: [],
    autoVisitCount: 0,
    rsvpStatus: 'pending',
    rsvp: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('menghasilkan pesan undangan resmi sesuai PRD Lampiran B', () => {
    const msg = generateWhatsAppInvitation(dummyGuest, 'https://wedding-alwi.vercel.app');
    expect(msg).toContain('Assalamualaikum Wr. Wb.');
    expect(msg).toContain('kami mengundang Bapak Budi Santoso');
    expect(msg).toContain('Alwi & Septy');
    expect(msg).toContain('Sabtu, 10 Oktober 2026');
    expect(msg).toContain('https://wedding-alwi.vercel.app/budi-santoso-a7f3k9m2');
    expect(msg).toContain('Tautan ini bersifat pribadi dan hanya berlaku untuk Bapak Budi Santoso.');
    expect(msg).toContain('Wassalamualaikum Wr. Wb.');
  });

  it('menghasilkan pesan pengingat RSVP yang santun dengan tanggal anjuran', () => {
    const msg = generateWhatsAppReminder(dummyGuest, 'https://wedding-alwi.vercel.app');
    expect(msg).toContain('Assalamualaikum Wr. Wb.');
    expect(msg).toContain('Yth. Bapak Budi Santoso');
    expect(msg).toContain('26 September 2026');
    expect(msg).toContain('https://wedding-alwi.vercel.app/budi-santoso-a7f3k9m2');
    expect(msg).toContain('Alwi & Septy');
  });
});

describe('Manajemen Tamu: Proteksi Server Actions', () => {
  it('menolak createGuestAction saat tanpa sesi admin', async () => {
    const res = await createGuestAction({ name: 'Tamu Rahasia' });
    expect(res.success).toBe(false);
    expect(res.error).toContain('Sesi admin tidak sah');
  });

  it('menolak updateGuestAction saat tanpa sesi admin', async () => {
    const res = await updateGuestAction('id-123', { name: 'Nama Baru' });
    expect(res.success).toBe(false);
    expect(res.error).toContain('Sesi admin tidak sah');
  });

  it('menolak deleteGuestAction saat tanpa sesi admin', async () => {
    const res = await deleteGuestAction('id-123');
    expect(res.success).toBe(false);
    expect(res.error).toContain('Sesi admin tidak sah');
  });

  it('menolak importGuestsAction saat tanpa sesi admin', async () => {
    const res = await importGuestsAction([{ name: 'Tamu A' }]);
    expect(res.success).toBe(false);
    expect(res.error).toContain('Sesi admin tidak sah');
  });
});
