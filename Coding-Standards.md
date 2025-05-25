# ikzienix Coding Standards

These coding guidelines ensure a consistent and maintainable approach across the ikzienix codebase.

---

## 📦 Stack Overview

* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript
* **Styling**: Bootstrap 5 (utility classes only)
* **Database**: MySQL (via MAMP)
* **ORM**: Prisma
* **Hosting**: Plesk-based Shared Hosting
* **Deployment**: Manual via FTP / Optional GitHub Actions (WIP)

---

## 🧱 Project Structure

```
/app           - Next.js App Router pages and layouts
/components    - Reusable UI components
/styles        - Bootstrap overrides, global CSS
/lib           - Utility functions
/prisma        - Prisma schema and migrations
/public        - Static assets
/features      - Feature-flagged functionality modules
/admin         - Admin panel for toggling features and managing products/users
```

---

## 🛠 Code Practices

* Use **TypeScript** strict mode.
* Prefer `async/await` over `.then()`.
* All API routes must validate input using Zod.
* Use `react-hook-form` + Zod for all form handling.
* Avoid unnecessary dependencies.
* Use **Bootstrap utility classes only** — do not include Tailwind.
* Every feature must be wrapped in a **feature flag** and toggled via the Admin Panel.

---

## 🗂 Naming Conventions

* Components: `PascalCase.tsx`
* Utility functions: `camelCase.ts`
* Environment variables: `UPPER_SNAKE_CASE`
* Use `.tsx` only when React/JSX is involved.

---

## 🔍 Testing Philosophy

We use **Test Driven Development (TDD)**:

* Write tests before implementing new features.
* Focus on meaningful coverage — avoid over-testing trivial logic.
* **Stack**:

  * **Jest** for unit logic
  * **React Testing Library** for components
  * **Playwright** (optional) for e2e testing

---

## 🔒 Security

* Sanitize user input on both client and server.
* Never expose secrets in the frontend.

---

## 📁 Environment Files

```
.env.local           - Local MySQL (via MAMP)
.env.production      - Hosted MySQL (Plesk)
```

---

## ✨ Recommended Extensions

* Prisma
* Prettier
* ESLint
* DotENV
