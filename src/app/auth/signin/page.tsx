import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc'

export default async function SignInPage() {
  const session = await getServerSession()

  if (session) {
    redirect('/')
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Ikzienix</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          <a
            href="/api/auth/signin/google"
            className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors"
          >
            <FcGoogle className="h-6 w-6 mr-3" />
            <span>Continue with Google</span>
          </a>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          By signing in, you agree to our{' '}
          <a href="/terms" className="text-black hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-black hover:underline">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  )
} 