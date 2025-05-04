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
    <>
      <div className="d-flex flex-row min-vh-100">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-grow-1 d-flex flex-column">
          <div className="flex-grow-1 bg-light">
            {children}
          </div>
        </div>
      </div>
    </>
  )
} 