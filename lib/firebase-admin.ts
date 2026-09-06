import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

function formatPrivateKey(key?: string): string | undefined {
  if (!key) return undefined;
  // Menangani format private key baik yang mengandung escape \n maupun newline asli
  return key.replace(/\\n/g, '\n');
}

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

export function getFirebaseAdminApp(): App {
  if (adminApp) return adminApp;

  const apps = getApps();
  if (apps.length > 0 && apps[0]) {
    adminApp = apps[0];
    return adminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Kredensial Firebase Admin SDK belum lengkap. Pastikan FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, dan FIREBASE_PRIVATE_KEY disetel di berkas environment.'
    );
  }

  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return adminApp;
}

export function getAdminDb(): Firestore {
  if (adminDb) return adminDb;
  const app = getFirebaseAdminApp();
  adminDb = getFirestore(app);
  return adminDb;
}

export function getAdminAuth(): Auth {
  if (adminAuth) return adminAuth;
  const app = getFirebaseAdminApp();
  adminAuth = getAuth(app);
  return adminAuth;
}
