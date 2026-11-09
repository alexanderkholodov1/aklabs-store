# AKLabs Store

**Live: [aklabs-store.web.app](https://aklabs-store.web.app)**

A shopping simulator for the AKLabs merch line: browse, fill a bag, check out and
follow the courier on a map, without spending anything. Every product is
fictional, nothing is charged and nothing is shipped. It is also a working
e-commerce portfolio piece by [Alexander Kholodov](https://www.linkedin.com/in/alexanderkholodov1/).

## What it shows

| For | What to look at |
|---|---|
| Visitors | A complete purchase in English or Spanish: 30 products, sizes and colors, USD or EUR, a promotion code, a checkout that never asks for payment data, and a courier that arrives in one or two minutes, even offline. |
| Engineers | A static Next.js export on Firebase Hosting with no server, a deterministic catalog pipeline, browser-side cart and orders with validated storage, an offline service worker, and CI that checks types, every route, size budgets, accessibility and full purchases before anything deploys. |
| Businesses | The path from a brand to a store a customer enjoys, at zero hosting cost, with the owner keeping the data and the revenue. See the How it works page. |

Accessibility is a requirement of every version (WCAG 2.2 AA): keyboard and
screen-reader support, written alternatives for all product images, reduced
motion, and reflow down to 320 px.

## Architecture

```
Browser ── static HTML, CSS and JavaScript (Next.js static export)
  │         cart, checkout, orders and courier simulated in the browser
  ▼
Firebase Hosting ── CDN, HTTPS, security headers, a preview site per pull request

GitHub Actions ── type-check, static export, site checks; deploys main
Medusa v2 (store/apps/backend) ── local back-office; its catalog is exported to
                                  store/apps/storefront/src/data/catalog.json
```

Free tiers only: Firebase Spark and GitHub Actions for a public repository.

## Run it

Requires Node 22 and Corepack. From `store/`:

```sh
corepack pnpm install --frozen-lockfile
pnpm --dir apps/storefront run build:site   # catalog, static export, offline worker
pnpm --dir apps/storefront run start        # http://127.0.0.1:8000
pnpm --dir apps/storefront run check:site   # routes, budgets, axe, purchase flows
```

No environment variables, accounts or servers are needed to build or run the
storefront.

## Documents

- [Static storefront guide](docs/STATIC-STOREFRONT.md): build, catalog, browser data, offline behavior and checks.
- [Roadmap](docs/ROADMAP.md): principles, versions and the decisions that belong to the owner.
- [Work plan](docs/WORKPLAN.md): how the work is split and its quality gates.
- [Owner's observations](docs/OPERATOR-OBSERVATIONS.md): every observation of the owner and its state.
- [Medusa back-office guide](docs/BACKOFFICE-MEDUSA.es.md) (Spanish): the original Medusa v2 and Supabase setup.

## Stack

Next.js 15, React 19, TypeScript, Playwright with axe-core, Firebase Hosting,
GitHub Actions, Medusa v2, pnpm workspaces.
