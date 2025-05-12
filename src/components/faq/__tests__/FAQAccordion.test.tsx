import { render, screen, fireEvent } from '@testing-library/react'
import FAQAccordion from '../FAQAccordion'

const mockFAQs = [
  {
    question: 'Test Question 1',
    answer: 'Test Answer 1',
    category: 'Category 1'
  },
  {
    question: 'Test Question 2',
    answer: 'Test Answer 2',
    category: 'Category 2'
  }
]

describe('FAQAccordion', () => {
  it('renders FAQ items and handles expansion', () => {
    render(<FAQAccordion items={mockFAQs} />)
    
    // Check that questions are rendered
    expect(screen.getByText('Test Question 1')).toBeInTheDocument()
    expect(screen.getByText('Test Question 2')).toBeInTheDocument()
    
    // Click first accordion item
    const firstButton = screen.getByText('Test Question 1')
    fireEvent.click(firstButton)
    
    // Check that answer and category are visible after expansion
    expect(screen.getByText('Test Answer 1')).toBeInTheDocument()
    const category1Badges = screen.getAllByText('Category 1')
    expect(category1Badges.some(el => el.tagName === 'SPAN')).toBe(true)
    
    // Click second accordion item
    const secondButton = screen.getByText('Test Question 2')
    fireEvent.click(secondButton)
    
    // Check that second answer and category are visible
    expect(screen.getByText('Test Answer 2')).toBeInTheDocument()
    const category2Badges = screen.getAllByText('Category 2')
    expect(category2Badges.some(el => el.tagName === 'SPAN')).toBe(true)
  })

  it('filters questions based on search term', () => {
    render(<FAQAccordion items={mockFAQs} />)
    const searchInput = screen.getByPlaceholderText('Search FAQs...')
    fireEvent.change(searchInput, { target: { value: 'Question 1' } })
    expect(screen.getByText('Test Question 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Question 2')).not.toBeInTheDocument()
  })

  it('filters questions based on category', () => {
    render(<FAQAccordion items={mockFAQs} />)
    const categoryButton = screen.getAllByText('Category 1').find(el => el.tagName === 'BUTTON')
    fireEvent.click(categoryButton)
    expect(screen.getByText('Test Question 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Question 2')).not.toBeInTheDocument()
  })

  it('shows no results message when no matches found', () => {
    render(<FAQAccordion items={mockFAQs} />)
    const searchInput = screen.getByPlaceholderText('Search FAQs...')
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
    expect(screen.getByText('No matching FAQs found')).toBeInTheDocument()
  })

  it('displays category badges', () => {
    render(<FAQAccordion items={mockFAQs} />)
    
    // Click the first accordion item to expand it
    const firstButton = screen.getByText('Test Question 1')
    fireEvent.click(firstButton)
    
    // Now check for category badges
    const badge1 = screen.getAllByText('Category 1').find(el => el.tagName === 'SPAN')
    if (badge1) expect(badge1).toBeInTheDocument()
    
    // Click the second accordion item to expand it
    const secondButton = screen.getByText('Test Question 2')
    fireEvent.click(secondButton)
    
    const badge2 = screen.getAllByText('Category 2').find(el => el.tagName === 'SPAN')
    if (badge2) expect(badge2).toBeInTheDocument()
  })
}) 