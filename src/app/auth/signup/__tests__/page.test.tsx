import { render, screen } from '@testing-library/react'
import SignUpPage from '../page'

describe('SignUpPage', () => {
  it('renders the Sign Up page correctly', () => {
    render(<SignUpPage />)
    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument()
  })
}) 