import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import AdminDashboard from '../page'
import { SessionProvider } from 'next-auth/react'

// Mock the session
const mockSession = {
  user: {
    id: '1',
    email: 'admin@example.com',
    role: 'admin'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}

// Mock fetch
const mockDashboardData = {
  revenue: 1000,
  orders: 50,
  visitors: 200,
  newUsers: 30,
  revenueChange: 5.5,
  ordersChange: 2.3,
  visitorsChange: 8.1,
  newUsersChange: 4.2,
  salesByCategory: {
    'Sunglasses': 500,
    'Eyewear': 300,
    'Accessories': 200
  },
  topProducts: [
    { name: 'Product 1', sales: 100 },
    { name: 'Product 2', sales: 80 }
  ],
  dailyRevenue: [
    { date: '2024-01-01', revenue: 100 },
    { date: '2024-01-02', revenue: 150 }
  ]
}

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockDashboardData)
  })
)

describe('AdminDashboard', () => {
  it('renders the admin dashboard correctly', async () => {
    render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    // Check for stats
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('Total Orders')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('New Users')).toBeInTheDocument()

    // Check for time range selector
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('displays dashboard data correctly', async () => {
    render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('$1,000.00')).toBeInTheDocument()
    })

    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    // Mock fetch to return error
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.reject(new Error('Failed to fetch'))
      })
    )

    render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
    })

    expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument()
  })

  it('handles unauthorized access', async () => {
    // Mock session without admin role
    const nonAdminSession = {
      user: {
        id: '2',
        email: 'user@example.com',
        role: 'user'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    render(
      <SessionProvider session={nonAdminSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    // Check for unauthorized message
    expect(screen.getByText('Unauthorized')).toBeInTheDocument()
    expect(screen.getByText('You do not have permission to access this page.')).toBeInTheDocument()
  })

  it('updates time range', async () => {
    render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    // Wait for time range selector to load
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    // Select new time range
    const timeRangeSelector = screen.getByRole('combobox')
    fireEvent.change(timeRangeSelector, { target: { value: 'week' } })

    // Check if fetch was called with new time range
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('timeRange=week'))
  })
}) 