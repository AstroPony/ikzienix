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
    json: () => Promise.resolve({
      success: true
    })
  })
)

describe('CompleteProfilePage', () => {
  it('renders the complete profile page correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Complete Your Profile')).toBeInTheDocument()
    expect(screen.getByText('Please provide your information to continue')).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText('Full Name')
    const phoneInput = screen.getByLabelText('Phone Number')
    const addressInput = screen.getByLabelText('Address')
    const cityInput = screen.getByLabelText('City')
    const stateInput = screen.getByLabelText('State')
    const postalCodeInput = screen.getByLabelText('Postal Code')
    const countryInput = screen.getByLabelText('Country')

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(phoneInput, { target: { value: '1234567890' } })
    fireEvent.change(addressInput, { target: { value: '123 Main St' } })
    fireEvent.change(cityInput, { target: { value: 'New York' } })
    fireEvent.change(stateInput, { target: { value: 'NY' } })
    fireEvent.change(postalCodeInput, { target: { value: '10001' } })
    fireEvent.change(countryInput, { target: { value: 'USA' } })

    const submitButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument()
    })
  })

  it('handles form validation', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submitButton)

    expect(screen.getByText('Full name is required')).toBeInTheDocument()
    expect(screen.getByText('Phone number is required')).toBeInTheDocument()
    expect(screen.getByText('Address is required')).toBeInTheDocument()
    expect(screen.getByText('City is required')).toBeInTheDocument()
    expect(screen.getByText('State is required')).toBeInTheDocument()
    expect(screen.getByText('Postal code is required')).toBeInTheDocument()
    expect(screen.getByText('Country is required')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to update profile'))
    )

    const { container } = render(
      <SessionProvider session={mockSession}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText('Full Name')
    const phoneInput = screen.getByLabelText('Phone Number')
    const addressInput = screen.getByLabelText('Address')
    const cityInput = screen.getByLabelText('City')
    const stateInput = screen.getByLabelText('State')
    const postalCodeInput = screen.getByLabelText('Postal Code')
    const countryInput = screen.getByLabelText('Country')

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(phoneInput, { target: { value: '1234567890' } })
    fireEvent.change(addressInput, { target: { value: '123 Main St' } })
    fireEvent.change(cityInput, { target: { value: 'New York' } })
    fireEvent.change(stateInput, { target: { value: 'NY' } })
    fireEvent.change(postalCodeInput, { target: { value: '10001' } })
    fireEvent.change(countryInput, { target: { value: 'USA' } })

    const submitButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Failed to update profile')).toBeInTheDocument()
    })
  })

  it('handles unauthorized access', async () => {
    const { container } = render(
      <SessionProvider session={null}>
        <CompleteProfilePage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('You must be logged in to view this page')).toBeInTheDocument()
  })
}) 