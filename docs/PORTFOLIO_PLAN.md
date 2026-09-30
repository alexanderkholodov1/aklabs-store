# AKLabs Store: portfolio phase plan

Working spec for turning the course project into a public portfolio piece.
Every workstream reads this file first. Code, comments, commits and docs are
written in English.

## 1. Goal

A store that looks and behaves like a real e-commerce site and, at the same
time, shows what its author can build: modern stack, solid engineering,
security, maintainability, and an admin that a small-business owner can run.

- Primary purpose: a working storefront (browse, cart, checkout, orders, accounts).
- Secondary purpose: a portfolio "wink". Info hints explain how things are built,
  and there are dedicated pages about the project and its author, with a clear
  LinkedIn call to action.
- Products are fictional. The site must say so wherever a visitor could think
  otherwise, and nothing is ever charged.

## 2. Architecture decisions

| Topic | Decision |
|---|---|
| Commerce engine | Medusa v2, unchanged. Open source, owns the data model. |
| Storefront | Next.js 15 App Router, Server Components, Server Actions. |
| Database | PostgreSQL. Medusa requires it, so Firestore is not an option. |
| Hosting target | Firebase Hosting (CDN) in front of Cloud Run (storefront + Medusa) with Cloud SQL for PostgreSQL in the same region. **Pending owner approval (billing).** |
| Local development | Backend and storefront run locally against the hosted Postgres. No Docker on the author's laptop for now (section 6). |
| i18n | English first, Spanish complete. Cookie-based locale, typed dictionaries per namespace, product copy in `product.metadata.i18n`. |
| Seasons and dates | The backend owns the seasonal calendar (dates computed per year, store time zone) and schedules the matching promotions. The storefront only renders what the backend reports. |
| Payments | Manual test provider today. PayPal sandbox is optional, pending owner decision. |

Why the storefront feels slow today: the backend runs on a laptop in Ecuador
and every SQL query travels to a pooler in Oregon (about 160 ms). A single
checkout step runs dozens of sequential queries. Co-locating backend and
database fixes it; caches only hide it for reads.

## 3. Workstreams and file ownership

Execution model: all workstreams share the main working copy (no worktrees,
no extra installs) and edit only the files they own. The coordinator runs the
dev servers, reviews and commits. Workstreams never commit, install packages or
start servers. At most two workstreams run at the same time:

- Batch 1: WS-3 `backend` and WS-1 `frontend-browse`.
- Batch 2: WS-2 `frontend-checkout` and WS-4 `showcase`.
- Batch 3: WS-6 `seasonal` and WS-5 `docs`.

Anything outside your ownership: leave a note in your final report instead of
editing it.

### WS-1 `frontend-browse`
Owns: `src/modules/{layout,home,common,products,store,categories,collections,skeletons}`,
`src/styles/**`, `tailwind.config.js`, existing routes under
`src/app/[countryCode]/(main)/{page.tsx,store,categories,collections,products}`,
i18n namespaces `layout`, `home`, `product`, `store`, `common`,
`src/lib/i18n/product-copy.ts`, `src/lib/data/{products,categories,collections,catalog-cache}.ts`.

1. Finish i18n for every string in owned modules (server `getMessages()`, client `useI18n()`).
2. Responsive and zoom: fluid `content-container`, `clamp()` typography, no fixed
   pixel widths or heights for layout, full-bleed sections that fill wide screens.
   Verify at 360, 390, 768, 1024, 1280, 1440, 1920 and 2560 px wide.
3. Scale to 30 products and 13 categories: data-driven category showcase and
   filter chips, curated featured row, pagination that works.
4. Product copy: read `product.metadata.i18n[locale]` first, then the overlay map.
5. Sale prices: badge with the percentage and the struck original price.
6. Navigation and footer: links to `/about` and `/how-it-works`, LinkedIn from `SITE`.
7. Perceived speed: optimistic add-to-cart feedback, skeletons, prefetching.
8. Place `<InfoHint topic="..." />` on the price, region switcher and catalog.

### WS-2 `frontend-checkout`
Owns: `src/modules/{cart,checkout,order,account,shipping}`, routes
`src/app/[countryCode]/(checkout)/**`, `src/app/[countryCode]/(main)/{cart,account,order/[id]/confirmed}`,
i18n namespaces `cart`, `checkout`, `account`, `order`, `src/lib/data/{cart,customer,orders,fulfillment,payment}.ts`.

1. Finish i18n for every string in owned modules (the Spanish from the course
   version becomes English first, Spanish second).
2. Responsive and zoom, same rules as WS-1.
3. Accounts and order history: polished lists, order detail with status,
   items and a "Track package" link to `/order/[id]/tracking`.
4. Promotion codes in cart and checkout: clear applied state and errors.
5. Place `<InfoHint>` on cart totals, checkout steps and order confirmation.

### WS-3 `backend`
Owns: `store/apps/backend/**`.

1. Type-check clean (`tsc --noEmit` passes for the backend).
2. Catalog normalization: English names and descriptions in the database,
   Spanish in `metadata.i18n.es`, English category names and handles
   (`tees`, `caps`, `drinkware`, ...). Idempotent script with a dry run.
3. Discounts: a "Launch sale" price list (about 20% off on five products,
   USD and EUR) and a promotion code `AKLABS10` (10% off). Idempotent script.
4. Seasonal calendar (contract in section 4): pure date logic per year in the
   store time zone, a daily scheduled job that keeps the next occurrence of each
   seasonal campaign and its promotion in place, and a store route that reports
   the active and upcoming seasons.
5. Simulated courier: a scheduled job that moves recent orders through real
   fulfillment workflows (fulfillment created, shipment with tracking number,
   delivered) and records intermediate events in order metadata.
6. Tracking API (contract in section 4).
7. Delivery e-mail: notification module with a pluggable provider, a
   light-hearted HTML template with the ordered item and a business card.
   Disabled unless `MAILER_ENABLED=true`; sends at most one mail per order.
8. Hardening: rate limiting on auth and cart mutations; make the catalog
   response cache skip authenticated requests and key by region and sales channel.

### WS-4 `showcase`
Owns: `src/modules/{showcase,tracking}/**`, routes
`src/app/[countryCode]/(main)/{about,how-it-works,order/[id]/tracking}`,
`src/app/[countryCode]/(main)/layout.tsx`, i18n namespaces `showcase`, `tracking`,
`src/lib/site.ts`.

1. `/about`: who the author is and what they build, with a prominent LinkedIn call
   to action. Facts about the author come only from `SITE` and owner-provided
   text; use clearly marked placeholders otherwise.
2. `/how-it-works`: why this store exists, architecture diagram, stack, what it
   demonstrates (security, reliability, maintainability, owner-friendly admin)
   and why owning your commerce stack matters for small businesses.
3. Builder hints: finish `InfoHint` (motion, positioning on small screens) and a
   floating "How is this built?" entry point.
4. Demo disclaimer: dismissible banner in the main layout.
5. Tracking page: live timeline, animated route map, polling, ETA. Works with the
   API contract; renders a mock timeline if the API is unavailable.
6. Motion and depth: tasteful CSS animations and 3D (tilt, parallax); a lazy
   WebGL piece only if it stays under the performance budget.

### WS-5 `docs`
Owns: `README.md`, `docs/**` (except this file), `.github/**`, `LICENSE`,
`SECURITY.md`, `store/apps/storefront/next.config.js`.

1. README in English focused on capabilities, stack and infrastructure; a short
   section on owning your commerce stack (no vendor lock-in, no subscriptions).
2. `docs/ARCHITECTURE.md` (diagrams), `SECURITY.md` (threat model and controls).
3. CI: GitHub Actions for install, lint and type-check; Dependabot.
4. Security headers in `next.config.js` (CSP, HSTS, frame, referrer, permissions).
5. Move the course material (`PRESENTACION.md`, `presentacion/`) to `docs/academic/`.

### WS-6 `seasonal`
Owns: `src/modules/seasonal/**`, `src/lib/data/seasons.ts`, i18n namespace
`seasonal`, and in batch 3 also `src/app/[countryCode]/(main)/layout.tsx` and the
home hero.

1. Seasonal banner: active season (Halloween, Black Friday, Christmas, New Year,
   and local dates such as Carnival and Dia de los Difuntos) with its promotion code
   and a live countdown to the end, or a countdown to the next season.
2. Seasonal accents: light decoration per season (CSS and inline SVG only), never
   new brand colors, respecting `prefers-reduced-motion`.
3. Preview: `?season=<key>` shows any season on demand, clearly labeled as a
   preview, so visitors can see that the calendar runs itself.
4. Resilience: if the seasons API fails, the store renders without the banner.

### Coordinator
Dev servers, reviews, commits, infrastructure and deployment, QA across
breakpoints, e-mail and payment credentials, final polish.

## 4. Contracts

### Tracking API (WS-3 builds it, WS-4 consumes it)

`GET /store/aklabs/orders/{id}/tracking` with the publishable key header.

```json
{
  "order": {
    "id": "order_...", "display_id": 3, "created_at": "ISO",
    "currency_code": "usd",
    "items": [{ "title": "AKLabs Essential Hoodie", "thumbnail": "https://...", "quantity": 1 }]
  },
  "tracking": {
    "number": "AKX-000003",
    "carrier": "AKLabs Express",
    "simulated": true,
    "status": "in_transit",
    "progress": 0.6,
    "eta": "ISO",
    "stages": [
      { "key": "placed", "at": "ISO", "done": true },
      { "key": "packed", "at": "ISO", "done": true },
      { "key": "picked_up", "at": "ISO", "done": true },
      { "key": "in_transit", "at": "ISO", "done": true },
      { "key": "out_for_delivery", "at": null, "done": false },
      { "key": "delivered", "at": null, "done": false }
    ]
  }
}
```

The order id works as a capability (unguessable ULID), like Medusa's order
confirmation. The response never includes addresses, e-mails or phone numbers.

### Seasons API (WS-3 builds it, WS-6 consumes it)

`GET /store/aklabs/seasons` with the publishable key header. Optional
`?preview=<key>` returns that season as active with `"preview": true`.

```json
{
  "now": "ISO",
  "time_zone": "America/Guayaquil",
  "active": {
    "key": "halloween",
    "starts_at": "ISO",
    "ends_at": "ISO",
    "promotion_code": "SPOOKY15",
    "discount_percent": 15,
    "preview": false
  },
  "upcoming": [
    { "key": "black_friday", "starts_at": "ISO", "ends_at": "ISO", "days_until": 57 }
  ]
}
```

Season keys: `carnival`, `halloween`, `difuntos`, `black_friday`, `christmas`,
`new_year`. `active` is `null` between seasons. Codes are only returned for the
active season.

### Info hints

`<InfoHint topic="pricing" />` from `@modules/showcase/components/info-hint`.
Topics are the keys of `showcase.hints` in `src/lib/i18n/messages/showcase.ts`.
Ask WS-4 (through your report) for new topics.

### Site profile

`SITE` from `@lib/site` holds the owner name, LinkedIn, GitHub and repository URLs.

## 5. Conventions

- i18n: no hardcoded user-facing strings. Add keys to your namespace file in both
  `en` and `es` (`es` is typed `typeof en`, so missing keys fail the type-check).
- Design system: `ak-*` colors, `font-display`, `glass`, `liquid`, `rim-ak`,
  `btn-ak-gradient`, `text-gradient-ak`. Do not add new brand colors.
- Accessibility: keyboard reachable, visible focus, WCAG AA contrast, meaningful
  `alt`, `prefers-reduced-motion` respected.
- Performance: no heavy dependency without a reason; lazy-load below the fold;
  CSS over JS for motion.
- Commits: Conventional Commits, small and descriptive, no AI attribution lines.
- Never touch: `.env*` files, `private/`, lockfiles (only through pnpm), existing
  migrations.

## 6. Machine and resource rules

The author's laptop has an NVMe SSD that stops responding under sustained heavy
I/O (Windows logs controller resets, and it has crashed with
KERNEL_DATA_INPAGE_ERROR). Until the drive is checked, work gently:

- One backend (`:9000`) and one storefront (`:8000`), started by the coordinator.
  Workstreams use them; they never start their own servers.
- No Docker, no `pnpm install`, no `next build` from workstreams.
- Type-check only at the end of your work, once, with
  `NODE_OPTIONS=--max-old-space-size=2048`.
- Screenshots: one headless browser at a time, closed right after use.
- Keep outputs small: no watching logs in loops, no large file dumps.

## 7. Pending owner decisions

1. Infrastructure and budget for Firebase Hosting, Cloud Run and Cloud SQL.
2. E-mail sender for the delivery e-mail.
3. LinkedIn URL and a short bio for the about page.
4. Languages beyond English and Spanish.
5. Donations and a PayPal sandbox in checkout.
