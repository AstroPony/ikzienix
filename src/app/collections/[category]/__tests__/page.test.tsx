import { render, screen, waitFor } from '@testing-library/react'
import CategoryDetailPage from '../page'
import { useParams } from 'next/navigation'

// Mock the useParams hook
jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue({ category: 'test-category' })
}))

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock

describe('CategoryDetailPage', () => {
  it('renders the Category Detail page correctly', async () => {
    render(<CategoryDetailPage />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('test-category')).toBeInTheDocument()
    })
  })
}) 