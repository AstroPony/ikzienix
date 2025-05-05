import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/firebase-admin'
import Link from 'next/link'

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
  role: string;
  createdAt: Date;
  profileCompleted?: boolean;
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Get user data from Firestore
  const userDoc = await db.collection('users').doc(session.user.id).get()
  const userData = userDoc.data() as UserData

  // If user document doesn't exist or profile is not complete, redirect to complete profile
  if (!userData || !userData.profileCompleted) {
    redirect('/account/complete-profile')
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatAddress = (address: Address) => {
    return (
      <>
        <p className="mb-1">{address.line1}</p>
        {address.line2 && <p className="mb-1">{address.line2}</p>}
        <p className="mb-1">{`${address.city}, ${address.state} ${address.postalCode}`}</p>
        <p className="mb-0">{address.country}</p>
      </>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="display-5 mb-4">My Account</h1>
              
              {/* Personal Information */}
              <div className="mb-5">
                <h2 className="h4 mb-3">Personal Information</h2>
                <div className="card bg-light">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <h3 className="h6 text-muted mb-2">Name</h3>
                        <p className="lead mb-0">{userData.name}</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h3 className="h6 text-muted mb-2">Email</h3>
                        <p className="lead mb-0">{userData.email}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <h3 className="h6 text-muted mb-2">Phone</h3>
                        <p className="lead mb-0">{userData.phone}</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h3 className="h6 text-muted mb-2">Member Since</h3>
                        <p className="lead mb-0">{formatDate(userData.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-5">
                <h2 className="h4 mb-3">Shipping Address</h2>
                <div className="card bg-light">
                  <div className="card-body">
                    {formatAddress(userData.shippingAddress)}
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="mb-5">
                <h2 className="h4 mb-3">Billing Address</h2>
                <div className="card bg-light">
                  <div className="card-body">
                    {formatAddress(userData.billingAddress)}
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="d-grid gap-2">
                <Link href="/account/edit" className="btn btn-outline-primary">
                  Edit Profile
                </Link>
                <Link href="/account/password" className="btn btn-outline-danger">
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 