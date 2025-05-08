'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = 'An error occurred during authentication.'
  
  // Handle different error cases
  switch (error) {
    case 'CredentialsSignin':
      errorMessage = 'Invalid email or password.'
      break
    case 'AccessDenied':
      errorMessage = 'You do not have permission to access this resource.'
      break
    case 'Configuration':
      errorMessage = 'There is a problem with the server configuration.'
      break
    case 'Verification':
      errorMessage = 'The verification token has expired or is invalid.'
      break
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
    case 'EmailCreateAccount':
    case 'Callback':
      errorMessage = 'An error occurred during the authentication process.'
      break
    case 'OAuthAccountNotLinked':
      errorMessage = 'This email is already associated with another account.'
      break
    case 'EmailSignin':
      errorMessage = 'Failed to send the email.'
      break
    case 'SessionRequired':
      errorMessage = 'Please sign in to access this page.'
      break
    default:
      errorMessage = 'An unexpected error occurred. Please try again.'
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body text-center">
              <h1 className="display-4 mb-4">Authentication Error</h1>
              <p className="lead text-danger mb-4">{errorMessage}</p>
              <div className="d-grid gap-2">
                <Link href="/auth/signin" className="btn btn-primary">
                  Try Again
                </Link>
                <Link href="/" className="btn btn-outline-secondary">
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading error details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
} 