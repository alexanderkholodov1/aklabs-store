import { VariantPrice } from "types/global"

/**
 * A price is discounted when it comes from a "sale" price list or when the
 * calculated amount is below the original one (e.g. a promotion). Returns
 * the rounded percentage to show, or null when there is nothing to show.
 */
export function getDiscountPercent(price: VariantPrice | null | undefined) {
  if (!price) {
    return null
  }

  const cheaper = price.calculated_price_number < price.original_price_number
  if (price.price_type !== "sale" && !cheaper) {
    return null
  }

  const percent = Number.parseInt(price.percentage_diff, 10)
  return Number.isFinite(percent) && percent > 0 ? String(percent) : null
}
