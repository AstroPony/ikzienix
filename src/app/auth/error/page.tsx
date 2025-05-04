'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="card-body text-center">
      <h1 className="display-4 mb-4">Authentication Error</h1>
      
      <p className="lead mb-4">
        {error === 'AccessDenied'
          ? 'You do not have permission to sign in.'
          : 'An error occurred during authentication.'}
      </p>

      <Link href="/auth/signin" className="btn btn-dark">
        Try Again
      </Link>
    </div>
  )
}

export default function AuthError() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow">
            <Suspense fallback={
              <div className="card-body text-center">
                <h1 className="display-4 mb-4">Loading...</h1>
              </div>
            }>
              <ErrorContent />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
} 