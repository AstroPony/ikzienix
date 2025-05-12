import { render, screen } from '@testing-library/react'
import AdminUsersPage from '../page'

describe('AdminUsersPage', () => {
  it('renders the Admin Users page correctly', () => {
    render(<AdminUsersPage />)
    
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Manage user accounts')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add User/i })).toBeInTheDocument()
    expect(screen.getByText('No users found.')).toBeInTheDocument()
  })
}) 