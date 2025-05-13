'use client'

import { ProductSpecifications as ProductSpecs } from '@/types/product'

interface ProductSpecificationsProps {
  specifications: ProductSpecs
}

export default function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  return (
    <div className="mb-6">
      <h3 className="h5 mb-3">Specifications</h3>
      <div className="table-responsive">
        <table className="table table-sm">
          <tbody>
            <tr>
              <th className="text-muted">Frame Material</th>
              <td>{specifications.frameMaterial}</td>
            </tr>
            <tr>
              <th className="text-muted">Lens Material</th>
              <td>{specifications.lensMaterial}</td>
            </tr>
            <tr>
              <th className="text-muted">Lens Width</th>
              <td>{specifications.lensWidth}</td>
            </tr>
            <tr>
              <th className="text-muted">Bridge Width</th>
              <td>{specifications.bridgeWidth}</td>
            </tr>
            <tr>
              <th className="text-muted">Temple Length</th>
              <td>{specifications.templeLength}</td>
            </tr>
            <tr>
              <th className="text-muted">Weight</th>
              <td>{specifications.weight}</td>
            </tr>
            <tr>
              <th className="text-muted">UV Protection</th>
              <td>{specifications.uvProtection}</td>
            </tr>
            <tr>
              <th className="text-muted">Polarized</th>
              <td>{specifications.polarization ? 'Yes' : 'No'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
} 