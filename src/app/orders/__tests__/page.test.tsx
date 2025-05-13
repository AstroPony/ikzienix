import { render, screen } from '@testing-library/react'
import OrdersPage from '../page'

describe('OrdersPage', () => {
  it('renders the loading spinner', () => {
    render(<OrdersPage />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
}) 