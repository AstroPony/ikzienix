import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="container py-5 min-vh-100 bg-midnight-black text-cyber-yellow">
      <h2 class="font-orbitron text-cyber-yellow mb-4">Wishlist</h2>
      <div *ngIf="wishlist.length; else empty">
        <div class="row g-4">
          <div class="col-12 col-md-6 col-lg-4" *ngFor="let product of wishlist">
            <app-product-card [product]="product"></app-product-card>
            <div class="d-flex gap-2 mt-2">
              <button class="btn btn-sm btn-success" (click)="moveToCart(product)"><i class="bi bi-cart-plus me-1"></i>Move to Cart</button>
              <button class="btn btn-sm btn-danger" (click)="remove(product)"><i class="bi bi-x-lg me-1"></i>Remove</button>
            </div>
          </div>
        </div>
      </div>
      <ng-template #empty>
        <div class="alert alert-info glassy-card">Your wishlist is empty.</div>
      </ng-template>
    </div>
  `
})
export class WishlistComponent {
  wishlist: Product[] = [];
  constructor(private wishlistService: WishlistService, private cartService: CartService) {
    this.refresh();
  }
  refresh() {
    this.wishlist = this.wishlistService.getWishlist();
  }
  moveToCart(product: Product) {
    this.cartService.addToCart(product);
    this.wishlistService.removeFromWishlist(product.id);
    this.refresh();
  }
  remove(product: Product) {
    this.wishlistService.removeFromWishlist(product.id);
    this.refresh();
  }
} 