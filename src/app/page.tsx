'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data: Product[] = await response.json()
        console.log('Fetched products:', data)
        const featured = data.filter(p => p.featured).slice(0, 3)
        console.log('Featured products:', featured)
        setFeaturedProducts(featured)
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError('Error loading featured products')
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <>
      {/* Hero Section - Bootstrap Carousel */}
      <div className="bg-dark text-white py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                <div className="carousel-inner rounded-4 overflow-hidden" style={{ height: '500px' }}>
                  {/* Slide 1 */}
                  <div className="carousel-item active position-relative w-100 h-100">
                    <img
                      src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80"
                      className="d-block w-100 h-100 object-fit-cover"
                      alt="Festival Sunglasses"
                      style={{ objectFit: 'cover', height: '500px' }}
                    />
                    <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
                      <h1 className="display-3 fw-bold mb-4">Festival Ready</h1>
                      <p className="lead mb-4">Stand out with our boldest sunglasses</p>
                      <Link href="/products" className="btn btn-light btn-lg">Shop Now</Link>
                    </div>
                  </div>
                  {/* Slide 2 */}
                  <div className="carousel-item position-relative w-100 h-100">
                    <img
                      src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80"
                      className="d-block w-100 h-100 object-fit-cover"
                      alt="Outdoor Sunglasses"
                      style={{ objectFit: 'cover', height: '500px' }}
                    />
                    <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
                      <h1 className="display-3 fw-bold mb-4">Adventure Awaits</h1>
                      <p className="lead mb-4">Perfect shades for every outdoor journey</p>
                      <Link href="/collections/new" className="btn btn-light btn-lg">View Collection</Link>
                    </div>
                  </div>
                  {/* Slide 3 */}
                  <div className="carousel-item position-relative w-100 h-100">
                    <img
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                      className="d-block w-100 h-100 object-fit-cover"
                      alt="Classic Sunglasses"
                      style={{ objectFit: 'cover', height: '500px' }}
                    />
                    <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
                      <h1 className="display-3 fw-bold mb-4">Classic Styles</h1>
                      <p className="lead mb-4">Timeless looks for every occasion</p>
                      <Link href="/products" className="btn btn-light btn-lg">Shop Classics</Link>
                    </div>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container py-5">
        <h2 className="display-5 text-center mb-5">Featured Products</h2>
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading featured products...</p>
          </div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : (
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-12 col-md-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="text-center">
                <i className="bi bi-shield-check display-4 mb-3"></i>
                <h3 className="h4 mb-3">UV Protection</h3>
                <p className="text-muted">All our sunglasses come with UV400 protection for your eyes.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="text-center">
                <i className="bi bi-tag display-4 mb-3"></i>
                <h3 className="h4 mb-3">Best Value</h3>
                <p className="text-muted">Quality sunglasses that won't break your budget.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="text-center">
                <i className="bi bi-truck display-4 mb-3"></i>
                <h3 className="h4 mb-3">Fast Shipping</h3>
                <p className="text-muted">Free shipping on orders over $50.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 