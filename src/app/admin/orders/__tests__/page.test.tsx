import { render, screen, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import OrdersPage from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock session
const mockSession = {
  user: {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  expires: '1',
}

const mockOrders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    date: '2024-01-01',
    total: 100.00,
    status: 'pending',
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    date: '2024-01-02',
    total: 150.00,
    status: 'processing',
  },
]

describe('OrdersPage', () => {
  beforeEach(() => {
    // Mock fetch for orders data
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOrders),
    })
  })

  it('renders the orders page correctly', async () => {
    render(
      <SessionProvider session={mockSession}>
        <OrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Orders')).toBeInTheDocument()
      expect(screen.getByText('Manage Orders')).toBeInTheDocument()
    })
  })

  it('displays orders data correctly', async () => {
    render(
      <SessionProvider session={mockSession}>
        <OrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
      expect(screen.getByText('ORD-002')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('$100.00')).toBeInTheDocument()
      expect(screen.getByText('$150.00')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'))

    render(
      <SessionProvider session={mockSession}>
        <OrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Failed to load orders')).toBeInTheDocument()
    })
  })

  it('redirects non-admin users', async () => {
    const nonAdminSession = {
      ...mockSession,
      user: { ...mockSession.user, role: 'user' },
    }

    render(
      <SessionProvider session={nonAdminSession}>
        <OrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument()
      expect(screen.getByText('You do not have permission to access this page')).toBeInTheDocument()
    })
  })
}) 