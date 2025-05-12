'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product } from '@/types'

type WishlistState = {
  items: Product[]
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: { product: Product } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR_WISHLIST' }

type WishlistContextType = {
  state: WishlistState
  dispatch: React.Dispatch<WishlistAction>
}

const initialState: WishlistState = {
  items: []
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM':
      if (state.items.some(item => item.id === action.payload.product.id)) {
        return state
      }
      return {
        ...state,
        items: [...state.items, action.payload.product]
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.productId)
      }
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: []
      }
    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
} 