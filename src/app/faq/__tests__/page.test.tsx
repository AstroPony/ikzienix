import { render, screen } from '@testing-library/react'
import FAQPage from '../page'

describe('FAQPage', () => {
  it('renders the FAQ page correctly', () => {
    render(<FAQPage />)
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
  })
}) 