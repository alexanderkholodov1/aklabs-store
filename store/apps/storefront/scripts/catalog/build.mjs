import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import ts from "typescript"
import sharp from "sharp"
import {
  categories,
  optionNames,
  optionValues,
  materials,
  imageAlt,
} from "./localization.mjs"
import { validateCatalog } from "./validate.mjs"

const storefront = fileURLToPath(new URL("../../", import.meta.url))
const repository = path.resolve(storefront, "../../..")
const seedPath = "store/apps/backend/src/scripts/seed-aklabs-products.ts"
const syncPath = "store/apps/backend/src/scripts/sync-aklabs-catalog.ts"
const copyPath = "store/apps/storefront/src/lib/i18n/product-copy.ts"
const sourcePaths = [seedPath, syncPath, copyPath]
const sourceText = await Promise.all(
  sourcePaths.map((source) => readFile(path.join(repository, source), "utf8"))
)
const digest = (value) => createHash("sha256").update(value).digest("hex")
const slug = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/** Parse only literal data. Backend imports, environment reads and workflow code never execute. */
function extractLiteral(source, variable, filename) {
  const file = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )
  const declarations = new Map()
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer)
        declarations.set(declaration.name.text, declaration.initializer)
    }
  }
  function literal(node) {
    assert(node, `Missing ${variable} in ${filename}`)
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
      return node.text
    if (ts.isNumericLiteral(node)) return Number(node.text)
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
    if (ts.isObjectLiteralExpression(node))
      return Object.fromEntries(
        node.properties.map((property) => {
          assert(
            ts.isPropertyAssignment(property),
            `Only literal properties allowed in ${filename}`
          )
          return [property.name.text, literal(property.initializer)]
        })
      )
    if (ts.isIdentifier(node)) {
      assert(
        node.text === "SIZES",
        `Unsupported reference ${node.text} in ${filename}`
      )
      return literal(declarations.get(node.text))
    }
    if (ts.isCallExpression(node)) {
      assert(
        ts.isIdentifier(node.expression) &&
          node.expression.text === "img" &&
          node.arguments.length === 1,
        `Unsupported call in ${filename}`
      )
      return `/aklabs/products/${literal(node.arguments[0])}`
    }
    throw new Error(
      `Unsupported expression ${ts.SyntaxKind[node.kind]} in ${filename}`
    )
  }
  return literal(declarations.get(variable))
}

const seeds = extractLiteral(sourceText[0], "AKLABS_PRODUCTS", seedPath)
const copy = extractLiteral(sourceText[2], "productCopy", copyPath)
// Sync intentionally delegates pricing to the seed. Fail when this contract changes.
assert.match(
  sourceText[1],
  /import\s*\{\s*AKLABS_PRODUCTS,\s*buildPrices\s*\}\s*from\s*["']\.\/seed-aklabs-products["']/
)
assert.match(sourceText[1], /prices:\s*buildPrices\(seed\)/)
assert(
  !/salePrices\s*:|sale_prices\s*:|discount_percentage\s*:/.test(
    sourceText[0] + sourceText[1]
  ),
  "Sale pricing was added to the source; update the static exporter before publishing"
)

const imageDirectory = path.join(storefront, "public/aklabs/products")
const cacheDirectory = path.join(repository, ".tmp/catalog")
await mkdir(cacheDirectory, { recursive: true })
await mkdir(path.join(storefront, "src/data"), { recursive: true })
let previousCache = {}
try {
  previousCache = JSON.parse(
    await readFile(path.join(cacheDirectory, "image-cache.json"), "utf8")
  )
} catch (error) {
  if (error.code !== "ENOENT") throw error
}
const imageCache = {}
const images = new Map()
const imageReport = []
sharp.concurrency(1)
sharp.cache({ memory: 16, files: 0, items: 32 })
for (const file of (await readdir(imageDirectory))
  .filter((file) => file.endsWith(".png"))
  .sort()) {
  const id = path.basename(file, ".png")
  assert(imageAlt[id], `${file}: written EN/ES alt text required`)
  const input = await readFile(path.join(imageDirectory, file))
  const metadata = await sharp(input).metadata()
  const image = {
    id,
    source: `/aklabs/products/${file}`,
    width: metadata.width,
    height: metadata.height,
    alt: imageAlt[id],
    avif: {},
    webp: {},
  }
  for (const width of [400, 800]) {
    for (const format of ["avif", "webp"]) {
      const outputName = `${id}-${width}.${format}`
      const outputPath = path.join(imageDirectory, outputName)
      const quality = format === "avif" ? 46 : 68
      const key = createHash("sha256")
        .update(input)
        .update(
          JSON.stringify({ width, format, quality, versions: sharp.versions })
        )
        .digest("hex")
      let encoded
      try {
        if (
          !process.argv.includes("--fresh") &&
          previousCache[outputName]?.key === key
        ) {
          const cached = await readFile(outputPath)
          if (digest(cached) === previousCache[outputName].sha256)
            encoded = cached
        }
      } catch (error) {
        if (error.code !== "ENOENT") throw error
      }
      if (!encoded) {
        for (
          let currentQuality = quality;
          currentQuality >= 24;
          currentQuality -= 6
        ) {
          const resize = sharp(input).rotate().resize({ width })
          encoded = await resize[format]({
            quality: currentQuality,
            effort: format === "avif" ? 4 : 4,
          }).toBuffer()
          if (width !== 400 || encoded.length <= 40_000) break
        }
        await writeFile(outputPath, encoded)
      }
      const bytes = encoded.length
      assert(
        width !== 400 || bytes <= 40_000,
        `${outputName}: ${bytes} exceeds 40 KB`
      )
      imageCache[outputName] = { key, bytes, sha256: digest(encoded) }
      image[format][width] = `/aklabs/products/${outputName}`
      imageReport.push({ file: outputName, bytes, sha256: digest(encoded) })
    }
  }
  images.set(image.source, image)
}
assert.equal(
  images.size,
  Object.keys(imageAlt).length,
  "Alt inventory must match the PNG source inventory"
)

const catalog = {
  schemaVersion: 1,
  locales: ["en", "es"],
  currencies: ["USD", "EUR"],
  provenance: {
    sources: sourcePaths.map((source, index) => ({
      path: source,
      sha256: digest(sourceText[index]),
    })),
    pricing:
      "Backend seed and sync declare major-unit base prices; catalog stores integer minor units (cents). Neither source declares product sales, so salePrices is null.",
    promotions:
      "AKLABS10 is a browser simulator policy: 10% off merchandise. It is not a Medusa promotion, has no cash value and never charges money.",
    localization:
      "Product copy is extracted from the EN/ES product-copy overlay. Category, option, material and written image-alt translations live in scripts/catalog/localization.mjs.",
  },
  categories: Object.values(categories).map((category) => ({
    id: category.handle,
    ...category,
  })),
  products: seeds.map((seed) => {
    const category = categories[seed.category]
    assert(category, `Untranslated category: ${seed.category}`)
    assert(materials[seed.material], `Untranslated material: ${seed.material}`)
    assert(
      copy[seed.handle]?.en && copy[seed.handle]?.es,
      `Missing product copy: ${seed.handle}`
    )
    const prices = Object.fromEntries(
      ["USD", "EUR"].map((currency) => [
        currency,
        Math.round(seed.prices[currency.toLowerCase()] * 100),
      ])
    )
    const options = seed.options.map((option) => {
      assert(optionNames[option.title], `Untranslated option: ${option.title}`)
      return {
        id: slug(option.title),
        name: optionNames[option.title],
        values: option.values.map((value) => {
          assert(optionValues[value], `Untranslated option value: ${value}`)
          return { id: slug(value), label: optionValues[value] }
        }),
      }
    })
    const combinations = options.reduce(
      (previous, option) =>
        previous.flatMap((combination) =>
          option.values.map((value) => ({
            ...combination,
            [option.id]: value.id,
          }))
        ),
      [{}]
    )
    return {
      id: seed.handle,
      handle: seed.handle,
      categoryId: category.handle,
      copy: copy[seed.handle],
      material: materials[seed.material],
      weight: seed.weight,
      prices,
      salePrices: null,
      images: seed.images.map((url) => {
        assert(images.has(url), `Missing source image: ${url}`)
        return images.get(url)
      }),
      options,
      variants: combinations.map((combination, index) => {
        const rawValues = seed.options.map(
          (option, optionIndex) =>
            option.values[
              options[optionIndex].values.findIndex(
                (value) => value.id === combination[options[optionIndex].id]
              )
            ]
        )
        const suffix = rawValues
          .join("-")
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "-")
          .replace(/[^A-Z0-9-]/g, "")
        return {
          id: `${seed.handle}-${index + 1}`,
          sku: `${seed.handle.toUpperCase().replace(/-/g, "")}-${suffix}`,
          options: combination,
          prices,
          salePrices: null,
        }
      }),
    }
  }),
  promotions: [
    {
      code: "AKLABS10",
      type: "percentage",
      value: 10,
      label: { en: "10% lab welcome", es: "10 % de bienvenida al lab" },
    },
  ],
}
const summary = validateCatalog(catalog)
const output = `${JSON.stringify(catalog, null, 2)}\n`
await writeFile(path.join(storefront, "src/data/catalog.json"), output)
await writeFile(
  path.join(cacheDirectory, "image-cache.json"),
  `${JSON.stringify(imageCache, null, 2)}\n`
)
await writeFile(
  path.join(cacheDirectory, "report.json"),
  `${JSON.stringify({ ...summary, sourceImages: summary.images, generatedImages: imageReport.length, catalogSha256: digest(output), images: imageReport, maximum400Bytes: Math.max(...imageReport.filter((image) => /-400\./.test(image.file)).map((image) => image.bytes)) }, null, 2)}\n`
)
console.log(
  `Catalog schema v1 validated: ${summary.products} products, ${summary.variants} variants, ${summary.categories} categories, ${summary.images} images. SHA-256 ${digest(output)}`
)
