# AKLabs Store roadmap

Living document: what is done, what is being worked on, what comes next, and
the decisions that belong to the owner. Updated with every version.

Last update: 2026-09-30 · Current version: **v0.2 (foundation)** · Next: **v0.3 (first public version)**

## Vision

AKLabs Store is a **shopping simulator**: the whole fun of online shopping
(browsing, filling a cart, checking out, watching the courier on a map, getting
the "delivery") without spending anything. Every product is fictional AKLabs
merch. The store is also a portfolio piece and a live sales demo.

| Visitor | What they should feel | What they get |
|---|---|---|
| Curious visitor (friends, followers) | Fun, fast, satisfying | Instant interactions, a delightful checkout, the courier map, seasonal surprises |
| Technical reviewer (recruiter, engineer) | "This is built properly" | Architecture, security controls, tests, CI/CD, performance, accessibility, "How is this built?" hints |
| Potential client (a business) | "I want this for my brand" | The full path from brand brainstorming to a happy customer, configurability, zero hosting cost, ownership of data and revenue, a clear way to get in touch |

## Principles

1. **$0 per month.** Free tiers only: Firebase Spark and GitHub Actions for public repositories. No Blaze, no card on file.
2. **Honest.** Products are fictional and nothing is charged. The donations page is the only place with real money, and it says so clearly without shouting.
3. **Brand first.** Seasonal events decorate; they never replace the AKLabs identity.
4. **Secure by default.** Deny-by-default rules, least privilege, no secrets in the browser, security headers, dependency hygiene.
5. **Fast and light.** Static-first pages and instant feedback; browsing never waits on a server. A first view stays under about 300 KB, because the free Hosting plan includes 10 GB of transfer a month and disables the site until the next month when it runs out.
6. **Accessible and responsive** at every screen size and zoom level.
7. **Own your stack.** Open-source building blocks, portable data, no lock-in.
8. **Small versions.** Each version ships on its own. Foundations first, details after.

## Target architecture ($0 per month)

```
Browser
  |  static pages + JavaScript (Next.js static export)
  v
Firebase Hosting ........ CDN, HTTPS, security headers, a preview URL per pull request
  |
  +-- Firebase Auth ...... anonymous by default, optional Google sign-in       (v0.4)
  +-- Firestore .......... orders, history, wishlists; deny-by-default rules   (v0.4)
  +-- Firebase AI Logic .. optional AI touches on the free Gemini tier         (v0.7)

GitHub Actions (free for public repositories)
  +-- CI ......... install, type-check, lint, tests, security rules tests
  +-- CD ......... deploy main to aklabs-store.web.app, previews for pull requests
  +-- Schedules .. daily rebuild (seasons, countdowns), delivery e-mails        (v0.8)

Medusa v2 (in this repository, runs locally)
  +-- back-office: products, prices, promotions -> exported as a static catalog
```

Why the change: on the free Spark plan Firebase only serves static files
(Cloud Functions, Cloud Run and App Hosting need Blaze). The storefront becomes
a static export, and the cart, checkout and courier run in the browser. Medusa
stays as the owner's back-office and as the reference for real client stores,
where paying for a server makes sense.

## Now

- v0.2 is ready for review in PR #2.
- Waiting for the owner's answers to the decisions below. D1 and D2 block v0.3.
- Research done: [`docs/research/shopping-simulators.md`](research/shopping-simulators.md). Key lessons: speed comes from architecture (static pages, local state, tiny assets, no third-party scripts); the payoff scene (the courier) is the product; honesty works best in layers; the free Hosting transfer quota makes a size budget mandatory.

## Versions

### v0.1: course delivery (done, PR #1)
- [x] Medusa v2 + Next.js storefront + Supabase Postgres
- [x] Regions: Ecuador (USD) and Europe (EUR), shipping, full checkout, orders in the database

### v0.2: foundation (this version, PR #2)
- [x] English-first i18n with typed dictionaries per namespace (English, Spanish)
- [x] "How is this built?" hint component
- [x] One copy of the React types: the storefront type-check went from 321 false errors to 0
- [x] Backend setup scripts type-check clean
- [x] Owner profile and contact links (LinkedIn, Instagram, GitHub) and bio in English and Spanish
- [x] Firebase config as code; Firestore locked down (the open test-mode rules were replaced)
- [x] CI: type-check on every push and pull request
- [x] Workspace lists its apps explicitly (local copies no longer leak into the lockfile)
- [x] Course presentation removed from the repository (kept outside it)
- [x] Catalog snapshot taken from Medusa (30 products, 13 categories, USD and EUR)
- [x] Shopping-simulator research (DopamineCart, FoodNeverComes)

### v0.3: first public version (next)
Goal: aklabs-store.web.app is live, fast, responsive, and carries the portfolio essentials.
- [ ] Catalog pipeline: Medusa export to `catalog.json` (products, variants, USD and EUR prices, sale prices, categories, English and Spanish copy)
- [ ] Size budget: about 150 KB of JavaScript and 300 KB per first view, checked in CI. Product images converted to AVIF and WebP at build time (today: 34 PNGs averaging 165 KB), no third-party scripts, Firebase SDK loaded only when needed
- [ ] Static export with `/en` and `/es` routes; product and category pages generated at build time
- [ ] Client-side cart with persistence, currency switch (USD, EUR) and promotion codes
- [ ] Simulated checkout that never asks for real payment data; confirmation page; order kept in the browser
- [ ] Courier simulation and tracking page (timeline and animated route)
- [ ] Responsive and zoom pass from 360 to 2560 px wide and at 150% zoom
- [ ] About page (profile, highlights, contact) and How it works page (architecture, security, for businesses)
- [ ] Honesty in layers: a small SIMULATION chip, a note at checkout, a receipt footer, and a "What is real?" page (answer: only the donations page); credit the Korean origin of the trend
- [ ] CD: deploy main to Firebase Hosting and a preview channel for each pull request
- [ ] Salvage the reviewed parts of `wip/batch1-partial` (listing, pagination, sorting, sale badges)

### v0.4: accounts and data
- [ ] Firebase Auth: an anonymous session by default; optional Google sign-in that keeps the history (account linking)
- [ ] Orders and history in Firestore with per-user rules, schema validation and emulator tests in CI
- [ ] App Check against abuse
- [ ] Remote Config flags (seasons, notices, experiments) without redeploying
- [ ] Account page: past orders, track again, wishlist
- [ ] Installable app (PWA): Safari clears browser storage after 7 days without a visit unless the site is installed, so this also protects the history

### v0.5: business layer
- [ ] "Built by AKLabs" page for businesses: from brand brainstorming to checkout, the architecture, a security rules excerpt, performance scores, a mock merchant view, how to get in touch
- [ ] Donations page ("a tea", "a ramen"): the only real money; a clear label, no giant banners
- [ ] Owner story: how products, prices and promotions are managed (Medusa admin tour)
- [ ] Contact paths per audience (LinkedIn in English, Instagram in Spanish)

### v0.6: delight
- [ ] Seasonal calendar computed every year (Carnival from Easter, Halloween, Day of the Dead, Black Friday, Christmas, New Year)
- [ ] A subtle seasonal chip in the header that opens a themed event page with its own discounts (like Steam sales); the rest of the store keeps the AKLabs look
- [ ] Countdowns that keep themselves up to date
- [ ] Micro-interactions: add-to-cart feedback, a checkout celebration, a "money not spent" counter
- [ ] Signature finale: a full-screen courier call when the order "arrives" (text first, optional voice, captions, an off switch)
- [ ] Shareable receipt ("$0.00 charged, you kept $X") as an image
- [ ] Checkout as play: a tip slider, easter-egg coupons, a read-only "play card" with no inputs
- [ ] Shareable cart link and exploration badges
- [ ] Light 3D and parallax touches within a performance budget
- [ ] Mini-games on event pages

### v0.7: AI and languages
- [ ] Firebase AI Logic on the free Gemini tier: shopping buddy, gift finder, "roast my cart"
- [ ] Genkit in CI for translation drafts and image alt text
- [ ] More languages (Russian first)

### v0.8: notifications
- [ ] Delivery e-mail with the ordered item and a business card, sent by a scheduled GitHub Action (verified e-mails only, one per order, daily cap)
- [ ] Browser notification when the courier arrives

### v0.9: brand book
- [ ] Brand identity deck: story, personality, logo system, palette with contrast checks, typography, iconography, moodboards, wireframes, UI kit
- [ ] Figma file with design tokens
- [ ] Case study page on the site

### v1.0: launch
- [ ] README, ARCHITECTURE.md and SECURITY.md (threat model) in English
- [ ] Lighthouse budgets in CI, accessibility audit, Content Security Policy, security review
- [ ] Launch assets: LinkedIn post, screenshots, short video

## Decisions needed from the owner

**D1. Architecture (blocks v0.3).** Static simulator on Firebase Spark plus GitHub Actions, with Medusa as the local back-office (diagram above).
- Alternative: keep Medusa running live on a free external host (Render, Koyeb). Free instances sleep after about 15 minutes idle, take a minute or more to wake up, and 512 MB of RAM is tight for Medusa. The store would feel slow and break often.
- Alternative: paid hosting. Ruled out.
- Recommendation: go static. Needed: your OK.

**D2. Deploy credentials for CI/CD (blocks the first deploy).**
- Option A (recommended): in the repository folder run `firebase login` and then `firebase init hosting:github`. It creates a deploy-only service account and stores it as a GitHub secret.
- Option B: reuse the admin key from `private/`. Not recommended: it has broad permissions and would live in GitHub.

**D3. Sign-in providers (v0.4).** Anonymous (automatic, invisible) plus Google. Optional: GitHub, which suits the technical audience. Needed: turn on Google in the Firebase console (one click). Anonymous can be enabled from here.

**D4. Delivery e-mail sender (v0.8).**
- A) Your professional Gmail with an app password, sent from GitHub Actions: free, about 500 e-mails a day, and replies reach you directly (a business-card effect).
- B) A free developer subdomain (for example is-a.dev, if it allows the mail DNS records) with Resend's free tier.
- C) Your own domain (about $10 to $15 a year, for example at Cloudflare's at-cost registrar) with Resend and free e-mail forwarding. A domain is rented yearly from a registrar; its DNS records (SPF, DKIM) prove that mail sent from it is really yours.
- Recommendation: A now, C when you want a professional brand domain.

**D5. Donations (v0.5).** A PayPal Donate button (hosted by PayPal, so no code here touches money) and/or a Ko-fi or PayPal.Me link. Needed: your PayPal.Me handle or Donate button ID, and the amounts ("a tea", "a ramen").

**D6. AI features (v0.7).** Which ideas to build. Needed later: enable Firebase AI Logic with the Gemini Developer API in the console.

**D7. Brand book format (v0.9).** PowerPoint (like the course deck), a Figma file, or a `/brand` page on the site. Recommendation: Figma as the source, plus a case-study page and a PDF export. Needed: authorize the Figma connector if we use it.

**D8. Analytics.** None, Firebase Performance Monitoring only (no personal data), or Google Analytics with a consent banner. Recommendation: Performance Monitoring only for now.

**D9. Own domain (optional, any time).** About $10 to $15 a year. It gives a professional address instead of `web.app`, allows branded e-mail (D4), and with a free CDN proxy in front it can cache the site and protect the 10 GB monthly transfer quota. Not needed for v0.3.

## Decided

- 2026-09-30: free tiers only; no Blaze plan.
- 2026-09-30: host on aklabs-store.web.app with CI/CD; the repository is now `aklabs-store`.
- 2026-09-30: accounts are optional; everything works without signing in.
- 2026-09-30: English and Spanish for now; more languages later.
- 2026-09-30: seasonal events stay subtle and open themed pages; the AKLabs identity stays.
- 2026-09-30: the course presentation leaves the repository; PR #2 now carries the portfolio foundation.
- 2026-09-30: the donations page is the only place with real money.

## Owner actions

- [ ] Laptop health: Kingston SSD Manager (health, temperature, firmware update), then `chkdsk C: /scan` and `sfc /scannow` in an administrator terminal.
- [ ] D2: `firebase login` and `firebase init hosting:github` (guided when we get there).
- [ ] Review and merge PR #2.
- [ ] Keep other AI editors (Cursor) off this repository while a version is in progress.

## Parking lot (ideas not scheduled yet)

- Lifetime "money not spent" counter and a shareable receipt card
- Achievements (first order, window shopper, night owl)
- Mini-game leaderboards (Firestore)
- Live "someone just ordered" feed, simulated and anonymous
- Optional sound design, off by default
- Installable app (PWA) with an offline catalog
- Owner dashboard on Firebase (orders and logistics)
- Move the back-office catalog from Supabase to a local database once the laptop is healthy
