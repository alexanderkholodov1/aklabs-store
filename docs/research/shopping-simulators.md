# Shopping simulators: lessons for AKLabs Store

Researched 2026-09-30 through text-only fetches. `[n]` means observed at source n (section 6); (I) marks an inference. DopamineCart is a JavaScript app, so only its static shell was readable: its catalogue, animations and sounds are not verified here.

## 1. Summary

Both sites belong to the "dopamine site" trend: fake shopping, real feelings, zero cost. The trend started with a Korean site in spring 2026 [12], and English coverage has run since mid-June [16]. The shared recipe: a faithful imitation of a familiar app, a flow that runs entirely in the browser, no real payment, and one memorable payoff scene. FoodNeverComes adds jokes, a voiced courier call, real recipes and a studio footer [3,14]. DopamineCart (launched on Product Hunt on 9 June, now at v2.0) is an Amazon-shaped single-page app with a virtual starting balance and a live markets tab [1,2]. Both keep the loop local, with no server calls after the first load (I).

## 2. Comparison

| | DopamineCart (dopaminecart.com) | FoodNeverComes (foodnevercomes.com) |
|---|---|---|
| Concept and tone | Amazon-style "retail therapy simulator" for any product; playful, emoji-rich [1] | Delivery-app parody with self-aware humour, aimed at people curbing takeout [3,11] |
| Loop and aftermath | Splash, profile dialog (name, address, starting balance), departments, search, wishlist, cart, unboxing overlay, orders, markets tab [1]; later steps not observed | Kitchens, timed deals, a five-question quiz, customisation, a shareable tray, one-tap pay, an animal courier on a live map with a countdown, a full-screen call admitting no food is coming, history, a streak cat, badges, a real recipe [3,4]. A sister site adds a boarding pass, a savings receipt and sharing [10] |
| Why it feels fast | Served from a CDN edge over HTTP/3 [9]; hash routing and emoji icons instead of image assets [1]; apparently one self-contained file (I) | CDN in front of static hosting [9]; about 57 KB of HTML and 14 cached JPEGs of 28 to 110 KB in a June scan [8]; deals seeded by the clock, so no server is needed (I) [3] |
| Delight | Live markets tab, virtual balance, wishlist [1] | Voiced call with an off switch, delivery ping, countdowns, streaks, badges, cuisine votes [3,4] |
| "Not real" and payment | "Simulator" in the title, virtual-funds wording; payment step not observed [1] | Tagline, FAQ, footer, imaginary prices, a non-affiliation list, a prefilled fake card, no accounts [3] |
| Money | None seen [1] | Ads, affiliate links, sponsored dishes and a Ko-fi link [5,6,8] |
| Mobile and accessibility | Five-tab bottom navigation [1]; no accessibility information found | Installable PWA [3,7]; no accessibility statement found |

## 3. Lessons

- Speed is architecture: one static document at the edge, local state, tiny assets, no third-party code. Third-party ad and analytics scripts can easily outweigh a site's own code [8].
- The payoff scene is the product. Press retells the courier call [14]; the aftermath (history, streaks, recipes, receipts) is what brings people back (I).
- Testers asked for more ritual, not less: artificial waits, a tip decision, coupons, loyalty [11].
- Safari clears site storage after 7 days without a visit unless the site is installed [7,24], so history kept only in the browser is fragile.
- Experts warn that these sites can reinforce compulsive habits [17,25]. Design for delight, not for compulsion.
- Good models of honesty: a simulation-only banner [18]; a receipt of what you did not spend, invented product names and clearly labelled ads [19].

## 4. Ideas for AKLabs Store

Ranked. I/E = impact (H/M/L) and effort (S/M/L).

| # | Idea | I/E | Stack mapping |
|---|---|---|---|
| 1 | **Performance and transfer budget:** about 150 KB of JavaScript and 300 KB for a first view, SVG or AVIF art, no third-party scripts, and the Firebase SDK loaded only at checkout or sign-in. Spark Hosting includes 10 GB of transfer a month; after a short grace period the site is disabled until the next month [22]. At 1.5 MB per first view that is about 7K visits; at 300 KB, about 33K. With a custom domain, a free CDN proxy in front could cache assets and protect the quota (to be tested). | H/S | `output: 'export'`, AVIF generated at build time, cache headers in `firebase.json` [23], Lighthouse CI |
| 2 | **Honesty in layers:** a SIMULATION chip, a checkout note, a receipt footer, and a "What is real?" page (answer: only /donate), with invented merch and credit to the trend's Korean origin | H/S | Static pages, i18n |
| 3 | **Donations as a distinct real-money zone:** a hosted link (PayPal Donate, PayPal.Me or Ko-fi), no card fields, no trackers, one honest sentence | H/S | Static page |
| 4 | **"Built by AKLabs" proof page:** architecture, a rules excerpt, scores, the repository, a mock merchant view, and a contact call to action | H/S | Static page |
| 5 | **Security on display:** HSTS, nosniff, frame-ancestors, and a strict CSP through script hashes. Few sites in this genre send these headers [9] | H/M | Headers in `firebase.json`, a post-build hashing step |
| 6 | **Courier derived from time:** position = f(now - placedAt), an SVG route (no map tiles or API keys), "it arrived while you were away", a choice of pace | H/M | Client state, `/track/?id=` |
| 7 | **Signature finale:** a full-screen courier call, text first, optional speech synthesis, captions, an off switch | H/M | Client component |
| 8 | **Receipt:** "$0.00 charged, you kept $X", shareable as an image via Canvas and Web Share | H/M | Client; Firestore when signed in |
| 9 | **Seasonal events from date windows:** a dismissible entry point, themed static routes, a `?event=` preview, deals rotating by time window | H/M | Static routes plus a daily rebuild; no server |
| 10 | **Local-first orders:** optional sign-in syncs them to `users/{uid}/orders`. Rules allow only the owner, check schema and size, and cap orders per user, with App Check. One write per order (the free tier allows 20K writes a day [22]); cap the history size instead of using TTL, which is not free [22] | H/M | Auth, Firestore, IndexedDB |
| 11 | **Checkout friction as play:** a tip slider, easter-egg coupons, a read-only prefilled "play card" with no inputs | M/S | Client |
| 12 | **Installable app (PWA)** with a gentle install nudge that also protects the history [7] | M/M | `public/sw.js`, manifest |
| 13 | **Shareable cart in the URL hash**, exploration badges, a vote for the next event | M/M | Client; one counter document |

## 5. Avoid

- Real brands, logos or trade dress: invented products only.
- Ads, pop-ups and third-party scripts.
- Any real card input, even one that looks fake.
- Loot boxes, VIP tiers, cashback, streak-loss guilt and unlabelled false urgency.
- Therapeutic claims, and real names or addresses stored in Firestore.
- Presenting the idea as original: credit the inspiration.
- Site-wide seasonal takeovers, autoplay audio, and a database write per click.

## 6. Sources

1. https://dopaminecart.com/ (plus probes of /robots.txt, /sitemap.xml, /manifest.json, /sw.js, /about, /privacy)
2. https://www.producthunt.com/products/dopaminecart-v1-0 and https://innolope.com/pulse/startups/6a280dccaa5682d9491df0a2 (launch date)
3. https://foodnevercomes.com/
4. https://foodnevercomes.com/blog/ and /blog/what-is-foodnevercomes.html
5. https://foodnevercomes.com/privacy
6. https://foodnevercomes.com/sponsors and /terms
7. https://foodnevercomes.com/blog/install-foodnevercomes-app.html and /blog/foodnevercome-vs-foodnevercomes.html
8. https://urlscan.io/result/019f12ce-3708-768a-829f-99d30340dfd8/ (scan of 2026-06-29)
9. https://api.hackertarget.com/httpheaders/?q=https://dopaminecart.com/ and ?q=https://foodnevercomes.com/ (headers, 2026-09-30)
10. https://tripneverleaves.com/
11. https://news.ycombinator.com/item?id=48959355
12. https://news.ycombinator.com/item?id=49437187
13. https://www.cbc.ca/radio/thecurrent/fake-shopping-website-app-dopamine-9.7313588 (search snippet only)
14. https://www.businesstoday.in/technology/news/story/26-year-old-developers-from-udaipur-created-foodnevercomes-shop-without-spending-money-558245-2026-09-28
15. https://www.gizbot.com/features/dopamine-sites-fake-food-delivery-foodnevercomes-128777.html
16. https://businessmodelanalyst.com/dopamine-sites-fake-stores-business-model/
17. https://theconversation.com/why-people-are-ordering-fake-food-and-fashion-deliveries-on-free-dopamine-apps-287690
18. https://www.dopaminekart.com/cartnever/
19. https://dopamine-shop.com/about/
20. https://github.com/ahmedps520-svg/DopaCart (a separate project)
21. https://apps.apple.com/us/app/dopamine-cart-fake-shopping/id6792004581 (a same-named app; relation unverified)
22. https://firebase.google.com/docs/hosting/usage-quotas-pricing and https://firebase.google.com/docs/firestore/quotas
23. https://nextjs.org/docs/app/guides/static-exports
24. https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
25. https://www.yahoo.com/lifestyle/articles/tried-fake-shopping-sites-people-183816916.html
