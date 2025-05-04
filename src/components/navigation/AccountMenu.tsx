'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function AccountMenu() {
  const { data: session } = useSession()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  if (!session) {
    return (
      <Link 
        href="/login" 
        className="btn btn-outline-dark"
      >
        Sign In
      </Link>
    )
  }

  return (
    <div className="dropdown">
      <button 
        className="btn btn-link text-dark dropdown-toggle d-flex align-items-center" 
        type="button" 
        data-bs-toggle="dropdown"
        aria-expanded={isAccountMenuOpen}
      >
        <i className="bi bi-person-circle me-1"></i>
        <span className="d-none d-sm-inline">{session.user?.name}</span>
      </button>
      <ul className="dropdown-menu">
        <li>
          <Link 
            href="/account" 
            className="dropdown-item d-flex align-items-center"
            onClick={() => setIsAccountMenuOpen(false)}
          >
            <i className="bi bi-person me-2"></i>
            My Account
          </Link>
        </li>
        <li>
          <Link 
            href="/orders" 
            className="dropdown-item d-flex align-items-center"
            onClick={() => setIsAccountMenuOpen(false)}
          >
            <i className="bi bi-bag me-2"></i>
            My Orders
          </Link>
        </li>
        {session.user?.email === 'admin@ikzienix.com' && (
          <li>
            <Link 
              href="/admin" 
              className="dropdown-item d-flex align-items-center"
              onClick={() => setIsAccountMenuOpen(false)}
            >
              <i className="bi bi-gear me-2"></i>
              Admin Panel
            </Link>
          </li>
        )}
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button 
            className="dropdown-item d-flex align-items-center text-danger"
            onClick={() => {
              signOut()
              setIsAccountMenuOpen(false)
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  )
} 