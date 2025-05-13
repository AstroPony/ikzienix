'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface SearchResult {
  id: string
  name: string
  description: string
  price: number
  image: string
}

interface SearchError {
  message: string
  code?: string
}

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<SearchError | null>(null)
  const [showResults, setShowResults] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery) {
        setResults([])
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`)
        }
        const data = await response.json()
        setResults(data.products)
      } catch (error) {
        setError({
          message: error instanceof Error ? error.message : 'An error occurred while searching',
          code: 'SEARCH_ERROR'
        })
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    searchProducts()
  }, [debouncedQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setShowResults(false)
    }
  }

  return (
    <div ref={searchRef} className="position-relative">
      <form onSubmit={handleSubmit} className="d-flex">
        <input
          type="search"
          className="form-control"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />
        <button type="submit" className="btn btn-primary ms-2">
          <i className="bi bi-search"></i>
        </button>
      </form>

      {showResults && (query.trim() || isLoading) && (
        <div className="position-absolute w-100 mt-1 bg-white shadow-lg rounded">
          {isLoading ? (
            <div className="p-3 text-center">
              <LoadingSpinner size="sm" />
            </div>
          ) : error ? (
            <div className="p-3 text-danger">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error.message}
            </div>
          ) : results.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {results.map((result) => (
                <li key={result.id}>
                  <a
                    href={`/products/${result.id}`}
                    className="d-flex align-items-center p-3 text-decoration-none text-dark hover-bg-light"
                    onClick={() => setShowResults(false)}
                  >
                    <img
                      src={result.image}
                      alt={result.name}
                      className="me-3"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div>
                      <div className="fw-bold">{result.name}</div>
                      <div className="text-muted small">${result.price.toFixed(2)}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-muted">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  )
} 