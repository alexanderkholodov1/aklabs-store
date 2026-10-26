import assert from "node:assert/strict"

const nonempty = (value, label) =>
  assert(
    typeof value === "string" && value.trim().length > 0,
    `${label}: expected text`
  )
const localized = (value, label) => {
  assert(value && typeof value === "object", `${label}: expected EN/ES text`)
  for (const locale of ["en", "es"])
    nonempty(value[locale], `${label}.${locale}`)
}
const unique = (values, label) =>
  assert.equal(
    new Set(values).size,
    values.length,
    `${label}: duplicate identifier`
  )
const price = (value, label) => {
  assert(
    value && Object.keys(value).length === 2,
    `${label}: exactly USD and EUR are required`
  )
  for (const currency of ["USD", "EUR"])
    assert(
      Number.isSafeInteger(value[currency]) && value[currency] > 0,
      `${label}.${currency}: expected positive integer cents`
    )
}

/** Schema v1 validation includes referential integrity, complete option products and pricing. */
export function validateCatalog(catalog) {
  assert.equal(catalog.schemaVersion, 1)
  assert.deepEqual(catalog.locales, ["en", "es"])
  assert.deepEqual(catalog.currencies, ["USD", "EUR"])
  assert(catalog.products.length > 0 && catalog.categories.length > 0)
  unique(
    catalog.categories.map((category) => category.id),
    "categories"
  )
  unique(
    catalog.categories.map((category) => category.handle),
    "category handles"
  )
  unique(
    catalog.products.map((product) => product.id),
    "products"
  )
  unique(
    catalog.products.map((product) => product.handle),
    "product handles"
  )
  const categoryIds = new Set(catalog.categories.map((category) => category.id))
  for (const category of catalog.categories)
    localized(category.name, category.id)
  const imageIds = new Set()
  for (const product of catalog.products) {
    assert(
      categoryIds.has(product.categoryId),
      `${product.handle}: unknown category`
    )
    for (const locale of catalog.locales) {
      for (const field of ["title", "subtitle", "description"])
        nonempty(
          product.copy[locale][field],
          `${product.handle}.${locale}.${field}`
        )
    }
    localized(product.material, `${product.handle}.material`)
    price(product.prices, `${product.handle}.prices`)
    if (product.salePrices !== null) {
      price(product.salePrices, `${product.handle}.salePrices`)
      for (const currency of catalog.currencies)
        assert(
          product.salePrices[currency] < product.prices[currency],
          "Sale must be below original price"
        )
    }
    assert(product.images.length > 0, `${product.handle}: missing images`)
    for (const image of product.images) {
      localized(image.alt, `${image.id}.alt`)
      assert(
        image.width > 0 && image.height > 0,
        `${image.id}: dimensions required`
      )
      for (const format of ["avif", "webp"]) {
        for (const width of [400, 800])
          assert(
            image[format][width].startsWith("/aklabs/products/") &&
              image[format][width].endsWith(`-${width}.${format}`),
            `${image.id}: invalid image path`
          )
      }
      imageIds.add(image.id)
    }
    assert(product.options.length > 0, `${product.handle}: missing options`)
    unique(
      product.options.map((option) => option.id),
      `${product.handle}.options`
    )
    for (const option of product.options) {
      localized(option.name, `${product.handle}.${option.id}`)
      assert(option.values.length > 0, "Option must have values")
      unique(
        option.values.map((value) => value.id),
        `${product.handle}.${option.id}.values`
      )
      for (const value of option.values)
        localized(value.label, `${product.handle}.${option.id}.${value.id}`)
    }
    assert.equal(
      product.variants.length,
      product.options.reduce(
        (count, option) => count * option.values.length,
        1
      ),
      `${product.handle}: incomplete variants`
    )
    unique(
      product.variants.map((variant) => variant.id),
      `${product.handle}.variants`
    )
    unique(
      product.variants.map((variant) => variant.sku),
      `${product.handle}.skus`
    )
    unique(
      product.variants.map((variant) => JSON.stringify(variant.options)),
      `${product.handle}.combinations`
    )
    for (const variant of product.variants) {
      assert.equal(
        Object.keys(variant.options).length,
        product.options.length,
        "Variant must select every option"
      )
      for (const option of product.options)
        assert(
          option.values.some(
            (value) => value.id === variant.options[option.id]
          ),
          `${variant.id}: invalid ${option.id}`
        )
      price(variant.prices, `${variant.id}.prices`)
      assert.deepEqual(
        variant.prices,
        product.prices,
        `${variant.id}: source uses identical base prices for all variants`
      )
      assert.deepEqual(variant.salePrices, product.salePrices)
    }
  }
  unique(
    catalog.promotions.map((promotion) => promotion.code),
    "promotions"
  )
  for (const promotion of catalog.promotions) {
    assert(/^[A-Z0-9]{3,20}$/.test(promotion.code), "Invalid promotion code")
    assert.equal(promotion.type, "percentage")
    assert(
      Number.isInteger(promotion.value) &&
        promotion.value > 0 &&
        promotion.value <= 100
    )
    localized(promotion.label, `promotion.${promotion.code}`)
  }
  return {
    products: catalog.products.length,
    variants: catalog.products.reduce(
      (count, product) => count + product.variants.length,
      0
    ),
    categories: catalog.categories.length,
    images: imageIds.size,
  }
}
