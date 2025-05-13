'use client'

import { useState } from 'react'
import Image from 'next/image'

interface SizeGuideProps {
  className?: string
}

export default function SizeGuide({ className = '' }: SizeGuideProps) {
  const [activeTab, setActiveTab] = useState<'measurements' | 'fit'>('measurements')

  return (
    <div className={`card ${className}`}>
      <div className="card-header bg-white">
        <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'measurements' ? 'active' : ''}`}
              onClick={() => setActiveTab('measurements')}
            >
              Frame Measurements
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'fit' ? 'active' : ''}`}
              onClick={() => setActiveTab('fit')}
            >
              Fit Guide
            </button>
          </li>
        </ul>
      </div>
      <div className="card-body">
        {activeTab === 'measurements' ? (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="position-relative" style={{ height: '300px' }}>
                <Image
                  src="/images/size-guide-frame.png"
                  alt="Sunglasses frame measurements"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="col-md-6">
              <h3 className="h5 mb-3">Understanding Frame Measurements</h3>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <strong>Lens Width:</strong> The horizontal width of each lens (in mm)
                </li>
                <li className="mb-3">
                  <strong>Bridge Width:</strong> The distance between the lenses (in mm)
                </li>
                <li className="mb-3">
                  <strong>Temple Length:</strong> The length of the arms (in mm)
                </li>
                <li className="mb-3">
                  <strong>Frame Width:</strong> The total width of the frame (in mm)
                </li>
              </ul>
              <div className="alert alert-info mb-0">
                <i className="bi bi-info-circle me-2"></i>
                These measurements can be found in the product specifications.
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-md-6">
              <h3 className="h5 mb-3">How to Find Your Perfect Fit</h3>
              <div className="mb-4">
                <h4 className="h6 mb-2">Face Shape Guide</h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <strong>Round Face:</strong> Angular frames, square or rectangular shapes
                  </li>
                  <li className="mb-2">
                    <strong>Square Face:</strong> Round or oval frames to soften angles
                  </li>
                  <li className="mb-2">
                    <strong>Oval Face:</strong> Most frame shapes work well
                  </li>
                  <li className="mb-2">
                    <strong>Heart Face:</strong> Bottom-heavy frames, round or square shapes
                  </li>
                </ul>
              </div>
              <div className="alert alert-warning mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                If you're between sizes, we recommend going with the larger size for comfort.
              </div>
            </div>
            <div className="col-md-6">
              <div className="position-relative" style={{ height: '300px' }}>
                <Image
                  src="/images/size-guide-fit.png"
                  alt="Face shape guide"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 