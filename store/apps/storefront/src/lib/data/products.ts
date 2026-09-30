"use server"

import { sdk } from "@lib/config"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { remember } from "./catalog-cache"
import { getRegion, retrieveRegion } from "./regions"

const CATALOG_FIELDS = [
  "id",
  "title",
  "subtitle",
  "description",
  "handle",
  "thumbnail",
  "created_at",
  "is_giftcard",
  "collection_id",
  "material",
  "metadata",
  "*images",
  "*options",
  "*options.values",
  "*tags",
  "*categories",
  "*variants",
  "*variants.calculated_price",
  "+variants.inventory_quantity",
  "*variants.options",
  "*variants.images",
].join(",")

const asList = (value: string | string[] | undefined) => {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

async function loadRegionCatalog(regionId: string) {
  return remember(`catalog:${regionId}`, async () => {
    const { products } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>(`/store/products`, {
      method: "GET",
      query: {
        limit: 200,
        region_id: regionId,
        fields: CATALOG_FIELDS,
      },
      cache: "no-store",
    })

    return products
  })
}

function productMatches(
  product: HttpTypes.StoreProduct,
  queryParams?: ProductListQueryParams
) {
  if (!queryParams) {
    return true
  }

  const handles = asList(queryParams.handle)
  if (handles.length && !handles.includes(product.handle ?? "")) {
    return false
  }

  const ids = asList(queryParams.id)
  if (ids.length && !ids.includes(product.id)) {
    return false
  }

  const categoryIds = asList(queryParams.category_id)
  if (
    categoryIds.length &&
    !product.categories?.some((category) =>
      category?.id ? categoryIds.includes(category.id) : false
    )
  ) {
    return false
  }

  const collectionIds = asList(queryParams.collection_id)
  if (
    collectionIds.length &&
    (!product.collection_id || !collectionIds.includes(product.collection_id))
  ) {
    return false
  }

  const tagIds = asList(queryParams.tag_id as string | string[] | undefined)
  if (
    tagIds.length &&
    !product.tags?.some((tag) => (tag?.id ? tagIds.includes(tag.id) : false))
  ) {
    return false
  }

  if (queryParams.is_giftcard === false && product.is_giftcard) {
    return false
  }

  const optionValueIds = asList(queryParams.option_value_id)
  if (optionValueIds.length) {
    const matchesOption = product.variants?.some((variant) =>
      variant.options?.some(
        (option) => option.id && optionValueIds.includes(option.id)
      )
    )

    if (!matchesOption) {
      return false
    }
  }

  return true
}

type ProductListQueryParams = (HttpTypes.FindParams &
  HttpTypes.StoreProductListParams) & {
  options?: string[]
  option_value_id?: string | string[]
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: ProductListQueryParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const catalog = await loadRegionCatalog(region.id)
  const matched = catalog.filter((product) =>
    productMatches(product, queryParams)
  )
  const products = matched.slice(offset, offset + limit)
  const nextPage = matched.length > offset + limit ? pageParam + 1 : null

  return {
    response: {
      products,
      count: matched.length,
    },
    nextPage,
    queryParams,
  }
}

/** Every product sold in the country's region (one cached request). */
export const listRegionProducts = async (
  countryCode: string
): Promise<HttpTypes.StoreProduct[]> => {
  const region = await getRegion(countryCode)
  return region ? loadRegionCatalog(region.id) : []
}

export const getProductByHandle = async (
  countryCode: string,
  handle: string
): Promise<HttpTypes.StoreProduct | null> => {
  const products = await listRegionProducts(countryCode)
  return products.find((product) => product.handle === handle) ?? null
}

/**
 * Fallback curation when no product is flagged in the admin. Handles that do
 * not exist are skipped, so the list can go stale without breaking the row.
 */
const FEATURED_HANDLES = [
  "aklabs-essential-hoodie",
  "aklabs-pro-cap",
  "aklabs-tech-tee",
  "aklabs-steel-thermo",
  "aklabs-coach-jacket",
  "aklabs-monogram-sticker-pack",
  "aklabs-mini-figure",
  "aklabs-canvas-tote",
]

const isFlagged = (value: unknown) =>
  value === true || value === "true" || value === 1 || value === "1"

const featuredRank = (product: HttpTypes.StoreProduct) => {
  const rank = Number(product.metadata?.featured_rank)
  return Number.isFinite(rank) ? rank : Number.MAX_SAFE_INTEGER
}

const isOnSale = (product: HttpTypes.StoreProduct) =>
  !!product.variants?.some((variant) => {
    const price = variant.calculated_price
    return (
      price?.calculated_price?.price_list_type === "sale" ||
      (price?.calculated_amount ?? 0) < (price?.original_amount ?? 0)
    )
  })

const newestFirst = (a: HttpTypes.StoreProduct, b: HttpTypes.StoreProduct) =>
  new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()

/**
 * Home page selection. Order of precedence:
 * 1. products with `metadata.featured = true`, sorted by `metadata.featured_rank`;
 * 2. the FEATURED_HANDLES list above;
 * 3. products on sale, then the newest ones.
 * Each source only fills the slots the previous one left empty.
 */
export const listFeaturedProducts = async ({
  countryCode,
  limit = 8,
}: {
  countryCode: string
  limit?: number
}): Promise<HttpTypes.StoreProduct[]> => {
  const products = await listRegionProducts(countryCode)

  const curated = products
    .filter((product) => isFlagged(product.metadata?.featured))
    .sort((a, b) => featuredRank(a) - featuredRank(b))
  const byHandle = FEATURED_HANDLES.map((handle) =>
    products.find((product) => product.handle === handle)
  ).filter((product): product is HttpTypes.StoreProduct => !!product)
  const rest = [...products].sort(
    (a, b) => Number(isOnSale(b)) - Number(isOnSale(a)) || newestFirst(a, b)
  )

  const picked = new Map<string, HttpTypes.StoreProduct>()
  for (const product of [...curated, ...byHandle, ...rest]) {
    if (picked.size >= limit) {
      break
    }
    picked.set(product.id, product)
  }

  return Array.from(picked.values())
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  optionValueIds,
}: {
  page?: number
  queryParams?: ProductListQueryParams
  sortBy?: SortOptions
  countryCode: string
  optionValueIds?: OptionValueIds
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  const limit = queryParams?.limit || 12
  const optionFilters = Array.from(
    new Set((optionValueIds || []).filter(Boolean))
  )

  const {
    response: { products },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      ...(optionFilters.length ? { option_value_id: optionFilters } : {}),
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  // Pages are 1-based; a missing/zero page would produce slice(-limit, 0) = []
  const pageParam = (Math.max(page, 1) - 1) * limit

  const filteredCount = products.length

  const nextPage = filteredCount > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count: filteredCount,
    },
    nextPage,
    queryParams,
  }
}
