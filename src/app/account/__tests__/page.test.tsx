import { render, screen, waitFor } from '@testing-library/react'
import AccountPage from '../page'
import { CartProvider } from '@/contexts/CartContext'

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

// Mock Firebase auth
jest.mock('@/lib/firebase', () => ({
  clientAuth: {
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    })
  }
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
  test.skip('renders account page for authenticated user', async () => {
    render(<AccountPage />);
    await waitFor(() => {
      expect(screen.getByText('My Account')).toBeInTheDocument();
      expect(screen.getByText('Order History')).toBeInTheDocument();
    });
  });

  test.skip('shows sign in message for unauthenticated user', async () => {
    render(<AccountPage />);
    await waitFor(() => {
      expect(screen.getByText('Please sign in to view your account')).toBeInTheDocument();
    });
  });
}) 