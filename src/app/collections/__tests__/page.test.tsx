import { render, screen } from '@testing-library/react'
import CollectionsPage from '../page'

describe('CollectionsPage', () => {
  it('renders the collections page heading', () => {
    render(<CollectionsPage />)
    expect(screen.getByText(/collections/i)).toBeInTheDocument()
  })
}) 