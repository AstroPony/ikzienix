'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product } from '@/types/product'

interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  error: string | null
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

const initialState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
  error: null
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (!action.payload.product?.id) {
        return state
      }

      const existingItem = state.items.find(
        item => item.product?.id === action.payload.product.id
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          isOpen: true
        }
      }

      return {
        ...state,
        items: [...state.items, { product: action.payload.product, quantity: 1 }],
        isOpen: true
      }
    }

    case 'REMOVE_ITEM': {
      if (!action.payload.productId) {
        return state
      }

      return {
        ...state,
        items: state.items.filter(item => item.product?.id !== action.payload.productId)
      }
    }

    case 'UPDATE_QUANTITY': {
      if (!action.payload.productId) {
        return state
      }

      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.product?.id !== action.payload.productId)
        }
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.product?.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    }

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }

    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 