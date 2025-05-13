import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ForgotPasswordPage from './page'
import { sendPasswordResetEmail } from 'firebase/auth'
import { clientAuth } from '@/lib/firebase'

// Mock firebase/auth
jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn(),
  clientAuth: {}
}))

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

interface FirebaseError extends Error {
  code: string;
}

class CustomFirebaseError extends Error implements FirebaseError {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders forgot password form', () => {
    render(<ForgotPasswordPage />)
    expect(screen.getByText('Forgot Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeInTheDocument()
  })

  it('handles successful password reset', async () => {
    (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined)
    render(<ForgotPasswordPage />)

    const emailInput = screen.getByLabelText('Email address')
    const submitButton = screen.getByRole('button', { name: 'Send Reset Link' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password reset link has been sent to your email.')).toBeInTheDocument()
    })
  })

  it('handles user not found error', async () => {
    const error = { message: 'User not found', code: 'auth/user-not-found' }
    (sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(error)

    render(<ForgotPasswordPage />)

    const emailInput = screen.getByLabelText('Email address')
    const submitButton = screen.getByRole('button', { name: 'Send Reset Link' })

    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('No account found with this email address.')).toBeInTheDocument()
    })
  })

  it('handles invalid email error', async () => {
    const error = { message: 'Invalid email', code: 'auth/invalid-email' }
    (sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(error)

    render(<ForgotPasswordPage />)

    const emailInput = screen.getByLabelText('Email address')
    const submitButton = screen.getByRole('button', { name: 'Send Reset Link' })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
    })
  })

  it('handles generic error', async () => {
    (sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(new Error('Generic error'))

    render(<ForgotPasswordPage />)

    const emailInput = screen.getByLabelText('Email address')
    const submitButton = screen.getByRole('button', { name: 'Send Reset Link' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again later.')).toBeInTheDocument()
    })
  })
}) 