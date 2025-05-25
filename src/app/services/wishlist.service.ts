import { Injectable } from '@angular/core';
import { Product } from './product.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private key = 'wishlist';

  getWishlist(): Product[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  addToWishlist(product: Product) {
    if (typeof window === 'undefined') return;
    const wishlist = this.getWishlist();
    if (!wishlist.find((p: Product) => p.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem(this.key, JSON.stringify(wishlist));
    }
  }

  removeFromWishlist(productId: string) {
    if (typeof window === 'undefined') return;
    let wishlist = this.getWishlist();
    wishlist = wishlist.filter((p: Product) => p.id !== productId);
    localStorage.setItem(this.key, JSON.stringify(wishlist));
  }

  isWishlisted(productId: string): boolean {
    if (typeof window === 'undefined') return false;
    return this.getWishlist().some((p: Product) => p.id === productId);
  }

  clearWishlist() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.key);
  }
} 