import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import AdminDashboard from '../page'

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
const mockAnalyticsData = {
  revenue: 1000,
  orders: 50,
  visitors: 200,
  newUsers: 30,
  revenueChange: 10,
  ordersChange: 5,
  visitorsChange: 15,
  newUsersChange: 20,
  salesByCategory: {
    'Category 1': 500,
    'Category 2': 500
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
    json: () => Promise.resolve(mockAnalyticsData)
  })
)

describe('AdminDashboard', () => {
  it('renders the admin dashboard correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Overview of your store\'s performance')).toBeInTheDocument()
  })

  it('displays dashboard data correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('$1,000.00')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    )

    const { container } = render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument()
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
        <AdminDashboard />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('You do not have permission to access this page')).toBeInTheDocument()
  })

  it('updates time range', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const timeRangeSelect = screen.getByRole('combobox')
    expect(timeRangeSelect).toHaveValue('7d')

    // Mock fetch for new time range
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          ...mockAnalyticsData,
          revenue: 2000,
          orders: 100
        })
      })
    )

    fireEvent.change(timeRangeSelect, { target: { value: '30d' } })

    await waitFor(() => {
      expect(screen.getByText('$2,000.00')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument()
    })
  })
}) 