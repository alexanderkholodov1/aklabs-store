# AKLabs Store work plan

How the work is split between the coordinator (the main Claude session) and
delegated agents, and the work packages for the next version. It complements
[ROADMAP.md](ROADMAP.md), which says what and when; this file says who and how.

Status: **v0.3 packages are defined and ready to launch once the owner approves D1 and D2.**

## Execution rules

Learned from the first attempt, when two agents ran out of quota mid-task and the
laptop's SSD crashed under load.

1. **Coordinator.** Runs dev servers, commits, pull requests, installs, cloud changes and final QA. It keeps ROADMAP.md up to date.
2. **Agents write code only.** They edit the files their package owns in the shared checkout. They never install packages, start servers, run Docker or builds, commit, or touch `.env` files and `private/`.
3. **At most two agents at a time,** with no overlapping files. Research agents use a lighter model.
4. **Heavy checks run in CI** (GitHub Actions), not on the laptop. Locally: one type-check at a time with `NODE_OPTIONS=--max-old-space-size=2048`, and one headless browser at a time.
5. **Every brief is self-contained.** It gives context, files owned, tasks, acceptance criteria (function, accessibility, size budget, security) and the report format.
6. **Stopped agents.** If an agent stops mid-task, its partial edits move to a side branch (like `wip/batch1-partial`) and are reviewed before reuse.
7. **One version per pull request.** The coordinator reviews every package against its criteria before committing.

## Quality gates for every package

- Type-check clean; lint clean on touched files.
- The [accessibility requirements](ROADMAP.md#accessibility-requirements) hold for everything the package renders.
- Size budget: about 150 KB of JavaScript and 300 KB per first view; images in AVIF or WebP.
- No secrets in the browser, no third-party scripts, and input validation on every boundary.
- User-facing text comes from the i18n dictionaries in English and Spanish, with no hardcoded strings.

## v0.3 work packages (first public version)

Order: batch A runs first (WP1 and WP2 in parallel), then batch B (WP3 and WP4 in parallel). The coordinator handles WP5 throughout.

### WP1. Catalog pipeline and images (batch A)
- **Owns:** `store/apps/storefront/scripts/catalog/**`, `store/apps/storefront/src/data/**`, generated images under `store/apps/storefront/public/aklabs/products/`.
- **Input:** the raw Store API export (coordinator provides it) and the copy overlay in `src/lib/i18n/product-copy.ts`.
- **Output:**
  - `src/data/catalog.json` (schema v1): products, variants, option values in English and Spanish, prices in USD and EUR including sale prices, categories, and English and Spanish copy.
  - AVIF and WebP images at 400 and 800 px, generated with the already installed `sharp`.
  - A `catalog:build` script.
- **Accessibility:** written alt text in English and Spanish for every product image, describing type, color and print.
- **Done when:**
  - The output is deterministic.
  - Every product has an image and alt text.
  - 400 px images are 40 KB or less.
  - A schema check passes.

### WP2. Static shell, routing and i18n (batch A)
- **Owns:**
  - `next.config.js` and the route tree under `src/app/**`.
  - `src/modules/layout/**` and `src/lib/i18n/**`.
  - The removal of `src/middleware.ts` and of server-only data functions.
- **Output:**
  - A static export with `/en` and `/es` routes, product and category pages generated from `catalog.json`, and the root redirect decided in the browser.
  - Language links, a currency switch (USD and EUR) kept in local storage, and the navigation and footer with the profile links.
- **Accessibility:** skip link, landmarks, one `h1` per page, `lang` per route, focus styles, and keyboard-operable menus.
- **Done when:**
  - The export build passes in CI.
  - No server-only APIs remain.
  - The home, category and product pages meet the size budget.

### WP3. Commerce simulation (batch B)
- **Owns:** `src/lib/sim/**` and the cart, checkout, order and tracking modules and routes.
- **Output:**
  - A cart in local storage and promotion codes from `catalog.json`.
  - A simulated checkout with no card inputs and a demo address button.
  - Local order records.
  - A courier position computed from time, and a tracking page with a text timeline and an SVG route.
- **Accessibility:**
  - Live regions announce cart and courier updates.
  - Forms have labels, errors tied to fields and `autocomplete`.
  - Removing an item can be undone.
  - The timeline is the text equivalent of the map.
- **Done when:**
  - The full flow works offline after the first load.
  - The flow is usable with a keyboard and with a screen reader.
  - No real payment data is ever requested.

### WP4. Portfolio pages, honesty layers and responsive pass (batch B)
- **Owns:**
  - `src/modules/showcase/**`.
  - The About, How it works and "What is real?" routes.
  - `src/styles/**` and `tailwind.config.js`.
- **Output:**
  - About, built from `src/lib/profile.ts` and `SITE`.
  - How it works: architecture, security and the pitch for businesses.
  - "What is real?", whose answer is that only donations are real.
  - A small SIMULATION chip.
  - A responsive and zoom pass over every page.
- **Accessibility:** contrast checks on the brand palette, 400% reflow, and reduced motion.
- **Done when:** there is no horizontal overflow at 360, 768, 1280 and 2560 px or at 400% zoom, and contrast is AA.
- **Salvage:** review the listing, pagination, sorting and sale-badge work on `wip/batch1-partial` and reuse what passes.

### WP5. Delivery and quality gates (coordinator)
- **Owns:** `.github/workflows/**` and `firebase.json`.
- **Output:**
  - Deploy of `main` to aklabs-store.web.app and a preview channel for each pull request (needs D2).
  - A size budget check and axe checks on key pages in CI.
  - A Content Security Policy in report-only mode.
- **Done when:** the pull request previews and the production deploy work, and the gates fail on regressions.

## Later versions (packages drafted after their decisions)

| Version | Packages | Waiting for |
|---|---|---|
| v0.4 | Auth (anonymous plus Google), Firestore orders with rules tests, App Check, Remote Config, PWA | D3 |
| v0.5 | "Built by AKLabs" page, donations page, accessibility statement, admin tour | D5 |
| v0.6 | Seasonal calendar and event pages, courier finale, receipt, checkout play, badges | — |
| v0.7 | AI Logic features, Genkit drafts in CI, more languages | D6 |
| v0.8 | Delivery e-mail from a scheduled workflow | D4 |
| v0.9 | Brand book | D7 |

## Brief template

```
You are <package> of AKLabs Store. Work autonomously until done or blocked, then report.

Context: <two or three lines>. Read docs/ROADMAP.md (principles, accessibility
requirements) and docs/WORKPLAN.md (rules, quality gates, your package) first.

Machine rules: code only; no installs, servers, Docker, builds or git changes;
one type-check at the end with NODE_OPTIONS=--max-old-space-size=2048;
never read .env or private/.

You own: <paths>. Anything else goes in your report.

Tasks: <numbered list>.

Acceptance: <function>, <accessibility>, <size budget>, <security>.

Report: files changed per task, how each criterion was verified, open issues,
requests for other packages.
```
