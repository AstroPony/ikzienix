'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CartButton() {
  const { state } = useCart()
  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Link href="/cart" className="btn btn-link text-dark position-relative me-3" aria-label="cart">
      <i className="bi bi-cart3 fs-5"></i>
      {cartItemCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {cartItemCount}
        </span>
      )}
    </Link>
  )
} 