import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

type SortField = 'name' | 'price' | 'stock' | 'category';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-product-crud',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-crud.component.html',
  styleUrls: ['./product-crud.component.scss']
})
export class ProductCrudComponent implements OnInit {
  categories = ['Sunglasses', 'Eyeglasses', 'Accessories'];
  
  products: Product[] = [
    { 
      id: 1, 
      name: 'Dank Shades', 
      description: 'Stylish sunglasses with UV protection',
      price: 29.99, 
      image: 'https://via.placeholder.com/200x200?text=Dank+Shades',
      category: 'Sunglasses',
      stock: 50
    },
    { 
      id: 2, 
      name: 'Meme Goggles', 
      description: 'Fun and quirky eyewear for the modern age',
      price: 24.99, 
      image: 'https://via.placeholder.com/200x200?text=Meme+Goggles',
      category: 'Sunglasses',
      stock: 30
    },
    { 
      id: 3, 
      name: 'Dutch Flex', 
      description: 'Premium reading glasses with flexible frames',
      price: 34.99, 
      image: 'https://via.placeholder.com/200x200?text=Dutch+Flex',
      category: 'Eyeglasses',
      stock: 25
    }
  ];

  // Sorting and filtering state
  sortField: SortField = 'name';
  sortDirection: SortDirection = 'asc';
  searchTerm: string = '';
  selectedCategory: string = '';
  imagePreview: string | null = null;

  editIndex: number | null = null;
  newProduct: Product = { 
    id: 0, 
    name: '', 
    description: '',
    price: 0, 
    image: '', 
    category: this.categories[0],
    stock: 0
  };

  // Form validation state
  formErrors = {
    name: '',
    price: '',
    stock: '',
    image: '',
    description: ''
  };

  // Modal state
  showDeleteModal = false;
  deleteIndex: number | null = null;
  deleteProductName: string = '';

  // Pagination state
  page = 1;
  pageSize = 5;

  // Toast notification state
  toasts: { message: string; type: 'success' | 'error'; }[] = [];

  isDarkTheme = true;

  get filteredProducts(): Product[] {
    return this.products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const aValue = a[this.sortField];
        const bValue = b[this.sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return this.sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return this.sortDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });
  }

  get paginatedProducts(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
  }

  setPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
    }
  }

  // Reset to first page on filter/search/sort changes
  ngDoCheck() {
    if (this.page > this.totalPages) {
      this.page = 1;
    }
  }

  sort(field: SortField) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  validateForm(): boolean {
    let isValid = true;
    this.formErrors = {
      name: '',
      price: '',
      stock: '',
      image: '',
      description: ''
    };

    if (!this.newProduct.name.trim()) {
      this.formErrors.name = 'Name is required';
      isValid = false;
    }

    if (this.newProduct.price <= 0) {
      this.formErrors.price = 'Price must be greater than 0';
      isValid = false;
    }

    if (this.newProduct.stock < 0) {
      this.formErrors.stock = 'Stock cannot be negative';
      isValid = false;
    }

    if (!this.newProduct.image.trim()) {
      this.formErrors.image = 'Image URL is required';
      isValid = false;
    }

    if (!this.newProduct.description.trim()) {
      this.formErrors.description = 'Description is required';
      isValid = false;
    }

    return isValid;
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toasts.push({ message, type });
    setTimeout(() => this.toasts.shift(), 3000);
  }

  addProduct() {
    if (!this.validateForm()) {
      this.showToast('Please fix the form errors before adding.', 'error');
      return;
    }
    const nextId = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    this.products.push({ ...this.newProduct, id: nextId });
    this.resetForm();
    this.showToast('Product added successfully!', 'success');
  }

  startEdit(index: number) {
    this.editIndex = index;
    this.newProduct = { ...this.products[index] };
    this.imagePreview = this.newProduct.image;
  }

  saveEdit() {
    if (!this.validateForm()) {
      this.showToast('Please fix the form errors before saving.', 'error');
      return;
    }
    if (this.editIndex !== null) {
      this.products[this.editIndex] = { ...this.newProduct };
      this.resetForm();
      this.showToast('Product updated successfully!', 'success');
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.editIndex = null;
    this.newProduct = { 
      id: 0, 
      name: '', 
      description: '',
      price: 0, 
      image: '', 
      category: this.categories[0],
      stock: 0
    };
    this.imagePreview = null;
    this.formErrors = {
      name: '',
      price: '',
      stock: '',
      image: '',
      description: ''
    };
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
    if (this.editIndex === index) {
      this.resetForm();
    }
  }

  updateImagePreview() {
    this.imagePreview = this.newProduct.image;
  }

  confirmDelete(index: number) {
    this.deleteIndex = index;
    this.deleteProductName = this.products[index].name;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.deleteIndex = null;
    this.deleteProductName = '';
  }

  proceedDelete() {
    if (this.deleteIndex !== null) {
      this.products.splice(this.deleteIndex, 1);
      if (this.editIndex === this.deleteIndex) {
        this.resetForm();
      }
      this.showToast('Product deleted.', 'success');
    }
    this.cancelDelete();
  }

  private setTheme(isDark: boolean) {
    // Theme switching removed
  }

  ngOnInit() {
    // Initialize any other necessary logic
  }
}
