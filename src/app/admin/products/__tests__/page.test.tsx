import { render, screen, waitFor } from '@testing-library/react'
import AdminProductsPage from '../page'

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock

describe('AdminProductsPage', () => {
  it('renders the Admin Products page correctly', async () => {
    render(<AdminProductsPage />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Manage your product catalog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeInTheDocument()
    expect(screen.getByText('No products found.')).toBeInTheDocument()
  })
}) 