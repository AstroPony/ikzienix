import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import CheckoutPage from '../page'

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

// Mock cart context
jest.mock('@/lib/cart-context', () => ({
  useCart: () => ({
    items: [
      {
        id: '1',
        name: 'Test Product',
        price: 100,
        quantity: 2,
        image: 'test-image.jpg'
      }
    ],
    total: 200,
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn()
  })
}))

// Mock fetch
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
)

describe('CheckoutPage', () => {
  it('renders the checkout page correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <CheckoutPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Checkout')).toBeInTheDocument()
    expect(screen.getByText('Complete your purchase')).toBeInTheDocument()
  })

  it('displays cart items correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <CheckoutPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('$200.00')).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <CheckoutPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const addressInput = screen.getByLabelText(/address/i)
    const cityInput = screen.getByLabelText(/city/i)
    const stateInput = screen.getByLabelText(/state/i)
    const postalCodeInput = screen.getByLabelText(/postal code/i)
    const countryInput = screen.getByLabelText(/country/i)
    const cardNumberInput = screen.getByLabelText(/card number/i)
    const expiryInput = screen.getByLabelText(/expiry/i)
    const cvcInput = screen.getByLabelText(/cvc/i)

    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(addressInput, { target: { value: '123 Test St' } })
    fireEvent.change(cityInput, { target: { value: 'Test City' } })
    fireEvent.change(stateInput, { target: { value: 'TS' } })
    fireEvent.change(postalCodeInput, { target: { value: '12345' } })
    fireEvent.change(countryInput, { target: { value: 'Test Country' } })
    fireEvent.change(cardNumberInput, { target: { value: '4242424242424242' } })
    fireEvent.change(expiryInput, { target: { value: '12/25' } })
    fireEvent.change(cvcInput, { target: { value: '123' } })

    const submitButton = screen.getByRole('button', { name: /place order/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Order placed successfully')).toBeInTheDocument()
    })
  })

  it('handles form validation', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <CheckoutPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /place order/i })
    fireEvent.click(submitButton)

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Address is required')).toBeInTheDocument()
    expect(screen.getByText('City is required')).toBeInTheDocument()
    expect(screen.getByText('State is required')).toBeInTheDocument()
    expect(screen.getByText('Postal code is required')).toBeInTheDocument()
    expect(screen.getByText('Country is required')).toBeInTheDocument()
    expect(screen.getByText('Card number is required')).toBeInTheDocument()
    expect(screen.getByText('Expiry date is required')).toBeInTheDocument()
    expect(screen.getByText('CVC is required')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to process payment'))
    )

    const { container } = render(
      <SessionProvider session={mockSession}>
        <CheckoutPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const addressInput = screen.getByLabelText(/address/i)
    const cityInput = screen.getByLabelText(/city/i)
    const stateInput = screen.getByLabelText(/state/i)
    const postalCodeInput = screen.getByLabelText(/postal code/i)
    const countryInput = screen.getByLabelText(/country/i)
    const cardNumberInput = screen.getByLabelText(/card number/i)
    const expiryInput = screen.getByLabelText(/expiry/i)
    const cvcInput = screen.getByLabelText(/cvc/i)

    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(addressInput, { target: { value: '123 Test St' } })
    fireEvent.change(cityInput, { target: { value: 'Test City' } })
    fireEvent.change(stateInput, { target: { value: 'TS' } })
    fireEvent.change(postalCodeInput, { target: { value: '12345' } })
    fireEvent.change(countryInput, { target: { value: 'Test Country' } })
    fireEvent.change(cardNumberInput, { target: { value: '4242424242424242' } })
    fireEvent.change(expiryInput, { target: { value: '12/25' } })
    fireEvent.change(cvcInput, { target: { value: '123' } })

    const submitButton = screen.getByRole('button', { name: /place order/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Failed to process payment')).toBeInTheDocument()
    })
  })

  it('handles unauthorized access', async () => {
    const { container } = render(
      <SessionProvider session={null}>
        <CheckoutPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('You must be logged in to view this page')).toBeInTheDocument()
  })
}) 