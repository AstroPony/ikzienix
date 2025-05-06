'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

interface AccountMenuProps {
  onMenuClick: () => void
}

export default function AccountMenu({ onMenuClick }: AccountMenuProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  if (!session) {
    return (
      <div className="d-flex gap-2">
        <Link 
          href="/auth/signin" 
          className="btn btn-link text-dark"
          aria-label="Sign in to your account"
        >
          <i className="bi bi-person fs-5" aria-hidden="true"></i>
          <span className="visually-hidden">Sign In</span>
        </Link>
      </div>
    )
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
    onMenuClick()
  }

  return (
    <div className="position-relative" ref={menuRef}>
      <button
        ref={buttonRef}
        className="btn btn-link text-dark p-0"
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-controls="account-menu"
        aria-label="Account menu"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User'}
            width={32}
            height={32}
            className="rounded-circle"
          />
        ) : (
          <i className="bi bi-person fs-5" aria-hidden="true"></i>
        )}
        <span className="visually-hidden">Account Menu</span>
      </button>

      {/* Desktop Dropdown */}
      <div 
        id="account-menu"
        className="dropdown-menu" 
        style={{ 
          right: 0, 
          left: 'auto',
          display: isOpen ? 'block' : 'none',
          position: 'absolute',
          top: '100%',
          marginTop: '0.5rem',
          minWidth: '200px',
          zIndex: 1000
        }}
        role="menu"
        aria-label="Account options"
      >
        <div className="p-3 border-bottom">
          <div className="d-flex align-items-center">
            {session.user?.image && (
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
              <div className="fw-medium">{session.user?.name}</div>
              <small className="text-muted">{session.user?.email}</small>
            </div>
          </div>
        </div>

        <div className="py-2" role="menu">
          <Link 
            href="/account" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
          >
            <i className="bi bi-person me-2" aria-hidden="true"></i>
            My Account
          </Link>
          <Link 
            href="/orders" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
          >
            <i className="bi bi-bag me-2" aria-hidden="true"></i>
            My Orders
          </Link>
          {session.user?.email === 'admin@ikzienix.com' && (
            <Link 
              href="/admin" 
              className="dropdown-item"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
            >
              <i className="bi bi-gear me-2" aria-hidden="true"></i>
              Admin Panel
            </Link>
          )}
          <hr className="my-2" />
          <button 
            className="dropdown-item text-danger"
            onClick={() => {
              signOut()
              setIsOpen(false)
            }}
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
          >
            <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
} 