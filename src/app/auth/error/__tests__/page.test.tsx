import { render, screen } from '@testing-library/react'
import AuthErrorPage from '../page'

describe('AuthErrorPage', () => {
  it('renders the Auth Error page correctly', () => {
    render(<AuthErrorPage />)
    expect(screen.getByText('Authentication Error')).toBeInTheDocument()
  })
}) 