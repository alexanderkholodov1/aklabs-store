import { Suspense } from "react"

import { listShopCategories } from "@lib/data/categories"
import { getMessages } from "@lib/i18n/get-messages"
import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { toCategoryChips } from "@modules/store/components/refinement-list/category-chips"
import { SortOptions } from "@modules/store/components/refinement-list/sort-options"
import StoreHeader from "@modules/store/components/store-header"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy: SortOptions
  page: number
  countryCode: string
  optionValueIds?: OptionValueIds
}) => {
  const [{ t, locale }, categories] = await Promise.all([
    getMessages(),
    listShopCategories(),
  ])

  return (
    <div className="content-container py-5 small:py-8" data-testid="category-container">
      <StoreHeader
        eyebrow={t.store.eyebrow}
        title={t.store.title}
        description={t.store.description}
        crumbs={[{ label: t.nav.store }]}
        hint="catalog"
        testId="store-page-title"
      />
      <RefinementList sortBy={sortBy} categories={toCategoryChips(categories, locale)} />
      <Suspense key={`${sortBy}:${page}`} fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sortBy}
          page={page}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
        />
      </Suspense>
    </div>
  )
}

export default StoreTemplate
