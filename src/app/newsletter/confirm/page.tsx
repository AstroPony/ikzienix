'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore'

export default function NewsletterConfirmation() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmSubscription = async () => {
      try {
        const token = searchParams.get('token')

        if (!token) {
          setStatus('error')
          setMessage('Invalid confirmation link')
          return
        }

        // Find subscriber with the token
        const subscribersRef = collection(db, 'newsletter_subscribers')
        const subscriberQuery = query(
          subscribersRef,
          where('confirmationToken', '==', token)
        )
        const subscriberSnapshot = await getDocs(subscriberQuery)

        if (subscriberSnapshot.empty) {
          setStatus('error')
          setMessage('Invalid or expired confirmation link')
          return
        }

        const subscriberDoc = subscriberSnapshot.docs[0]
        const subscriberData = subscriberDoc.data()

        if (subscriberData.isConfirmed) {
          setStatus('success')
          setMessage('Your subscription is already confirmed')
          return
        }

        // Update subscriber status
        await updateDoc(subscriberDoc.ref, {
          isConfirmed: true,
          confirmedAt: new Date().toISOString(),
        })

        setStatus('success')
        setMessage('Thank you for confirming your subscription!')
      } catch (error) {
        console.error('Newsletter confirmation error:', error)
        setStatus('error')
        setMessage('Failed to confirm subscription. Please try again later.')
      }
    }

    confirmSubscription()
  }, [searchParams])

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 text-center">
              {status === 'loading' && (
                <>
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h2 className="h4 mb-3">Confirming your subscription...</h2>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="text-success mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      fill="currentColor"
                      className="bi bi-check-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                  </div>
                  <h2 className="h4 mb-3">Subscription Confirmed!</h2>
                  <p className="text-muted mb-0">{message}</p>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="text-danger mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      fill="currentColor"
                      className="bi bi-exclamation-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                  </div>
                  <h2 className="h4 mb-3">Oops!</h2>
                  <p className="text-muted mb-0">{message}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 