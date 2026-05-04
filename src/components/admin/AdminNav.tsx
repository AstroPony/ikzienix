'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNav() {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <nav style={{
      borderBottom: '1px solid #1a1a1a',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#050505',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link href="/admin/products" style={{ fontWeight: 700, color: '#f5f5f5', textDecoration: 'none', fontSize: '0.9rem' }}>
          ik<span style={{ color: '#c8f135' }}>zienix</span>
          <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginLeft: '0.5rem' }}>admin</span>
        </Link>
        <Link href="/admin/products" style={navLinkStyle}>Products</Link>
        <Link href="/admin/waitlist" style={navLinkStyle}>Waitlist</Link>
        <Link href="/" target="_blank" style={navLinkStyle}>↗ site</Link>
      </div>

      <button onClick={logout} style={logoutStyle}>
        sign out
      </button>
    </nav>
  );
}

const navLinkStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  color: 'rgba(255,255,255,0.45)',
  textDecoration: 'none',
  letterSpacing: '0.05em',
};

const logoutStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #2a2a2a',
  color: 'rgba(255,255,255,0.35)',
  fontFamily: 'monospace',
  fontSize: '0.7rem',
  letterSpacing: '0.05em',
  padding: '0.3rem 0.75rem',
  cursor: 'pointer',
};
