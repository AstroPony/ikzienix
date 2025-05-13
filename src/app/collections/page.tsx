"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data: Product[] = await response.json();
        setProducts(data);
        setCategories(Array.from(new Set(data.map((p) => p.category))));
      } catch (err) {
        setError('Error loading collections');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading collections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h1 className="display-5 mb-4">Error</h1>
        <p className="lead text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="display-4 mb-5 text-center">Collections</h1>
      <div className="row g-4">
        {categories.map((cat) => {
          const product = products.find((p) => p.category === cat);
          return (
            <div key={cat} className="col-12 col-md-6 col-lg-4">
              <Link href={`/collections/${cat}`} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="position-relative" style={{ aspectRatio: '1/1' }}>
                    <Image
                      src={product?.images?.[0]?.url || 'https://source.unsplash.com/600x400/?sunglasses,collection'}
                      alt={cat}
                      fill
                      className="card-img-top object-fit-cover"
                      sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="h5 card-title mb-2 text-capitalize">{cat} Collection</h3>
                    <p className="card-text text-muted">Browse our selection of {cat.toLowerCase()} sunglasses.</p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
} 