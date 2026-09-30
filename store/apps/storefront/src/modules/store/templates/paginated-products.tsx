import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getMessages } from "@lib/i18n/get-messages"
import { OptionValueIds } from "@lib/util/product-option-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductGrid from "@modules/products/components/product-grid"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import {
  PRODUCTS_PER_PAGE,
  SortOptions,
} from "@modules/store/components/refinement-list/sort-options"

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
}

const EmptyState = ({
  title,
  body,
  cta,
  href,
}: {
  title: string
  body: string
  cta: string
  href: string
}) => (
  <div className="glass flex flex-col items-center gap-4 rounded-[32px] px-6 py-14 text-center">
    <p className="font-display type-display-sm tracking-wide text-ak-ink">{title}</p>
    <p className="max-w-md text-ak-ink/70">{body}</p>
    <LocalizedClientLink
      href={href}
      className="btn-ak-gradient inline-flex min-h-11 items-center rounded-full px-6 text-sm font-semibold text-white"
    >
      {cta}
    </LocalizedClientLink>
  </div>
)

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  optionValueIds,
  basePath = "/store",
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  optionValueIds?: OptionValueIds
  /** Listing path without the country code, used by the empty states. */
  basePath?: string
}) {
  const queryParams: PaginatedProductsParams = { limit: PRODUCTS_PER_PAGE }

  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }
  if (categoryId) {
    queryParams.category_id = [categoryId]
  }
  if (productsIds) {
    queryParams.id = productsIds
  }

  const [{ t }, region, listing] = await Promise.all([
    getMessages(),
    getRegion(countryCode),
    listProductsWithSort({
      page,
      queryParams,
      sortBy,
      countryCode,
      optionValueIds,
    }),
  ])

  if (!region) {
    return null
  }

  const { products, count } = listing.response
  const totalPages = Math.max(1, Math.ceil(count / PRODUCTS_PER_PAGE))

  if (!count) {
    return (
      <EmptyState
        title={t.store.emptyTitle}
        body={t.store.emptyBody}
        cta={t.store.emptyCta}
        href="/store"
      />
    )
  }

  if (!products.length) {
    return (
      <EmptyState
        title={t.store.pageEmptyTitle}
        body={t.store.pageEmptyBody(totalPages)}
        cta={t.store.pageEmptyCta}
        href={sortBy ? `${basePath}?sortBy=${sortBy}` : basePath}
      />
    )
  }

  const from = (page - 1) * PRODUCTS_PER_PAGE + 1
  const to = from + products.length - 1
  const currency = region.currency_code?.toUpperCase() ?? ""

  return (
    <>
      <p className="mb-4 flex flex-wrap gap-x-3 gap-y-1 px-1 text-sm text-ak-ink/70">
        <span>{t.store.results(count, currency)}</span>
        {totalPages > 1 && (
          <span className="text-ak-ink/60">{t.store.showing(from, to, count)}</span>
        )}
      </p>
      <ProductGrid data-testid="products-list">
        {products.map((product, index) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} priority={index < 4} />
          </li>
        ))}
      </ProductGrid>
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
