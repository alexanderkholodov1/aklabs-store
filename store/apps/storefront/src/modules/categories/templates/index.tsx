import { Suspense } from "react"

import { listShopCategories } from "@lib/data/categories"
import { getMessages } from "@lib/i18n/get-messages"
import { resolveCategoryCopy } from "@lib/i18n/product-copy"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { toCategoryChips } from "@modules/store/components/refinement-list/category-chips"
import { SortOptions } from "@modules/store/components/refinement-list/sort-options"
import StoreHeader from "@modules/store/components/store-header"
import PaginatedProducts from "@modules/store/templates/paginated-products"

const ancestorsOf = (category: HttpTypes.StoreProductCategory) => {
  const ancestors: HttpTypes.StoreProductCategory[] = []
  let parent = category.parent_category
  while (parent) {
    ancestors.unshift(parent)
    parent = parent.parent_category
  }
  return ancestors
}

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy: SortOptions
  page: number
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const [{ t, locale }, shopCategories] = await Promise.all([
    getMessages(),
    listShopCategories(),
  ])

  const copy = resolveCategoryCopy(category, locale)
  const children = category.category_children ?? []
  const basePath = `/categories/${category.handle}`

  return (
    <div className="content-container py-5 small:py-8" data-testid="category-container">
      <StoreHeader
        eyebrow={t.store.categoryEyebrow}
        title={copy.name}
        description={copy.description || t.store.categoryFallback(copy.name)}
        crumbs={[
          { label: t.nav.store, href: "/store" },
          ...ancestorsOf(category).map((ancestor) => ({
            label: resolveCategoryCopy(ancestor, locale).name,
            href: `/categories/${ancestor.handle}`,
          })),
          { label: copy.name },
        ]}
        hint="catalog"
        testId="category-page-title"
      />
      {children.length > 0 && (
        <nav aria-label={t.store.subcategories} className="mb-5">
          <ul className="flex flex-wrap gap-2">
            {children.map((child) => (
              <li key={child.id}>
                <LocalizedClientLink
                  href={`/categories/${child.handle}`}
                  className="glass inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold text-ak-ink hover:bg-white"
                >
                  {resolveCategoryCopy(child, locale).name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <RefinementList
        sortBy={sortBy}
        categories={toCategoryChips(shopCategories, locale)}
        activeCategoryHandle={category.handle}
        data-testid="sort-by-container"
      />
      <Suspense
        key={`${sortBy}:${page}`}
        fallback={<SkeletonProductGrid numberOfProducts={Math.min(category.products?.length || 8, 12)} />}
      >
        <PaginatedProducts
          sortBy={sortBy}
          page={page}
          categoryId={category.id}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
          basePath={basePath}
        />
      </Suspense>
    </div>
  )
}
