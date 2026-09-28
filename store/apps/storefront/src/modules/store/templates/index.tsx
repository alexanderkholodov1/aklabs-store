import { Suspense } from "react"

import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { getCategoryChips } from "@modules/store/components/refinement-list/category-chips"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreHeader from "@modules/store/components/store-header"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const categories = await getCategoryChips()

  return (
    <div className="content-container py-6 small:py-10" data-testid="category-container">
      <StoreHeader
        eyebrow="Colección 01"
        title="Tienda AKLabs"
        description="Todo el merch del laboratorio en un solo lugar. Filtra por categoría u ordena por precio."
        crumbs={[{ label: "Tienda" }]}
        testId="store-page-title"
      />
      <RefinementList sortBy={sort} categories={categories} />
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
        />
      </Suspense>
    </div>
  )
}

export default StoreTemplate
