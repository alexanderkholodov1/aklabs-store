# Static catalog pipeline

Run `pnpm catalog:build` in the storefront. The pipeline extracts only literals
from the backend seed and bilingual product overlay using the TypeScript parser.
It does not import backend modules, contact Medusa, read environment variables,
or execute source code. The sync script is checked to ensure it still delegates
variant pricing to the seed. Source SHA-256 hashes are recorded in the catalog.

Schema v1 is described by `src/data/catalog-types.ts` and checked, including
referential integrity and every option combination, by `validate.mjs`.
All money is integer cents in USD and EUR. Backend prices are major units, and
the seed assigns the same prices to every variant. Neither source declares sale
prices, so `salePrices` remains `null`. When source pricing changes, update the
exporter and validation together rather than adding prices in the UI.

`AKLABS10` is an explicit simulator promotion of 10% off merchandise, with no
cash value. It is not represented as a real back-office promotion. Its provenance
is recorded in `catalog.json`.

Every original PNG has written English and Spanish alt text in
`localization.mjs`. Materials, category labels, option names and option values
are also translated there. Missing translations fail the build.

Sharp generates AVIF and WebP at widths 400 and 800, preserving transparency.
Each 400 px output must be at most 40,000 bytes; the encoder reduces quality when
necessary and fails if the budget cannot be met. Images run sequentially, with
one Sharp worker and a small memory cache. Originals remain available as source
assets. Storefront `<picture>` elements should request the generated images.

The pipeline contains no timestamps. With the same source files, locked Sharp
version and platform it emits identical JSON and image bytes. `.tmp/catalog/`
at the repository root contains a disposable incremental image cache and a
size report. The cache key includes source bytes, dimensions, encoder settings
and Sharp dependency versions. Deleting the cache regenerates identical outputs.
Pass `--fresh` to force all encodes, for example `pnpm catalog:build --fresh`.
The report includes a SHA-256 for every output to compare independent runs, and
cached outputs are hash-checked before reuse.
