import { render, screen } from '@testing-library/react'
import AccountPage from '../page'
import { CartProvider } from '@/lib/cart-context'

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
  test.skip('renders the account page correctly', async () => {
    render(
      <CartProvider>
        <AccountPage />
      </CartProvider>
    )

    await screen.findByText('My Account')
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  test.skip('displays order history', async () => {
    render(
      <CartProvider>
        <AccountPage />
      </CartProvider>
    )

    await screen.findByText('Order History')
  })

  test.skip('redirects to sign in if not authenticated', async () => {
    render(
      <CartProvider>
        <AccountPage />
      </CartProvider>
    )

    await screen.findByText('Please sign in to view your account')
  })
}) 