import type { Product } from "@lib/catalog"
import type { Locale } from "@lib/i18n/locales"
import { ProductImage } from "./product-image"
import { Price } from "./price"
export function ProductCard({
  product,
  locale,
  priority = false,
}: {
  product: Product
  locale: Locale
  priority?: boolean
}) {
  return (
    <article className="product-card">
      <a
        href={`/${locale}/products/${product.handle}`}
        className="product-link"
      >
        <div className="product-art">
          <ProductImage
            image={product.images[0]}
            locale={locale}
            priority={priority}
          />
          <span className="card-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
        <div className="product-card-meta">
          <h3>{product.copy[locale].title.replace(/^AKLabs /, "")}</h3>
          <Price
            prices={product.prices}
            salePrices={product.salePrices}
            locale={locale}
          />
        </div>
        <p>{product.copy[locale].subtitle}</p>
      </a>
    </article>
  )
}
