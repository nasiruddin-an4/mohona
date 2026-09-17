# Mohona by CGFWA — Technical Documentation

**Package name:** `betopia-daily` (v0.1.0)
**Stack:** Next.js 16.2 (App Router) · React 19.2 · MongoDB + Mongoose 9.6 · Tailwind CSS 4 · Zustand 5
**Scope:** Compiled from a full read of the `shop-daily` repository, `main` branch.

A Next.js storefront and admin console for Mohona, the retail arm of the Bangladesh Coast Guard Family Welfare Association (CGFWA), selling handicrafts, home décor and apparel across five physical branches. Checkout is contact-driven: shoppers reach staff by WhatsApp or phone rather than paying online.

| API routes | Admin pages | Public pages | Mongoose models | Zustand stores |
|---|---|---|---|---|
| 18 | 23 | 9 | 7 | 3 |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Project Structure](#4-project-structure)
5. [Data Models](#5-data-models)
6. [API Reference](#6-api-reference)
7. [Client State (Zustand)](#7-client-state-zustand)
8. [Storefront Flows](#8-storefront-flows)
9. [Admin Panel](#9-admin-panel)
10. [Integrations](#10-integrations)
11. [Environment & Scripts](#11-environment--scripts)
12. [Known Gaps & Inconsistencies](#12-known-gaps--inconsistencies)

---

## 1. Overview

The repository is named `shop-daily` and its `package.json` still calls the app `betopia-daily`, and `docs/SRS.md` describes an entirely different product: an internal zero-margin grocery platform for Betopia Group employees, with ERP login, salary-credit payments and demand-scheduled delivery of perishables. None of that survives in the running application. The commit history shows the project was repointed early on to a public storefront for **Mohona by CGFWA**, a Bangladeshi handicraft and home-décor retailer, and every user-facing string, model field and integration now serves that business instead.

> **Read this as two layers.** A leftover grocery-platform skeleton (demand windows, MOQ/max-order fields, a cart-and-payment checkout) still exists in the code, while the live product experience is a browse-and-WhatsApp catalogue for handmade goods. Section 12 maps exactly where the two layers diverge.

The system has two halves that share one Next.js deployment:

- **Storefront** — public catalogue browsing, product detail pages, order tracking by phone number, and a WhatsApp/phone-based purchase flow with no in-app payment.
- **Admin console** at `/admin` — cookie-gated CRUD for products, categories, brands, tags, reviews, orders and site settings, plus sales/inventory dashboards.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.2 (App Router) | File-system routing under `app/`; route handlers double as the REST API. |
| UI runtime | React 19.2 + React DOM 19.2 | Almost entirely client components (`"use client"`); data is fetched from the browser with `fetch`, not server components. |
| Styling | Tailwind CSS 4 + `@tailwindcss/postcss` | Utility classes inline; one custom theme block in `app/globals.css` defines `brandColor` (`#2a2d96`). |
| Animation | Framer Motion 12 | Section transitions on the homepage and marketing components. |
| Client state | Zustand 5 (+ `persist` middleware) | Cart, legacy order log, and cart-sidebar open/close state — see [Section 7](#7-client-state-zustand). |
| Database | MongoDB via Mongoose 9.6 | Single connection cached on `global.mongoose` to survive hot reload / serverless re-invocation. |
| Media | ImageKit (`imagekit` + `@imagekit/next`) | Client-side signed uploads for product photography in the admin panel. |
| Carousels | Swiper 12 | Hero, deals and category carousels on the homepage. |
| Charts | Recharts 3.8 | Revenue chart on the admin dashboard. |
| Utilities | date-fns 4, slugify, clsx, tailwind-merge, sweetalert2, jsPDF + autotable | Delivery-date math, slug generation, admin alerts, and exportable sales-report PDFs. |
| Tooling | ESLint 9 / eslint-config-next | `npm run lint`; no test runner is configured. |

---

## 3. Architecture

One Next.js app serves three concerns from the same codebase and the same Mongo database: the public storefront, the JSON API under `app/api`, and the admin console. There is no separate backend service and no server-side rendering of data — nearly every page is a client component that calls its own API route on mount.

```
Browser (React client components)
   │                         │
   │ fetch('/api/...')       │ mirrors to
   ▼                         ▼
Route handlers          Zustand stores
(app/api/**/route.js)   (localStorage-persisted)
   │
   ▼
Mongoose models ──► MongoDB Atlas
   │
   ├──► ImageKit (signed client upload)
   └──► WhatsApp / tel: (wa.me deep link, checkout exits the app)
```

Everything funnels through the browser: pages fetch `/api/*` directly, Zustand mirrors cart state to `localStorage`, and the two checkout paths leave the app entirely for WhatsApp or a phone dialer.

### Rendering model

Route handlers are the only server-executed code. Pages such as `app/page.js`, `app/shop/page.jsx` and every admin page are marked `"use client"` and fetch their data with `useEffect` + `fetch('/api/...')` after mount, so there is no streaming SSR or React Server Component data-fetching in this app despite the framework supporting it.

### Authentication model

There is one operator identity, not a user table. `middleware.js` guards every path under `/admin` except `/admin/login`, redirecting to the login page unless an `admin_token` cookie is present. `app/api/auth/admin-login/route.js` checks the submitted email/password against the plain-text `SUPER_ADMIN` / `SUPER_ADMIN_PASSWORD` environment values and, on match, sets an HTTP-only cookie whose value is the literal string `"authenticated"` for seven days. There is no JWT, no hashing, and no per-admin account — see [Section 12](#12-known-gaps--inconsistencies) for the security implications.

---

## 4. Project Structure

```
shop-daily/
├── app/
│   ├── api/                     # REST route handlers (18 files, see §6)
│   ├── admin/                   # /admin console — layout, sidebar, 23 pages
│   ├── components/              # storefront-only sections (Navbar, Footer, Hero, ...)
│   ├── context/                 # SiteSettingsContext (global store info)
│   ├── product/[slug]/          # product detail page
│   ├── shop/, shop/[category]/  # catalogue + category filter
│   ├── cart/, checkout/, payment/  # legacy cart→payment funnel (see §12)
│   ├── track-order/             # phone-number order lookup
│   ├── about/, contact/, demand/, orders/
│   ├── layout.js, page.js, globals.css
├── components/                  # shared widgets: ProductCard, CartSidebar, ImageZoom
├── models/                      # 7 Mongoose schemas (§5)
├── lib/                         # db.js, imagekit.js, utils.js, data.js
├── store/                       # 3 Zustand stores (§7)
├── scripts/                     # one-off DB seed/migration scripts (run via node)
├── data/links.json              # nav menu + footer link config
├── docs/SRS.md                  # original "Betopia Daily" spec — superseded, see §1
├── middleware.js                # /admin route guard
└── public/                      # catalog scans, hero images, logo, video.mp4
```

---

## 5. Data Models

All seven schemas live in `models/`, each guarded with `mongoose.models.X || mongoose.model(...)` to survive Next.js hot reload. All use Mongoose's `timestamps` option.

### Product — `models/Product.js`

| Field | Type |
|---|---|
| name, slug | String, slug unique+sparse |
| category, product_type, brand | String |
| unit_price, selling_price | Number |
| unit, available_units[] | String / [String] |
| stock_status | enum: In stock / Out of stock / Limited |
| status | enum: Publish / Draft |
| stock_qty, discount_pct | Number |
| colors[], tags[] | [String] |
| variants[] | `{sku, variant_id, image, color, size, visible, status}` |
| discounts[] | `{title, price, duration}` |
| cover_image, product_images[], video_url | String / [String] |
| fabric, wash_care, material | String |

### Order — `models/Order.js`

| Field | Type |
|---|---|
| order_number | String, unique+sparse, `"ORD-XXXXXX"` |
| customer_name, email, contact_number, address | String, required |
| payment_method | enum: Cash On Delivery / Bkash / Other |
| items[] | `{product_id, name, price, quantity, image}` |
| subtotal, shipping_cost, total_amount | Number |
| payment_status | enum: Unpaid / Pending / Paid / Failed / Cancelled |
| status | enum: Pending / Confirmed / Shipped / Delivered / Cancelled / Returned / Refunded |
| transaction_id, tracking_number, courier_name | String, nullable |

### Category — `models/Category.js`

| Field | Type |
|---|---|
| name | String, unique |
| icon, description | String |
| subcategories[] | `{ name }` |

### Brand · Tag — `models/Brand.js` · `models/Tag.js`

| Field | Type |
|---|---|
| name | String, unique, required |
| description | String |

### Review — `models/Review.js`

| Field | Type |
|---|---|
| product_id | ObjectId → Product, required |
| user_name, review_text | String, required |
| rating | Number, 1–5 |
| status | enum: Published / Hidden |

### SiteSettings — `models/SiteSettings.js` (singleton document)

| Field | Type |
|---|---|
| key | `"singleton"`, unique |
| storeName, phone, phoneAlt, email, address | String, defaulted to Mohona's info |
| socialLinks | `{facebook, instagram, youtube, linkedin}` |

---

## 6. API Reference

Every route lives under `app/api` and returns `{ success, data }` or `{ success: false, error }`. None of the CRUD endpoints check the `admin_token` cookie themselves — page-level access is gated by `middleware.js`, but the API routes are reachable directly by anyone who knows the URL (see [Section 12](#12-known-gaps--inconsistencies)).

### Products

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | List products, optional `?category=` filter, newest first. Sent with `no-store` cache headers. |
| POST | `/api/products` | Create a product; server derives a unique slug from `name` + random suffix. |
| GET | `/api/products/[id]` | Fetch by Mongo `_id` or by `slug` (auto-detected via a 24-hex-char regex). |
| PUT | `/api/products/[id]` | Full update, same id/slug lookup. |
| DELETE | `/api/products/[id]` | Delete by id or slug. |

### Orders

| Method | Path | Description |
|---|---|---|
| GET | `/api/orders` | All orders, newest first (admin order list). |
| POST | `/api/orders` | Create an order; server assigns `order_number = ORD-<6 random hex chars>`. |
| GET | `/api/orders/[id]` | Fetch by `_id` or `order_number`. |
| PATCH | `/api/orders/[id]` | Partial update — status, payment_status, items, totals, tracking_number, courier_name. Setting status to `Cancelled` force-sets `payment_status` to `Cancelled` too. |
| POST | `/api/orders/track` | Body `{contact_number}` → all orders for that exact phone number, newest first. Powers `/track-order`. |

### Catalogue taxonomy

| Method | Path | Description |
|---|---|---|
| GET / POST | `/api/categories` | List / create categories (with nested subcategories). |
| PUT / DELETE | `/api/categories/[id]` | Update / delete one category. |
| GET / POST | `/api/brands` | List / create brands. |
| PUT / DELETE | `/api/brands/[id]` | Update / delete one brand. |
| GET / POST | `/api/tags` | List / create tags. |
| PUT / DELETE | `/api/tags/[id]` | Update / delete one tag. |

### Reviews

| Method | Path | Description |
|---|---|---|
| GET | `/api/reviews` | All reviews, populated with product name/images. With `?product_id=`, filters to that product *and* forces `status=Published` — the public product page only ever sees approved reviews. |
| POST | `/api/reviews` | Customer submits `{product_id, user_name, review_text, rating}`; always created as `Published` (no moderation queue before going live). |
| PATCH | `/api/reviews/[id]` | Admin sets `status` to `Published` or `Hidden`. |
| DELETE | `/api/reviews/[id]` | Remove a review. |

### Settings, auth, media & seed

| Method | Path | Description |
|---|---|---|
| GET | `/api/settings` | Fetch (or lazily create) the singleton `SiteSettings` doc powering contact info sitewide. |
| PUT | `/api/settings` | Update store name / phones / email / address / social links. |
| POST | `/api/auth/admin-login` | Checks credentials against `SUPER_ADMIN` env vars; sets the `admin_token` cookie. |
| POST | `/api/auth/admin-logout` | Clears the cookie. |
| GET | `/api/imagekit-auth` | Issues a 40-minute HMAC-SHA1 token/signature pair for direct browser → ImageKit uploads. |
| POST | `/api/seed/products` | Wipes the `Product` collection and reloads it from `data/mock_products.json`. Destructive; intended as a one-off dev/demo utility, not a production endpoint. |

> **Two Mongo connection patterns coexist.** Most routes call the shared, cached helper in `lib/db.js`. `app/api/reviews/route.js` and `app/api/reviews/[id]/route.js` instead re-implement their own copy of the same caching logic inline. Functionally equivalent today, but a change to connection options has to be made in two places.

---

## 7. Client State (Zustand)

### `useCartStore` — `store/useCartStore.js`
Persisted to `localStorage` as `betopia-daily-cart`. Holds `items[]` (each `{product, quantity, demandDate}`) and a `shippingCost` flag (5 or 15). `addItem` matches existing lines by product id *and* selected unit, clamps quantity to `product.max_order_qty`, and seeds new lines at `product.moq` or 1. Still wired into the legacy `/cart → /checkout → /payment` pages; the WhatsApp buy flow never touches it.

### `useSidebarStore` — `store/useSidebarStore.js`
In-memory only. Trivial boolean toggle (`isCartOpen`) driving the slide-out `CartSidebar` component from the Navbar's cart icon.

### `useOrderStore` — `store/useOrderStore.js`
Persisted as `betopia-daily-orders`. A client-only order log that mints its own `order_id`/`order_number` and never calls `/api/orders`. It duplicates what the Order API + `/track-order` now do server-side and does not appear to be read anywhere in the current UI.

### `SiteSettingsContext` — `app/context/SiteSettingsContext.jsx`
React context, not Zustand. Wraps the whole app in `layout.js`, fetches `/api/settings` once on mount, and exposes `{settings, loading, refreshSettings}` so Navbar, Footer and Contact can render live store info without prop drilling.

---

## 8. Storefront Flows

### Primary purchase path — no payment gateway

Mohona takes no online payments. Two separate "buy" entry points both end outside the app:

**A. Product card → WhatsApp.** Every `ProductCard` (grid/listing view) renders a "Buy via WhatsApp" button linking to `https://wa.me/8801769441085` with a pre-filled message containing the product name, a generated `LSHR####` code, and its price range.

**B. Product detail → Contact page.** The full product page (`app/product/[slug]/page.jsx`) instead routes a size-aware "Contact for order" button to `/contact`, which lists phone/email and all five showroom branches for the shopper to reach out directly.

### Order lookup

`/track-order` lets a customer enter the phone number an order was placed under and calls `POST /api/orders/track`, returning every order matching that exact `contact_number` with status, items and delivery info — there's no login, so the phone number is effectively the lookup credential.

### Delivery date logic

`lib/utils.js` implements a 5:30 PM cutoff rule (leftover from the original grocery-platform spec, still used for the demand-window UI): orders placed before 17:30 deliver the next business day, after 17:30 they slip to the following business day again, and weekends are always skipped.

```js
calculateDeliveryDate(orderDate = new Date())
  // cutoff = 17:30 same day
  // isAfterCutoff ? +2 days : +1 day, then roll forward past weekends
```

### Homepage sections

`app/page.js` fetches `/api/products` and renders `Hero`, `Categories`, `ExclusiveCollection`, `EverydayCasual` and `Magazine`. Several built components are commented out of the tree rather than deleted: `CollectionBanners`, `PromoBanner`, `CategoryBento`, `DailyDeals`, `FeaturedOffers`, `RecommendationCarousel`.

---

## 9. Admin Panel

`/admin/*` shares one `AdminLayout` (sidebar + header) for every route except `/admin/login`, which renders standalone. The sidebar groups 23 pages as follows:

| Group | Pages |
|---|---|
| Overview | Dashboard (`/admin`) — revenue chart, stat cards, top sales, promotional sales widget |
| Catalogue | All / Draft / Stock Products, Product Reviews, Add Product, Edit/View Product |
| Taxonomy | Categories, Tags, Brands (list + inline edit) |
| Inventory | Manage Inventory (list + per-product detail) |
| Orders | All Orders, Order Detail, Returns & Refunds, Abandoned Cart, Transactions |
| Reporting | Sales Reports (jsPDF export via `jspdf-autotable`) |
| People | Admins, Customers |
| Config | Settings (maps to the `SiteSettings` singleton) |

Shared admin components: `AdminSidebar`, `AdminHeader`, `ImageUploader` / `MultiImageUploader` (ImageKit), `StatCard`, `RevenueChart` (Recharts), `TopSaleList`, `StatusDropdown`, `PromotionalSales`.

> **Single operator account.** There is exactly one admin identity, sourced from the `SUPER_ADMIN` / `SUPER_ADMIN_PASSWORD` environment variables. The `/admin/admins` and `/admin/customers` pages exist in the UI, but nothing in the API layer backs multi-admin accounts or customer records — see [Section 12](#12-known-gaps--inconsistencies).

---

## 10. Integrations

| Service | Used for | Wired in |
|---|---|---|
| MongoDB Atlas | System of record for products, orders, taxonomy, reviews, settings | `lib/db.js`, `MONGODB_URI` / `MONGODB_DB` |
| ImageKit | Product photo hosting/transform; browser uploads straight to ImageKit's API | `lib/imagekit.js` + `/api/imagekit-auth` for signed tokens |
| WhatsApp (wa.me) | Primary checkout channel — pre-filled message deep link, no API key needed | `components/ProductCard.jsx` |
| date-fns | Delivery-date cutoff/weekend-skip math, demand-window formatting | `lib/utils.js` |
| jsPDF + autotable | Exportable sales report PDFs | `app/admin/reports/sales/page.jsx` |
| SweetAlert2 | Admin confirm/alert dialogs (delete confirmations, save toasts) | admin CRUD pages |

---

## 11. Environment & Scripts

### Environment variables

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | Mongo connection string (required — throws at import time if unset) |
| `MONGODB_DB` | Database name, defaults to `mohonaEcommerceDB` |
| `MONGODB_PASS` | Present in `.env` but not referenced by any code path read during this review — likely embedded directly in `MONGODB_URI` instead |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | ImageKit delivery URL base, exposed to the browser |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | ImageKit public key, exposed to the browser |
| `IMAGEKIT_PRIVATE_KEY` | Server-only, signs upload tokens in `/api/imagekit-auth` |
| `SUPER_ADMIN` / `SUPER_ADMIN_PASSWORD` | Sole admin login credentials, compared in plain text |

### npm scripts

| Command | Effect |
|---|---|
| `npm run dev` | `next dev -p 8001` — local dev server on port 8001 |
| `npm run build` | `next build` |
| `npm run start` | `next start` — serve the production build |
| `npm run lint` | ESLint via `eslint-config-next` |

One-off data scripts (`scripts/seed-products.js`, `add-catalog-products.js`, `update-categories.js`, `update-names.js`, plus root-level `update-images.js`) are run manually with `node`; none are wired into `package.json`.

---

## 12. Known Gaps & Inconsistencies

- **Two checkout systems coexist.** `/cart → /checkout → /payment` is a fully built cart-and-payment funnel backed by `useCartStore`, but nothing in the current UI adds items to it — every visible "buy" button goes to WhatsApp or `/contact` instead (see Section 8). The funnel and its store code are dead weight unless a future release re-enables it.
- **SRS document is stale.** `docs/SRS.md` describes ERP login, ID-based auth, salary-credit payment and JWT sessions — none of which exist in the code. It documents a discarded direction, not this build.
- **`/orders` redirects to a page that doesn't exist.** `app/orders/page.jsx` immediately `router.replace('/profile')`, but there is no `app/profile` route in the project — this link currently 404s.
- **Admin auth is minimal.** One shared credential pair, a static `"authenticated"` cookie value instead of a signed token, and passwords compared with `===` rather than a hashed check. Fine for a single trusted operator; not multi-admin- or attacker-resistant.
- **API routes aren't independently authorized.** Write endpoints (`POST`/`PUT`/`PATCH`/`DELETE` under `/api/products`, `/api/orders`, `/api/categories`, etc.) don't check the admin cookie themselves — only the admin *pages* are gated by `middleware.js`. Anyone who finds the endpoint can call it directly.
- **`/api/seed/products` is destructive and unauthenticated.** It deletes the entire `Product` collection before reseeding from a local JSON fixture — safe to keep for local demos, risky if ever deployed reachable in production.
- **Admin/Customer pages have no backing model.** `/admin/admins` and `/admin/customers` exist as UI but there's no `Admin` or `Customer` Mongoose schema — they likely render static or placeholder data today.
- **Duplicated DB-connection logic.** `app/api/reviews/route.js` and `app/api/reviews/[id]/route.js` hand-roll their own cached-connection helper instead of importing `lib/db.js`.
- **`useOrderStore` looks unused.** It builds its own client-side order numbering scheme but nothing in the current pages appears to call it now that order creation goes through `POST /api/orders`.
