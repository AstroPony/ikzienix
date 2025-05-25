# ikzienix Visual Style Guide

This style guide defines the updated look and feel for the ikzienix brand, inspired by bold futuristic fashion aesthetics and sci-fi editorial design, while sticking to our core purple/yellow identity.

---

## ✨ Visual Identity

- **Primary Colors**
  - **Midnight Black** `#0A0A0A` – Background and base
  - **Cyber Yellow** `#FFD400` – Primary CTA, icons, highlights
  - **Electric Purple** `#9F00FF` – Secondary accents, tags, UI highlights
- **Secondary Accents**
  - Neon green: `#00FF88`
  - Muted white: `#F8F8F8` (for readable contrasts)

## 🔤 Typography

- **Headlines** – Square Display or Orbitron (bold, stretched sci-fi)
- **Subheadings** – Space Grotesk or Rajdhani (uppercase + geometric)
- **Body Text** – Inter, system font stack, 14-16px

## 🧱 Layout & UI

- Grid-based layout using Bootstrap 5
- Hero section with large central image, vertical or horizontal headline
- Use bold iconography, corner-badge labels, angled dividers
- CTAs should feel like “buttons from the future”
- Navigation should use a high-contrast sticky bar
- Feature toggles and admin controls grouped into a sidebar or modal

## 🔲 Components

- **Product Cards**
  - Hover effects (neon outlines or glow)
  - Tags like NEW / LIMITED in top-left
  - Glassy or textured containers
- **CTA Buttons**
  - Pill-shaped or square with bold corners
  - Colors: `#FFD400` text on `#0A0A0A` or vice versa

## 💡 Imagery

- Embrace visual storytelling
- Use dark-themed, editorial-style backgrounds with bold lighting
- Place products in futuristic mockups, highlight contrast

## 🔧 Developer Notes

- Use Bootstrap 5 only — no Tailwind
- Stick to TDD: every component should have a matching test
- Components should pull styling from SCSS or Bootstrap utility classes
- Theme toggles and feature flags must be respected via Admin Panel