import React, { Suspense } from "react"

import { getMessages } from "@lib/i18n/get-messages"
import { resolveProductCopy } from "@lib/i18n/product-copy"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate = async ({
  product,
  region,
  countryCode,
  images,
}: ProductTemplateProps) => {
  if (!product || !product.id) {
    return notFound()
  }

  const { locale, t } = await getMessages()
  const copy = resolveProductCopy(product, locale)

  const perks = [
    { title: t.product.ship, text: t.product.shipDetail },
    { title: t.product.exchange, text: t.product.exchangeDetail },
    { title: t.product.pay, text: t.product.payDetail },
  ]

  const actionLabels = {
    choose: t.product.choose,
    soldOut: t.product.soldOut,
    add: t.product.add,
    added: t.product.added,
    error: t.product.error,
  }

  const category = product.categories?.[0]

  return (
    <>
      <div
        className="content-container py-6 small:py-10"
        data-testid="product-container"
      >
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ak-ink/55"
        >
          <LocalizedClientLink href="/" className="hover:text-ak-ink">
            Home
          </LocalizedClientLink>
          <span aria-hidden="true">/</span>
          <LocalizedClientLink href="/store" className="hover:text-ak-ink">
            {t.nav.store}
          </LocalizedClientLink>
          {category && (
            <>
              <span aria-hidden="true">/</span>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="hover:text-ak-ink"
              >
                {category.name}
              </LocalizedClientLink>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-ak-ink">{copy.title}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-6 small:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] small:gap-10">
          <ImageGallery images={images} title={copy.title} />

          <div className="flex flex-col gap-5 small:sticky small:top-28">
            <div className="glass liquid flex flex-col gap-6 rounded-[32px] p-6 small:p-8">
              <ProductInfo product={product} />
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                    labels={actionLabels}
                  />
                }
              >
                <ProductActionsWrapper
                  id={product.id}
                  region={region}
                  labels={actionLabels}
                />
              </Suspense>
              <ul className="grid grid-cols-1 gap-2 xsmall:grid-cols-3">
                {perks.map((perk) => (
                  <li
                    key={perk.title}
                    className="rounded-2xl bg-white/70 px-3 py-2.5 ring-1 ring-ak-ink/5"
                  >
                    <p className="text-xs font-semibold text-ak-ink">
                      {perk.title}
                    </p>
                    <p className="text-[11px] leading-snug text-ak-ink/55">
                      {perk.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-[28px] px-6 py-2">
              <ProductTabs product={product} />
            </div>
          </div>
        </div>
      </div>
      <div
        className="content-container my-12 small:my-20"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
