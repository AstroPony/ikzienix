"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

function PaymentStatus() {
  const [status, setStatus] = useState<'processing' | 'succeeded' | 'failed'>('processing');
  const searchParams = useSearchParams();
  const { state, clearCart } = useCart();

  useEffect(() => {
    const payment_intent = searchParams.get('payment_intent');
    const payment_intent_client_secret = searchParams.get('payment_intent_client_secret');

    if (payment_intent && payment_intent_client_secret) {
      fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_intent,
          payment_intent_client_secret,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.status === 'succeeded') {
            try {
              const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  items: state.items,
                  paymentIntentId: payment_intent,
                }),
              });

              if (!orderResponse.ok) {
                throw new Error('Failed to create order');
              }

              clearCart();
              setStatus('succeeded');
            } catch (error) {
              setStatus('failed');
            }
          } else {
            setStatus('failed');
          }
        })
        .catch(() => {
          setStatus('failed');
        });
    } else {
      setStatus('failed');
    }
  }, [searchParams, state.items, clearCart]);

  return (
    <div className="text-center">
      {status === 'processing' && (
        <>
          <div className="spinner-border mb-4" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h1 className="display-4 mb-4">Processing Your Payment</h1>
          <p className="lead">Please wait while we confirm your payment...</p>
        </>
      )}

      {status === 'succeeded' && (
        <>
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <h1 className="display-4 mb-4">Payment Successful!</h1>
          <p className="lead mb-4">Thank you for your purchase. Your order has been confirmed.</p>
          <div>
            <Link href="/orders" className="btn btn-primary me-3">
              View Orders
            </Link>
            <Link href="/products" className="btn btn-outline-primary">
              Continue Shopping
            </Link>
          </div>
        </>
      )}

      {status === 'failed' && (
        <>
          <div className="mb-4">
            <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
          </div>
          <h1 className="display-4 mb-4">Payment Failed</h1>
          <p className="lead mb-4">We couldn't process your payment. Please try again.</p>
          <div>
            <Link href="/cart" className="btn btn-primary me-3">
              Return to Cart
            </Link>
            <Link href="/products" className="btn btn-outline-primary">
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="container py-5">
      <Suspense fallback={
        <div className="text-center">
          <div className="spinner-border mb-4" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h1 className="display-4 mb-4">Loading...</h1>
        </div>
      }>
        <PaymentStatus />
      </Suspense>
    </div>
  );
} 