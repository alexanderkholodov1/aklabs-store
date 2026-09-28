import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const category = product.categories?.[0]?.name
  const variantCount = product.variants?.length ?? 0

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full"
    >
      <article
        data-testid="product-wrapper"
        className="glass liquid flex h-full flex-col rounded-[28px] p-2 transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_-30px_rgba(11,30,216,0.45)] xsmall:p-2.5"
      >
        <div className="relative">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            alt={product.title}
          />
          {category && (
            <span className="glass chip absolute left-3 top-3 text-[10px] uppercase tracking-[0.12em] text-ak-royal">
              {category}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 px-2 pb-2 pt-3 xsmall:px-2.5 xsmall:pt-4">
          <h3
            className="text-sm font-semibold leading-snug text-ak-ink xsmall:text-base"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          {product.subtitle && (
            <p className="hidden text-sm text-ak-ink/55 line-clamp-1 xsmall:block">
              {product.subtitle}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <div className="flex flex-col">
              <span className="text-[11px] text-ak-ink/45">
                {variantCount > 1 ? "Desde" : "Precio"}
              </span>
              <div className="flex items-baseline gap-2">
                {cheapestPrice ? (
                  <PreviewPrice price={cheapestPrice} />
                ) : (
                  <span className="text-sm text-ak-ink/50">
                    No disponible
                  </span>
                )}
              </div>
            </div>
            <span
              aria-hidden="true"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ak-ink text-white transition-all duration-500 group-hover:bg-gradient-ak group-hover:rotate-[-45deg]"
            >
              →
            </span>
          </div>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
