"use client"
import { discountPercent, money, type Prices } from "@lib/catalog"
import type { Locale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
import { usePreferences } from "@lib/sim/preferences"
export function Price({
  prices,
  salePrices,
  locale,
}: {
  prices: Prices
  salePrices: Prices | null
  locale: Locale
}) {
  const { currency } = usePreferences()
  const discount = discountPercent(prices, salePrices, currency)
  return (
    <span className="price">
      {discount > 0 && (
        <>
          <span className="sale-label">
            {siteCopy(locale).sale} −{discount}%
          </span>{" "}
          <del>{money(prices[currency], currency, locale)}</del>{" "}
        </>
      )}
      {money((discount ? salePrices! : prices)[currency], currency, locale)}
    </span>
  )
}
