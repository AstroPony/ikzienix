'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import CartButton from './CartButton'
import AccountMenu from './AccountMenu'
import SharedMenu from './SharedMenu'
import { useSession } from 'next-auth/react'

export default function Navigation() {
  const [activeMenu, setActiveMenu] = useState<'nav' | 'account' | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const { data: session } = useSession()

  const handleMenuClick = (menu: 'nav' | 'account') => {
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  // Hamburger toggles nav menu open/close
  const handleNavToggle = () => {
    if (activeMenu === 'nav') {
      setActiveMenu(null);
    } else {
      setActiveMenu('nav');
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" role="navigation" aria-label="Main navigation">
      <div className="container-fluid">
        {/* Mobile navbar: logo, icons, hamburger */}
        <div className="container-fluid d-lg-none d-flex justify-content-between align-items-center px-2" style={{minHeight: '56px'}}>
          <Link className="navbar-brand text-dark m-0" href="/" aria-label="Ikzienix Home">Ikzienix</Link>
          <Link href="/cart" className="btn btn-link text-dark p-0" aria-label="Cart">
            <i className="bi bi-cart3 fs-4"></i>
          </Link>
          <Link href={session ? "/account" : "/auth/signin"} className="btn btn-link text-dark p-0" aria-label="Account">
            <i className="bi bi-person fs-4"></i>
          </Link>
          <button 
            ref={hamburgerRef}
            className="navbar-toggler ms-2" 
            type="button" 
            aria-controls="navbarNav" 
            aria-expanded={activeMenu === 'nav'}
            aria-label="Toggle navigation"
            onClick={handleNavToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        {/* Desktop nav links and buttons */}
        <div className="container-fluid d-none d-lg-flex">
          <Link className="navbar-brand text-dark" href="/" aria-label="Ikzienix Home">Ikzienix</Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav" role="menubar">
              <li className="nav-item" role="none">
                <Link className="nav-link" href="/collections" role="menuitem">Collections</Link>
              </li>
              <li className="nav-item" role="none">
                <Link className="nav-link" href="/about" role="menuitem">About</Link>
              </li>
              <li className="nav-item" role="none">
                <Link className="nav-link" href="/contact" role="menuitem">Contact</Link>
              </li>
            </ul>
            <div className="ms-auto d-flex align-items-center gap-3">
              <CartButton />
              <AccountMenu onMenuClick={() => handleMenuClick('account')} />
              <Link href="/auth/signup" className="btn btn-outline-dark ms-2" role="button">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu: only show on mobile */}
      <div className="d-lg-none">
        <SharedMenu 
          isOpen={activeMenu !== null} 
          type={activeMenu || 'nav'} 
          onClose={() => {
            setActiveMenu(null)
          }} 
          hamburgerRef={hamburgerRef}
        />
      </div>
    </nav>
  )
} 