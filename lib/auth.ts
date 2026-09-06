import { cookies } from 'next/headers';
import { getAdminAuth } from './firebase-admin';

export const ADMIN_SESSION_COOKIE = '__session';
// Sesi berlaku selama 5 hari (dalam milidetik)
export const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;
export const SESSION_DURATION_SEC = 5 * 24 * 60 * 60;

export interface AdminUser {
  uid: string;
  email: string;
}

export interface AdminAuthResult {
  authenticated: boolean;
  user: AdminUser | null;
}

/**
 * Memverifikasi email dan password admin ke Firebase Auth via Google Identity Toolkit REST API,
 * lalu membuat session cookie terenkripsi menggunakan Firebase Admin SDK.
 */
export async function signInAdmin(
  email: string,
  pass: string
): Promise<{ success: true; sessionCookie: string } | { success: false; error: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: 'Email dan password wajib diisi.' };
  }

  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey) {
    console.error('FIREBASE_WEB_API_KEY belum dikonfigurasi di environment.');
    return {
      success: false,
      error: 'Konfigurasi autentikasi server belum lengkap. Hubungi developer.',
    };
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPass,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errCode = data?.error?.message;
      if (
        errCode === 'EMAIL_NOT_FOUND' ||
        errCode === 'INVALID_PASSWORD' ||
        errCode === 'INVALID_LOGIN_CREDENTIALS'
      ) {
        return { success: false, error: 'Email atau kata sandi tidak sesuai.' };
      }
      if (errCode === 'USER_DISABLED') {
        return { success: false, error: 'Akun admin ini telah dinonaktifkan.' };
      }
      if (errCode === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        return {
          success: false,
          error: 'Terlalu banyak percobaan gagal. Silakan coba lagi beberapa saat lagi.',
        };
      }
      console.error('Firebase Auth sign-in error:', data?.error);
      return { success: false, error: 'Gagal memproses login admin. Silakan coba lagi.' };
    }

    const idToken = data.idToken;
    if (!idToken) {
      return { success: false, error: 'Token autentikasi tidak valid dari penyedia.' };
    }

    const auth = getAdminAuth();
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    return { success: true, sessionCookie };
  } catch (err) {
    console.error('Kesalahan saat login admin:', err);
    return {
      success: false,
      error: 'Terjadi kendala jaringan saat menghubung server autentikasi.',
    };
  }
}

/**
 * Menyimpan session cookie admin ke response header HTTP via next/headers cookies.
 */
export async function setAdminSessionCookie(sessionCookie: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_SEC,
    path: '/',
  });
}

/**
 * Menghapus session cookie admin untuk proses logout.
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

/**
 * Memverifikasi validitas session cookie admin saat ini.
 * Memastikan sesi belum expired atau dicabut (revoked) di Firebase.
 */
export async function verifyAdminSession(customCookie?: string): Promise<AdminAuthResult> {
  try {
    let sessionCookie = customCookie;
    if (!sessionCookie) {
      const cookieStore = await cookies();
      sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    }

    if (!sessionCookie) {
      return { authenticated: false, user: null };
    }

    const auth = getAdminAuth();
    // checkRevoked: true untuk memeriksa apakah token telah dibatalkan
    const decoded = await auth.verifySessionCookie(sessionCookie, true);

    return {
      authenticated: true,
      user: {
        uid: decoded.uid,
        email: decoded.email || '',
      },
    };
  } catch {
    // Sesi tidak valid, kadaluarsa, atau dicabut
    return { authenticated: false, user: null };
  }
}
