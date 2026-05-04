'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (product.stock === 0) {
    return (
      <button className="btn btn-outline-secondary w-100" disabled>
        Sold out
      </button>
    );
  }

  return (
    <button
      className="btn btn-accent w-100 fw-bold"
      onClick={handleAdd}
      disabled={added}
    >
      {added ? '✓ Added' : 'Add to cart'}
    </button>
  );
}
