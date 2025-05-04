'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  featured: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

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
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      image: formData.get('image'),
      category: formData.get('category'),
      inStock: formData.get('inStock') === 'true',
      featured: formData.get('featured') === 'on',
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
                      src={
                        (typeof window !== 'undefined' && document.getElementById('image-input')?.value) ||
                        editingProduct?.image ||
                        'https://via.placeholder.com/200x200?text=Preview'
                      }
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
                        id="image-input"
                        defaultValue={editingProduct?.image || ''}
                        required
                        onInput={e => {
                          const img = document.querySelector('.modal-body img');
                          if (img) img.setAttribute('src', (e.target as HTMLInputElement).value || 'https://via.placeholder.com/200x200?text=Preview');
                        }}
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-2">Products</h1>
          <p className="text-muted">Manage your product catalog</p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingProduct(null)
              setIsModalOpen(true)
            }}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Add Product
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="img-thumbnail"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 