import { Injectable } from '@angular/core';

export interface Product {
  id: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  category?: string;
  isLimited: boolean;
  isNew: boolean;
  slug?: string;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      title: 'Dank Shades',
      description: 'Stylish sunglasses with UV protection',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      stock: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Sunglasses',
      isLimited: false,
      isNew: true,
      slug: 'dank-shades',
    },
    {
      id: '2',
      title: 'Meme Goggles',
      description: 'Fun and quirky eyewear for the modern age',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
      stock: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Sunglasses',
      isLimited: false,
      isNew: false,
      slug: 'meme-goggles',
    },
    {
      id: '3',
      title: 'Dutch Flex',
      description: 'Premium reading glasses with flexible frames',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
      stock: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Eyeglasses',
      isLimited: true,
      isNew: false,
      slug: 'dutch-flex',
    }
  ];

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }
} 