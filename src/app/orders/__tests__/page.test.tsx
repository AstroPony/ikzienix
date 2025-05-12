import { render, screen } from '@testing-library/react'
import OrdersPage from '../page'

describe('OrdersPage', () => {
  it('renders the Orders page correctly', () => {
    render(<OrdersPage />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
}) 