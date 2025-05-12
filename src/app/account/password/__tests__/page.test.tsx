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
    email: 'test@example.com'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}

// Mock fetch
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
) as jest.Mock

describe('ChangePasswordPage', () => {
  it('renders the change password form correctly', () => {
    render(
      <SessionProvider session={mockSession}>
        <ChangePasswordPage />
      </SessionProvider>
    )
    expect(screen.getAllByText('Change Password')).toHaveLength(2)
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument()
  })

  it('handles password change submission', async () => {
    render(
      <SessionProvider session={mockSession}>
        <ChangePasswordPage />
      </SessionProvider>
    )

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Current Password'), {
      target: { value: 'currentpass' }
    })
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'newpass123' }
    })
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'newpass123' }
    })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }))

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Password changed successfully!')).toBeInTheDocument()
    })
  })

  it('shows error when passwords do not match', async () => {
    render(
      <SessionProvider session={mockSession}>
        <ChangePasswordPage />
      </SessionProvider>
    )

    // Fill in the form with mismatched passwords
    fireEvent.change(screen.getByLabelText('Current Password'), {
      target: { value: 'currentpass' }
    })
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'newpass123' }
    })
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'differentpass' }
    })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }))

    // Check for error message
    expect(screen.getByText('New passwords do not match.')).toBeInTheDocument()
  })

  it('handles API error', async () => {
    // Mock fetch to return error
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to change password' })
      })
    )

    render(
      <SessionProvider session={mockSession}>
        <ChangePasswordPage />
      </SessionProvider>
    )

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Current Password'), {
      target: { value: 'currentpass' }
    })
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'newpass123' }
    })
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'newpass123' }
    })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }))

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to change password')).toBeInTheDocument()
    })
  })
}) 