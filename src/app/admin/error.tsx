'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[admin] Page error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.14em', color: '#ff6b35', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          {'// admin.error'}
        </p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f5f5f5', marginBottom: '1rem' }}>
          Something went wrong
        </h1>
        <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>
          {error.digest ? `digest: ${error.digest}` : 'Check server logs for details.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{ padding: '0.6rem 1.5rem', background: '#c8f135', color: '#050505', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Try again
          </button>
          <Link href="/admin/products" style={{ padding: '0.6rem 1.5rem', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            Back to products
          </Link>
        </div>
      </div>
    </div>
  );
}
