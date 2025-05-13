import { useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface CartItem {
  productId: string
  color: string
  quantity: number
}

export function useCart() {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { showToast } = useToast()

  const addToCart = async (productId: string, color: string, quantity: number = 1) => {
    try {
      setIsAddingToCart(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          color,
          quantity,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add item to cart')
      }

      showToast('Item added to cart', 'success')
    } catch (error) {
      console.error('Error adding to cart:', error)
      showToast('Failed to add item to cart', 'error')
    } finally {
      setIsAddingToCart(false)
    }
  }

  return {
    addToCart,
    isAddingToCart,
  }
} 