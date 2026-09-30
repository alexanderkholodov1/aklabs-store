import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getMessages } from "@lib/i18n/get-messages"
import { SectionTitle } from "@modules/common/components/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function FeaturedCatalog({
  countryCode,
}: {
  countryCode: string
}) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const { t } = await getMessages()

  const {
    response: { products },
  } = await listProductsWithSort({
    countryCode,
    sortBy: "created_at",
    queryParams: { limit: 24 },
  })

  const featured = products.filter((product) =>
    product.handle?.startsWith("aklabs")
  )

  const displayProducts = featured.length ? featured : products

  if (!displayProducts.length) {
    return null
  }

  const currency = region.currency_code?.toUpperCase() ?? ""

  return (
    <section className="content-container py-16 small:py-24" id="coleccion">
      <SectionTitle
        eyebrow={t.featured.eyebrow}
        title={
          <>
            {t.featured.titleA}{" "}
            <span className="text-gradient-ak">{t.featured.titleB}</span>
          </>
        }
        description={t.featured.description(currency, region.name)}
      >
        <LocalizedClientLink
          href="/store"
          className="glass inline-flex h-11 items-center gap-2 self-start rounded-full px-5 text-sm font-semibold text-ak-ink transition-colors hover:bg-white small:self-auto"
        >
          {t.featured.all} <span aria-hidden="true">→</span>
        </LocalizedClientLink>
      </SectionTitle>

      <ul className="mt-10 grid grid-cols-2 gap-3 xsmall:gap-4 small:grid-cols-3 small:gap-6">
        {displayProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </section>
  )
}
