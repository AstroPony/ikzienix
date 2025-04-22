import { createContext, useContext, useReducer, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLEAR_CART' }

const initialState: CartState = {
  items: [],
  isOpen: false
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
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
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Your Cart</h2>
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {state.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {state.items.map(item => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="relative h-20 w-20">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-500">${item.price.toFixed(2)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <button
                              onClick={() =>
                                dispatch({
                                  type: 'UPDATE_QUANTITY',
                                  payload: { id: item.id, quantity: item.quantity - 1 },
                                })
                              }
                              className="text-gray-500 hover:text-gray-700"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                dispatch({
                                  type: 'UPDATE_QUANTITY',
                                  payload: { id: item.id, quantity: item.quantity + 1 },
                                })
                              }
                              className="text-gray-500 hover:text-gray-700"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">
                          ${state.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                        </span>
                      </div>
                      <button className="btn btn-primary w-full">
                        Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 