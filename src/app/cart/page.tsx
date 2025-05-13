"use client";

import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

export default function CartPage() {
  const { state, dispatch } = useCart();
  const cart = state.items;

  const handleRemove = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  return (
    <div className="container py-5">
      <h1 className="display-4 mb-4">Your Cart</h1>
      {cart.length > 0 ? (
        <>
          <div className="row g-4 mb-4">
            {cart.map((item) => (
              <div key={item.product.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100">
                  <img src={item.product.images?.[0]?.url || '/placeholder.png'} alt={item.product.name} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title">{item.product.name}</h5>
                    <p className="card-text">${item.product.price.toFixed(2)}</p>
                    <div className="d-flex align-items-center mb-2">
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="number"
                        className="form-control form-control-sm text-center"
                        style={{ width: 50 }}
                        value={item.quantity}
                        min={1}
                        onChange={e => handleQuantityChange(item.product.id, Number(e.target.value))}
                      />
                      <button
                        className="btn btn-outline-secondary btn-sm ms-2"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm ms-3"
                        onClick={() => handleRemove(item.product.id)}
                        aria-label="Remove item"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    <p className="card-text">Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</p>
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