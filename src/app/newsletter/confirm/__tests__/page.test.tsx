import { render, screen } from '@testing-library/react'
import NewsletterConfirmPage from '../page'

describe('NewsletterConfirmPage', () => {
  it('renders the Newsletter Confirmation page correctly', () => {
    render(<NewsletterConfirmPage />)
    expect(screen.getByText('Oops!')).toBeInTheDocument()
  })
}) 