import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function SuccessPage() {
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="flex justify-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your order has been received and is being processed. We'll send you an email with the order details and tracking information once your items are shipped.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
          <p className="text-sm text-gray-500">
            Order confirmation has been sent to your email address.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 