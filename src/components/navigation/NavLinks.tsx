'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWishlist } from '@/context/WishlistContext'

interface NavLinksProps {
  onLinkClick: () => void
}

export default function NavLinks({ onLinkClick }: NavLinksProps) {
  const pathname = usePathname()
  const { wishlist } = useWishlist()
  const isActive = (path: string) => pathname === path

  const links = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Collections' },
    { href: '/wishlist', label: `Wishlist ${wishlist.length > 0 ? `(${wishlist.length})` : ''}` },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <ul className="navbar-nav me-auto mb-2 mb-lg-0" role="menubar">
      {links.map(({ href, label }) => {
        const active = isActive(href)
        return (
          <li key={href} className="nav-item p-2" role="none">
            <Link 
              href={href} 
              className={`nav-link ${active ? 'active fw-bold' : 'text-dark'}`}
              onClick={onLinkClick}
              role="menuitem"
              aria-current={active ? 'page' : undefined}
            >
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
} 