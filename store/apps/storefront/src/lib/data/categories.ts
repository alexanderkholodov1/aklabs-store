import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { remember } from "./catalog-cache"

const CATEGORY_FIELDS = [
  "id",
  "name",
  "handle",
  "description",
  "rank",
  "metadata",
  "parent_category_id",
  "*category_children",
  "*parent_category",
  "*parent_category.parent_category",
  "products.id",
  "products.thumbnail",
].join(",")

export const listCategories = async (query?: Record<string, unknown>) => {
  const limit = query?.limit || 100

  return remember(`categories:v3:${CATEGORY_FIELDS}:${limit}`, async () => {
    const { product_categories } = await sdk.client.fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
    }>("/store/product-categories", {
      query: {
        fields: CATEGORY_FIELDS,
        limit,
        ...query,
      },
      cache: "no-store",
    })

    return product_categories
  })
}

/**
 * Handles a category answered to before it was renamed, read from
 * `metadata.legacy_handles` (array or comma-separated string).
 */
const legacyHandles = (category: HttpTypes.StoreProductCategory): string[] => {
  const raw = category.metadata?.legacy_handles
  if (Array.isArray(raw)) {
    return raw.filter((value): value is string => typeof value === "string")
  }
  return typeof raw === "string" ? raw.split(",").map((value) => value.trim()) : []
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = categoryHandle.join("/")
  const categories = await listCategories()

  return categories?.find((category) => category.handle === handle) ?? null
}

/** Category that used to live under `handle`, so old links can redirect. */
export const findRenamedCategory = async (categoryHandle: string[]) => {
  const handle = categoryHandle.join("/")
  const categories = await listCategories().catch(() => [])

  return (
    categories.find((category) => legacyHandles(category).includes(handle)) ??
    null
  )
}

export type ShopCategory = {
  category: HttpTypes.StoreProductCategory
  count: number
  thumbnail: string | null
}

const byNavigationOrder = (a: ShopCategory, b: ShopCategory) =>
  (a.category.rank ?? Number.MAX_SAFE_INTEGER) -
    (b.category.rank ?? Number.MAX_SAFE_INTEGER) ||
  b.count - a.count ||
  a.category.name.localeCompare(b.category.name)

/**
 * Top-level categories that have products, in the order set in the Medusa
 * admin (category rank), then by size. Drives the navigation, the filter
 * chips, the home showcase and the footer, so nothing hardcodes a handle.
 */
export const listShopCategories = async (): Promise<ShopCategory[]> => {
  const categories = await listCategories().catch(() => [])

  return categories
    .filter((category) => !category.parent_category_id && !category.parent_category)
    .map((category) => ({
      category,
      count: category.products?.length ?? 0,
      thumbnail:
        category.products?.find((product) => !!product.thumbnail)?.thumbnail ??
        null,
    }))
    .filter((entry) => entry.count > 0)
    .sort(byNavigationOrder)
}
