import { redirect } from 'next/navigation';
import { verifyAdminSession } from '../../../lib/auth';
import LoginForm from '../../../components/admin/login-form';

export default async function AdminLoginPage() {
  const session = await verifyAdminSession();

  // Jika sudah login, langsung alihkan ke dashboard admin
  if (session.authenticated) {
    redirect('/admin');
  }

  return <LoginForm />;
}
