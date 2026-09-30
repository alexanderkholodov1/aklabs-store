import { getMessages } from "@lib/i18n/get-messages"
import { resolveProductCopy } from "@lib/i18n/product-copy"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = async ({ product }: ProductInfoProps) => {
  const { locale } = await getMessages()
  const copy = resolveProductCopy(product, locale)
  const category = product.categories?.[0]

  return (
    <div id="product-info" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {category && (
          <LocalizedClientLink
            href={`/categories/${category.handle}`}
            className="chip bg-ak-mist text-ak-royal uppercase tracking-[0.12em] text-[10px] hover:bg-white"
          >
            {category.name}
          </LocalizedClientLink>
        )}
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="chip bg-white text-ak-ink/70 ring-1 ring-ak-ink/5"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
      </div>
      <h1
        className="font-display text-5xl leading-[0.92] tracking-wide text-ak-ink small:text-6xl"
        data-testid="product-title"
      >
        {copy.title}
      </h1>
      {copy.subtitle && (
        <p className="text-base font-medium text-ak-royal">
          {copy.subtitle}
        </p>
      )}
      <p
        className="text-[15px] leading-relaxed text-ak-ink/70 whitespace-pre-line"
        data-testid="product-description"
      >
        {copy.description}
      </p>
    </div>
  )
}

export default ProductInfo
