import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function AuthErrorPage() {
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center"
      >
        <div className="flex justify-center mb-8">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
        <p className="text-xl text-gray-600 mb-8">
          There was a problem signing you in. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="inline-block bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/contact"
            className="inline-block text-black hover:text-gray-600"
          >
            Contact Support
          </Link>
        </div>
      </motion.div>
    </div>
  )
} 