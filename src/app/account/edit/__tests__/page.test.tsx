import { render, screen } from '@testing-library/react'
import AccountEditPage from '../page'

describe('AccountEditPage', () => {
  it('renders the Account Edit page correctly', () => {
    render(<AccountEditPage />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
}) 