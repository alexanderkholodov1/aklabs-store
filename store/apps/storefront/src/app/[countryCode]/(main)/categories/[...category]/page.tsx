import { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import {
  findRenamedCategory,
  getCategoryByHandle,
  listCategories,
} from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { getMessages } from "@lib/i18n/get-messages"
import { resolveCategoryCopy } from "@lib/i18n/product-copy"
import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { HttpTypes, StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import {
  parsePage,
  parseSortOption,
} from "@modules/store/components/refinement-list/sort-options"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<
    Record<string, string | string[] | undefined> & {
      sortBy?: string
      page?: string
      optionValueIds?: string | string[]
    }
  >
}

export async function generateStaticParams() {
  if (process.env.NODE_ENV === "development") {
    return []
  }

  const [productCategories, regions] = await Promise.all([
    listCategories(),
    listRegions(),
  ])

  if (!productCategories) {
    return []
  }

  const countryCodes = regions
    ?.map((region: StoreRegion) => region.countries?.map((country) => country.iso_2))
    .flat()

  const categoryHandles = productCategories.map(
    (category: HttpTypes.StoreProductCategory) => category.handle
  )

  return countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: string) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()
}

/**
 * Category for the URL. Old handles (e.g. before the catalog moved to
 * English) redirect permanently when the category lists them in
 * `metadata.legacy_handles`.
 */
async function resolveCategory(countryCode: string, handle: string[]) {
  const category = await getCategoryByHandle(handle)
  if (category) {
    return category
  }

  const renamed = await findRenamedCategory(handle)
  if (renamed) {
    permanentRedirect(`/${countryCode}/categories/${renamed.handle}`)
  }

  notFound()
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const [category, { t, locale }] = await Promise.all([
    resolveCategory(params.countryCode, params.category),
    getMessages(),
  ])
  const copy = resolveCategoryCopy(category, locale)

  return {
    title: copy.name,
    description: copy.description || t.store.categoryMeta(copy.name),
    alternates: {
      canonical: `/${params.countryCode}/categories/${params.category.join("/")}`,
    },
  }
}

export default async function CategoryPage(props: Props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])
  const category = await resolveCategory(params.countryCode, params.category)

  return (
    <CategoryTemplate
      category={category}
      sortBy={parseSortOption(searchParams.sortBy)}
      page={parsePage(searchParams.page)}
      countryCode={params.countryCode}
      optionValueIds={parseOptionValueIds(searchParams)}
    />
  )
}
