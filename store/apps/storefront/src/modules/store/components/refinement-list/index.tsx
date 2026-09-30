"use client"

import { useI18n } from "@lib/i18n/client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import { useLinkStatus } from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

import SortProducts from "./sort-products"
import { SortOptions } from "./sort-options"

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
 * Toolbar above the product grid: category chips (real links, so they work
 * without JS and keep the chosen sort) and the sort control.
 */
const RefinementList = ({
  sortBy,
  categories = [],
  activeCategoryHandle,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const scrollerRef = useRef<HTMLUListElement>(null)

  const sortQuery = searchParams.get("sortBy")
    ? `?sortBy=${encodeURIComponent(searchParams.get("sortBy") ?? "")}`
    : ""

  // Bring the active chip into view on phones, where the row scrolls.
  useEffect(() => {
    const scroller = scrollerRef.current
    const active = scroller?.querySelector<HTMLElement>("[aria-current='page']")
    if (!scroller || !active || scroller.scrollWidth <= scroller.clientWidth) {
      return
    }
    scroller.scrollLeft =
      active.offsetLeft - scroller.clientWidth / 2 + active.clientWidth / 2
  }, [activeCategoryHandle])

  return (
    <div className="glass liquid mb-6 flex flex-col gap-3 rounded-[28px] p-2.5 sm:p-3">
      {categories.length > 0 && (
        <nav aria-label={t.store.filterLabel}>
          <ul
            ref={scrollerRef}
            className="fade-x-scroll flex gap-1.5 overflow-x-auto no-scrollbar md:flex-wrap md:overflow-visible"
          >
            <li className="shrink-0">
              <CategoryLink
                href={`/store${sortQuery}`}
                label={t.store.all}
                active={!activeCategoryHandle}
              />
            </li>
            {categories.map((category) => (
              <li key={category.id} className="shrink-0">
                <CategoryLink
                  href={`/categories/${category.handle}${sortQuery}`}
                  label={category.name}
                  count={category.count}
                  active={activeCategoryHandle === category.handle}
                />
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="flex items-center justify-end border-t border-ak-ink/5 pt-2.5 sm:pt-3">
        <SortProducts sortBy={sortBy} data-testid={dataTestId} />
      </div>
    </div>
  )
}

/** Chip label and count; pulses while the chip's navigation is pending. */
const ChipContent = ({
  label,
  count,
  active,
}: {
  label: string
  count?: number
  active: boolean
}) => {
  const { pending } = useLinkStatus()
  return (
    <span className={clx("flex items-center gap-2", pending && "animate-pulse")}>
      {label}
      {typeof count === "number" && (
        <span
          className={clx(
            "grid min-w-[1.5rem] place-items-center rounded-full px-1.5 text-xs",
            active ? "bg-white/20" : "bg-ak-ink/5"
          )}
        >
          {count}
        </span>
      )}
    </span>
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
      "flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors",
      active
        ? "bg-ak-ink text-white shadow-lg shadow-ak-blue/20"
        : "text-ak-ink/75 hover:bg-white hover:text-ak-ink"
    )}
    data-testid="category-chip"
    aria-current={active ? "page" : undefined}
  >
    <ChipContent label={label} count={count} active={active} />
  </LocalizedClientLink>
)

export default RefinementList
