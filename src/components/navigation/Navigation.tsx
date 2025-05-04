'use client'

import { useState } from 'react'
import Link from 'next/link'
import NavLinks from './NavLinks'
import CartButton from './CartButton'
import AccountMenu from './AccountMenu'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Ikzienix
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <NavLinks onLinkClick={() => setIsMenuOpen(false)} />
          
          <div className="d-flex align-items-center gap-3">
            <CartButton />
            <AccountMenu />
          </div>
        </div>
      </div>
    </nav>
  )
} 