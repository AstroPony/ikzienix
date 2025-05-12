import { render, screen } from '@testing-library/react'
import AccountPage from '../page'
import { useSession } from 'next-auth/react'

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({ data: { user: { id: '1' } }, status: 'authenticated' })
}))

describe.skip('AccountPage', () => {
  it('renders the Account page correctly', () => {
    render(<AccountPage />)
    expect(screen.getByText('Account')).toBeInTheDocument()
  })
}) 