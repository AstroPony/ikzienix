import { render, screen } from '@testing-library/react'
import CollectionsPage from '../page'

describe('CollectionsPage', () => {
  it('renders the Collections page correctly', () => {
    render(<CollectionsPage />)
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
}) 