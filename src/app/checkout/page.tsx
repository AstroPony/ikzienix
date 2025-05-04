"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useSession } from 'next-auth/react';
import ShippingForm, { ShippingData } from '@/components/ShippingForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ shippingData }: { shippingData: ShippingData }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { state, clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'An error occurred');
      } else {
        // Payment was successful, clear cart and redirect
        clearCart();
        router.push('/checkout/success');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">Payment Details</h5>
        <PaymentElement />
        {error && (
          <div className="alert alert-danger mt-3">{error}</div>
        )}
        <button
          type="submit"
          className="btn btn-primary btn-lg w-100 mt-4"
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { state } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);

  useEffect(() => {
    // Set loading to false once we have the session status
    if (status !== 'loading') {
      setLoading(false);
    }

    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && state.items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [status, router, state.items]);

  // Early return if not authenticated or no items
  if (status === 'unauthenticated' || state.items.length === 0) {
    return null;
  }

  const handleShippingSubmit = async (data: ShippingData) => {
    setLoading(true);
    setShippingData(data);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          shippingData: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const responseData = await response.json();
      setClientSecret(responseData.clientSecret);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setShippingData(null); // Reset shipping data on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <button 
              className="btn btn-outline-danger"
              onClick={() => {
                setError(null);
                setShippingData(null);
              }}
            >
              Try Again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          {!shippingData ? (
            <ShippingForm onSubmit={handleShippingSubmit} />
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                },
              }}
            >
              <CheckoutForm shippingData={shippingData} />
            </Elements>
          ) : (
            <div className="alert alert-info">
              Processing your shipping information...
            </div>
          )}
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Name</th>
                      <th scope="col">Qty</th>
                      <th scope="col">Price</th>
                      <th scope="col">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.items.map((item) => (
                      <tr key={item.product.id}>
                        <td style={{ width: 80 }}>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }}
                          />
                        </td>
                        <td>{item.product.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.product.price.toFixed(2)}</td>
                        <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="text-end"><strong>Subtotal:</strong></td>
                      <td><strong>${state.items.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}</strong></td>
                    </tr>
                    {shippingData && (
                      <tr>
                        <td colSpan={4} className="text-end"><strong>Shipping ({shippingData.shippingMethod}):</strong></td>
                        <td><strong>${shippingData.shippingMethod === 'standard' ? '5.99' : '14.99'}</strong></td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={4} className="text-end"><strong>Total:</strong></td>
                      <td>
                        <strong>
                          ${(
                            state.items.reduce((total, item) => total + item.product.price * item.quantity, 0) +
                            (shippingData ? (shippingData.shippingMethod === 'standard' ? 5.99 : 14.99) : 0)
                          ).toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {shippingData && (
                <div className="mt-4">
                  <h6>Shipping Address:</h6>
                  <p className="mb-1">{shippingData.name}</p>
                  <p className="mb-1">{shippingData.line1}</p>
                  {shippingData.line2 && <p className="mb-1">{shippingData.line2}</p>}
                  <p className="mb-1">
                    {shippingData.city}, {shippingData.state} {shippingData.postalCode}
                  </p>
                  <p className="mb-0">{shippingData.country}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 