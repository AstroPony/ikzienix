import Link from 'next/link'
import { ShoppingBagIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'
import MobileMenu from './MobileMenu'
import { signOut, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navigation() {
  const { state, dispatch } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { data: session } = useSession()
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className="bg-white shadow-sm">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Ikzienix
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/collections" className="hover:text-gray-600">
              Collections
            </Link>
            <Link href="/about" className="hover:text-gray-600">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-600">
              Contact
            </Link>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="relative"
            >
              <ShoppingBagIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2"
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8" />
                )}
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                  >
                    {session ? (
                      <>
                        <div className="px-4 py-2 border-b">
                          <p className="font-medium">{session.user?.name}</p>
                          <p className="text-sm text-gray-500">{session.user?.email}</p>
                        </div>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={() => {
                            signOut()
                            setIsUserMenuOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth/signin"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  )
} 