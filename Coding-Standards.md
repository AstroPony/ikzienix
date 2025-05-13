🧑‍💻 ikzienix Coding Standards (Bootstrap + Next.js Stack)
⚙️ General Principles

    Build clean, fast, and modern UI using Bootstrap 5 utility classes.

    Avoid unnecessary abstraction—lean functional components win.

    Aim for snappy mobile UX with full accessibility support.

    Code should feel like the brand: urban, bold, no BS.

📦 Stack Breakdown

    Framework: Next.js 14

    Styling: Bootstrap 5 + Bootstrap Icons

    Auth: NextAuth.js

    Forms: react-hook-form + Zod validation

    Database: Firebase + Firebase Admin SDK

    Payments: Stripe.js + Stripe CLI

    Charts: Chart.js via react-chartjs-2

    Testing: Jest + Testing Library

    Tooling: ESLint, Husky, TypeScript

📁 Folder Structure Suggestions

/app or /pages          → Next.js routing
/components
  /layout               → Navbar, Footer
  /ui                   → Buttons, Modals, Loaders
  /product              → ProductCard, ProductDetail
/lib
  /firebase             → Init, admin, utils
  /stripe               → API helpers
  /validation           → Zod schemas
  /hooks                → useCart, useUser, etc.
/styles                 → Custom Bootstrap overrides
/scripts                → Firebase seeding, utilities
/public/assets          → Logo, favicons, product media

🎨 Styling Conventions

    Use Bootstrap utility classes (d-flex, gap-3, text-light, etc.)

    Define brand colors via Bootstrap SCSS or CSS overrides:

    :root {
      --bs-primary: #00ff88;
      --bs-dark: #0d0d0d;
    }

    Use bootstrap-icons for icons — consistent and easy to embed.

    Avoid inline styles unless necessary for animations or hacks.

🧠 Code Style & Standards

    Use TypeScript for all code.

    Validate all user input with Zod.

    Enforce form validation via react-hook-form + resolvers.

    Use const for immutability, avoid any.

    Extract reusable logic into custom hooks (/hooks).

    Avoid unnecessary re-renders; use memoization if performance suffers.

    Organize longer files by sections with comments:

    // ─── Imports ─────────────────────────────────────────────────────

    // ─── Component ───────────────────────────────────────────────────

    // ─── Event Handlers ──────────────────────────────────────────────

💳 Stripe & Checkout

    Use Stripe’s @stripe/react-stripe-js for secure payments.

    Validate all server-side operations via firebase-admin and stripe SDK.

    Never expose secret keys or client-specific prices on the frontend.

    Seed test data with scripts/seed-firebase.ts.

🧪 Testing Standards

    Use jest, @testing-library/react, and jest-dom.

    Test only key flows (e.g. add to cart, checkout, auth).

    Prefer data-testid attributes over class selectors.

    Snapshot test only for static UI components.

🔒 Security & Compliance

    Store secrets in .env.local, never commit.

    Use Firestore rules and server-side Firebase Admin checks.

    Validate all client-side actions and reflect user roles from JWTs or Firebase claims.

    Sanitize user content if enabling uploads or rich inputs.

🧼 Linting & Git

    Use ESLint and eslint-config-next.

    Format consistently with Prettier (if not already configured).

    Use Husky for pre-commit lint/test checks:

npx husky add .husky/pre-commit "npm run lint && npm test"

Git commit convention:

    feat: add sunglasses product card
    fix: align checkout button on mobile
    chore: configure eslint rules

🪩 Brand Vibe Guidelines in Code

    Use bold CTA text, emojis sparingly but smartly in UI text.

    Meme moments can be embedded in tooltips, hover text, or 404 pages.

    Prioritize vibe + clarity over technical overengineering.