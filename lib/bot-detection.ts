/**
 * Utilitas pendeteksi perayap / bot preview (WhatsApp, Telegram, Googlebot, dll).
 * Sesuai PRD §4.5: kunjungan sistem preview harus dikenali agar tidak tercatat
 * sebagai pembukaan nyata oleh tamu undangan.
 */

const BOT_USER_AGENT_PATTERNS = [
  /whatsapp/i,
  /facebookexternalhit/i,
  /telegrambot/i,
  /twitterbot/i,
  /googlebot/i,
  /bingbot/i,
  /slackbot/i,
  /linkedinbot/i,
  /discordbot/i,
  /applebot/i,
  /skypeuripreview/i,
  /crawler/i,
  /spider/i,
  /bot/i,
];

export function isBotUserAgent(userAgent?: string | null): boolean {
  if (!userAgent) return false;
  return BOT_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent));
}
