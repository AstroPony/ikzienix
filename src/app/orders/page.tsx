"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: {
    product: {
      id: string;
      name: string;
      image: string;
      price: number;
    };
    quantity: number;
  }[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      const fetchOrders = async () => {
        try {
          const response = await fetch('/api/orders');
          const data = await response.json();
          if (data.error) {
            setError(data.error);
          } else {
            setOrders(data);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to fetch orders');
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="display-4 mb-4">Your Orders</h1>
      {orders.length > 0 ? (
        <div className="row g-4">
          {orders.map((order) => (
            <div key={order.id} className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">Order #{order.id}</h5>
                    <small className="text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <span className={`badge bg-${order.status === 'completed' ? 'success' : 'warning'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="card-body">
                  <div className="row g-4">
                    {order.items.map((item) => (
                      <div key={item.product.id} className="col-md-6 col-lg-4">
                        <div className="card h-100">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                          <div className="card-body">
                            <h6 className="card-title">{item.product.name}</h6>
                            <p className="card-text">
                              Quantity: {item.quantity}
                              <br />
                              Price: ${item.product.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-end">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          You haven't placed any orders yet.{' '}
          <Link href="/products">Start shopping</Link>
        </div>
      )}
    </div>
  );
} 