import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  providers: [ProductService],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: string[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.products = this.productService.getProducts();
    this.updatePagination();
  }

  loadCategories() {
    this.categories = [...new Set(this.products.map(product => product.category).filter((category): category is string => category !== undefined))];
  }

  onSearch() {
    this.currentPage = 1;
    this.updatePagination();
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  updatePagination() {
    let filteredProducts = this.products;

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        (product.title?.toLowerCase().includes(searchLower) || false) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === this.selectedCategory
      );
    }

    this.totalPages = Math.ceil(filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedProducts = filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }
}
