import { listCategories } from "@lib/data/categories"
import type { CategoryChip } from "."

/** Top-level categories that actually have products, for the filter chips. */
export async function getCategoryChips(): Promise<CategoryChip[]> {
  const categories = await listCategories().catch(() => [])

  return (categories ?? [])
    .filter((c) => !c.parent_category && (c.products?.length ?? 0) > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
      count: c.products?.length ?? 0,
    }))
}
