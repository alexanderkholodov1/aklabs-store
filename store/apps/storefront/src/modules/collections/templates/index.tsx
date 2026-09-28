import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { getCategoryChips } from "@modules/store/components/refinement-list/category-chips"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreHeader from "@modules/store/components/store-header"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"

export default async function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const categories = await getCategoryChips()

  return (
    <div className="content-container py-6 small:py-10">
      <StoreHeader
        eyebrow="Colección"
        title={collection.title}
        crumbs={[{ label: "Tienda", href: "/store" }, { label: collection.title }]}
      />
      <RefinementList sortBy={sort} categories={categories} />
      <Suspense
        fallback={
          <SkeletonProductGrid numberOfProducts={collection.products?.length} />
        }
      >
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          collectionId={collection.id}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
        />
      </Suspense>
    </div>
  )
}
