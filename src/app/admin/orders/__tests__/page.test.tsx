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

// Mock fetch
global.fetch = jest.fn()

describe('OrdersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the orders page correctly', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    })

    render(
      <SessionProvider session={mockSession}>
        <OrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument()
    })
  })

  it('displays orders data correctly', async () => {
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        total: 100.00,
        status: 'pending',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customer: {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
        total: 200.00,
        status: 'processing',
        createdAt: '2024-01-02T00:00:00Z',
      },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockOrders),
    })

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
      expect(screen.getByText('$200.00')).toBeInTheDocument()
      expect(screen.getAllByText('Pending')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Processing')[0]).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to load orders'))

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
      user: {
        ...mockSession.user,
        role: 'user',
      },
    }

    render(
      <SessionProvider session={nonAdminSession}>
        <OrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Access denied')).toBeInTheDocument()
      expect(screen.getByText('You do not have permission to access this page.')).toBeInTheDocument()
    })
  })
}) 