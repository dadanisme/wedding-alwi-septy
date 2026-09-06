import { redirect } from 'next/navigation';
import { verifyAdminSession } from '../../lib/auth';
import { getGuestStats, getAllGuests } from '../../lib/db/guests';
import { getAllMessagesForAdmin } from '../../lib/db/messages';
import AdminDashboardClient from '../../components/admin/dashboard-client';

export default async function AdminPage() {
  const session = await verifyAdminSession();

  // Wajib autentikasi admin: jika belum login atau sesi kadaluwarsa, redirect ke login
  if (!session.authenticated || !session.user) {
    redirect('/admin/login');
  }

  // Ambil data statistik, pesan Buku Tamu, dan seluruh tamu secara paralel di sisi server
  const [stats, messages, guests] = await Promise.all([
    getGuestStats(),
    getAllMessagesForAdmin(),
    getAllGuests(),
  ]);

  return (
    <AdminDashboardClient
      initialStats={stats}
      initialMessages={messages}
      initialGuests={guests}
      adminEmail={session.user.email}
    />
  );
}
