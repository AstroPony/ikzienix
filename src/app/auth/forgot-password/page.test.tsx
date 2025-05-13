import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ForgotPasswordPage from '@/app/auth/forgot-password/page'
import { sendPasswordResetEmail } from 'firebase/auth'

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn(),
  getAuth: jest.fn(() => ({
    currentUser: null
  }))
}))

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Define Firebase error type
interface FirebaseError extends Error {
  code: string;
}

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders forgot password page', () => {
    render(<ForgotPasswordPage />)

    expect(screen.getByText('Forgot Password')).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to sign in/i })).toBeInTheDocument()
  })

  it('handles form submission successfully', async () => {
    ;(sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined)

    render(<ForgotPasswordPage />)

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'test@example.com')
      expect(screen.getByText(/password reset link has been sent/i)).toBeInTheDocument()
    })
  })

  it('handles user not found error', async () => {
    const error = new Error('User not found') as FirebaseError
    error.code = 'auth/user-not-found'
    ;(sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(error)

    render(<ForgotPasswordPage />)

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/no account found with this email address/i)).toBeInTheDocument()
    })
  })

  it('handles invalid email error', async () => {
    const error = new Error('Invalid email') as FirebaseError
    error.code = 'auth/invalid-email'
    ;(sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(error)

    render(<ForgotPasswordPage />)

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('handles generic error', async () => {
    ;(sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(new Error('Unknown error'))

    render(<ForgotPasswordPage />)

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument()
    })
  })
}) 