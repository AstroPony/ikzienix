import { render, screen } from '@testing-library/react'
import SizeGuidePage from '../page'

describe('SizeGuidePage', () => {
  it('renders the Size Guide page correctly', () => {
    render(<SizeGuidePage />)
    expect(screen.getByText('Frame Measurements')).toBeInTheDocument()
    expect(screen.getByText('Fit Guide')).toBeInTheDocument()
  })
}) 