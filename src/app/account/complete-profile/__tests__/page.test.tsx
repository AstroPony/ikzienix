import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import CompleteProfilePage from '../page'
import { CartProvider } from '@/contexts/CartContext'

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
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
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

// Mock Firebase auth
jest.mock('@/lib/firebase', () => ({
  clientAuth: {
    onAuthStateChanged: (callback: any) => callback(null)
  }
}))

const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com'
  },
  expires: '1'
}

// Mock fetch
global.fetch = jest.fn()

describe('CompleteProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders complete profile page correctly', () => {
    render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    expect(screen.getByText(/complete your profile/i)).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    const phoneInput = screen.getByLabelText(/phone number/i)
    const submitButton = screen.getByRole('button', { name: /save/i })

    fireEvent.change(phoneInput, { target: { value: '1234567890' } })
    fireEvent.click(submitButton)

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

    // Submit form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument()
      expect(screen.getByText('Phone number is required')).toBeInTheDocument()
      expect(screen.getByText('Address is required')).toBeInTheDocument()
      expect(screen.getByText('City is required')).toBeInTheDocument()
      expect(screen.getByText('State is required')).toBeInTheDocument()
      expect(screen.getByText('Postal code is required')).toBeInTheDocument()
      expect(screen.getByText('Country is required')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to update profile'))

    render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567890' },
    })
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    })
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'New York' },
    })
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'NY' },
    })
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: '10001' },
    })
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'USA' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('Failed to update profile')).toBeInTheDocument()
    })
  })

  it('handles unauthorized access', async () => {
    render(
      <SessionProvider session={null}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Please sign in to continue')).toBeInTheDocument()
    })
  })
}) 