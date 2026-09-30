"use client"

import { useI18n } from "@lib/i18n/client"
import { clx } from "@modules/common/components/ui"
import Link, { useLinkStatus } from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

type PageItem = number | "gap"

/** 1 … 4 5 6 … 12: first, last, and a window around the current page. */
export function pageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const start = Math.max(2, Math.min(page - 1, totalPages - 4))
  const end = Math.min(totalPages - 1, Math.max(page + 1, 5))
  const middle = Array.from({ length: end - start + 1 }, (_, index) => start + index)

  return [
    1,
    ...(start > 2 ? (["gap"] as const) : []),
    ...middle,
    ...(end < totalPages - 1 ? (["gap"] as const) : []),
    totalPages,
  ]
}

const PendingContent = ({ children }: { children: React.ReactNode }) => {
  const { pending } = useLinkStatus()
  return <span className={clx(pending && "animate-pulse")}>{children}</span>
}

const itemClass =
  "flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors"

/**
 * Link-based pagination: every page has a real URL (shareable, crawlable,
 * prefetched), and the other query parameters such as the sort are kept.
 */
export function Pagination({
  page,
  totalPages,
  "data-testid": dataTestid,
}: {
  page: number
  totalPages: number
  "data-testid"?: string
}) {
  const { t } = useI18n()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const hrefFor = (target: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (target <= 1) {
      params.delete("page")
    } else {
      params.set("page", String(target))
    }
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const labels = t.store.pagination

  return (
    <nav
      aria-label={labels.label}
      className="mt-10 flex flex-col items-center gap-3 small:mt-14"
      data-testid={dataTestid}
    >
      <ul className="glass flex flex-wrap items-center justify-center gap-1 rounded-full p-1.5">
        <li>
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} className={clx(itemClass, "hover:bg-white")} rel="prev">
              <PendingContent>
                <span aria-hidden="true">←</span>
                <span className="sr-only xsmall:not-sr-only xsmall:ml-2">
                  {labels.previous}
                </span>
              </PendingContent>
            </Link>
          ) : (
            <span className={clx(itemClass, "text-ak-ink/30")} aria-hidden="true">
              ←
            </span>
          )}
        </li>

        {pageItems(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-ak-ink/50">
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span
                  aria-current="page"
                  aria-label={labels.page(item)}
                  className={clx(itemClass, "bg-ak-ink text-white shadow-lg shadow-ak-blue/20")}
                >
                  {item}
                </span>
              ) : (
                <Link
                  href={hrefFor(item)}
                  aria-label={labels.page(item)}
                  className={clx(itemClass, "text-ak-ink/75 hover:bg-white hover:text-ak-ink")}
                >
                  <PendingContent>{item}</PendingContent>
                </Link>
              )}
            </li>
          )
        )}

        <li>
          {page < totalPages ? (
            <Link href={hrefFor(page + 1)} className={clx(itemClass, "hover:bg-white")} rel="next">
              <PendingContent>
                <span className="sr-only xsmall:not-sr-only xsmall:mr-2">
                  {labels.next}
                </span>
                <span aria-hidden="true">→</span>
              </PendingContent>
            </Link>
          ) : (
            <span className={clx(itemClass, "text-ak-ink/30")} aria-hidden="true">
              →
            </span>
          )}
        </li>
      </ul>
      <p className="text-sm text-ak-ink/65" aria-live="polite">
        {labels.status(page, totalPages)}
      </p>
    </nav>
  )
}
