import { render, screen } from '@testing-library/react'
import SuccessPage from '../page'

describe('SuccessPage', () => {
  it('renders the Success page correctly', () => {
    render(<SuccessPage />)
    expect(screen.getByText('Thank You for Your Order!')).toBeInTheDocument()
  })
}) 