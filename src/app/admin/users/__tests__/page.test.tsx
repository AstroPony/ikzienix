import { render, screen } from '@testing-library/react'
import AdminUsersPage from '../page'

describe('AdminUsersPage', () => {
  it('renders the Admin Users page correctly', () => {
    render(<AdminUsersPage />)
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
}) 