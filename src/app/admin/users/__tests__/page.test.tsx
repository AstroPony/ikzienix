import { render, screen, waitFor } from '@testing-library/react'
import AdminUsersPage from '../page'

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock

describe('AdminUsersPage', () => {
  it('renders the Admin Users page correctly', async () => {
    render(<AdminUsersPage />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Manage user accounts')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add User/i })).toBeInTheDocument()
    expect(screen.getByText('No users found.')).toBeInTheDocument()
  })
}) 