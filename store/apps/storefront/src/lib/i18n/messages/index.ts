import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from "../locales"
import * as account from "./account"
import * as cart from "./cart"
import * as checkout from "./checkout"
import * as common from "./common"
import * as home from "./home"
import * as layout from "./layout"
import * as order from "./order"
import * as product from "./product"
import * as showcase from "./showcase"
import * as store from "./store"
import * as tracking from "./tracking"

export type { Locale }
export { DEFAULT_LOCALE, SUPPORTED_LOCALES }

/**
 * Dictionaries are split by namespace (one file each, exporting `en` and `es`).
 * To add a namespace: create `./<name>.ts` and spread it in both objects below.
 * To add a language: add the code to `../locales.ts` and one export per file.
 */
const en = {
  ...common.en,
  ...layout.en,
  ...home.en,
  ...store.en,
  ...product.en,
  ...cart.en,
  ...checkout.en,
  ...account.en,
  ...order.en,
  ...tracking.en,
  ...showcase.en,
}

const es: typeof en = {
  ...common.es,
  ...layout.es,
  ...home.es,
  ...store.es,
  ...product.es,
  ...cart.es,
  ...checkout.es,
  ...account.es,
  ...order.es,
  ...tracking.es,
  ...showcase.es,
}

export const messages: Record<Locale, typeof en> = { en, es }

export type Messages = typeof en
