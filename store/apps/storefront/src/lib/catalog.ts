import snapshot from "../data/catalog.json"
import type { Locale } from "./i18n/locales"
import type {
  Catalog,
  CatalogCurrency,
  CatalogPrices,
  CatalogImage as Image,
  CatalogProduct,
  CatalogCategory,
} from "../data/catalog-types"
export type Currency = CatalogCurrency
export type Prices = CatalogPrices
export type CatalogImage = Image
export type Product = CatalogProduct
export type Category = CatalogCategory
export const catalog = snapshot as Catalog
export const productFor = (handle: string) =>
  catalog.products.find((p) => p.handle === handle)
export const money = (amount: number, currency: Currency, locale: Locale) =>
  new Intl.NumberFormat(locale === "es" ? "es-EC" : "en-US", {
    style: "currency",
    currency,
  }).format(amount / 100)
export function discountPercent(
  prices: Prices,
  sale: Prices | null,
  currency: Currency
) {
  return sale && sale[currency] < prices[currency]
    ? Math.round((1 - sale[currency] / prices[currency]) * 100)
    : 0
}
