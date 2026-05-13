'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [pairNumber, setPairNumber] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        stock: parseInt(stock) || 1,
        pairNumber: pairNumber ? parseInt(pairNumber) : null,
        isVisible,
      }),
    });

    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(json.error ?? 'Failed to create product');
      return;
    }

    router.push(`/admin/products/${json.id}`);
    router.refresh();
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={labelStyle}>Name</label>
        <input
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. The Wayfarer Black"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Price (€)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="29.99"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Stock</label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={e => setStock(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Pair number (optional)</label>
        <input
          type="number"
          min="1"
          max="999"
          value={pairNumber}
          onChange={e => setPairNumber(e.target.value)}
          placeholder="1–25 for the beta drop"
          style={inputStyle}
        />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={isVisible}
          onChange={e => setIsVisible(e.target.checked)}
          style={{ width: 14, height: 14, accentColor: '#c8f135' }}
        />
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: isVisible ? 'rgba(255,255,255,0.5)' : '#ff6b35' }}>
          {isVisible ? 'Visible in shop' : 'Hidden from shop (test / draft)'}
        </span>
      </label>

      {error && (
        <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.3)', padding: '0.5rem 0.75rem', margin: 0 }}>
          {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
        <button type="submit" disabled={submitting || !name || !price} style={submitBtn}>
          {submitting ? 'Creating…' : 'Create product'}
        </button>
        <a
          href="/admin/products"
          style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}
        >
          Cancel
        </a>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'monospace',
  fontSize: '0.6rem',
  letterSpacing: '0.1em',
  color: 'rgba(255,255,255,0.3)',
  textTransform: 'uppercase',
  marginBottom: '0.4rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  background: '#0d0d0d',
  border: '1px solid #2a2a2a',
  color: '#f5f5f5',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

const submitBtn: React.CSSProperties = {
  padding: '0.65rem 1.75rem',
  background: '#c8f135',
  color: '#050505',
  border: 'none',
  fontWeight: 700,
  fontSize: '0.85rem',
  letterSpacing: '0.03em',
  cursor: 'pointer',
  opacity: 1,
};
