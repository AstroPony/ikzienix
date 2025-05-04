import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

interface OrderItem {
  id: string
  product: { name: string }
  quantity: number
  price: number
}

interface Order {
  id: string
  createdAt: string
  total: number
  status: string
  items: OrderItem[]
}

async function fetchUserOrders(): Promise<Order[]> {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/my-orders`, {
    cache: 'no-store',
    headers: {},
  })
  if (!res.ok) return []
  return res.json()
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  const orders = await fetchUserOrders()

  return (
    <div className="container py-5">
      <h1 className="display-5 mb-4">My Orders</h1>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          {orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-bag-x fs-1 mb-3"></i>
              <p className="mb-0">You have no orders yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: Order, idx: number) => (
                    <React.Fragment key={order.id}>
                      <tr data-bs-toggle="collapse" data-bs-target={`#order-details-${idx}`} aria-expanded="false" style={{ cursor: 'pointer' }}>
                        <td className="fw-medium">{order.id.slice(0, 8)}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td><span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'processing' ? 'info' : 'secondary'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                        <td>${order.total.toFixed(2)}</td>
                        <td><i className="bi bi-chevron-down"></i></td>
                      </tr>
                      <tr className="collapse bg-light" id={`order-details-${idx}`}> 
                        <td colSpan={5}>
                          <div className="p-3">
                            <h6>Order Items</h6>
                            <ul className="list-group list-group-flush">
                              {order.items.map((item: OrderItem, i: number) => (
                                <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                  <span>{item.product.name} <span className="text-muted small">x{item.quantity}</span></span>
                                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 