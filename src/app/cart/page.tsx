'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-fluid px-3 px-md-4 py-5 text-center" style={{ maxWidth: 600, margin: '0 auto' }}>
        <p className="font-monospace text-secondary mb-4">{'// cart is empty'}</p>
        <h1 className="h3 fw-bold mb-4">Nothing here yet.</h1>
        <Link href="/shop" className="btn btn-accent px-5 fw-bold">
          Back to the drop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-5" style={{ maxWidth: 800, margin: '0 auto' }}>
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
      <div className="border-top border-dark pt-4">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-secondary">Subtotal</span>
          <span className="fw-bold">{formatPrice(totalPrice)}</span>
        </div>
        <div className="d-flex justify-content-between mb-4">
          <span className="text-secondary small">Shipping</span>
          <span className="text-secondary small">Free in NL</span>
        </div>
        <Link href="/checkout" className="btn btn-accent w-100 btn-lg fw-bold">
          Checkout
        </Link>
        <Link href="/shop" className="btn btn-link w-100 text-secondary mt-2 small">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
