# ELUX — Premium E-Commerce Experience (Next.js 14)

ELUX is a premium, high-performance, and responsive e-commerce web application meticulously designed and built using the latest **Next.js 14 (App Router)** framework. The platform offers a seamless shopping journey with state-of-the-art client-side filtering, interactive dashboards, robust routing, and highly optimized media delivery. 

This repository represents the modernized, client-focused Next.js implementation of the ELUX ecosystem, maintained alongside the classic PHP/MySQL backend architecture in separate, dedicated repositories.

---

## 🚀 Live Production URL
The live, production-ready application is deployed and instantly accessible here:  
👉 **[elux-fixed.vercel.app](https://elux-fixed.vercel.app/)**

Each commit pushed to the `main` branch is automatically analyzed, optimized, and built in real-time by Vercel's Edge CDN.

---

## ✨ Full Feature Breakdown

### 1. 🛍️ Customer Shopping Journey
* **Intuitive Category Filtering:** Browse through dedicated sections like **Computing, Audio, Wearables, Home, and Photography** with real-time UI transitions.
* **High-Resolution Media Catalog:** Built-in dynamic support for fast, lightweight images powered by professional content delivery networks (CDNs like Pexels).
* **Dynamic Search & Sorting:** Customers can filter products on-the-fly based on category-specific parameters and sort them dynamically.
* **Persistent User States:** Handles interactive client-side operations smoothly, ensuring fluid navigations without full-page reloads.

### 2. 🛡️ Advanced Architecture & Routing
* **Next.js 14 App Router:** Leverages modern file-system routing, route groups, and native layout nesting to load pages with optimal speed.
* **React Suspense Boundaries:** Uses loading placeholders and `<Suspense>` wrappers around high-resource tasks (such as search parameters read via `useSearchParams()`) to guarantee zero-layout shift.
* **Tailwind Modern Design System:** Fully customized layouts, beautiful smooth-hover cards, high-contrast typography, and a modern clean glassmorphism footer.
* **Global State Management:** Structured context providers to seamlessly manage cart items, user session tokens, and wishlists.

### 3. 📈 Admin Management Panel
* **Interactive Dashboard:** Easily accessible via the `/admin` route.
* **Real-time Analytics Feed:** View current catalog properties, active statistics, and overall product distribution across multiple categories.

---

## 📂 Codebase & Folder Architecture

The project has been refactored into a highly professional directory structure standard for modern React applications:

```text
ELUX-NEXT/
│
├── app/                      # Next.js App Router root
│   ├── layout.tsx            # Global layout, fonts, and metadata configurations
│   ├── page.tsx              # Home / Landing hero display page
│   ├── shop/                 # Core shop catalog display
│   │   └── page.tsx          # Dynamic category grid and filter controls
│   └── admin/                # Admin Analytics Dashboard portal
│
├── components/               # Pure UI and functional components
│   ├── Navbar.tsx            # Desktop & mobile responsive header bar
│   ├── Footer.tsx            # Modern aesthetic footer with newsletter and links
│   ├── ProductCard.tsx       # Reusable product visual component with hover states
│   └── ShopView.tsx          # Main shopping logic handler containing layout states
│
├── context/                  # React context providers
│   └── CartContext.tsx       # Handles global shopping cart, updates, and subtotals
│
├── lib/                      # Helper modules and mock data
│   └── products.ts           # Unified products array containing accurate details & verified image links
│
├── public/                   # Static public assets (Favicons, local images, icons)
│
└── Configuration Files
    ├── package.json          # Script commands and project NPM dependencies
    ├── next.config.mjs       # Next.js configurations & remote image source permissions
    ├── tsconfig.json         # Strict TypeScript compiler options
    ├── tailwind.config.ts    # Custom theme configurations, extensions, and color palettes
    └── postcss.config.mjs    # CSS processing configurations
