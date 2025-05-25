import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid px-0 bg-midnight-black min-vh-100 bg-gradient-purple">
      <div class="container py-5">
        <div class="row justify-content-center" *ngIf="product as p; else notFound">
          <div class="col-md-7 col-lg-6">
            <div class="card shadow-sm p-4 mb-4 glassy-card position-relative">
              <!-- Corner badges -->
              <div class="position-absolute top-0 start-0 m-2 z-2 d-flex flex-column align-items-start gap-1">
                <span *ngIf="p.isNew" class="badge badge-electric-purple font-space-grotesk px-2 py-1 shadow-electric-purple">NEW</span>
                <span *ngIf="p.isLimited" class="badge badge-neon-green font-space-grotesk px-2 py-1 shadow-neon-green">LIMITED</span>
              </div>
              <img [src]="p.imageUrl" [alt]="p.title" class="card-img-top mb-4 img-cover h-320 rounded-4 shadow-electric-purple">
              <div class="card-body p-0">
                <h2 class="card-title mb-3 font-orbitron text-cyber-yellow">{{ p.title }}</h2>
                <div class="mb-3">
                  <span class="text-electric-purple font-space-grotesk me-2">{{ p.category }}</span>
                  <i class="bi bi-lightning-charge-fill text-neon-green"></i>
                </div>
                <p class="card-text mb-3">{{ p.description }}</p>
                <p class="card-text fw-bold mb-3 fs-4 text-cyber-yellow">&euro;{{ p.price.toFixed(2) }}</p>
                <p class="card-text mb-3">
                  <span class="badge bg-success" *ngIf="p.stock > 0">In Stock: {{ p.stock }}</span>
                  <span class="badge bg-danger" *ngIf="p.stock === 0">Out of Stock</span>
                </p>
                <button class="btn cta-future w-100 mb-3" [disabled]="p.stock === 0" (click)="addToCart()">Add to Cart</button>
                <button class="btn btn-link w-100 text-cyber-yellow" (click)="goBack()">Back to Products</button>
              </div>
            </div>
          </div>
        </div>
        <div class="toast-container position-fixed bottom-0 end-0 p-3 z-1100">
          <div *ngIf="showToast" class="toast show align-items-center text-bg-success border-0 mb-2 fade-in" role="alert">
            <div class="d-flex">
              <div class="toast-body">
                Added to cart!
              </div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close" (click)="showToast = false"></button>
            </div>
          </div>
        </div>
        <ng-template #notFound>
          <div class="container py-4">
            <div class="alert alert-danger mb-3">Product not found.</div>
            <button class="btn btn-link" (click)="goBack()">Back to Products</button>
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class ProductDetailsComponent {
  product: Product | undefined;
  showToast = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getProductById(id);
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.showToast = true;
      setTimeout(() => (this.showToast = false), 2000);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
} 