import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-electric-purple z-1100">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2 font-orbitron text-cyber-yellow" routerLink="/">
          <img src="assets/logo-yellow.svg" alt="Ikzienix Logo" class="h-60 img-contain">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center gap-2">
            <li class="nav-item">
              <a class="nav-link font-space-grotesk text-cyber-yellow" routerLink="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link position-relative font-space-grotesk text-cyber-yellow" routerLink="/cart">
                <i class="bi bi-cart3"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-cyber-yellow text-dark fs-075">{{ cartCount() }}</span>
                Cart
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link font-space-grotesk text-electric-purple" routerLink="/admin">Admin</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="bg-midnight-black min-vh-100 bg-gradient-purple">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-dark text-cyber-yellow py-4 mt-auto border-top border-electric-purple">
      <div class="container text-center">
        <img src="assets/logo-yellow.svg" alt="Ikzienix Logo" height="24" class="mb-1 max-w-80 img-contain">
        <p class="mb-0 small font-space-grotesk">&copy; 2024 Ikzienix. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main {
      flex: 1;
    }
    .navbar-brand img {
      filter: drop-shadow(0 1px 2px #0002);
    }
    .max-w-80 { max-width: 80px; }
    .img-contain { object-fit: contain; }
  `]
})
export class AppComponent {
  private cartService = inject(CartService);
  cartCount = () => this.cartService.getCount();
  title = 'ikzienix';
}
