import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card glassy-card position-relative d-flex flex-column">
      <!-- Badges -->
      <div class="badge-stack">
        <span *ngIf="product.isNew" class="badge badge-electric-purple animate-glow">NEW</span>
        <span *ngIf="product.isLimited" class="badge badge-neon-green animate-glow">LIMITED</span>
      </div>

      <!-- Wishlist Button -->
      <button class="wishlist-btn" title="Add to Wishlist">
        <i class="bi bi-heart"></i>
      </button>

      <!-- Product Image -->
      <a [routerLink]="['/products', product.id]" class="image-link">
        <img [src]="product.imageUrl" [alt]="product.title" class="product-image" />
      </a>

      <!-- Info -->
      <div class="card-body d-flex flex-column flex-grow-1 p-3">
        <a [routerLink]="['/products', product.id]" class="text-decoration-none">
          <h3 class="card-title font-orbitron text-cyber-yellow mb-2 text-truncate">{{ product.title }}</h3>
        </a>
        <div class="mb-2 d-flex align-items-center gap-2">
          <span class="category-tag text-electric-purple font-space-grotesk">
            <i class="bi bi-lightning-charge-fill text-neon-green"></i> {{ product.category }}
          </span>
        </div>
        <p class="card-text text-muted mb-3 flex-grow-1 description">{{ product.description }}</p>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <span class="fs-4 text-cyber-yellow price">&euro;{{ product.price.toFixed(2) }}</span>
          <button class="btn cta-future pulse" [disabled]="product.stock === 0">
            <i class="bi bi-cart-plus me-2"></i>Add
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: rgba(20, 20, 30, 0.92);
      border: 1.5px solid rgba(159, 0, 255, 0.25);
      border-radius: 1.5rem;
      box-shadow: 0 0 32px 0 rgba(159, 0, 255, 0.12), 0 2px 12px 0 rgba(0, 255, 136, 0.10);
      overflow: hidden;
      transition: box-shadow 0.3s, transform 0.3s;
      min-height: 520px;
      max-width: 370px;
      margin: auto;
      position: relative;
    }
    .product-card:hover {
      box-shadow: 0 0 48px 8px #9F00FF55, 0 2px 16px 0 #00FF8855;
      transform: translateY(-6px) scale(1.03);
    }
    .badge-stack {
      position: absolute;
      top: 1rem; left: 1rem;
      display: flex; flex-direction: column; gap: 0.5rem;
      z-index: 2;
    }
    .animate-glow {
      animation: badgeGlow 1.8s infinite alternate;
    }
    @keyframes badgeGlow {
      0% { box-shadow: 0 0 8px 2px var(--electric-purple); }
      100% { box-shadow: 0 0 24px 6px var(--electric-purple), 0 0 16px 4px var(--neon-green); }
    }
    .wishlist-btn {
      position: absolute; top: 1rem; right: 1rem; z-index: 2;
      background: rgba(20,20,30,0.7); border: none; border-radius: 50%;
      color: var(--electric-purple); font-size: 1.3rem; padding: 0.5rem;
      transition: background 0.2s;
    }
    .wishlist-btn:hover { background: var(--electric-purple); color: #fff; }
    .image-link {
      display: block; width: 100%; height: 260px; overflow: hidden; border-radius: 1.2rem 1.2rem 0 0;
      box-shadow: 0 4px 24px 0 rgba(159, 0, 255, 0.10);
      margin-bottom: 0.5rem;
    }
    .product-image {
      width: 100%; height: 100%; object-fit: cover; display: block;
      transition: transform 0.3s;
    }
    .image-link:hover .product-image { transform: scale(1.04); }
    .category-tag {
      font-size: 0.95rem; font-weight: 600; letter-spacing: 0.02em;
      display: flex; align-items: center; gap: 0.3em;
    }
    .price {
      font-family: 'Orbitron', monospace; font-size: 1.3rem; font-weight: 700;
    }
    .cta-future {
      background: linear-gradient(135deg, #9F00FF 0%, #FFD400 100%);
      color: #0A0A0A; border: none; border-radius: 2rem;
      font-weight: 700; padding: 0.5rem 1.5rem; font-size: 1.1rem;
      box-shadow: 0 0 12px #FFD40055;
      transition: box-shadow 0.2s, background 0.2s;
    }
    .cta-future:disabled { background: #666; color: #222; }
    .pulse { animation: pulse 1s infinite alternate; }
    @keyframes pulse {
      0% { box-shadow: 0 0 12px #FFD40055; }
      100% { box-shadow: 0 0 32px #FFD40099; }
    }
    .description {
      font-size: 0.97rem; color: #ccc;
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
      overflow: hidden; text-overflow: ellipsis;
    }
    @media (max-width: 768px) {
      .product-card {
        min-height: 420px;
        max-width: 100%;
      }
      .image-link { height: 180px; }
      .card-title { font-size: 1.1rem; }
      .description { font-size: 0.85rem; -webkit-line-clamp: 2; }
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
} 