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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!session) {
    return (
      <div className="d-flex gap-2">
        <Link href="/auth/signin" className="btn btn-link text-dark">
          <i className="bi bi-person fs-5"></i>
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
        className="btn btn-link text-dark p-0"
        onClick={handleClick}
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
          <i className="bi bi-person fs-5"></i>
        )}
      </button>

      {/* Desktop Dropdown */}
      <div className="dropdown-menu" style={{ 
        right: 0, 
        left: 'auto',
        display: isOpen ? 'block' : 'none',
        position: 'absolute',
        top: '100%',
        marginTop: '0.5rem',
        minWidth: '200px',
        zIndex: 1000
      }}>
        <div className="p-3 border-bottom">
          <div className="d-flex align-items-center">
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
        </div>

        <div className="py-2">
          <Link 
            href="/account" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <i className="bi bi-person me-2"></i>
            My Account
          </Link>
          <Link 
            href="/orders" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <i className="bi bi-bag me-2"></i>
            My Orders
          </Link>
          {session.user?.email === 'admin@ikzienix.com' && (
            <Link 
              href="/admin" 
              className="dropdown-item"
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-gear me-2"></i>
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
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
} 