import { render, screen } from '@testing-library/react'
import SignInPage from '../page'

describe('SignInPage', () => {
  it('renders the Sign In page correctly', () => {
    render(<SignInPage />)
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument()
  })
}) 