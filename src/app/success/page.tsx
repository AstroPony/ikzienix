'use client'

import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 text-center">
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <h1 className="display-4 mb-4">Thank You for Your Order!</h1>
          <p className="lead text-muted mb-5">
            Your order has been received and is being processed. We'll send you an email with the order details and tracking information once your items are shipped.
          </p>
          <div className="d-flex flex-column gap-3 align-items-center">
            <Link
              href="/"
              className="btn btn-dark px-4 py-2"
            >
              Continue Shopping
            </Link>
            <p className="small text-muted">
              Order confirmation has been sent to your email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 