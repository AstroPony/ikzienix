import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
    name: 'Test User'
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString()
}

const mockOrders = {
  orders: [
    {
      id: '1',
      userId: '1',
      status: 'pending',
      total: 100,
      createdAt: '2024-01-01T00:00:00Z',
      user: {
        name: 'Test User',
        email: 'test@example.com'
      }
    }
  ],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
    hasNextPage: false,
    hasPrevPage: false
  }
}

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify(mockOrders), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  )
)

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <SessionProvider session={mockSession}>
      {component}
    </SessionProvider>
  )
}

describe('AdminOrdersPage', () => {
  it('renders the orders page correctly', async () => {
    renderWithProviders(<AdminOrdersPage />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByText('Manage customer orders')).toBeInTheDocument()
  })

  it('displays orders data', async () => {
    renderWithProviders(<AdminOrdersPage />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
    expect(screen.getAllByText('Pending')[0]).toBeInTheDocument()
  })

  it('handles order status change', async () => {
    renderWithProviders(<AdminOrdersPage />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Click status dropdown
    fireEvent.click(screen.getByText('Change Status'))

    // Click new status
    fireEvent.click(screen.getByText('Processing'))

    // Wait for status update
    await waitFor(() => {
      expect(screen.getByText('Processing')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch orders'))
    )

    renderWithProviders(<AdminOrdersPage />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Failed to load orders')).toBeInTheDocument()
  })

  it('handles unauthorized access', async () => {
    render(
      <SessionProvider session={null}>
        <AdminOrdersPage />
      </SessionProvider>
    )

    // Wait for redirect
    await waitFor(() => {
      expect(window.location.pathname).toBe('/auth/signin')
    })
  })
}) 