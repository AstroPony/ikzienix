'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: 'bi-graph-up' },
  { name: 'Products', href: '/admin/products', icon: 'bi-box' },
  { name: 'Orders', href: '/admin/orders', icon: 'bi-cart' },
  { name: 'Users', href: '/admin/users', icon: 'bi-people' },
  { name: 'Settings', href: '/admin/settings', icon: 'bi-gear' },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`admin-sidebar bg-light border-end ${isOpen ? 'start-0 position-fixed' : 'd-none d-md-block position-relative'}`}
      >
        <div className="d-flex flex-column flex-grow-1 overflow-auto py-3">
          <div className="px-3 mb-3 d-flex justify-content-between align-items-center">
            <h1 className="h5 mb-0">Admin Panel</h1>
            <button
              className="btn btn-link p-0 d-md-none"
              onClick={onClose}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <nav className="nav flex-column px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link d-flex align-items-center py-2 px-3 rounded ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-dark hover-bg-light'
                  }`}
                  onClick={onClose}
                >
                  <i className={`bi ${item.icon} me-2`}></i>
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
} 