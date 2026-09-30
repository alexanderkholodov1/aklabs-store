/**
 * Sorting and paging parameters for catalog listings. Plain module (no
 * "use client") so Server Components can parse search params with it.
 */
export type SortOptions = "price_asc" | "price_desc" | "created_at"

export const SORT_OPTIONS: SortOptions[] = ["created_at", "price_asc", "price_desc"]

export const DEFAULT_SORT: SortOptions = "created_at"

/** Products per listing page: divisible by 2, 3 and 4 columns. */
export const PRODUCTS_PER_PAGE = 12

export function parseSortOption(value: unknown): SortOptions {
  return SORT_OPTIONS.includes(value as SortOptions)
    ? (value as SortOptions)
    : DEFAULT_SORT
}

export function parsePage(value: unknown): number {
  const page = Number.parseInt(typeof value === "string" ? value : "", 10)
  return Number.isFinite(page) && page > 0 ? page : 1
}
