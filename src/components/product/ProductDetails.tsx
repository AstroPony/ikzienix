'use client'

import { useState } from 'react'
import { Product } from '@/types/product'

interface ProductDetailsProps {
  product: Product
  className?: string
}

export default function ProductDetails({ product, className = '' }: ProductDetailsProps) {
  const [activeTab, setActiveTab] = useState('shipping')

  const hasSpecifications = product.specifications && Object.keys(product.specifications).length > 0
  const hasFeatures = product.features && product.features.length > 0
  const hasCareInstructions = product.careInstructions && product.careInstructions.length > 0
  const hasWarranty = product.warranty && product.warranty.length > 0
  const hasShipping = product.shipping && Object.keys(product.shipping).length > 0

  return (
    <div className={className}>
      <ul className="nav nav-tabs mb-3" role="tablist">
        {hasSpecifications && (
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
              type="button"
              role="tab"
              aria-selected={activeTab === 'specifications'}
            >
              Specifications
            </button>
          </li>
        )}
        {hasFeatures && (
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
              type="button"
              role="tab"
              aria-selected={activeTab === 'features'}
            >
              Features
            </button>
          </li>
        )}
        {hasCareInstructions && hasWarranty && (
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'care' ? 'active' : ''}`}
              onClick={() => setActiveTab('care')}
              type="button"
              role="tab"
              aria-selected={activeTab === 'care'}
            >
              Care & Warranty
            </button>
          </li>
        )}
        {hasShipping && (
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'shipping' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipping')}
              type="button"
              role="tab"
              aria-selected={activeTab === 'shipping'}
            >
              Shipping
            </button>
          </li>
        )}
      </ul>

      <div className="tab-content">
        {hasSpecifications && (
          <div
            className={`tab-pane fade ${activeTab === 'specifications' ? 'show active' : ''}`}
            role="tabpanel"
          >
            <div className="row g-3">
              {product.specifications?.frameMaterial && (
                <div className="col-6">
                  <p className="mb-1 text-muted">Frame Material</p>
                  <p className="mb-0">{product.specifications.frameMaterial}</p>
                </div>
              )}
              {product.specifications?.lensMaterial && (
                <div className="col-6">
                  <p className="mb-1 text-muted">Lens Material</p>
                  <p className="mb-0">{product.specifications.lensMaterial}</p>
                </div>
              )}
              {product.specifications?.lensWidth && (
                <div className="col-6">
                  <p className="mb-1 text-muted">Lens Width</p>
                  <p className="mb-0">{product.specifications.lensWidth}mm</p>
                </div>
              )}
              {product.specifications?.bridgeWidth && (
                <div className="col-6">
                  <p className="mb-1 text-muted">Bridge Width</p>
                  <p className="mb-0">{product.specifications.bridgeWidth}mm</p>
                </div>
              )}
              {product.specifications?.templeLength && (
                <div className="col-6">
                  <p className="mb-1 text-muted">Temple Length</p>
                  <p className="mb-0">{product.specifications.templeLength}mm</p>
                </div>
              )}
              {product.specifications?.weight && (
                <div className="col-6">
                  <p className="mb-1 text-muted">Weight</p>
                  <p className="mb-0">{product.specifications.weight}g</p>
                </div>
              )}
              {product.specifications?.uvProtection && (
                <div className="col-6">
                  <p className="mb-1 text-muted">UV Protection</p>
                  <p className="mb-0">{product.specifications.uvProtection}</p>
                </div>
              )}
              {product.specifications?.polarization && (
                <div className="col-6">
                  <p className="mb-1 text-muted">Polarization</p>
                  <p className="mb-0">{product.specifications.polarization ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {hasFeatures && (
          <div
            className={`tab-pane fade ${activeTab === 'features' ? 'show active' : ''}`}
            role="tabpanel"
          >
            <ul className="list-unstyled mb-0">
              {product.features?.map((feature, index) => (
                <li key={index} className="d-flex align-items-center mb-2">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasCareInstructions && hasWarranty && (
          <div
            className={`tab-pane fade ${activeTab === 'care' ? 'show active' : ''}`}
            role="tabpanel"
          >
            <div className="mb-4">
              <h6 className="mb-3">Care Instructions</h6>
              <ul className="list-unstyled mb-0">
                {Array.isArray(product.careInstructions) 
                  ? product.careInstructions.map((instruction, index) => (
                      <li key={index} className="d-flex align-items-center mb-2">
                        <i className="bi bi-dot me-2"></i>
                        {instruction}
                      </li>
                    ))
                  : (
                      <li className="d-flex align-items-center mb-2">
                        <i className="bi bi-dot me-2"></i>
                        {product.careInstructions}
                      </li>
                    )
                }
              </ul>
            </div>
            <div>
              <h6 className="mb-3">Warranty</h6>
              <p className="mb-0">{product.warranty}</p>
            </div>
          </div>
        )}

        {hasShipping && (
          <div
            className={`tab-pane fade ${activeTab === 'shipping' ? 'show active' : ''}`}
            role="tabpanel"
          >
            <div className="row g-3">
              <div className="col-12">
                <p className="mb-1 text-muted">Shipping</p>
                <p className="mb-0">
                  {product.shipping?.freeShipping ? 'Free Shipping' : 'Standard Shipping'}
                </p>
              </div>
              <div className="col-12">
                <p className="mb-1 text-muted">Estimated Delivery</p>
                <p className="mb-0">{product.shipping?.estimatedDelivery}</p>
              </div>
              <div className="col-12">
                <p className="mb-1 text-muted">Return Policy</p>
                <p className="mb-0">{product.shipping?.returnPolicy}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 