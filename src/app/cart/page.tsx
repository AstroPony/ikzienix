"use client";

import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

export default function CartPage() {
  const { state } = useCart();
  const cart = state.items;

  return (
    <div className="container py-5">
      <h1 className="display-4 mb-4">Your Cart</h1>
      {cart.length > 0 ? (
        <>
          <div className="row g-4 mb-4">
            {cart.map((item) => (
              <div key={item.product.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100">
                  <img src={item.product.image} alt={item.product.name} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title">{item.product.name}</h5>
                    <p className="card-text">${item.product.price.toFixed(2)}</p>
                    <p className="card-text">Quantity: {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Total: </strong>
              ${cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}
            </div>
            <Link href="/checkout" className="btn btn-primary btn-lg">
              Proceed to Checkout
            </Link>
          </div>
        </>
      ) : (
        <div className="alert alert-info">Your cart is empty. <Link href="/products">Shop now</Link></div>
      )}
    </div>
  );
} 