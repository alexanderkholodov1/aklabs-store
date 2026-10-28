# AKLabs Store static storefront

The public storefront is a browser shopping simulation. Next.js exports English
and Spanish HTML; Firebase Hosting serves `store/apps/storefront/out`. Medusa
remains in `store/apps/backend` as the local back-office. No storefront request
contacts Medusa, a payment provider, or a database.

## Build and preview

From `store/`:

```sh
corepack pnpm install --frozen-lockfile
pnpm --dir apps/storefront run build:site
pnpm --dir apps/storefront run start
```

The preview listens on `http://127.0.0.1:8000`. Building needs no environment
variables, server, or account. `build:site` validates and generates the catalog,
exports Next.js, then generates the offline worker. No deploy command runs.

## Catalog

`scripts/catalog/build.mjs` reads the backend seed and catalog-sync TypeScript
as syntax trees; it never executes backend imports or reads their environment.
It overlays `src/lib/i18n/product-copy.ts`, written image alternatives, and
category, material and option translations. Schema validation checks unique
identifiers, complete variant combinations, localized copy, prices and references.
The generated snapshot contains 30 products, 122 variants and 13 categories.

Prices are integer cents in the snapshot and in the simulator. The source scripts
currently declare no product sales, so `salePrices` is `null`; the UI supports
sale labels when a source sale is available. `AKLABS10` is an explicit simulator
policy in the catalog, giving 10% off merchandise without cash value.

Sharp generates AVIF and WebP at 400 and 800 px for all 34 originals. Every 400 px
asset must be at most 40,000 bytes. Source images stay in the repository. Build
reports and the incremental image cache live in `.tmp/catalog/`; a fresh run with
`node scripts/catalog/build.mjs --fresh` independently re-encodes every image.
There are no timestamps in the catalog, and repeated builds preserve its hash.

## Browser data and offline behavior

The cart, currency, appearance and up to 20 orders live in local storage. The
address draft lives in session storage. The checkout offers a fictional address
and requests no card, e-mail or telephone number. Nothing is submitted to a
server. Cart and order data are validated when read; unknown variants, malformed
quantities, invalid promotions and corrupt records recover safely. Item removal
has an undo action without an expiring timer. Order creation saves before clearing the cart.

The service worker caches only static, same-origin files. It downloads the offline
package in the background after rendering; the footer reports when this has
finished. The complete browse-to-delivery flow then works offline. The package is
additional background transfer, separate from the first-view page resource budget.
Images can use the cached 400 px rendition offline when an 800 px rendition has
not been downloaded. The worker never caches addresses, carts or order records.
New exports replace the versioned static cache.

Courier stages and SVG position are functions of the order time and selected
one- or two-minute delivery duration. Refreshing does not restart the journey.
The text timeline, live announcement, pause control and reduced-motion rules
provide alternatives to the map. No geolocation or real courier service is used.

## Quality checks

```sh
pnpm --dir apps/storefront exec tsc --noEmit -p .
pnpm --dir apps/backend exec tsc --noEmit -p .
pnpm --dir apps/storefront run lint
pnpm --dir apps/storefront run check:site
```

`check:site` starts its own static server and one headless Chromium instance. It
checks every exported route and internal link, English/Spanish page language and
heading structure, gzip JavaScript (150 KiB) and first-view page resources
(300 KiB), and serious/critical axe violations across the principal pages in phone
and laptop viewports. It also checks form error, delivery, review and dark states;
undo and promotions; persisted currency; keyboard menu closing; two localized
purchases; a fresh-context offline purchase and completed courier via the browser
clock; corrupt storage; 320, 360, 768, 1280 and 2560 px reflow; and enlarged text.
The 320 px viewport exercises the reflow width of a 1280 px desktop at 400% zoom.

`CAPTURE_SITE=1` saves screenshots under `.tmp/screenshots/`. Full measurements go
to `.tmp/site-report.json`. CI installs a compatible Chromium if none is cached;
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` may select an existing browser locally.
All browser temporary files use the worktree's `.tmp/t/` directory.

Automated checks support the WCAG 2.2 AA target; they do not constitute a complete
accessibility certification. NVDA, VoiceOver and TalkBack require separate device
checks. Firebase deployment remains a coordinator action after the final rehearsal.
