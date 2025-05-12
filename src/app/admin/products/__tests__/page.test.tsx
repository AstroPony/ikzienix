import { render, screen } from '@testing-library/react'
import AdminProductsPage from '../page'

describe('AdminProductsPage', () => {
  it('renders the Admin Products page correctly', () => {
    render(<AdminProductsPage />)
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
}) 