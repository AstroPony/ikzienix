'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface Props {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const prev = useCallback(() => {
    setLightboxIndex(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex(i => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, closeLightbox, prev, next]);

  // Touch swipe
  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); }
  };

  const mainImage = images[active] ?? '/images/placeholder.jpg';

  return (
    <>
      {/* Main image */}
      <div
        className="position-relative"
        style={{ aspectRatio: '1/1', background: '#0d0d0d', cursor: images.length > 0 ? 'zoom-in' : 'default' }}
        onClick={() => openLightbox(active)}
      >
        <Image
          src={mainImage}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
          priority
        />
        {images.length > 1 && (
          <span style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            fontFamily: 'monospace',
            fontSize: '0.62rem',
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(0,0,0,0.6)',
            padding: '3px 7px',
          }}>
            {active + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="d-flex gap-2 mt-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                position: 'relative',
                width: 72,
                height: 72,
                flexShrink: 0,
                background: '#0d0d0d',
                border: `1px solid ${i === active ? '#c8f135' : 'transparent'}`,
                padding: 0,
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              aria-label={`View photo ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${productName} view ${i + 1}`}
                fill
                sizes="72px"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              minWidth: 44,
              minHeight: 44,
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>

          {/* Counter */}
          <span style={{
            position: 'absolute',
            top: 22,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
          }}>
            {lightboxIndex + 1} / {images.length}
          </span>

          {/* Prev arrow */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              style={arrowStyle('left')}
              aria-label="Previous image"
            >
              ←
            </button>
          )}

          {/* Main image */}
          <div
            style={{ position: 'relative', width: '90vw', height: '85vh', maxWidth: 900 }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${productName} ${lightboxIndex + 1}`}
              fill
              sizes="90vw"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          {/* Next arrow */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              style={arrowStyle('right')}
              aria-label="Next image"
            >
              →
            </button>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.4rem' }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setLightboxIndex(i); }}
                  style={{
                    width: i === lightboxIndex ? 20 : 6,
                    height: 6,
                    background: i === lightboxIndex ? '#c8f135' : 'rgba(255,255,255,0.25)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    [side]: 20,
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'monospace',
    fontSize: '1.1rem',
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'all 0.15s',
  };
}
