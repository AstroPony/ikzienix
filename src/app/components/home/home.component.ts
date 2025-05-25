import { Component } from '@angular/core';
import { FeaturedProductsListComponent } from '../featured-products-list/featured-products-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FeaturedProductsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
