'use client'

import Image from 'next/image'
import { placeholderImages } from '@/lib/placeholder-images'

export default function AboutPage() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1 className="display-4 mb-4">About Us</h1>
          <p className="lead mb-4">
            Welcome to Ikzienix, your premier destination for high-quality sunglasses and eyewear.
            We are passionate about providing stylish, durable, and affordable eyewear that helps
            you express your unique style while protecting your eyes.
          </p>
          <p className="mb-4">
            Our journey began with a simple mission: to make premium eyewear accessible to everyone.
            We carefully curate our collection to include both timeless classics and cutting-edge
            designs, ensuring there's something for every style and occasion.
          </p>
          <p>
            At Ikzienix, we believe that quality eyewear is an investment in both style and eye health.
            That's why we work directly with manufacturers to ensure the highest standards of quality
            and craftsmanship in every pair of sunglasses we offer.
          </p>
        </div>
        <div className="col-md-6">
          <div className="position-relative" style={{ height: '400px' }}>
            <Image
              src={placeholderImages['classic-black']}
              alt="About Ikzienix"
              fill
              className="rounded-3"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <h2 className="text-center mb-4">Our Values</h2>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-award display-4 text-primary mb-3"></i>
              <h3 className="h4 mb-3">Quality</h3>
              <p className="text-muted">
                We are committed to offering only the highest quality eyewear that meets
                rigorous standards for durability and protection.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-heart display-4 text-primary mb-3"></i>
              <h3 className="h4 mb-3">Customer Satisfaction</h3>
              <p className="text-muted">
                Your satisfaction is our top priority. We strive to provide exceptional
                service and support at every step of your shopping journey.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-globe display-4 text-primary mb-3"></i>
              <h3 className="h4 mb-3">Sustainability</h3>
              <p className="text-muted">
                We are committed to sustainable practices and reducing our environmental
                impact through responsible manufacturing and packaging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 