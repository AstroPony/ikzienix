import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
    json: () => Promise.resolve({ success: true })
  })
)

describe('CompleteProfilePage', () => {
  it('renders the complete profile page correctly', async () => {
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

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '1234567890' }
    })
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' }
    })
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'New York' }
    })
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'NY' }
    })
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '10001' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument()
    })
  })

  it('handles form validation', async () => {
    render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    // Submit form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('Phone number is required')).toBeInTheDocument()
      expect(screen.getByText('Address is required')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to update profile'))

    render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '1234567890' }
    })
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' }
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