/**
 * Menghasilkan atau mengambil anonymous device ID dari localStorage.
 * Digunakan untuk indikator penerusan link (menghitung jumlah perangkat unik per link)
 * sesuai PRD §4.1 & §4.5 tanpa menyimpan data pribadi (PII).
 */
export function getClientDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    const KEY = "_as_dev_id";
    let deviceId = localStorage.getItem(KEY);
    if (!deviceId) {
      deviceId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem(KEY, deviceId);
    }
    return deviceId;
  } catch {
    // Fallback jika localStorage diblokir (mode incognito ketat / safari storage limit)
    return "";
  }
}
