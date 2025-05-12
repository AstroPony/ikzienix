import { render, screen, fireEvent } from '@testing-library/react'
import SizeGuide from '../SizeGuide'

describe('SizeGuide', () => {
  it('renders both tabs', () => {
    render(<SizeGuide />)
    expect(screen.getByText('Frame Measurements')).toBeInTheDocument()
    expect(screen.getByText('Fit Guide')).toBeInTheDocument()
  })

  it('switches between tabs', () => {
    render(<SizeGuide />)
    const fitGuideTab = screen.getByText('Fit Guide')
    fireEvent.click(fitGuideTab)
    expect(screen.getByText('How to Find Your Perfect Fit')).toBeInTheDocument()
  })

  it('displays frame measurements content', () => {
    render(<SizeGuide />)
    expect(screen.getByText('Understanding Frame Measurements')).toBeInTheDocument()
    expect(screen.getByText('Lens Width:')).toBeInTheDocument()
    expect(screen.getByText('Bridge Width:')).toBeInTheDocument()
    expect(screen.getByText('Temple Length:')).toBeInTheDocument()
    expect(screen.getByText('Frame Width:')).toBeInTheDocument()
  })

  it('displays fit guide content when switched', () => {
    render(<SizeGuide />)
    const fitGuideTab = screen.getByText('Fit Guide')
    fireEvent.click(fitGuideTab)
    expect(screen.getByText('Face Shape Guide')).toBeInTheDocument()
    expect(screen.getByText('Round Face:')).toBeInTheDocument()
    expect(screen.getByText('Square Face:')).toBeInTheDocument()
    expect(screen.getByText('Oval Face:')).toBeInTheDocument()
    expect(screen.getByText('Heart Face:')).toBeInTheDocument()
  })
}) 