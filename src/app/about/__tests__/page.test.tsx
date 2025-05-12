import { render, screen } from '@testing-library/react'
import AboutPage from '../page'

describe('AboutPage', () => {
  it('renders the About page correctly', () => {
    render(<AboutPage />)
    expect(screen.getByText('About Us')).toBeInTheDocument()
  })
}) 