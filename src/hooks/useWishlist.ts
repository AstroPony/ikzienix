import { useState, useCallback } from 'react'
import { Product } from '@/types/product'
import { useToast } from './useToast'

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const { showToast } = useToast()

  const addToWishlist = useCallback(
    (product: Product) => {
      if (wishlistItems.some((item) => item.id === product.id)) {
        showToast('Product already in wishlist', 'info')
        return
      }

      setWishlistItems((prev) => [...prev, product])
      showToast('Product added to wishlist', 'success')
    },
    [wishlistItems, showToast]
  )

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId))
      showToast('Product removed from wishlist', 'info')
    },
    [showToast]
  )

  const clearWishlist = useCallback(() => {
    setWishlistItems([])
    showToast('Wishlist cleared', 'info')
  }, [showToast])

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistItems.some((item) => item.id === productId)
    },
    [wishlistItems]
  )

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
  }
} 