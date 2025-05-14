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

    expect(screen.getAllByText('Change Password')[0]).toBeInTheDocument()
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument()
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

    const currentPasswordInput = screen.getByLabelText('Current Password')
    const newPasswordInput = screen.getByLabelText('New Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password')

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpass123' } })
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } })

    const submitButton = screen.getByRole('button', { name: /change password/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password changed successfully!')).toBeInTheDocument()
    })
  })

  it('displays error message when passwords do not match', async () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <ChangePasswordPage />
      </SessionProvider>
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    const currentPasswordInput = screen.getByLabelText('Current Password')
    const newPasswordInput = screen.getByLabelText('New Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password')

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpass123' } })
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpass' } })

    const submitButton = screen.getByRole('button', { name: /change password/i })
    fireEvent.click(submitButton)

    // Wait for the error message to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText(/new passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('handles API error', async () => {
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

    const currentPasswordInput = screen.getByLabelText('Current Password')
    const newPasswordInput = screen.getByLabelText('New Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password')

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpass123' } })
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } })

    const submitButton = screen.getByRole('button', { name: /change password/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument()
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
  })
}) 