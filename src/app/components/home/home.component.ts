import { Component } from '@angular/core';
import { FeaturedProductsListComponent } from '../featured-products-list/featured-products-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FeaturedProductsListComponent, RouterModule, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  newsletterEmail = '';
  newsletterSuccess = false;

  subscribe() {
    this.newsletterSuccess = true;
    this.newsletterEmail = '';
    setTimeout(() => (this.newsletterSuccess = false), 2500);
  }
}
