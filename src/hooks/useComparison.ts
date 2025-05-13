import { useState, useCallback } from 'react'
import { Product } from '@/types/product'
import { useToast } from './useToast'

const MAX_COMPARISON_ITEMS = 4

export function useComparison() {
  const [comparisonItems, setComparisonItems] = useState<Product[]>([])
  const { showToast } = useToast()

  const addToComparison = useCallback(
    (product: Product) => {
      if (comparisonItems.length >= MAX_COMPARISON_ITEMS) {
        showToast('Maximum number of items reached for comparison', 'warning')
        return
      }

      if (comparisonItems.some((item) => item.id === product.id)) {
        showToast('Product already in comparison', 'info')
        return
      }

      setComparisonItems((prev) => [...prev, product])
      showToast('Product added to comparison', 'success')
    },
    [comparisonItems, showToast]
  )

  const removeFromComparison = useCallback(
    (productId: string) => {
      setComparisonItems((prev) => prev.filter((item) => item.id !== productId))
      showToast('Product removed from comparison', 'info')
    },
    [showToast]
  )

  const clearComparison = useCallback(() => {
    setComparisonItems([])
    showToast('Comparison cleared', 'info')
  }, [showToast])

  const isInComparison = useCallback(
    (productId: string) => {
      return comparisonItems.some((item) => item.id === productId)
    },
    [comparisonItems]
  )

  return {
    comparisonItems,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
  }
} 