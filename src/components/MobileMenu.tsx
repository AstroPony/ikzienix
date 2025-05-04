'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

export default function MobileMenu() {
  const { data: session } = useSession()

  return (
    <div className="offcanvas offcanvas-start" tabIndex={-1} id="mobileMenu">
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">Menu</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <ul className="nav flex-column mb-4">
          <li className="nav-item">
            <Link href="/collections" className="nav-link">
              Collections
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/about" className="nav-link">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
          </li>
        </ul>

        <hr className="my-4" />

        {session ? (
          <div>
            <div className="d-flex align-items-center mb-3">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user?.name || 'User'}
                  width={40}
                  height={40}
                  className="rounded-circle me-2"
                />
              )}
              <div>
                <div className="fw-medium">{session.user?.name}</div>
                <small className="text-muted">{session.user?.email}</small>
              </div>
            </div>

            <ul className="nav flex-column">
              <li className="nav-item">
                <Link href="/orders" className="nav-link">
                  Orders
                </Link>
              </li>
              <li className="nav-item">
                <button
                  onClick={() => signOut()}
                  className="nav-link text-danger border-0 bg-transparent w-100 text-start"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link href="/auth/signin" className="btn btn-dark w-100">
            Sign In
          </Link>
        )}
      </div>
    </div>
  )
} 