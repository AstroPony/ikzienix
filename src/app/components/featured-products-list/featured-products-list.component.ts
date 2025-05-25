import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { ProductCardComponent } from '../shared/product-card/product-card.component';

@Component({
  selector: 'app-featured-products-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './featured-products-list.component.html',
  styleUrl: './featured-products-list.component.scss'
})
export class FeaturedProductsListComponent {
  products: Product[];
  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts().slice(0, 3);
  }
}
