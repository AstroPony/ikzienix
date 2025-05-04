'use client'

interface RemoveItemButtonProps {
  onClick: () => void
  className?: string
}

export default function RemoveItemButton({ onClick, className = '' }: RemoveItemButtonProps) {
  return (
    <button
      className={`btn btn-link text-danger ${className}`}
      onClick={onClick}
    >
      <i className="bi bi-trash"></i>
    </button>
  )
} 