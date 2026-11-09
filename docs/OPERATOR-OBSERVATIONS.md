# Owner observations (AKLabs Store)

Living inventory of what the owner said about this store: design, content, products,
accounts and tone. Updated by the coordinator with each hito. Columns: his words (verbatim
where possible), whether it is built, evidence, and what remains.

**Totals (2026-11-09, branch `v0.3.1` at `0.3.1.4`):**

| | Count |
|---|---:|
| Built before this hito (v0.3.0 on production) | 14 |
| Built in v0.3.1 (this pull request) | 8 |
| Documented; decision or session still needed | 9 |
| Planned for later versions (roadmap) | 6 |
| **Rows** | **37** |

---

## Table

| # | His words (verbatim) | Source | Built | Evidence | What is left |
|---|----------------------|--------|:-----:|----------|--------------|
| 1 | «dale un diseño moderno, tal vez con gradientes y liquid glass, usa colores de las imagenes (celeste, rojo), que representan mi "merch" propio y la pagina debe ser con eso en mente.» | `~/caspian-kb/research/2026-11-02-review/REGISTER.md` (2026-09-28, supaday-ecommerce) | **Yes (v0.3.1)** | `0.3.1.3`: `store/apps/storefront/src/styles/brand.css`, aurora background, glass header, celeste/red/royal tokens | Tune in his design session if gradients or glass feel too strong or too weak |
| 2 | «Prepara el PPT, en la identidad del diseño de la pagina.» | same REGISTER (2026-09-28) | No | v0.2 merged a presentation track; no PPT tied to current static store | New deliverable if he still wants a deck aligned with the live storefront |
| 3 | «El "arranque" se refiere a que se debe poder desplegar localmente tambien, entonces considera estas instrucciones en el README.» | same REGISTER (2026-09-28) | **Yes** | Root `README.md` run section; `docs/STATIC-STOREFRONT.md` | Keep in sync when scripts change |
| 4 | Shopping simulator, not real purchases; donations are the only real money, stated clearly | REGISTER 2026-09-30; `docs/ROADMAP.md` | **Yes (v0.3.0)** | `/en/what-is-real`, `/es/what-is-real`, SIMULATION chip, checkout has no card fields | Donations page and copy for v0.5 (D5) |
| 5 | Three audiences: casual fun, technical depth, business pitch | REGISTER 2026-09-30 | **Yes (v0.3.0)** | Home and commerce sim; `/how-it-works`; honesty layer | v0.5 “Built by AKLabs” and contact path |
| 6 | Deploy at `aklabs-store.web.app`; repo `alexanderkholodov1/aklabs-store` | REGISTER 2026-09-30 | **Yes** | Production + Firebase project; CI deploy on `main` | Custom domain only with his word |
| 7 | CI/CD because it demonstrates the technology | REGISTER 2026-09-30 | **Yes** | `.github/workflows/ci.yml`: type-check, static build, Playwright checks, deploy | None for v0.3 scope |
| 8 | Optional accounts: usable without sign-in | REGISTER 2026-09-30 | **Yes (v0.3.0)** | No auth gate on storefront | v0.4 auth (D3) when he approves providers |
| 9 | English and Spanish for now; more languages later | REGISTER 2026-09-30 | **Yes (v0.3.0)** | `/en/*`, `/es/*`, i18n dictionaries | v0.7 languages |
| 10 | Genkit / AI Logic / more Firebase within free tier — evaluate and recommend | REGISTER 2026-09-30 | Partial | Listed in `docs/ROADMAP.md` v0.7 | Research brief; no implementation without decision |
| 11 | «quiero que despliegues algo presentable de aklabs-store … porque debo mandar un CV a una empresa de UI/UX (asi que hay que demostrar eso) … Encargate de subir algo a produccion … algo que ellos puedan probar» | `docs/WORKPLAN.md`; REGISTER 2026-10-26 | **Yes (v0.3.0)** | `https://aklabs-store.web.app` deployed 2026-10-28 | Portfolio polish beyond “presentable” (rows 17–20, 36) |
| 12 | «QUIEN TE DIO PERMISO ALTERAR EL LOGO SIN PREGUNTARME!?!!?» / drawn header mark | `~/caspian-kb/rules/sources/2026-10-28T1521Z-session-7a06e82b.md`; INCIDENTS 2026-10-28 | **Yes (v0.3.1)** | `0.3.1.1`: header uses `public/aklabs/brand/logo-circle.png`; About uses same asset in `0.3.1.3` | Merge PR #4 when he is satisfied with preview |
| 13 | «Esta muy inmadura la pagina, asi que tendremos que trabajar y hacer una sesion de diseno, pero para tener algo desplegado esta bien.» | `2026-10-28T1521Z-session-7a06e82b.md` | Partial | v0.3.0 live; v0.3.1 addresses documented repo preferences without replacing a session | Schedule design session; lock motion and layout choices |
| 14 | «Nada de animaciones, interacciones, realmente ALMA a este proyecto, nada de sensacion de satisfaccion, marcos chuecos y sin estilo, pagina desplazada por posicionamiento incorrecto» | `2026-10-28T1650Z-session-c8491d.md`; REGISTER | Partial (**v0.3.1**) | `0.3.1.3`: square product frames, brand motion with `prefers-reduced-motion`, glass and gradient system | Subjective “ALMA” and checkout delight largely v0.6; layout review on his devices in preview |
| 15 | Repo documents what he wants on the page; he does not see it built yet | `2026-10-28T1650Z-session-c8491d.md` | Partial (**v0.3.1**) | This file + `docs/ROADMAP.md` / `WORKPLAN.md`; design tokens restored in code | He reviews preview and corrects the table |
| 16 | Hold PR #4 merge until quality is portfolio-ready; Opus for visitor-facing design | `2026-10-28T1650Z-session-c8491d.md` | Process | PR #4 open; only he merges | His call after preview (question 1 in pending batch) |
| 17 | Implement requirements already documented in the repository | REGISTER 2026-10-28 | Partial | v0.3.0 WP1–WP5; v0.3.1 closes logo and design gaps from 2026-09-28 | v0.4+ per roadmap |
| 18 | Verify deployed store on phone and desktop and report | REGISTER 2026-10-27 | **Yes** | CI `check:site` viewports; captain screenshots under `.tmp/obs/shots/` | His own pass on preview URL |
| 19 | No red CI ever | `~/Workspaces/aklabs-inputs/AK-v0.3.0-build.md` | **Yes (v0.3.1)** | `0.3.1.2`: `runs-on: ubuntu-24.04` in `.github/workflows/ci.yml` (Playwright 1.58.2 lacks Ubuntu 26.04) | Green run on pushed `v0.3.1` after this commit |
| 20 | Working Firebase preview link on every PR review | `2026-11-09T1610Z-session-11a763bf.md`; PR #4 comment | **Yes (v0.3.1)** | Preview job after green `site` job; 2-day channel (same as `0.3.0.6`) | Full URL in OPERATOR-PENDING once CI finishes |
| 21 | «NO ME DISTE EL LINK!!!!!!!!!!!» (AKLabs, among others) | `2026-11-09T1542Z-session-11a763bf.md` | **Yes (this hito)** | Preview URL spelled out in `~/caspian-kb/agenda/OPERATOR-PENDING.json` item `aklabs-pr4-merge` and question batch below | Praetorium v0.2 centralizes links later |
| 22 | «no solo es "volver a poner mi logo", le di muchisimas otras observaciones y preferencias, no creo que los ha construido» | `2026-11-09T1542Z-session-11a763bf.md` | Partial (**v0.3.1**) | Logo + design system + frames + CI; this table lists the rest | Build only what his decisions already fix; rest is questions |
| 23 | Brand surfaces (logo, favicon, `brand/`) change only with his decision | INCIDENTS 2026-10-28; fleet hooks | **Yes (process)** | `owner-surfaces.sh` on push paths | None |
| 24 | He merges pull requests; coordinator does not merge for him | handoffs / REGISTER | **Yes (process)** | PR #4 waiting | Merge when ready |
| 25 | $0 hosting (Firebase Spark, public Actions) | `docs/ROADMAP.md` principle 1 | **Yes (v0.3.0)** | Static export, no Blaze functions in storefront | Hold on any Blaze feature |
| 26 | WCAG 2.2 AA, checked in CI | `docs/ROADMAP.md` | **Yes (v0.3.0)** | `check:site` axe gates | Re-run after design changes |
| 27 | Medusa stays local back-office; catalog export to static JSON | D1; `docs/STATIC-STOREFRONT.md` | **Yes** | `catalog:build`, `store/apps/backend` | None for v0.3 |
| 28 | PWA / installable app | `docs/WORKPLAN.md` v0.4 | No | Offline worker exists; no full manifest milestone | v0.4 package |
| 29 | Firebase Auth: anonymous + Google (and options) | `docs/ROADMAP.md` D3 | No | — | **Decision D3** |
| 30 | Donations: PayPal setup and amounts | `docs/ROADMAP.md` D5 | No | Honesty copy only | **Decision D5** |
| 31 | Seasonal events, courier finale, checkout play, badges | `docs/ROADMAP.md` v0.6 | No | Basic courier sim in v0.3.0 | v0.6 after design session |
| 32 | Brand book | `docs/ROADMAP.md` v0.9 D7 | No | Assets in `public/aklabs/brand/` | D7 |
| 33 | «Implement the AKLabs Store requirements already documented in its repository» (high) | REGISTER 2026-10-28 | Partial | See rows 1–11, 14, 27 | Roadmap versions v0.4–v0.9 |
| 34 | Accept current production as interim demo | REGISTER 2026-10-28 | **Yes** | Production unchanged until merge | Replace with v0.3.1 after merge |
| 35 | Advance aklabs-store in parallel when capacity allows | `2026-11-02T0535Z-session-c4fe386c.md` | In progress | This hito `v0.3.1` | Next hito after his merge call |
| 36 | Portfolio shelf: show e-commerce UI skill end to end | AK-next-proposal brief; REGISTER | Partial | Full sim + tech story; design still maturing per his 10-28 words | His design session + optional v0.6 delight |
| 37 | README: owner observations table lives in repo | Root `README.md` (2026-11-09) | **Yes (v0.3.1.4)** | This file | Keep updated each hito |

---

## How this hito maps to commits (`v0.3.1`)

| Internal | Commit | What it closes in the table |
|----------|--------|----------------------------|
| 0.3.1.1 | `4c931f2` | Rows 12, 23 |
| 0.3.1.2 | `85a8ff2` | Rows 19, 20 (CI prerequisite) |
| 0.3.1.3 | `4dbe305` | Rows 1, 14 (frames, motion, brand pages) |
| 0.3.1.4 | (this doc + README link) | Rows 15, 22, 37 |

**Pull request:** [#4](https://github.com/alexanderkholodov1/aklabs-store/pull/4) is the single hito PR for v0.3.1 (logo, CI runner pin, design system, observations table). Production stays on v0.3.0 until he merges.

**CI fix (cause):** GitHub `ubuntu-latest` became Ubuntu 26.04 after 2026-10-28; Playwright **1.58.2** cannot install Chromium there. Fix: pin **`ubuntu-24.04`** on every CI job (not a Playwright upgrade in this hito).
