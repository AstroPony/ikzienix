'use client'

import CartSubtotal from './CartSubtotal'
import CheckoutButton from './CheckoutButton'

interface CartFooterProps {
  subtotal: number
  onCheckout: () => Promise<void>
  isLoading: boolean
  className?: string
}

export default function CartFooter({ subtotal, onCheckout, isLoading, className = '' }: CartFooterProps) {
  return (
    <div className={`cart-footer ${className}`}>
      <CartSubtotal subtotal={subtotal} />
      <p className="text-muted small mb-3">
        Shipping and taxes calculated at checkout.
      </p>
      <CheckoutButton onClick={onCheckout} disabled={isLoading} />
    </div>
  )
} 