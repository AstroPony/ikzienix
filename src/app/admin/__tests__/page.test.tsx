import { render, screen } from '@testing-library/react'
import AdminPage from '../page'

describe('AdminPage', () => {
  it('renders the Admin page correctly', () => {
    render(<AdminPage />)
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
}) 