'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string | null;
  isLimited: boolean;
  pairNumber: number | null;
  images: string[];
}

interface Props {
  product: Product;
}

export default function ProductEditor({ product }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState((product.price / 100).toFixed(2));
  const [stock, setStock] = useState(String(product.stock));
  const [category, setCategory] = useState(product.category ?? '');
  const [isLimited, setIsLimited] = useState(product.isLimited);
  const [images, setImages] = useState<string[]>(product.images);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
    const json = await res.json();
    setUploading(false);
    if (!res.ok) { setError(json.error ?? 'Upload failed'); return; }
    setImages(prev => [...prev, json.url]);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(uploadFile);
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const moveImage = (from: number, to: number) => {
    if (from === to) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setImages(next);
  };

  const save = async () => {
    setSaving(true);
    setError('');
    setSaved(false);

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price: parseFloat(price), stock: parseInt(stock), category: category || null, isLimited, images }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } else {
      const json = await res.json();
      setError(json.error ?? 'Save failed');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>

      {/* Left — fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <Field label="Name">
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="Price (€)">
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={e => setPrice(e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="Stock">
            <input
              type="number"
              min="0"
              value={stock}
              onChange={e => setStock(e.target.value)}
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="Category">
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            <option value="">— none —</option>
            <option value="Wayfarers">Wayfarers</option>
            <option value="Oversized">Oversized</option>
            <option value="Statement">Statement</option>
            <option value="Classic">Classic</option>
          </select>
        </Field>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isLimited}
            onChange={e => setIsLimited(e.target.checked)}
            style={{ width: 14, height: 14, accentColor: '#c8f135' }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
            Mark as limited
          </span>
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <button onClick={save} disabled={saving} style={saveBtn}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
          </button>
          <a
            href={`/shop/${product.slug}`}
            target="_blank"
            style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}
          >
            ↗ view on site
          </a>
        </div>

        {error && (
          <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.3)', padding: '0.5rem 0.75rem', margin: 0 }}>
            {error}
          </p>
        )}
      </div>

      {/* Right — images */}
      <div>
        <p style={sectionLabel}>Photos ({images.length}/3+)</p>

        {/* Upload drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          style={{
            border: `1px dashed ${dragOver ? '#c8f135' : '#2a2a2a'}`,
            background: dragOver ? 'rgba(200,241,53,0.05)' : '#0a0a0a',
            padding: '1.25rem',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '1rem',
            transition: 'all 0.15s',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
          <p style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: uploading ? '#c8f135' : 'rgba(255,255,255,0.3)', margin: 0 }}>
            {uploading ? 'Uploading…' : '+ click or drag to upload'}
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', margin: '0.25rem 0 0' }}>
            JPEG · PNG · WebP · AVIF
          </p>
        </div>

        {/* Image grid */}
        {images.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {images.map((url, idx) => (
              <div
                key={url + idx}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={e => { e.preventDefault(); setDragOverIndex(idx); }}
                onDrop={e => { e.preventDefault(); if (dragIndex != null) moveImage(dragIndex, idx); setDragIndex(null); setDragOverIndex(null); }}
                onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem',
                  background: dragOverIndex === idx ? '#1a1a1a' : '#0d0d0d',
                  border: `1px solid ${dragOverIndex === idx ? '#333' : '#1a1a1a'}`,
                  cursor: 'grab',
                  transition: 'background 0.1s',
                  opacity: dragIndex === idx ? 0.4 : 1,
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0, background: '#111' }}>
                  <Image src={url} alt={`Photo ${idx + 1}`} fill sizes="56px" style={{ objectFit: 'cover' }} />
                </div>

                {/* Labels */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: idx === 0 ? '#c8f135' : 'rgba(255,255,255,0.3)', margin: 0 }}>
                    {idx === 0 ? 'cover photo' : `photo ${idx + 1}`}
                  </p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {url.split('/').pop()}
                  </p>
                </div>

                {/* Drag handle + remove */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', lineHeight: 1 }}>⠿</span>
                  <button
                    onClick={() => removeImage(idx)}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,107,107,0.6)', fontSize: '0.75rem', cursor: 'pointer', padding: '0 0.2rem' }}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '0.25rem' }}>
              drag to reorder · first image is the cover
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={sectionLabel}>{label}</label>
      {children}
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
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

const saveBtn: React.CSSProperties = {
  padding: '0.65rem 1.75rem',
  background: '#c8f135',
  color: '#050505',
  border: 'none',
  fontWeight: 700,
  fontSize: '0.85rem',
  letterSpacing: '0.03em',
  cursor: 'pointer',
};
