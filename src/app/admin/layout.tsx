'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Navigation from '@/components/navigation/Navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="d-flex min-vh-100">
      <div className="d-none d-md-block" style={{ minWidth: '280px', maxWidth: '280px' }}>
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
      <div className="d-md-none">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
      <div className="flex-grow-1 bg-light p-4">
        {children}
      </div>
    </div>
  )
} 