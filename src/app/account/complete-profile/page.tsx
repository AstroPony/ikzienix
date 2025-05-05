import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/firebase-admin'
import CompleteProfileForm from './complete-profile-form'

export default async function CompleteProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Get user data from Firestore
  const userDoc = await db.collection('users').doc(session.user.id).get()
  const userData = userDoc.data()

  // If user already has complete profile, redirect to account page
  if (userData?.shippingAddress && userData?.billingAddress && userData?.phone) {
    redirect('/account')
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="display-5 mb-4">Complete Your Profile</h1>
              <p className="lead mb-4">
                Please provide your shipping and billing information to complete your profile.
              </p>
              <CompleteProfileForm userId={session.user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 