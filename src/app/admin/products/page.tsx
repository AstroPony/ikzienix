'use client'

import { useState, useEffect } from 'react'
import { Product, defaultProduct } from '@/types/product'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (editingProduct) {
      setImagePreview(editingProduct.image)
    } else {
      setImagePreview('')
    }
  }, [editingProduct])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete product')
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleToggleFeatured = async (productId: string, current: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !current }),
      })
      if (!response.ok) throw new Error('Failed to update featured status')
      await fetchProducts()
    } catch (error) {
      console.error('Error updating featured status:', error)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const productData: Partial<Product> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      image: formData.get('image') as string,
      category: formData.get('category') as string,
      inStock: formData.get('inStock') === 'true',
      featured: formData.get('featured') === 'on',
      images: formData.get('images')?.toString().split('\n') || [],
      colors: formData.get('colors')?.toString().split(', ') || [],
      specifications: {
        frameMaterial: formData.get('specifications.frameMaterial') as string,
        lensMaterial: formData.get('specifications.lensMaterial') as string,
        lensWidth: formData.get('specifications.lensWidth') as string,
        bridgeWidth: formData.get('specifications.bridgeWidth') as string,
        templeLength: formData.get('specifications.templeLength') as string,
        weight: formData.get('specifications.weight') as string,
        uvProtection: formData.get('specifications.uvProtection') as string,
        polarization: formData.get('specifications.polarization') === 'on',
      },
      features: formData.get('features')?.toString().split('\n') || [],
      careInstructions: formData.get('careInstructions')?.toString().split('\n') || [],
      warranty: formData.get('warranty') as string,
      shipping: {
        freeShipping: formData.get('shipping.freeShipping') === 'on',
        estimatedDelivery: formData.get('shipping.estimatedDelivery') as string,
        returnPolicy: formData.get('shipping.returnPolicy') as string,
      },
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) throw new Error('Failed to save product')
      await fetchProducts()
      setIsModalOpen(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
        ></div>
      )}
      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ background: 'rgba(0,0,0,0.0)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body row g-4">
                  <div className="col-md-5 d-flex flex-column align-items-center justify-content-center">
                    {/* Image Preview */}
                    <img
                      src={imagePreview || 'https://via.placeholder.com/200x200?text=Preview'}
                      alt="Preview"
                      className="img-fluid rounded border mb-2"
                      style={{ maxHeight: 200, objectFit: 'cover' }}
                      onError={e => (e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Preview')}
                    />
                    <small className="text-muted">Image preview</small>
                  </div>
                  <div className="col-md-7">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        defaultValue={editingProduct?.name || ''}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        defaultValue={editingProduct?.description || ''}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        defaultValue={editingProduct?.price || ''}
                        min={0}
                        step={0.01}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="image"
                        defaultValue={editingProduct?.image || ''}
                        required
                        onChange={e => setImagePreview(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Additional Images (one per line)</label>
                      <textarea
                        className="form-control"
                        name="images"
                        rows={3}
                        defaultValue={editingProduct?.images?.join('\n') || ''}
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        name="category"
                        defaultValue={editingProduct?.category || ''}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Colors (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="colors"
                        defaultValue={editingProduct?.colors?.join(', ') || ''}
                        placeholder="Black, Brown, Gold"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Specifications</label>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            name="specifications.frameMaterial"
                            placeholder="Frame Material"
                            defaultValue={editingProduct?.specifications?.frameMaterial || ''}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            name="specifications.lensMaterial"
                            placeholder="Lens Material"
                            defaultValue={editingProduct?.specifications?.lensMaterial || ''}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            name="specifications.lensWidth"
                            placeholder="Lens Width"
                            defaultValue={editingProduct?.specifications?.lensWidth || ''}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            name="specifications.bridgeWidth"
                            placeholder="Bridge Width"
                            defaultValue={editingProduct?.specifications?.bridgeWidth || ''}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            name="specifications.templeLength"
                            placeholder="Temple Length"
                            defaultValue={editingProduct?.specifications?.templeLength || ''}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            name="specifications.weight"
                            placeholder="Weight"
                            defaultValue={editingProduct?.specifications?.weight || ''}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            name="specifications.uvProtection"
                            placeholder="UV Protection"
                            defaultValue={editingProduct?.specifications?.uvProtection || ''}
                          />
                        </div>
                        <div className="col-md-6">
                          <div className="form-check mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="specifications.polarization"
                              id="polarization"
                              defaultChecked={editingProduct?.specifications?.polarization || false}
                            />
                            <label className="form-check-label" htmlFor="polarization">
                              Polarized Lenses
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Features (one per line)</label>
                      <textarea
                        className="form-control"
                        name="features"
                        rows={3}
                        defaultValue={editingProduct?.features?.join('\n') || ''}
                        placeholder="UV400 Protection&#10;Lightweight Frame&#10;Scratch Resistant"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Care Instructions (one per line)</label>
                      <textarea
                        className="form-control"
                        name="careInstructions"
                        rows={3}
                        defaultValue={editingProduct?.careInstructions?.join('\n') || ''}
                        placeholder="Clean with microfiber cloth&#10;Store in case when not in use&#10;Avoid extreme temperatures"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Warranty</label>
                      <input
                        type="text"
                        className="form-control"
                        name="warranty"
                        defaultValue={editingProduct?.warranty || ''}
                        placeholder="1 Year Manufacturer Warranty"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Shipping Information</label>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <div className="form-check mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="shipping.freeShipping"
                              id="freeShipping"
                              defaultChecked={editingProduct?.shipping?.freeShipping || false}
                            />
                            <label className="form-check-label" htmlFor="freeShipping">
                              Free Shipping
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            name="shipping.estimatedDelivery"
                            placeholder="Estimated Delivery"
                            defaultValue={editingProduct?.shipping?.estimatedDelivery || ''}
                          />
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            className="form-control"
                            name="shipping.returnPolicy"
                            placeholder="Return Policy"
                            defaultValue={editingProduct?.shipping?.returnPolicy || ''}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="inStock"
                        id="inStock"
                        defaultChecked={editingProduct?.inStock ?? true}
                        value="true"
                      />
                      <label className="form-check-label" htmlFor="inStock">
                        In Stock
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="featured"
                        id="featured"
                        defaultChecked={editingProduct?.featured ?? false}
                      />
                      <label className="form-check-label" htmlFor="featured">
                        Featured
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="h2 mb-2">Products</h1>
                  <p className="text-muted">Manage your product catalog</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null)
                    setIsModalOpen(true)
                  }}
                  className="btn btn-primary"
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Add Product
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted">No products found.</td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div className="fw-medium">{product.name}</div>
                            <small className="text-muted">{product.description}</small>
                          </td>
                          <td>{product.category}</td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>
                            <span className={`badge bg-${product.inStock ? 'success' : 'danger'}`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${product.featured ? 'primary' : 'secondary'}`}>{product.featured ? 'Yes' : 'No'}</span>
                            <button
                              type="button"
                              className={`btn btn-sm ms-2 ${product.featured ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                              onClick={() => handleToggleFeatured(product.id, product.featured)}
                            >
                              {product.featured ? 'Unfeature' : 'Feature'}
                            </button>
                          </td>
                          <td>
                            <div className="btn-group">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => {
                                  setEditingProduct(product)
                                  setIsModalOpen(true)
                                }}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(product.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 