'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/contexts/CartContext';

interface Props {
  product: Product;
  totalPairs?: number;
}

export default function ProductCard({ product, totalPairs = 25 }: Props) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, items } = useCart();

  const thumbnail = product.images[0] ?? '/images/placeholder.jpg';
  const isSoldOut = product.stock === 0;
  const alreadyInCart = items.some((i) => i.product.id === product.id);
  const pairNum = product.pairNumber;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (alreadyInCart || isSoldOut) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      className={`product-card h-100 d-flex flex-column${isSoldOut ? ' product-card--claimed' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image + overlays */}
      <div className="product-card-media position-relative overflow-hidden">
        <Link href={`/shop/${product.slug}`} tabIndex={-1} aria-hidden="true">
          <Image
            src={thumbnail}
            alt={product.name}
            width={600}
            height={600}
            className="product-card-img"
            style={{ width: '100%', height: 'auto' }}
          />
        </Link>

        {/* Pair number — top-left */}
        {pairNum != null && (
          <span className="pair-badge">
            #{pairNum}<span className="pair-badge-total"> of {totalPairs}</span>
          </span>
        )}

        {/* Urgency badge — low stock */}
        {!isSoldOut && product.stock <= 3 && (
          <span className="urgency-badge">{product.stock} left</span>
        )}

        {/* Claimed overlay — sold out */}
        {isSoldOut && (
          <div className="claimed-overlay" aria-label="Sold out">
            <span className="claimed-label">claimed</span>
          </div>
        )}

        {/* Hover quick-add — desktop only */}
        {!isSoldOut && (
          <div
            className={`quick-add-overlay${hovered ? ' quick-add-overlay--visible' : ''}`}
            aria-hidden="true"
          >
            <button
              className={`btn fw-bold w-100${added ? ' btn-outline-light' : ' btn-accent'}`}
              onClick={handleAdd}
              tabIndex={hovered ? 0 : -1}
            >
              {alreadyInCart && !added ? '✓ In cart' : added ? '✓ Added' : 'Quick add'}
            </button>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
          <Link
            href={`/shop/${product.slug}`}
            className={`fw-semibold lh-sm${isSoldOut ? ' text-secondary' : ''}`}
          >
            {product.name}
          </Link>
          {product.isLimited && !isSoldOut && (
            <span className="limited-badge flex-shrink-0">LIMITED</span>
          )}
        </div>

        <div className="d-flex align-items-center justify-content-between mt-auto pt-2">
          <span className={`fw-bold${isSoldOut ? ' text-secondary' : ''}`}>
            {formatPrice(product.price)}
          </span>
          {isSoldOut ? (
            <span className="text-secondary font-monospace" style={{ fontSize: '0.7rem' }}>
              gone
            </span>
          ) : (
            /* Mobile: always-visible add button — 44px min touch target */
            <button
              className={`btn btn-sm fw-bold d-md-none${alreadyInCart ? ' btn-outline-light' : ' btn-accent'}`}
              onClick={handleAdd}
              style={{ minWidth: 44, minHeight: 44 }}
            >
              {alreadyInCart ? '✓' : '+'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
