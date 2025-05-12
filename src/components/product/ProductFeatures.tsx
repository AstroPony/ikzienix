interface ProductFeaturesProps {
  features: string[]
}

export default function ProductFeatures({ features }: ProductFeaturesProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Features</h2>
      <ul className="list-disc list-inside space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-700">{feature}</li>
        ))}
      </ul>
    </div>
  )
} 