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
          users: 200,
          newUsers: 30,
          revenueChange: 10,
          ordersChange: 5,
          usersChange: 15,
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
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
      expect(screen.getByText(/overview of your store's performance/i)).toBeInTheDocument()
    })
  })

  it('displays analytics data', async () => {
    render(
      <SessionProvider session={mockSession}>
        <AdminDashboard />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('$1,000.00')).toBeInTheDocument()
      expect(screen.getByText('50')).toBeInTheDocument()
      expect(screen.getByText('200')).toBeInTheDocument()
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
      expect(screen.getByText(/error loading analytics/i)).toBeInTheDocument()
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
      expect(screen.getByText(/access denied/i)).toBeInTheDocument()
      expect(screen.getByText(/you do not have permission to access this page/i)).toBeInTheDocument()
    })
  })
}) 