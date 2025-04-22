import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

export default function Cart() {
  const { state, dispatch } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    try {
      setIsProcessing(true)

      // Create a payment intent
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
        }),
      })

      const { clientSecret } = await response.json()

      // Load Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        clientSecret,
        mode: 'payment',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cart`,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      // TODO: Show error message to user
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {state.items.length === 0 ? (
                  <p className="text-gray-500 text-center">Your cart is empty</p>
                ) : (
                  <div className="space-y-6">
                    {state.items.map(item => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="relative h-20 w-20 flex-shrink-0">
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
                                  payload: { id: item.id, quantity: item.quantity - 1 }
                                })
                              }
                              className="text-gray-500 hover:text-gray-700"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                dispatch({
                                  type: 'UPDATE_QUANTITY',
                                  payload: { id: item.id, quantity: item.quantity + 1 }
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
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t">
                <div className="flex justify-between text-lg font-semibold mb-6">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={state.items.length === 0 || isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 