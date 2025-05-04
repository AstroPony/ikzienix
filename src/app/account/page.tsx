import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="display-4 mb-4">My Account</h1>
              <div className="mb-4">
                <h3 className="h5 text-muted">Email</h3>
                <p className="lead">{session.user?.email}</p>
              </div>
              <div className="mb-4">
                <h3 className="h5 text-muted">Name</h3>
                <p className="lead">{session.user?.name || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="h5 text-muted">Account Status</h3>
                <p className="lead">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 