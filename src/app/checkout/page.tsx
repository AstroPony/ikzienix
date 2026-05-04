'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid email'),
  address: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  postalCode: z.string().min(4, 'Enter a valid postal code'),
  country: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { country: 'NL' } });

  if (items.length === 0) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center px-3"
        style={{ minHeight: 'calc(100svh - 200px)', gap: '1.25rem' }}
      >
        <p className="font-monospace text-secondary small mb-0">{'// cart is empty'}</p>
        <p className="text-secondary" style={{ maxWidth: 320, fontSize: '0.9rem' }}>
          Nothing to check out. Head back and find your pair.
        </p>
        <Link href="/shop" className="btn btn-accent fw-bold px-5">
          Back to the drop
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
          })),
          shipping: data,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? 'Something went wrong. Try again.');
        return;
      }

      clearCart();
      window.location.href = json.checkoutUrl;
    } catch {
      setError('Connection error. Check your internet and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-5">
      <div className="row g-5 justify-content-center" style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Form column */}
        <div className="col-12 col-md-7">
          <p className="checkout-section-label mb-1">{'// step 1 of 1'}</p>
          <h1 className="fw-bold h3 mb-5">Shipping details</h1>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label">First name</label>
                <input
                  {...register('firstName')}
                  autoComplete="given-name"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                />
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName.message}</div>
                )}
              </div>

              <div className="col-6">
                <label className="form-label">Last name</label>
                <input
                  {...register('lastName')}
                  autoComplete="family-name"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName.message}</div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label">Address</label>
                <input
                  {...register('address')}
                  autoComplete="street-address"
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                />
                {errors.address && (
                  <div className="invalid-feedback">{errors.address.message}</div>
                )}
              </div>

              <div className="col-5">
                <label className="form-label">Postal code</label>
                <input
                  {...register('postalCode')}
                  autoComplete="postal-code"
                  className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                />
                {errors.postalCode && (
                  <div className="invalid-feedback">{errors.postalCode.message}</div>
                )}
              </div>

              <div className="col-7">
                <label className="form-label">City</label>
                <input
                  {...register('city')}
                  autoComplete="address-level2"
                  className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                />
                {errors.city && (
                  <div className="invalid-feedback">{errors.city.message}</div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label">Country</label>
                <select
                  {...register('country')}
                  autoComplete="country"
                  className="form-select"
                >
                  <option value="NL">Netherlands</option>
                  <option value="BE">Belgium</option>
                  <option value="DE">Germany</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger mt-4">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-accent w-100 btn-lg fw-bold mt-5"
              disabled={submitting}
            >
              {submitting
                ? '↗ Connecting to Stripe…'
                : `Pay ${formatPrice(totalPrice)} — secure checkout`}
            </button>

            <p className="text-center mt-3 mb-0" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
              iDEAL · Card · Stripe encrypted
            </p>
          </form>
        </div>

        {/* Order summary */}
        <div className="col-12 col-md-5">
          <div className="order-summary-card">
            <p className="order-summary-label">Order summary</p>
            <div className="d-flex flex-column gap-3 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="d-flex justify-content-between small">
                  <span>
                    {product.name}
                    {quantity > 1 && (
                      <span className="text-secondary ms-1 font-monospace" style={{ fontSize: '0.75rem' }}>
                        ×{quantity}
                      </span>
                    )}
                  </span>
                  <span className="text-secondary">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between small mb-2">
              <span className="text-secondary">Shipping</span>
              <span className="font-monospace" style={{ color: 'var(--color-accent)', fontSize: '0.78rem' }}>free</span>
            </div>

            <div className="border-top pt-3 mt-1 d-flex justify-content-between" style={{ borderColor: '#222 !important' }}>
              <span className="fw-bold">Total</span>
              <span className="fw-bold">{formatPrice(totalPrice)}</span>
            </div>

            <p className="mt-4 mb-0" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', lineHeight: 1.6 }}>
              Beta drop — one of 25.<br />
              No restocks. No logo yet.
            </p>
          </div>

          <Link href="/cart" className="d-block text-center mt-3" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
            ← edit cart
          </Link>
        </div>
      </div>
    </div>
  );
}
