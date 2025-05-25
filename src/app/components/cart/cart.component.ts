import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid px-0 bg-midnight-black min-vh-100 bg-gradient-purple">
      <div class="container py-5">
        <h2 class="mb-4 font-orbitron text-cyber-yellow">Shopping Cart</h2>
        <div *ngIf="items.length; else emptyCart">
          <div class="card glassy-card p-4 mb-4">
            <table class="table align-middle mb-4 text-white">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of items">
                  <td class="py-3">
                    <img [src]="item.product.imageUrl" [alt]="item.product.title" width="40" class="me-2 rounded shadow-electric-purple img-thumbnail-glow">
                    <span class="fw-bold text-cyber-yellow">{{ item.product.title }}</span>
                  </td>
                  <td class="py-3 text-cyber-yellow">&euro;{{ item.product.price.toFixed(2) }}</td>
                  <td class="py-3">
                    <input type="number" min="1" class="form-control form-control-sm w-auto d-inline bg-midnight-black text-cyber-yellow border-electric-purple" [(ngModel)]="item.quantity" (change)="updateQuantity(item)">
                  </td>
                  <td class="py-3 text-cyber-yellow">&euro;{{ (item.product.price * item.quantity).toFixed(2) }}</td>
                  <td class="py-3">
                    <button class="btn btn-sm btn-danger" (click)="remove(item.product.id)"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4">
              <a routerLink="/" class="btn btn-link mb-2 mb-md-0 text-cyber-yellow">Continue Shopping</a>
              <div>
                <span class="fw-bold me-3 fs-5 text-cyber-yellow">Total: &euro;{{ total.toFixed(2) }}</span>
                <button class="btn cta-future" [disabled]="!items.length">Checkout</button>
              </div>
            </div>
          </div>
        </div>
        <ng-template #emptyCart>
          <div class="alert alert-info mb-3 glassy-card p-4">Your cart is empty.</div>
          <a routerLink="/" class="btn cta-future">Shop Now</a>
        </ng-template>
      </div>
    </div>
  `
})
export class CartComponent {
  items: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService) {
    this.refresh();
  }

  refresh() {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  updateQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity);
    this.refresh();
  }

  remove(productId: string) {
    this.cartService.removeFromCart(productId);
    this.refresh();
  }
} 