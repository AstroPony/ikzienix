import { render, screen, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import AccountPage from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn().mockResolvedValue({
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    },
  }),
}))

// Mock firebase-admin
jest.mock('@/lib/firebase-admin', () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      exists: true,
      data: () => ({
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      }),
    }),
  },
}))

const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: '1',
}

describe('AccountPage', () => {
  test.skip('renders account page correctly', async () => {
    render(
      <SessionProvider session={mockSession}>
        <AccountPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('My Account')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  test.skip('displays order history', async () => {
    render(
      <SessionProvider session={mockSession}>
        <AccountPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Order History')).toBeInTheDocument()
    })
  })

  test.skip('redirects to sign in if not authenticated', async () => {
    render(
      <SessionProvider session={null}>
        <AccountPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Please sign in to view your account')).toBeInTheDocument()
    })
  })
}) 