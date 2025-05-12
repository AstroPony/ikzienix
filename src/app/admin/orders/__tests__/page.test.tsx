import { render, screen, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import OrdersPage from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}))

// Mock the session
const mockSession = {
  user: {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN'
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString()
}

// Mock orders data
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    status: 'PENDING',
    total: 99.99,
    createdAt: new Date().toISOString(),
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    status: 'COMPLETED',
    total: 149.99,
    createdAt: new Date().toISOString(),
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    }
  }
]

describe('OrdersPage', () => {
  beforeEach(() => {
    // Mock fetch to return orders
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOrders)
    })
  })

  it('renders the orders page correctly', async () => {
    render(
      <SessionProvider session={mockSession}>
        <OrdersPage />
      </SessionProvider>
    )

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument()
  })

  it('displays orders data correctly', async () => {
    render(
      <SessionProvider session={mockSession}>
        <OrdersPage />
      </SessionProvider>
    )

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Check for order data
    expect(screen.getByText('ORD-001')).toBeInTheDocument()
    expect(screen.getByText('ORD-002')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('$149.99')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch orders'))

    render(
      <SessionProvider session={mockSession}>
        <OrdersPage />
      </SessionProvider>
    )

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load orders')).toBeInTheDocument()
    })
  })

  it('redirects non-admin users', async () => {
    const nonAdminSession = {
      ...mockSession,
      user: {
        ...mockSession.user,
        role: 'USER'
      }
    }

    render(
      <SessionProvider session={nonAdminSession}>
        <OrdersPage />
      </SessionProvider>
    )

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Access denied')).toBeInTheDocument()
  })
}) 