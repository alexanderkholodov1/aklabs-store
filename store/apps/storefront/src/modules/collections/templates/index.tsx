import { Suspense } from "react"

import { listShopCategories } from "@lib/data/categories"
import { getMessages } from "@lib/i18n/get-messages"
import { resolveCollectionTitle } from "@lib/i18n/product-copy"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { HttpTypes } from "@medusajs/types"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { toCategoryChips } from "@modules/store/components/refinement-list/category-chips"
import { SortOptions } from "@modules/store/components/refinement-list/sort-options"
import StoreHeader from "@modules/store/components/store-header"
import PaginatedProducts from "@modules/store/templates/paginated-products"

export default async function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy: SortOptions
  collection: HttpTypes.StoreCollection
  page: number
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const [{ t, locale }, shopCategories] = await Promise.all([
    getMessages(),
    listShopCategories(),
  ])
  const title = resolveCollectionTitle(collection, locale)

  return (
    <div className="content-container py-5 small:py-8">
      <StoreHeader
        eyebrow={t.store.collectionEyebrow}
        title={title}
        crumbs={[{ label: t.nav.store, href: "/store" }, { label: title }]}
        hint="catalog"
      />
      <RefinementList sortBy={sortBy} categories={toCategoryChips(shopCategories, locale)} />
      <Suspense key={`${sortBy}:${page}`} fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sortBy}
          page={page}
          collectionId={collection.id}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
          basePath={`/collections/${collection.handle}`}
        />
      </Suspense>
    </div>
  )
}
