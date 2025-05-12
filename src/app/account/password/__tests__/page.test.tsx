import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import ChangePasswordPage from '../page'

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

// Mock fetch
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
)

describe('ChangePasswordPage', () => {
  it('renders the change password page correctly', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ChangePasswordPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Change Password')).toBeInTheDocument()
    expect(screen.getByText('Update your account password')).toBeInTheDocument()
  })

  it('handles password change submission', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ChangePasswordPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const currentPasswordInput = screen.getByLabelText(/current password/i)
    const newPasswordInput = screen.getByLabelText(/new password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword123' } })
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } })

    const submitButton = screen.getByRole('button', { name: /change password/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password changed successfully')).toBeInTheDocument()
    })
  })

  it('handles password mismatch', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ChangePasswordPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const currentPasswordInput = screen.getByLabelText(/current password/i)
    const newPasswordInput = screen.getByLabelText(/new password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword123' } })
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword123' } })

    const submitButton = screen.getByRole('button', { name: /change password/i })
    fireEvent.click(submitButton)

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
  })

  it('handles form validation', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ChangePasswordPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /change password/i })
    fireEvent.click(submitButton)

    expect(screen.getByText('Current password is required')).toBeInTheDocument()
    expect(screen.getByText('New password is required')).toBeInTheDocument()
    expect(screen.getByText('Confirm password is required')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to change password'))
    )

    const { container } = render(
      <SessionProvider session={mockSession}>
        <ChangePasswordPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const currentPasswordInput = screen.getByLabelText(/current password/i)
    const newPasswordInput = screen.getByLabelText(/new password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword123' } })
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } })

    const submitButton = screen.getByRole('button', { name: /change password/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Failed to change password')).toBeInTheDocument()
    })
  })

  it('handles unauthorized access', async () => {
    const { container } = render(
      <SessionProvider session={null}>
        <ChangePasswordPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('You must be logged in to view this page')).toBeInTheDocument()
  })
}) 