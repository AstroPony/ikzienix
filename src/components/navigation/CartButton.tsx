'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CartButton() {
  const { state } = useCart()
  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Link 
      href="/cart" 
      className="btn btn-link text-dark position-relative me-3 d-flex align-items-center" 
      aria-label={`Shopping cart (${cartItemCount} items)`}
      role="button"
      tabIndex={0}
    >
      <i className="bi bi-cart3 fs-5" aria-hidden="true"></i>
      {cartItemCount > 0 && (
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          aria-label={`${cartItemCount} items in cart`}
        >
          {cartItemCount}
        </span>
      )}
      <span className="visually-hidden">
        {cartItemCount === 0 
          ? 'Your cart is empty' 
          : `${cartItemCount} item${cartItemCount === 1 ? '' : 's'} in cart`}
      </span>
    </Link>
  )
} 