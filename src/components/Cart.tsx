'use client'

import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { MotionDiv, MotionWrapper } from './MotionWrapper'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function Cart() {
  const { state, dispatch } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: state.items }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      const result = await stripe.redirectToCheckout({
        sessionId,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MotionWrapper>
      {state.isOpen && (
        <MotionDiv
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'tween' }}
          className="fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-xl"
        >
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close panel</span>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-8">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {state.items.map(item => (
                      <li key={item.id} className="flex py-6">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={item.image}
                            alt={item.name}
                            className="object-cover object-center"
                            fill
                            sizes="(max-width: 96px) 100vw, 96px"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">Qty {item.quantity}</p>
                            <button
                              onClick={() =>
                                dispatch({
                                  type: 'REMOVE_ITEM',
                                  payload: { id: item.id },
                                })
                              }
                              className="font-medium text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>
                  $
                  {state.items
                    .reduce((total, item) => total + item.price * item.quantity, 0)
                    .toFixed(2)}
                </p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={state.items.length === 0 || isLoading}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          </div>
        </MotionDiv>
      )}
    </MotionWrapper>
  )
} 