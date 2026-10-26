export type CatalogLocale = "en" | "es"
export type CatalogCurrency = "USD" | "EUR"
export type LocalizedText = Record<CatalogLocale, string>
export type CatalogPrices = Record<CatalogCurrency, number>

export type CatalogImage = {
  id: string
  source: string
  width: number
  height: number
  alt: LocalizedText
  avif: Record<"400" | "800", string>
  webp: Record<"400" | "800", string>
}

export type CatalogOption = {
  id: string
  name: LocalizedText
  values: { id: string; label: LocalizedText }[]
}

export type CatalogVariant = {
  id: string
  sku: string
  options: Record<string, string>
  prices: CatalogPrices
  salePrices: CatalogPrices | null
}

export type CatalogProduct = {
  id: string
  handle: string
  categoryId: string
  copy: Record<
    CatalogLocale,
    { title: string; subtitle: string; description: string }
  >
  material: LocalizedText
  weight: number
  prices: CatalogPrices
  salePrices: CatalogPrices | null
  images: CatalogImage[]
  options: CatalogOption[]
  variants: CatalogVariant[]
}

export type CatalogCategory = {
  id: string
  handle: string
  name: LocalizedText
}

export type CatalogPromotion = {
  code: string
  type: "percentage"
  value: number
  label: LocalizedText
}

export type Catalog = {
  schemaVersion: 1
  locales: CatalogLocale[]
  currencies: CatalogCurrency[]
  provenance: {
    sources: { path: string; sha256: string }[]
    pricing: string
    promotions: string
    localization: string
  }
  categories: CatalogCategory[]
  products: CatalogProduct[]
  promotions: CatalogPromotion[]
}
