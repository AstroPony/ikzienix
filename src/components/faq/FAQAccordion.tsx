'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
}

export default function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Get unique categories
  const categories = Array.from(new Set(items.map(item => item.category)))

  // Filter items based on search term and active category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !activeCategory || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={className}>
      {/* Search and Filter */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="btn-group w-100">
            <button
              className={`btn ${!activeCategory ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`btn ${activeCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="accordion" id="faqAccordion">
        {filteredItems.map((item, index) => (
          <div key={index} className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#faq${index}`}
                aria-expanded="false"
                aria-controls={`faq${index}`}
              >
                {item.question}
              </button>
            </h2>
            <div
              id={`faq${index}`}
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                <div className="d-flex align-items-center mb-2">
                  <span className="badge bg-primary me-2">{item.category}</span>
                </div>
                <div className="text-muted">{item.answer}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredItems.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-question-circle display-1 text-muted mb-3" />
          <h3 className="h4 mb-3">No matching FAQs found</h3>
          <p className="text-muted mb-0">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
} 