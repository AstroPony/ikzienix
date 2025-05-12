import { render, screen, waitFor } from '@testing-library/react'
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
const mockUserData = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockUserData)
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
    expect(screen.getByText('Account Settings')).toBeInTheDocument()
  })

  it('displays user information correctly', async () => {
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

  it('handles error state', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
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
    expect(screen.getByText('Failed to load account information')).toBeInTheDocument()
  })

  it('displays loading state', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <AccountPage />
      </SessionProvider>
    )

    expect(container).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
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

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('You must be logged in to view this page')).toBeInTheDocument()
  })
}) 