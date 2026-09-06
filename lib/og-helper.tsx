/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

let cachedBaseImageBase64: string | null = null;
let cachedMonogramBase64: string | null = null;
let cachedFontBuffer: ArrayBuffer | null = null;

async function getAssets() {
  if (!cachedBaseImageBase64) {
    const baseImgPath = join(process.cwd(), 'public', 'images', 'og-base.jpg');
    const baseImgBuffer = await readFile(baseImgPath);
    cachedBaseImageBase64 = `data:image/jpeg;base64,${baseImgBuffer.toString('base64')}`;
  }

  if (!cachedMonogramBase64) {
    const monogramPath = join(process.cwd(), 'public', 'logo', 'monogram-gold.png');
    const monogramBuffer = await readFile(monogramPath);
    cachedMonogramBase64 = `data:image/png;base64,${monogramBuffer.toString('base64')}`;
  }

  if (!cachedFontBuffer) {
    const fontPath = join(process.cwd(), 'public', 'fonts', 'CormorantGaramond-SemiBold.ttf');
    const buf = await readFile(fontPath);
    cachedFontBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }

  return {
    baseImage: cachedBaseImageBase64,
    monogram: cachedMonogramBase64,
    font: cachedFontBuffer,
  };
}

/**
 * Menghasilkan kartu gambar OpenGraph 1200 x 630 piksel standar PRD §4.6
 * dengan foto adat Sunda, monogram emas A&S, dan overlay nama tamu / general.
 */
export async function generateWeddingOgImage(guestName?: string | null) {
  const { baseImage, monogram, font } = await getAssets();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#1E1815',
          overflow: 'hidden',
        }}
      >
        {/* Background photo */}
        <img
          src={baseImage}
          alt="Alwi & Septy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '630px',
            objectFit: 'cover',
          }}
        />

        {/* Top subtle vignette */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '180px',
            background:
              'linear-gradient(180deg, rgba(20, 14, 10, 0.75) 0%, rgba(20, 14, 10, 0) 100%)',
            display: 'flex',
          }}
        />

        {/* Bottom rich espresso gradient */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '360px',
            background:
              'linear-gradient(0deg, rgba(20, 14, 10, 0.98) 0%, rgba(20, 14, 10, 0.90) 45%, rgba(20, 14, 10, 0.5) 75%, rgba(20, 14, 10, 0) 100%)',
            display: 'flex',
          }}
        />

        {/* Outer thin decorative gold border frame */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: '1px solid rgba(201, 162, 39, 0.45)',
            display: 'flex',
          }}
        />

        {/* Inner thin border frame */}
        <div
          style={{
            position: 'absolute',
            top: '26px',
            left: '26px',
            right: '26px',
            bottom: '26px',
            border: '1px solid rgba(201, 162, 39, 0.2)',
            display: 'flex',
          }}
        />

        {/* Top Header Badge */}
        <div
          style={{
            position: 'absolute',
            top: '36px',
            left: '40px',
            right: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={monogram} width={44} height={44} alt="A&S" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '13px',
                  letterSpacing: '3.5px',
                  textTransform: 'uppercase',
                  color: '#D4AF37',
                  fontWeight: 600,
                }}
              >
                Undangan Pernikahan
              </span>
              <span
                style={{
                  fontSize: '20px',
                  color: '#F7EFE1',
                  letterSpacing: '1px',
                  fontFamily: 'Cormorant Garamond',
                }}
              >
                Alwi & Septy
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 16px',
              borderRadius: '20px',
              backgroundColor: 'rgba(30, 24, 21, 0.65)',
              border: '1px solid rgba(201, 162, 39, 0.4)',
              color: '#E5D8C5',
              fontSize: '13px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            10 · 10 · 2026
          </div>
        </div>

        {/* Bottom Content Area */}
        <div
          style={{
            position: 'absolute',
            bottom: '42px',
            left: '50px',
            right: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {guestName ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: '#D4AF37',
                  marginBottom: '4px',
                  fontWeight: 600,
                }}
              >
                Kepada Yth.
              </span>
              <span
                style={{
                  fontSize: '52px',
                  color: '#FFFFFF',
                  fontFamily: 'Cormorant Garamond',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                  maxWidth: '960px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {guestName}
              </span>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  letterSpacing: '4px',
                  textTransform: 'uppercase',
                  color: '#D4AF37',
                  marginBottom: '6px',
                  fontWeight: 600,
                }}
              >
                The Wedding Of
              </span>
              <span
                style={{
                  fontSize: '54px',
                  color: '#FFFFFF',
                  fontFamily: 'Cormorant Garamond',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                }}
              >
                Alwi & Septy
              </span>
            </div>
          )}

          {/* Gold separator divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              width: '100%',
              margin: '6px 0 10px 0',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #C9A227)',
              }}
            />
            <div
              style={{
                width: '6px',
                height: '6px',
                transform: 'rotate(45deg)',
                backgroundColor: '#C9A227',
              }}
            />
            <div
              style={{
                width: '120px',
                height: '1px',
                background: 'linear-gradient(90deg, #C9A227, transparent)',
              }}
            />
          </div>

          <span
            style={{
              fontSize: '15px',
              color: '#E5D8C5',
              letterSpacing: '1.5px',
            }}
          >
            Sabtu, 10 Oktober 2026 · Steikhaus (Area Pabrik Bajoe), Bandung
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Cormorant Garamond',
          data: font,
          weight: 600,
          style: 'normal',
        },
      ],
    }
  );
}
