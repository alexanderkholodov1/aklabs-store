import { listProductsWithSort } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { SectionTitle } from "@modules/common/components/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function FeaturedCatalog({
  countryCode,
  region,
}: {
  countryCode: string
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProductsWithSort({
    countryCode,
    sortBy: "created_at",
    queryParams: { limit: 12 },
  })

  const featured = products.filter((product) =>
    product.handle?.startsWith("aklabs")
  )

  const displayProducts = featured.length ? featured : products

  if (!displayProducts.length) {
    return null
  }

  return (
    <section className="content-container py-16 small:py-24" id="coleccion">
      <SectionTitle
        eyebrow="Colección 01"
        title={
          <>
            El merch del <span className="text-gradient-ak">laboratorio</span>
          </>
        }
        description={`Seis piezas pensadas para programar, entrenar y salir. Precios en ${region.currency_code?.toUpperCase()} para la región ${region.name}.`}
      >
        <LocalizedClientLink
          href="/store"
          className="glass inline-flex h-11 items-center gap-2 self-start rounded-full px-5 text-sm font-semibold text-ak-ink transition-colors hover:bg-white small:self-auto"
        >
          Ver toda la tienda <span aria-hidden="true">→</span>
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
