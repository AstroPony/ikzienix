'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/admin/products');
    } else {
      const json = await res.json();
      setError(json.error ?? 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#050505',
      }}
    >
      <div style={{ width: '100%', maxWidth: 360 }}>
        <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.14em', color: '#c8f135', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          {'// admin.login'}
        </p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', color: '#f5f5f5' }}>
          ik<span style={{ color: '#c8f135' }}>zienix</span> admin
        </h1>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#ff6b6b', marginBottom: '1rem', border: '1px solid rgba(255,107,107,0.3)', padding: '0.5rem 0.75rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#c8f135',
              color: '#050505',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.04em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'monospace',
  fontSize: '0.7rem',
  letterSpacing: '0.08em',
  color: 'rgba(255,255,255,0.4)',
  textTransform: 'uppercase',
  marginBottom: '0.4rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  background: '#111',
  border: '1px solid #2a2a2a',
  color: '#f5f5f5',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};
