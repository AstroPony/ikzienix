'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import NavLinks from './NavLinks'
import { useEffect, useRef, RefObject } from 'react'

type MenuType = 'nav' | 'account'

interface SharedMenuProps {
  isOpen: boolean
  type: MenuType
  onClose: () => void
  hamburgerRef?: RefObject<HTMLButtonElement>
}

export default function SharedMenu({ isOpen, type, onClose, hamburgerRef }: SharedMenuProps) {
  const { data: session } = useSession()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (hamburgerRef && hamburgerRef.current && hamburgerRef.current.contains(event.target as Node)) {
        return
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, hamburgerRef])

  if (!isOpen) return null

  if (type === 'account' && !session) {
    return (
      <div 
        ref={menuRef}
        className="collapse navbar-collapse show position-absolute start-0 end-0 bg-white border-bottom" 
        style={{ top: '100%', zIndex: 1000 }}
        role="dialog"
        aria-label="Sign in options"
      >
        <div className="container py-3">
          <div className="d-flex flex-column gap-2">
            <Link 
              href="/auth/signin" 
              className="btn btn-link text-dark" 
              onClick={onClose}
              role="menuitem"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup" 
              className="btn btn-outline-dark" 
              onClick={onClose}
              role="menuitem"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={menuRef}
      className="collapse navbar-collapse show position-absolute start-0 end-0 bg-white border-bottom" 
      style={{ top: '100%', zIndex: 1000 }}
      role="dialog"
      aria-label={type === 'nav' ? 'Navigation menu' : 'Account menu'}
    >
      <div className="container py-3 position-relative">
        {type === 'nav' ? (
          <NavLinks onLinkClick={onClose} />
        ) : (
          <div className="py-2" role="menu">
            <div className="d-flex align-items-center mb-3">
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-circle me-2"
                  aria-hidden="true"
                />
              )}
              <div>
                <div className="fw-medium">{session?.user?.name}</div>
                <small className="text-muted">{session?.user?.email}</small>
              </div>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item p-0 border-0 bg-transparent">
                <Link 
                  href="/account" 
                  className="nav-link px-0"
                  onClick={onClose}
                  role="menuitem"
                >
                  My Account
                </Link>
              </li>
              <li className="list-group-item p-0 border-0 bg-transparent">
                <Link 
                  href="/orders" 
                  className="nav-link px-0"
                  onClick={onClose}
                  role="menuitem"
                >
                  My Orders
                </Link>
              </li>
              {session?.user?.email === 'admin@ikzienix.com' && (
                <li className="list-group-item p-0 border-0 bg-transparent">
                  <Link 
                    href="/admin" 
                    className="nav-link px-0"
                    onClick={onClose}
                    role="menuitem"
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
              <li><hr className="my-2" /></li>
              <li className="list-group-item p-0 border-0 bg-transparent">
                <button 
                  className="nav-link px-0 text-danger border-0 bg-transparent"
                  onClick={() => {
                    signOut()
                    onClose()
                  }}
                  role="menuitem"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
} 