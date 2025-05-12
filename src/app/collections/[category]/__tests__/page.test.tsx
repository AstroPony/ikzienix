import { render, screen } from '@testing-library/react'
import CategoryDetailPage from '../page'
import { useParams } from 'next/navigation'

// Mock the useParams hook
jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue({ category: 'test-category' })
}))

describe('CategoryDetailPage', () => {
  it('renders the Category Detail page correctly', () => {
    render(<CategoryDetailPage />)
    expect(screen.getByText('Failed to load products')).toBeInTheDocument()
  })
}) 