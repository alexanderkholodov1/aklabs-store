import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { getCategoryChips } from "@modules/store/components/refinement-list/category-chips"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreHeader from "@modules/store/components/store-header"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"

const CATEGORY_COPY: Record<string, string> = {
  hoodies:
    "Felpa premium, capucha amplia y el monograma AK bordado. La prenda insignia de la marca.",
  camisetas:
    "Algodón suave, corte unisex y estampados que se ven desde lejos.",
  joggers: "Comodidad para trabajar desde casa, entrenar o viajar.",
  gorras: "Seis paneles, visera curva y bordado en relieve.",
  "termos-y-botellas":
    "Acero inoxidable con aislamiento al vacío para acompañar tus jornadas largas.",
}

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  const categories = await getCategoryChips()

  return (
    <div
      className="content-container py-6 small:py-10"
      data-testid="category-container"
    >
      <StoreHeader
        eyebrow="Categoría"
        title={category.name}
        description={category.description || CATEGORY_COPY[category.handle]}
        crumbs={[
          { label: "Tienda", href: "/store" },
          ...parents
            .reverse()
            .map((p) => ({ label: p.name, href: `/categories/${p.handle}` })),
          { label: category.name },
        ]}
        testId="category-page-title"
      />
      {category.category_children && category.category_children.length > 0 && (
        <div className="mb-6">
          <ul className="flex flex-wrap gap-4">
            {category.category_children?.map((c) => (
              <li key={c.id}>
                <InteractiveLink href={`/categories/${c.handle}`}>
                  {c.name}
                </InteractiveLink>
              </li>
            ))}
          </ul>
        </div>
      )}
      <RefinementList
        sortBy={sort}
        categories={categories}
        activeCategoryHandle={category.handle}
        data-testid="sort-by-container"
      />
      <Suspense
        fallback={
          <SkeletonProductGrid
            numberOfProducts={category.products?.length ?? 8}
          />
        }
      >
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          categoryId={category.id}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
        />
      </Suspense>
    </div>
  )
}
