import { ShopCategory } from "@lib/data/categories"
import { Locale } from "@lib/i18n/locales"
import { resolveCategoryCopy } from "@lib/i18n/product-copy"
import type { CategoryChip } from "."

/** Shop categories as localized filter chips. */
export function toCategoryChips(
  categories: ShopCategory[],
  locale: Locale
): CategoryChip[] {
  return categories.map(({ category, count }) => ({
    id: category.id,
    name: resolveCategoryCopy(category, locale).name,
    handle: category.handle,
    count,
  }))
}
