import SizeGuide from '@/components/product/SizeGuide'

export default function SizeGuidePage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <h1 className="h2 mb-4">Sunglasses Size Guide</h1>
          <p className="lead mb-4">
            Finding the perfect fit for your sunglasses is essential for both comfort and style.
            Use our comprehensive size guide to help you choose the right pair.
          </p>
          <SizeGuide />
          
          <div className="mt-5">
            <h2 className="h3 mb-4">Additional Tips</h2>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5 mb-3">Measuring Your Face</h3>
                    <ol className="mb-0">
                      <li className="mb-2">Measure the width of your face at the temples</li>
                      <li className="mb-2">Measure the distance between your eyes</li>
                      <li className="mb-2">Measure the length of your face from hairline to chin</li>
                      <li>Compare these measurements with the frame specifications</li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5 mb-3">Common Fit Issues</h3>
                    <ul className="mb-0">
                      <li className="mb-2">Frames too tight on temples</li>
                      <li className="mb-2">Nose pads leaving marks</li>
                      <li className="mb-2">Frames sliding down nose</li>
                      <li>Frames too wide for face</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 