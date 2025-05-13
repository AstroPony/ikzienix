import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import CompleteProfilePage from '../page'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase-admin'

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock firebase-admin
jest.mock('@/lib/firebase-admin', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
      })),
    })),
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('CompleteProfilePage', () => {
  const mockSession = {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
    expires: '1',
  }

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    
    // Mock getServerSession to return our mock session
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
    
    // Mock Firestore response
    const mockGet = jest.fn().mockResolvedValue({
      data: () => ({
        shippingAddress: null,
        billingAddress: null,
        phone: null,
      }),
    })
    
    ;(db.collection as jest.Mock).mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: mockGet,
      }),
    })
  })

  it('renders complete profile page correctly', async () => {
    render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument()
    })
  })

  it('handles form submission', async () => {
    render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument()
    })

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567890' },
    })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument()
    })
  })

  it('shows validation errors for required fields', async () => {
    render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument()
    })

    // Submit the form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    // Mock Firestore error
    const mockGet = jest.fn().mockRejectedValue(new Error('Failed to fetch user data'))
    ;(db.collection as jest.Mock).mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: mockGet,
      }),
    })

    render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/error loading profile/i)).toBeInTheDocument()
    })
  })

  it('handles unauthorized access', async () => {
    // Mock getServerSession to return null (unauthorized)
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    render(
      <SessionProvider session={null}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    // Should redirect to sign in page
    await waitFor(() => {
      expect(require('next/navigation').redirect).toHaveBeenCalledWith('/auth/signin')
    })
  })
}) 