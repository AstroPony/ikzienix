'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '@/types/product'

interface ComparisonContextType {
  comparisonProducts: Product[]
  addToComparison: (product: Product) => void
  removeFromComparison: (productId: string) => void
  clearComparison: () => void
  isInComparison: (productId: string) => boolean
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([])

  const addToComparison = (product: Product) => {
    if (comparisonProducts.length >= 3) {
      // Remove the oldest product if we already have 3
      setComparisonProducts(prev => [...prev.slice(1), product])
    } else {
      setComparisonProducts(prev => [...prev, product])
    }
  }

  const removeFromComparison = (productId: string) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== productId))
  }

  const clearComparison = () => {
    setComparisonProducts([])
  }

  const isInComparison = (productId: string) => {
    return comparisonProducts.some(p => p.id === productId)
  }

  return (
    <ComparisonContext.Provider
      value={{
        comparisonProducts,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
} 