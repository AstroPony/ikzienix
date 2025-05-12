import { render, screen } from '@testing-library/react'
import AdminDynamicPage from '../page'
import { useParams } from 'next/navigation'

// Mock the useParams hook
jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue({ page: 'test-page' })
}))

describe('AdminDynamicPage', () => {
  it('renders the Admin dynamic page correctly', () => {
    render(<AdminDynamicPage />)
    // Check for loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
}) 