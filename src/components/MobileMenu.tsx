import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { state, dispatch } = useCart()
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute left-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Menu</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-4">
                <Link
                  href="/"
                  className="block text-lg font-medium hover:text-gray-600"
                  onClick={onClose}
                >
                  Home
                </Link>
                <Link
                  href="/collections"
                  className="block text-lg font-medium hover:text-gray-600"
                  onClick={onClose}
                >
                  Collections
                </Link>
                <Link
                  href="/about"
                  className="block text-lg font-medium hover:text-gray-600"
                  onClick={onClose}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block text-lg font-medium hover:text-gray-600"
                  onClick={onClose}
                >
                  Contact
                </Link>
                <button
                  onClick={() => {
                    dispatch({ type: 'TOGGLE_CART' })
                    onClose()
                  }}
                  className="flex items-center text-lg font-medium hover:text-gray-600"
                >
                  Cart
                  {totalItems > 0 && (
                    <span className="ml-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 