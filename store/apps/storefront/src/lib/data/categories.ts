import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { remember } from "./catalog-cache"

const CATEGORY_FIELDS =
  "id,name,handle,description,*category_children,*parent_category,*parent_category.parent_category,*products"

export const listCategories = async (query?: Record<string, unknown>) => {
  const limit = query?.limit || 100

  return remember(`categories:v2:${CATEGORY_FIELDS}:${limit}`, async () => {
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

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`
  const categories = await listCategories()

  return (
    categories?.find((category) => category.handle === handle) ?? null
  )
}
