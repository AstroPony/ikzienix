🔮 Vision for the ikzienix Website

The ikzienix website serves as the digital flagship for the brand, blending cheeky urban attitude with minimalist, high-impact design. Its core goal is to deliver a fast, effortless, and memorable shopping experience for Dutch youth who resonate with streetwise, meme-powered fashion culture.

Key aspects of the website vision:

    Clean & Minimal Interface
    A sleek, dark-themed layout with green accents, generous whitespace, and bold sans-serif typography. Prioritizes clarity and aesthetics with intuitive navigation.

    Mobile-First Design
    Optimized for fast browsing and easy checkout on mobile. The design should feel like a natural extension of social media culture—swipeable, tappable, and scrollable.

    High-Impact Product Pages
    Each sunglasses style is presented with punchy visuals, clear names, playful descriptions, and instant availability. Visitors should be able to add to cart within 2 clicks.

    Community-Driven Content Blocks
    Sections dedicated to showcasing memes, customer IG tags, or UGC, embedded natively to reinforce the brand’s vibe and social proof.

    Drop & Hype Mechanism
    Features countdown timers or product highlight sections to emphasize limited drops, sell-outs, or collabs. Think "hype streetwear drop" energy.

    Lightweight Storefront Functionality
    Integrated with Stripe and minimal plugins to ensure speed. A simple backend process for managing inventory, orders, and future product drops.

    SEO & Meme Marketing Hooks
    Includes playful meta descriptions, alt text, and internal linking to support the brand's shareability and discovery via memes or Google.

    Easter Eggs & Microinteractions
    Subtle, delightful touches (like hover effects, cheeky tooltips, or small text jokes) that enhance brand personality without bloating the UI.


## 🎯 Core Website Goals

- Deliver a **frictionless user flow** from discovery to purchase.
- Match the **tone and swagger** of meme culture while keeping the UX fast and modern.
- Keep the codebase clean, TDD-ready, and easy to extend without bloat.

---

## 🎨 Design Principles

- **Bootstrap-Only** Responsive UI
  - Uses Bootstrap 5 utility classes and components for fast UI prototyping and consistency.
  - Clean dark/light layout toggle optional, green accents default.

- **Mobile-First** Experience
  - Primary breakpoint design is mobile.
  - Actions like “Add to Cart” are reachable in 1-2 taps.

- **Minimalist UX**
  - No unnecessary animations.
  - Emphasis on fast load times and visual clarity.

---

## 🛍️ Product Experience

- **Fast Product Overview**
  - Every product visible on homepage or category grid.
  - Clean thumbnails, funny short names, price, and "Buy" CTA.

- **Limited Drops**
  - Use feature flags to toggle drop-specific product availability and content.
  - Add optional hype features like countdowns and “X left” tags.

- **Checkout Simplicity**
  - Stripe integration.
  - Autofill-ready forms.
  - Guest checkout is default.

---

## 👩‍💻 Admin Experience

- Custom Admin Panel with Bootstrap layout.
- Feature Flags dashboard (enable/disable modules like promo codes, blog, community memes).
- Product CRUD (image, price, title, active toggle).
- Order overview (status, user info, Stripe link).
- User management (ban/delete, see purchases).

---

## 🧪 Dev/Infra Principles

- **Test-Driven Development**
  - Every new feature must be scaffolded with tests (unit + integration).
  - CI/CD optional for now, but tests are mandatory.

- **Feature-Flag Driven Dev**
  - All non-core modules must be behind flags, toggled in Admin UI.

- **MySQL via Prisma**
  - MAMP for local, Plesk-hosted DB for prod.
  - `.env.local` vs `.env.production` split.

---

## 📦 Launch Scope (MVP)

- User Auth
- Product Listing
- Cart + Checkout
- Admin Panel with:
  - Product Management
  - Feature Flags
- Stripe Payments
- TDD Scaffold (tests for every feature)

---

> File name: `Product-Vision.md`
