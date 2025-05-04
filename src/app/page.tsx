'use client'

import Image from 'next/image'
import Link from 'next/link'
import { placeholderImages } from '@/lib/placeholder-images'

// This would typically come from your database
const featuredProducts = [
  {
    id: '1',
    name: 'Classic Aviator',
    price: 149.99,
    image: placeholderImages['aviator-gold'],
  },
  {
    id: '2',
    name: 'Retro Wayfarer',
    price: 129.99,
    image: placeholderImages['wayfarer'],
  },
  {
    id: '3',
    name: 'Modern Round',
    price: 139.99,
    image: placeholderImages['retro-round'],
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-dark text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6">
              <div className="position-relative" style={{ height: '500px' }}>
                <Image
                  src={placeholderImages['classic-black']}
                  alt="Hero"
                  fill
                  className="object-fit-cover"
                  priority
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-40"></div>
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center text-white">
                    <h1 className="display-3 fw-bold mb-4">Premium Sunglasses</h1>
                    <p className="lead mb-4">Discover our collection of high-quality sunglasses</p>
                    <Link href="/products" className="btn btn-light btn-lg">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 mt-5 mt-lg-0">
              <div className="position-relative" style={{ height: '400px' }}>
                <Image
                  src={placeholderImages['sport-shield']}
                  alt="Sunglasses collection"
                  fill
                  className="object-fit-cover"
                  priority
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-40"></div>
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center text-white">
                    <h2 className="display-5 fw-bold mb-4">New Collection</h2>
                    <p className="lead mb-4">Check out our latest arrivals</p>
                    <Link href="/collections/new" className="btn btn-light btn-lg">
                      View Collection
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container py-5">
        <h2 className="display-5 text-center mb-5">Featured Products</h2>
        <div className="row g-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="col-12 col-md-4">
              <Link href={`/products/${product.id}`} className="text-decoration-none">
                <div className="card h-100">
                  <div className="position-relative" style={{ height: '300px' }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-fit-cover"
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title h5 text-dark">{product.name}</h3>
                    <p className="card-text text-muted">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
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