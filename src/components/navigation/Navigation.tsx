'use client'

import { useState } from 'react'
import Link from 'next/link'
import CartButton from './CartButton'
import AccountMenu from './AccountMenu'
import SharedMenu from './SharedMenu'

export default function Navigation() {
  const [activeMenu, setActiveMenu] = useState<'nav' | 'account' | null>(null)

  const handleMenuClick = (menu: 'nav' | 'account') => {
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand text-dark" href="/">Ikzienix</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
          onClick={() => handleMenuClick('nav')}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" href="/collections">Collections</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/contact">Contact</Link>
            </li>
          </ul>
          <div className="ms-auto d-flex align-items-center gap-3">
            <CartButton />
            <AccountMenu onMenuClick={() => {}} />
            <Link href="/auth/signup" className="btn btn-outline-dark ms-2">Sign Up</Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="d-lg-none">
        <SharedMenu 
          isOpen={activeMenu !== null} 
          type={activeMenu || 'nav'} 
          onClose={() => setActiveMenu(null)} 
        />
      </div>
    </nav>
  )
} 