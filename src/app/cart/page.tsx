'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center px-3"
        style={{ minHeight: 'calc(100svh - 200px)', gap: '1.25rem' }}
      >
        <p className="font-monospace text-secondary small mb-0">{'// cart is empty'}</p>
        <p className="text-secondary" style={{ maxWidth: 320, fontSize: '0.9rem' }}>
          25 pairs. Not one in your cart yet.
        </p>
        <Link href="/shop" className="btn btn-accent px-5 fw-bold">
          Back to the drop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-5" style={{ maxWidth: 800, margin: '0 auto' }}>
      <p className="checkout-section-label mb-1">{'// your selection'}</p>
      <h1 className="fw-bold h3 mb-5">Your cart</h1>

      <div className="d-flex flex-column gap-4 mb-5">
        {items.map(({ product, quantity }) => {
          const thumbnail = product.images[0] ?? '/images/placeholder.jpg';
          return (
            <div key={product.id} className="d-flex gap-3 align-items-start border-bottom border-dark pb-4">
              {/* Thumbnail */}
              <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0, background: '#111' }}>
                <Image
                  src={thumbnail}
                  alt={product.name}
                  fill
                  sizes="80px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Details */}
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex justify-content-between align-items-start">
                  <Link href={`/shop/${product.slug}`} className="fw-semibold">
                    {product.name}
                  </Link>
                  <span className="fw-bold ms-3 flex-shrink-0">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
                <p className="text-secondary small mb-2">{formatPrice(product.price)} each</p>

                {/* Quantity control */}
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary px-2 py-0"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="font-monospace small" style={{ minWidth: 20, textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-secondary px-2 py-0"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    className="btn btn-sm btn-link text-secondary p-0 ms-2"
                    onClick={() => removeItem(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary + CTA */}
      <div className="border-top pt-4" style={{ borderColor: '#222 !important' }}>
        <div className="d-flex justify-content-between mb-2 small">
          <span className="text-secondary">Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="d-flex justify-content-between mb-1 small">
          <span className="text-secondary">Shipping</span>
          <span className="font-monospace" style={{ color: 'var(--color-accent)', fontSize: '0.75rem' }}>free</span>
        </div>
        <p className="text-secondary mb-4" style={{ fontSize: '0.7rem', textAlign: 'right', fontFamily: 'monospace' }}>
          Netherlands only
        </p>
        <Link href="/checkout" className="btn btn-accent w-100 btn-lg fw-bold">
          Go to checkout → {formatPrice(totalPrice)}
        </Link>
        <Link href="/shop" className="btn btn-link w-100 text-secondary mt-2 small p-0" style={{ opacity: 0.5 }}>
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
}
