import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from "../locales"
import * as cart from "./cart"
import * as home from "./home"
import * as layout from "./layout"
import * as product from "./product"

export type { Locale }
export { DEFAULT_LOCALE, SUPPORTED_LOCALES }

/**
 * Dictionaries are split by namespace (one file each, exporting `en` and `es`).
 * To add a namespace: create `./<name>.ts` and spread it in both objects below.
 * To add a language: add the code to `../locales.ts` and one export per file.
 */
const en = {
  ...layout.en,
  ...home.en,
  ...product.en,
  ...cart.en,
}

const es: typeof en = {
  ...layout.es,
  ...home.es,
  ...product.es,
  ...cart.es,
}

export const messages: Record<Locale, typeof en> = { en, es }

export type Messages = typeof en
