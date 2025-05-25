# ✅ Feature Implementation Checklist

All features must be:
- Written using **Test-Driven Development (TDD)**
- **Bootstrap 5** only (no Tailwind)
- Controlled via **feature flags** (toggled from Admin Panel)
- Compatible with **MySQL via Prisma** (local: MAMP / prod: Plesk)

---

## 🔐 Core App Features (MVP)

- [ ] User Registration
- [ ] User Login / Logout
- [ ] Password Reset (email or token)
- [ ] Admin Panel
  - [ ] Feature Flags Management
  - [ ] User Management
  - [ ] Product Management (CRUD)
- [ ] Product Catalog
  - [ ] Product detail page
  - [ ] Image upload (admin only)
- [ ] Cart & Checkout Flow
  - [ ] Add to Cart
  - [ ] Cart UI
  - [ ] Checkout (form + summary)
- [ ] Order Summary (user view)
- [ ] Stripe Integration (one-time checkout)

---

## 🧪 Test Driven Development

- [ ] `jest` + TypeScript setup
- [ ] React Testing Library for components
- [ ] Supertest for API routes
- [ ] Database mocking with test seeds
- [ ] GitHub Actions CI with test step

---

## 🧱 Optional Features (Behind Feature Flags)

- [ ] Discount Codes (Promo logic)
- [ ] Product Reviews & Ratings
- [ ] Wishlist / Save for Later
- [ ] Drop Countdown
- [ ] Community Gallery (Meme uploads)
- [ ] Blog or Announcements Page
- [ ] Dark Mode

---

## ⚙️ Infrastructure & Deployment

- [ ] `.env.local` for local (MAMP)
- [ ] `.env.production` for Plesk
- [ ] Prisma schema (MySQL)
- [ ] GitHub Actions (optional deploy)
- [ ] Build script for `/dist` folder export
- [ ] Static assets optimization

---

## 📱 Responsiveness & UX

- [ ] Mobile-first layout using Bootstrap Grid
- [ ] Product card responsiveness
- [ ] Accessible forms
- [ ] Animation-free (for now)

---

## 🗂 Essential Pages

- [ ] Home Page
- [ ] About / Brand Story
- [ ] Contact Form (email config)
- [ ] FAQ Page
- [ ] Terms & Privacy Pages

---

## 🚦 Suggested Order of Build

1. Database + Prisma setup
2. Auth system with TDD
3. Admin Panel
4. Product catalog (with admin CRUD)
5. Cart + Checkout
6. Stripe integration
7. User dashboard (orders)
8. Optional toggled features