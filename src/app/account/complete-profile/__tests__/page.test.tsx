import { render, screen, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import CompleteProfilePage from '../page'

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
            // Missing required fields to trigger profile completion
            shippingAddress: null,
            billingAddress: null,
            phone: null
          })
        })
      })
    })
  }
}))

// Mock ProfileForm component
jest.mock('../complete-profile-form', () => {
  return function MockProfileForm() {
    return <div data-testid="profile-form">Profile Form</div>
  }
})

// Mock the session
const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}

describe('CompleteProfilePage', () => {
  it('renders the complete profile page correctly', async () => {
    const page = await CompleteProfilePage()
    render(
      <SessionProvider session={mockSession}>
        {page}
      </SessionProvider>
    )

    // Check for main heading
    expect(screen.getByText('Complete Your Profile')).toBeInTheDocument()

    // Check for description
    expect(screen.getByText(/Please provide your shipping and billing information/)).toBeInTheDocument()

    // Check for profile form
    expect(screen.getByTestId('profile-form')).toBeInTheDocument()
  })

  it('handles already completed profile', async () => {
    // Mock Firestore to return completed profile
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
                profileCompleted: true
              })
            })
          })
        })
      }
    }))

    const page = await CompleteProfilePage()
    render(
      <SessionProvider session={mockSession}>
        {page}
      </SessionProvider>
    )

    // Check for redirect message
    expect(screen.getByText('Your profile is already complete.')).toBeInTheDocument()
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

    const page = await CompleteProfilePage()
    render(
      <SessionProvider session={mockSession}>
        {page}
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

    const page = await CompleteProfilePage()
    render(
      <SessionProvider session={null}>
        {page}
      </SessionProvider>
    )

    // Check for redirect
    expect(screen.getByText('Please sign in to complete your profile')).toBeInTheDocument()
  })
}) 