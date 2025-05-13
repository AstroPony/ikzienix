import { render, screen, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import AdminDashboard from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

const mockSession = {
  user: {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  expires: '1',
}

describe('AdminDashboard', () => {
  beforeEach(() => {
    // Mock fetch for analytics data
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          revenue: 1000,
          orders: 50,
          users: 0,
          newUsers: 30,
          revenueChange: 10,
          ordersChange: 5,
          usersChange: 0,
          newUsersChange: 20,
        }),
    })
  })

  it('renders the dashboard correctly', async () => {
    render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Overview of your store\'s performance')).toBeInTheDocument()
    })
  })

  it('displays analytics data', async () => {
    render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('$1000.00')).toBeInTheDocument()
      expect(screen.getByText('50')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('30')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'))

    render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument()
    })
  })

  it('redirects non-admin users', async () => {
    const nonAdminSession = {
      ...mockSession,
      user: { ...mockSession.user, role: 'user' },
    }

    render(
      <SessionProvider session={nonAdminSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument()
      expect(screen.getByText('You do not have permission to access this page')).toBeInTheDocument()
    })
  })
}) 