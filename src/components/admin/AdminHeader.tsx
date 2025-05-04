'use client'

interface AdminHeaderProps {
  onMenuClick: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <div className="bg-white border-bottom p-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-link p-0 d-md-none me-3"
            onClick={onMenuClick}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          <h1 className="h4 mb-0">Admin Dashboard</h1>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-link text-dark">
            <i className="bi bi-bell fs-5"></i>
          </button>
          <button className="btn btn-link text-dark">
            <i className="bi bi-gear fs-5"></i>
          </button>
        </div>
      </div>
    </div>
  )
} 