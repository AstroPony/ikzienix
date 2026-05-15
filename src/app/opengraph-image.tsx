import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ikzienix — affordable unbranded sunglasses from Amsterdam';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
        }}
      >
        {/* Top: version stamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 14,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            β — build 0.1 · Amsterdam
          </div>
        </div>

        {/* Middle: wordmark + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            fontSize: 112,
            fontWeight: 700,
            letterSpacing: '-3px',
            lineHeight: 1,
            display: 'flex',
          }}>
            <span style={{ color: '#f5f5f5' }}>ik</span>
            <span style={{ color: '#c8f135' }}>zienix</span>
          </div>
          <div style={{
            fontSize: 26,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.01em',
            lineHeight: 1.4,
          }}>
            Unbranded sunglasses — from €24,99 — free shipping NL
          </div>
        </div>

        {/* Bottom: accent bar + pair count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            background: '#c8f135',
            color: '#0a0a0a',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '10px 20px',
          }}>
            25 pairs · beta drop
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 14,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.08em',
          }}>
            ikzienix.nl
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
