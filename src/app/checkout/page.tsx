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
      <div className="container-fluid px-3 py-5 text-center" style={{ maxWidth: 500, margin: '0 auto' }}>
        <p className="text-secondary font-monospace mb-4">{'// nothing to checkout'}</p>
        <Link href="/shop" className="btn btn-accent fw-bold px-5">Back to shop</Link>
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
      // Redirect to Mollie hosted checkout
      window.location.href = json.checkoutUrl;
    } catch {
      setError('Connection error. Check your internet and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-5">
      <div className="row g-5 justify-content-center" style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Form */}
        <div className="col-12 col-md-7">
          <h1 className="fw-bold h3 mb-5">Shipping details</h1>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label small text-secondary">First name</label>
                <input
                  {...register('firstName')}
                  className={`form-control bg-transparent text-white border-secondary ${errors.firstName ? 'is-invalid' : ''}`}
                />
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName.message}</div>
                )}
              </div>
              <div className="col-6">
                <label className="form-label small text-secondary">Last name</label>
                <input
                  {...register('lastName')}
                  className={`form-control bg-transparent text-white border-secondary ${errors.lastName ? 'is-invalid' : ''}`}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName.message}</div>
                )}
              </div>
              <div className="col-12">
                <label className="form-label small text-secondary">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className={`form-control bg-transparent text-white border-secondary ${errors.email ? 'is-invalid' : ''}`}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>
              <div className="col-12">
                <label className="form-label small text-secondary">Address</label>
                <input
                  {...register('address')}
                  className={`form-control bg-transparent text-white border-secondary ${errors.address ? 'is-invalid' : ''}`}
                />
                {errors.address && (
                  <div className="invalid-feedback">{errors.address.message}</div>
                )}
              </div>
              <div className="col-5">
                <label className="form-label small text-secondary">Postal code</label>
                <input
                  {...register('postalCode')}
                  className={`form-control bg-transparent text-white border-secondary ${errors.postalCode ? 'is-invalid' : ''}`}
                />
                {errors.postalCode && (
                  <div className="invalid-feedback">{errors.postalCode.message}</div>
                )}
              </div>
              <div className="col-7">
                <label className="form-label small text-secondary">City</label>
                <input
                  {...register('city')}
                  className={`form-control bg-transparent text-white border-secondary ${errors.city ? 'is-invalid' : ''}`}
                />
                {errors.city && (
                  <div className="invalid-feedback">{errors.city.message}</div>
                )}
              </div>
              <div className="col-12">
                <label className="form-label small text-secondary">Country</label>
                <select
                  {...register('country')}
                  className="form-select bg-transparent text-white border-secondary"
                  style={{ color: 'white' }}
                >
                  <option value="NL" style={{ background: '#111' }}>Netherlands</option>
                  <option value="BE" style={{ background: '#111' }}>Belgium</option>
                  <option value="DE" style={{ background: '#111' }}>Germany</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger mt-4 small">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-accent w-100 btn-lg fw-bold mt-4"
              disabled={submitting}
            >
              {submitting ? 'Redirecting to payment…' : `Pay ${formatPrice(totalPrice)}`}
            </button>
            <p className="text-secondary small text-center mt-2">
              You&apos;ll be taken to Stripe to complete payment securely.
            </p>
          </form>
        </div>

        {/* Order summary */}
        <div className="col-12 col-md-5">
          <div className="p-4" style={{ background: '#111', border: '1px solid #222' }}>
            <h2 className="h6 fw-bold text-uppercase text-secondary mb-4">Order summary</h2>
            <div className="d-flex flex-column gap-3 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="d-flex justify-content-between small">
                  <span>
                    {product.name}
                    <span className="text-secondary ms-1">×{quantity}</span>
                  </span>
                  <span>{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-top border-dark pt-3 d-flex justify-content-between">
              <span className="fw-bold">Total</span>
              <span className="fw-bold">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-secondary small mt-2 mb-0">Free shipping in NL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
