'use client'

interface CheckoutButtonProps {
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export default function CheckoutButton({ className = '', onClick, disabled = false }: CheckoutButtonProps) {
  return (
    <button
      className={`btn btn-primary w-100 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? 'Processing...' : 'Checkout'}
    </button>
  )
} 