'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ikzienix_waitlist_dismissed';

type Trigger = 'soldout' | 'low';

interface Props {
  totalStock: number;
}

export default function WaitlistPopup({ totalStock }: Props) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trigger: Trigger = totalStock === 0 ? 'soldout' : 'low';
  const shouldShow = totalStock === 0 || totalStock <= 3;

  useEffect(() => {
    if (!shouldShow) return;
    if (localStorage.getItem(STORAGE_KEY) === '1') return;
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, [shouldShow]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: trigger }),
    });

    setLoading(false);
    if (res.ok) {
      setSubmitted(true);
      localStorage.setItem(STORAGE_KEY, '1');
      setTimeout(() => setVisible(false), 3000);
    } else {
      setError('Something went wrong. Try again.');
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 10000,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10001,
        width: '90vw',
        maxWidth: 460,
        background: '#0a0a0a',
        border: '1px solid #2a2a2a',
        padding: '2.5rem 2rem',
      }}>
        {/* Close */}
        <button
          onClick={dismiss}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.9rem',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '0.2rem 0.4rem',
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {submitted ? (
          // Success state
          <>
            <p style={monoLabel}>{'// you\'re on the list'}</p>
            <h2 style={heading}>We see you.</h2>
            <p style={body}>
              When v1.0 drops, you&apos;ll hear about it before anyone else.
              Check your inbox — and keep an eye on{' '}
              <a href="https://www.instagram.com/ikzienix" target="_blank" rel="noopener noreferrer" style={{ color: '#c8f135' }}>
                @ikzienix
              </a>.
            </p>
          </>
        ) : trigger === 'soldout' ? (
          // Sold out state
          <>
            <p style={monoLabel}>{'// drop.status = closed'}</p>
            <h2 style={heading}>25 of 25<br />claimed.</h2>
            <p style={body}>
              The beta drop is gone. But v1.0 is coming — branded, 100 pairs.
              Leave your email and you&apos;ll get first access and a discount before anyone else.
            </p>
            <form onSubmit={submit}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={inputStyle}
              />
              {error && <p style={{ color: '#ff6b6b', fontFamily: 'monospace', fontSize: '0.72rem', margin: '0.4rem 0 0' }}>{error}</p>}
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? 'Saving…' : 'Notify me first + get a discount'}
              </button>
              <p style={fine}>No spam. One email when v1.0 is live.</p>
            </form>
          </>
        ) : (
          // Low stock state
          <>
            <p style={monoLabel}>{'// stock.warning = true'}</p>
            <h2 style={heading}>
              {totalStock} pair{totalStock !== 1 ? 's' : ''} left.
            </h2>
            <p style={body}>
              The beta drop is nearly gone. If you miss it, sign up and you&apos;ll get
              first access to v1.0 — plus a discount on your first pair.
            </p>
            <form onSubmit={submit}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={inputStyle}
              />
              {error && <p style={{ color: '#ff6b6b', fontFamily: 'monospace', fontSize: '0.72rem', margin: '0.4rem 0 0' }}>{error}</p>}
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? 'Saving…' : 'Notify me when v1.0 drops'}
              </button>
              <p style={fine}>No spam. Discount included if you sign up now.</p>
            </form>
          </>
        )}
      </div>
    </>
  );
}

const monoLabel: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.62rem',
  letterSpacing: '0.12em',
  color: '#c8f135',
  textTransform: 'uppercase',
  marginBottom: '0.5rem',
};

const heading: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
  fontWeight: 700,
  lineHeight: 1.1,
  color: '#f5f5f5',
  marginBottom: '1rem',
};

const body: React.CSSProperties = {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '0.9rem',
  lineHeight: 1.7,
  marginBottom: '1.5rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.75rem',
  background: '#111',
  border: '1px solid #2a2a2a',
  color: '#f5f5f5',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  marginBottom: '0.75rem',
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  background: '#c8f135',
  color: '#050505',
  border: 'none',
  fontWeight: 700,
  fontSize: '0.85rem',
  letterSpacing: '0.02em',
  cursor: 'pointer',
  marginBottom: '0.75rem',
};

const fine: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.62rem',
  color: 'rgba(255,255,255,0.2)',
  textAlign: 'center',
  margin: 0,
};
