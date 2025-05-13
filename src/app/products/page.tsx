"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import ProductCard from '@/components/product/ProductCard'

const PAGE_SIZE = 20;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [displayed, setDisplayed] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        setError("Error loading products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (showFeatured) result = result.filter((p) => p.featured);
    if (showInStock) result = result.filter((p) => p.inStock);
    if (category) result = result.filter((p) => p.category === category);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    if (minPrice) result = result.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= parseFloat(maxPrice));
    // Sorting
    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'name-asc') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'name-desc') result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    if (sort === 'newest') result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setFiltered(result);
    setPage(1);
    setDisplayed(result.slice(0, PAGE_SIZE));
  }, [showFeatured, showInStock, category, search, minPrice, maxPrice, sort, products]);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && displayed.length < filtered.length) {
      setPage((prev) => prev + 1);
    }
  }, [displayed.length, filtered.length]);

  useEffect(() => {
    if (!loader.current) return;
    const option = { root: null, rootMargin: "20px", threshold: 0 };
    const observer = new window.IntersectionObserver(handleObserver, option);
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    setDisplayed(filtered.slice(0, page * PAGE_SIZE));
  }, [page, filtered]);

  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));

  const clearFilters = () => {
    setShowFeatured(false);
    setShowInStock(false);
    setCategory('');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading products...</p>
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
      <h1 className="display-4 mb-4 text-center">All Products</h1>
      <div className="mb-4 d-flex flex-wrap gap-3 justify-content-center align-items-end">
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="featured"
            checked={showFeatured}
            onChange={() => setShowFeatured((v) => !v)}
          />
          <label className="form-check-label" htmlFor="featured">
            Featured
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="inStock"
            checked={showInStock}
            onChange={() => setShowInStock((v) => !v)}
          />
          <label className="form-check-label" htmlFor="inStock">
            In Stock
          </label>
        </div>
        <div>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <input
          type="number"
          className="form-control w-auto"
          placeholder="Min Price"
          value={minPrice}
          min={0}
          onChange={e => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          className="form-control w-auto"
          placeholder="Max Price"
          value={maxPrice}
          min={0}
          onChange={e => setMaxPrice(e.target.value)}
        />
        <select
          className="form-select w-auto"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
          <option value="name-desc">Name: Z-A</option>
        </select>
        <button className="btn btn-outline-secondary" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
      <div className="mb-3 text-end text-muted">
        Showing {displayed.length} of {filtered.length} products
      </div>
      <div className="row g-4">
        {displayed.map((product) => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4">
            <ProductCard product={product} />
          </div>
        ))}
        {displayed.length === 0 && (
          <div className="col-12 text-center text-muted">No products found.</div>
        )}
      </div>
      <div ref={loader} />
      {displayed.length < filtered.length && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading more...</span>
          </div>
        </div>
      )}
      <style jsx>{`
        .product-card-hover:hover {
          box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.15) !important;
          transform: translateY(-4px) scale(1.01);
          transition: box-shadow 0.2s, transform 0.2s;
        }
      `}</style>
    </div>
  );
} 