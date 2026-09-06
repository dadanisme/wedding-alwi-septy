import { redirect } from 'next/navigation';
import { verifyAdminSession } from '../../lib/auth';
import { getGuestStats } from '../../lib/db/guests';
import { getAllMessagesForAdmin } from '../../lib/db/messages';
import AdminDashboardClient from '../../components/admin/dashboard-client';

export default async function AdminPage() {
  const session = await verifyAdminSession();

  // Wajib autentikasi admin: jika belum login atau sesi kadaluwarsa, redirect ke login
  if (!session.authenticated || !session.user) {
    redirect('/admin/login');
  }

  // Ambil data statistik dan seluruh pesan Buku Tamu secara paralel di sisi server
  const [stats, messages] = await Promise.all([
    getGuestStats(),
    getAllMessagesForAdmin(),
  ]);

  return (
    <AdminDashboardClient
      initialStats={stats}
      initialMessages={messages}
      adminEmail={session.user.email}
    />
  );
}
