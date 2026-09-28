import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { OptionValueIds } from "@lib/util/product-option-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
    optionValueIds,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (!products.length) {
    return (
      <div className="glass flex flex-col items-center gap-4 rounded-[32px] px-6 py-16 text-center">
        <p className="font-display text-4xl tracking-wide text-ak-ink">
          Nada por aquí todavía
        </p>
        <p className="max-w-md text-ak-ink/60">
          No encontramos productos con estos filtros. Prueba con otra
          categoría o mira toda la colección.
        </p>
        <LocalizedClientLink
          href="/store"
          className="btn-ak-gradient inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-white"
        >
          Ver todos los productos
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <>
      <p className="mb-4 px-1 text-sm text-ak-ink/55">
        {count} {count === 1 ? "producto" : "productos"} · precios en{" "}
        {region.currency_code?.toUpperCase()}
      </p>
      <ul
        className="grid w-full grid-cols-2 gap-3 xsmall:gap-4 small:grid-cols-3 small:gap-6 medium:grid-cols-4"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
