import { render, screen } from '@testing-library/react'
import AdminProductsPage from '../page'

describe('AdminProductsPage', () => {
  it('renders the Admin Products page correctly', () => {
    render(<AdminProductsPage />)
    
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Manage your product catalog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeInTheDocument()
    expect(screen.getByText('No products found.')).toBeInTheDocument()
  })
}) 