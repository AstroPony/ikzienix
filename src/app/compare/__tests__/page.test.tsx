import { render, screen } from '@testing-library/react'
import ComparePage from '../page'
import { ComparisonProvider } from '@/lib/comparison-context'

describe('ComparePage', () => {
  it('renders the Compare page correctly', () => {
    render(
      <ComparisonProvider>
        <ComparePage />
      </ComparisonProvider>
    )
    // Check for empty state message
    expect(screen.getByText(/no products selected/i)).toBeInTheDocument()
  })
}) 