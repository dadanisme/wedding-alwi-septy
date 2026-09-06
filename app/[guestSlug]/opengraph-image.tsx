import { getGuestByFullSlug } from '@/lib/db/guests';
import { generateWeddingOgImage } from '@/lib/og-helper';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ guestSlug: string }>;
}

export default async function Image({ params }: Props) {
  const { guestSlug } = await params;
  const guest = await getGuestByFullSlug(guestSlug);
  const displayName = guest
    ? guest.salutation
      ? `${guest.salutation} ${guest.name}`
      : guest.name
    : null;

  return generateWeddingOgImage(displayName);
}
