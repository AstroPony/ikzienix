"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { collectionImages, collectionDescriptions } from '@/lib/collections';
import ProductCard from '@/components/product/ProductCard'

export default function CollectionPage() {
  const params = useParams();
  const category = typeof params.category === 'string' ? params.category : '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('name-asc');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Filter by category
        if (product.category.toLowerCase() !== category.toLowerCase()) {
          return false;
        }

        // Filter by featured
        if (showFeatured && !product.featured) {
          return false;
        }

        // Filter by stock
        if (showInStock && !product.inStock) {
          return false;
        }

        // Filter by search
        if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }

        // Filter by price range
        if (minPrice && product.price < parseFloat(minPrice)) {
          return false;
        }
        if (maxPrice && product.price > parseFloat(maxPrice)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sort) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          default:
            return 0;
        }
      });
  }, [showFeatured, showInStock, search, minPrice, maxPrice, sort, products, category]);

  const categoryName = products[0]?.category || category;
  const heroImage = collectionImages[category] || collectionImages['extra'];
  const heroDesc = collectionDescriptions[category] || 'Browse our special collection.';

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="position-relative" style={{ height: '400px' }}>
        <Image
          src={heroImage}
          alt={categoryName}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className="display-4 fw-bold">{categoryName}</h1>
          <p className="lead">{heroDesc}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
          <div className="col-md-3">
            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                id="featured"
                checked={showFeatured}
                onChange={(e) => setShowFeatured(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="featured">
                Featured
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                id="inStock"
                checked={showInStock}
                onChange={(e) => setShowInStock(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="inStock">
                In Stock
              </label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-5">
            <h3>No products found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
} 