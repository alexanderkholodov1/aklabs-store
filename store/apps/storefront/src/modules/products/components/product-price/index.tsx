import { clx } from "@modules/common/components/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block h-12 w-40 rounded-2xl bg-ak-ink/5 animate-pulse" />
  }

  return (
    <div className="flex flex-col text-ak-ink">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-ak-ink/45">
        {variant ? "Precio" : "Desde"}
      </span>
      <div className="flex items-baseline gap-3">
        <span
          className={clx("text-4xl font-bold tracking-tight", {
            "text-ak-red": selectedPrice.price_type === "sale",
          })}
        >
          <span
            data-testid="product-price"
            data-value={selectedPrice.calculated_price_number}
          >
            {selectedPrice.calculated_price}
          </span>
        </span>
        <span className="text-xs text-ak-ink/45">
          {selectedPrice.currency_code?.toUpperCase()}
        </span>
      </div>
      {selectedPrice.price_type === "sale" && (
        <p className="flex items-center gap-2 text-sm">
          <span className="text-ak-ink/55">Antes:</span>
          <span
            className="line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
          <span className="chip bg-ak-red/10 text-ak-red">
            -{selectedPrice.percentage_diff}%
          </span>
        </p>
      )}
    </div>
  )
}
