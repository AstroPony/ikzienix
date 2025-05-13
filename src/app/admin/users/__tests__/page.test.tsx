import { render, screen } from '@testing-library/react'
import AdminUsersPage from '../page'

describe('AdminUsersPage', () => {
  it('renders the loading spinner', () => {
    render(<AdminUsersPage />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
}) 