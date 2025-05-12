import { render, screen } from '@testing-library/react'
import ContactPage from '../page'

describe('ContactPage', () => {
  it('renders the Contact page correctly', () => {
    render(<ContactPage />)
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
  })
}) 