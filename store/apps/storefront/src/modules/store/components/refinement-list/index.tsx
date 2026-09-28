"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import SortProducts, { SortOptions } from "./sort-products"

export type CategoryChip = {
  id: string
  name: string
  handle: string
  count: number
}

type RefinementListProps = {
  sortBy: SortOptions
  categories?: CategoryChip[]
  activeCategoryHandle?: string
  "data-testid"?: string
}

/**
 * Toolbar above the product grid: category chips on the left and the sort
 * control on the right. Categories are real links, so they work without JS.
 */
const RefinementList = ({
  sortBy,
  categories = [],
  activeCategoryHandle,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setQueryParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  return (
    <div className="glass liquid mb-8 flex flex-col gap-4 rounded-[28px] p-3 small:flex-row small:items-center small:justify-between">
      {categories.length > 0 ? (
        <nav
          aria-label="Categorías"
          className="flex gap-2 overflow-x-auto no-scrollbar"
        >
          <CategoryLink
            href="/store"
            label="Todo"
            active={!activeCategoryHandle}
          />
          {categories.map((c) => (
            <CategoryLink
              key={c.id}
              href={`/categories/${c.handle}`}
              label={c.name}
              count={c.count}
              active={activeCategoryHandle === c.handle}
            />
          ))}
        </nav>
      ) : (
        <span />
      )}
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
    </div>
  )
}

const CategoryLink = ({
  href,
  label,
  count,
  active,
}: {
  href: string
  label: string
  count?: number
  active: boolean
}) => (
  <LocalizedClientLink
    href={href}
    className={clx(
      "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
      active
        ? "bg-ak-ink text-white shadow-lg shadow-ak-blue/20"
        : "text-ak-ink/70 hover:bg-white hover:text-ak-ink"
    )}
    data-testid="category-chip"
    aria-current={active ? "page" : undefined}
  >
    {label}
    {typeof count === "number" && (
      <span
        className={clx(
          "rounded-full px-1.5 text-[11px]",
          active ? "bg-white/20" : "bg-ak-ink/5"
        )}
      >
        {count}
      </span>
    )}
  </LocalizedClientLink>
)

export default RefinementList
