import { render, screen } from '@testing-library/react'
import AdminProductsPage from '../page'

describe('AdminProductsPage', () => {
  it('renders the loading spinner', () => {
    render(<AdminProductsPage />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
}) 