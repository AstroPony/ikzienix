'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import NavLinks from './NavLinks'

type MenuType = 'nav' | 'account'

interface SharedMenuProps {
  isOpen: boolean
  type: MenuType
  onClose: () => void
}

export default function SharedMenu({ isOpen, type, onClose }: SharedMenuProps) {
  const { data: session } = useSession()

  if (!isOpen) return null

  return (
    <div className="collapse navbar-collapse show position-absolute start-0 end-0 bg-white border-bottom" style={{ top: '100%', zIndex: 1000 }}>
      <div className="container py-3">
        {type === 'nav' ? (
          <NavLinks onLinkClick={onClose} />
        ) : (
          <div className="py-2">
            <div className="d-flex align-items-center mb-3">
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user?.name || 'User'}
                  width={40}
                  height={40}
                  className="rounded-circle me-2"
                />
              )}
              <div>
                <div className="fw-medium">{session?.user?.name}</div>
                <small className="text-muted">{session?.user?.email}</small>
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <Link 
                href="/account" 
                className="d-flex align-items-center text-dark text-decoration-none"
                onClick={onClose}
              >
                <i className="bi bi-person me-2"></i>
                My Account
              </Link>
              <Link 
                href="/orders" 
                className="d-flex align-items-center text-dark text-decoration-none"
                onClick={onClose}
              >
                <i className="bi bi-bag me-2"></i>
                My Orders
              </Link>
              {session?.user?.email === 'admin@ikzienix.com' && (
                <Link 
                  href="/admin" 
                  className="d-flex align-items-center text-dark text-decoration-none"
                  onClick={onClose}
                >
                  <i className="bi bi-gear me-2"></i>
                  Admin Panel
                </Link>
              )}
              <hr className="my-2" />
              <button 
                className="d-flex align-items-center text-danger border-0 bg-transparent p-0"
                onClick={() => {
                  signOut()
                  onClose()
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 