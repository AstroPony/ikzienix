import { ProductSpecifications as ProductSpecs } from '@/types/product'

interface ProductSpecificationsProps {
  specifications: ProductSpecs
}

export default function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Specifications</h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt className="font-medium text-gray-600">Frame Material</dt>
          <dd className="text-gray-900">{specifications.frameMaterial}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Lens Material</dt>
          <dd className="text-gray-900">{specifications.lensMaterial}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Lens Width</dt>
          <dd className="text-gray-900">{specifications.lensWidth}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Bridge Width</dt>
          <dd className="text-gray-900">{specifications.bridgeWidth}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Temple Length</dt>
          <dd className="text-gray-900">{specifications.templeLength}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Weight</dt>
          <dd className="text-gray-900">{specifications.weight}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">UV Protection</dt>
          <dd className="text-gray-900">{specifications.uvProtection}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-600">Polarization</dt>
          <dd className="text-gray-900">{specifications.polarization ? 'Yes' : 'No'}</dd>
        </div>
      </dl>
    </div>
  )
} 