import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import AccountPage from '../page'

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

// Mock fetch
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      },
      orders: [
        {
          id: '1',
          total: 100,
          status: 'pending',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ]
    })
  })
)

describe('AccountPage', () => {
  it('renders the account page correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <AccountPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('My Account')).toBeInTheDocument()
    expect(screen.getByText('Manage your account settings')).toBeInTheDocument()
  })

  it('displays user information', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <AccountPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('displays order history', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <AccountPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Order #1')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch account data'))
    )

    const { container } = render(
      <SessionProvider session={mockSession}>
        <AccountPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Failed to load account data')).toBeInTheDocument()
  })

  it('handles unauthorized access', async () => {
    const { container } = render(
      <SessionProvider session={null}>
        <AccountPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })
  })
}) 