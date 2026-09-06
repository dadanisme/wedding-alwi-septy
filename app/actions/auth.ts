'use server';

import { redirect } from 'next/navigation';
import { signInAdmin, setAdminSessionCookie, clearAdminSessionCookie } from '../../lib/auth';

export interface LoginActionResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action untuk memproses login admin.
 */
export async function loginAdminAction(
  _prevState: LoginActionResult | null,
  formData: FormData
): Promise<LoginActionResult> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || !email.trim()) {
    return { success: false, error: 'Email wajib diisi.' };
  }
  if (typeof password !== 'string' || !password.trim()) {
    return { success: false, error: 'Kata sandi wajib diisi.' };
  }

  const result = await signInAdmin(email, password);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  await setAdminSessionCookie(result.sessionCookie);

  // Redirect setelah session cookie terpasang
  redirect('/admin');
}

/**
 * Server Action untuk logout admin.
 */
export async function logoutAdminAction(): Promise<void> {
  await clearAdminSessionCookie();
  redirect('/admin/login');
}
