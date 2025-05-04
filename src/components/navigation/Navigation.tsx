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
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <div className="d-flex align-items-center">
          <Link href="/" className="navbar-brand">
            Ikzienix
          </Link>
          
          {/* Hamburger menu button - only visible on mobile */}
          <button 
            className="navbar-toggler border-0 ms-3 d-lg-none" 
            type="button" 
            onClick={() => handleMenuClick('nav')}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="d-none d-lg-flex align-items-center">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/collections" className="nav-link">Collections</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link">About</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Cart and Account icons */}
        <div className="d-flex align-items-center gap-3">
          <CartButton />
          {/* Desktop Account Menu */}
          <div className="d-none d-lg-block">
            <AccountMenu onMenuClick={() => {}} />
          </div>
          {/* Mobile Account Menu */}
          <div className="d-lg-none">
            <AccountMenu onMenuClick={() => handleMenuClick('account')} />
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
      </div>
    </nav>
  )
} 