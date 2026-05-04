import { prisma } from '@/lib/prisma';
import AdminNav from '@/components/admin/AdminNav';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Waitlist' };
export const dynamic = 'force-dynamic';

export default async function AdminWaitlistPage() {
  const entries = await prisma.waitlistEntry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <AdminNav />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          {'// waitlist'}
        </p>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f5f5f5' }}>
          {entries.length} signups
        </h1>
        <p style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>
          These people want to be first for v1.0.
        </p>

        {entries.length === 0 ? (
          <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>
            No signups yet. Popup triggers when stock ≤ 3 or sold out.
          </p>
        ) : (
          <div style={{ border: '1px solid #1e1e1e' }}>
            {entries.map((e, i) => (
              <div
                key={e.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 5rem 8rem',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.8rem 1.25rem',
                  borderBottom: i < entries.length - 1 ? '1px solid #1a1a1a' : 'none',
                  background: '#0a0a0a',
                }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#f5f5f5' }}>
                  {e.email}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                  {e.source}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}>
                  {new Date(e.createdAt).toLocaleDateString('nl-NL')}
                </span>
              </div>
            ))}
          </div>
        )}

        {entries.length > 0 && (
          <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginTop: '1rem', textAlign: 'right' }}>
            export: copy emails below ↓
          </p>
        )}

        {entries.length > 0 && (
          <textarea
            readOnly
            value={entries.map(e => e.email).join('\n')}
            style={{
              width: '100%',
              background: '#0a0a0a',
              border: '1px solid #1a1a1a',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              padding: '0.75rem',
              marginTop: '0.5rem',
              resize: 'none',
              height: 120,
              boxSizing: 'border-box',
            }}
          />
        )}
      </div>
    </div>
  );
}
