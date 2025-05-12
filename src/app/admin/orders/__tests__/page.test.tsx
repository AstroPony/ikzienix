import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import AdminOrdersPage from '../page'

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
    email: 'test@example.com',
    name: 'Test User',
    role: 'admin'
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString()
}

// Mock fetch
const mockOrders = [
  {
    id: '1',
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    items: [
      {
        product: {
          name: 'Product 1',
          price: 100
        },
        quantity: 2
      }
    ],
    total: 200,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    items: [
      {
        product: {
          name: 'Product 2',
          price: 150
        },
        quantity: 1
      }
    ],
    total: 150,
    status: 'completed',
    createdAt: new Date().toISOString()
  }
]

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockOrders)
  })
)

describe('AdminOrdersPage', () => {
  it('renders the orders page correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <AdminOrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByText('Manage customer orders')).toBeInTheDocument()
  })

  it('displays orders correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <AdminOrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('$200.00')).toBeInTheDocument()
    expect(screen.getByText('$150.00')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    )

    const { container } = render(
      <SessionProvider session={mockSession}>
        <AdminOrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Failed to load orders')).toBeInTheDocument()
  })

  it('handles unauthorized access', async () => {
    const nonAdminSession = {
      ...mockSession,
      user: {
        ...mockSession.user,
        role: 'user'
      }
    }

    const { container } = render(
      <SessionProvider session={nonAdminSession}>
        <AdminOrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('You do not have permission to access this page')).toBeInTheDocument()
  })

  it('updates order status', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <AdminOrdersPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const statusSelect = screen.getAllByRole('combobox')[0]
    expect(statusSelect).toHaveValue('pending')

    // Mock fetch for status update
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          ...mockOrders[0],
          status: 'processing'
        })
      })
    )

    fireEvent.change(statusSelect, { target: { value: 'processing' } })

    await waitFor(() => {
      expect(statusSelect).toHaveValue('processing')
    })
  })
}) 