'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = 'An error occurred during authentication.'
  if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid email or password.'
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body text-center">
              <h1 className="display-4 mb-4">Authentication Error</h1>
              <p className="lead text-danger mb-4">{errorMessage}</p>
              <Link href="/auth/signin" className="btn btn-primary">
                Try Again
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
} 