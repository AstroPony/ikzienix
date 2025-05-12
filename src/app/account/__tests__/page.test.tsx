import { render, screen, waitFor } from '@testing-library/react'
import AccountPage from '../page'
import { SessionProvider } from 'next-auth/react'

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: () => Promise.resolve({
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User'
    }
  })
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

// Mock Firestore
jest.mock('@/lib/firebase-admin', () => ({
  db: {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({
          data: () => ({
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            shippingAddress: {
              line1: '123 Test St',
              city: 'Test City',
              state: 'TS',
              postalCode: '12345',
              country: 'Test Country'
            },
            billingAddress: {
              line1: '123 Test St',
              city: 'Test City',
              state: 'TS',
              postalCode: '12345',
              country: 'Test Country'
            },
            role: 'user',
            createdAt: new Date('2024-01-01'),
            profileCompleted: true
          })
        })
      })
    })
  }
}))

// Mock the session
const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}

describe('AccountPage', () => {
  it('renders the account page correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        {await AccountPage()}
      </SessionProvider>
    )

    // Check for main heading
    expect(screen.getByText('My Account')).toBeInTheDocument()

    // Check for personal information
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('1234567890')).toBeInTheDocument()

    // Check for addresses
    expect(screen.getByText('Shipping Address')).toBeInTheDocument()
    expect(screen.getByText('Billing Address')).toBeInTheDocument()
    expect(screen.getAllByText('123 Test St')).toHaveLength(2)
    expect(screen.getAllByText('Test City, TS 12345')).toHaveLength(2)
    expect(screen.getAllByText('Test Country')).toHaveLength(2)

    // Check for action buttons
    expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    expect(screen.getByText('Change Password')).toBeInTheDocument()
  })

  it('handles incomplete profile', async () => {
    // Mock Firestore to return incomplete profile
    jest.mock('@/lib/firebase-admin', () => ({
      db: {
        collection: () => ({
          doc: () => ({
            get: () => Promise.resolve({
              data: () => ({
                name: 'Test User',
                email: 'test@example.com',
                profileCompleted: false
              })
            })
          })
        })
      }
    }))

    const { container } = render(
      <SessionProvider session={mockSession}>
        {await AccountPage()}
      </SessionProvider>
    )

    // Check for complete profile prompt
    expect(screen.getByText('Complete Your Profile')).toBeInTheDocument()
    expect(screen.getByText('Please complete your profile to continue shopping.')).toBeInTheDocument()
  })

  it('handles Firestore error', async () => {
    // Mock Firestore to return error
    jest.mock('@/lib/firebase-admin', () => ({
      db: {
        collection: () => ({
          doc: () => ({
            get: () => Promise.reject(new Error('Failed to fetch profile'))
          })
        })
      }
    }))

    const { container } = render(
      <SessionProvider session={mockSession}>
        {await AccountPage()}
      </SessionProvider>
    )

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
    })
    expect(screen.getByText('Failed to load profile')).toBeInTheDocument()
  })

  it('handles unauthenticated user', async () => {
    // Mock getServerSession to return null
    jest.mock('next-auth', () => ({
      getServerSession: () => Promise.resolve(null)
    }))

    const { container } = render(
      <SessionProvider session={null}>
        {await AccountPage()}
      </SessionProvider>
    )

    // Check for redirect
    expect(screen.getByText('Please sign in to view your account')).toBeInTheDocument()
  })
}) 