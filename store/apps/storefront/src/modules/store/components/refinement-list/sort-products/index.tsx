"use client"

import { useI18n } from "@lib/i18n/client"
import { clx } from "@modules/common/components/ui"
import Link, { useLinkStatus } from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useId, useTransition } from "react"

import { SORT_OPTIONS, SortOptions } from "../sort-options"

export type { SortOptions } from "../sort-options"

type SortProductsProps = {
  sortBy: SortOptions
  "data-testid"?: string
}

const useSortHref = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (value: SortOptions) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    params.delete("page")
    return `${pathname}?${params.toString()}`
  }
}

/** Dims the option while its navigation is in flight. */
const PendingLabel = ({ children }: { children: React.ReactNode }) => {
  const { pending } = useLinkStatus()
  return (
    <span className={clx("transition-opacity", pending && "animate-pulse opacity-60")}>
      {children}
    </span>
  )
}

/**
 * Sort control. Real links on wider screens (work without JS, keep the
 * history); a native select on phones, where three long labels do not fit.
 */
const SortProducts = ({ sortBy, "data-testid": dataTestId }: SortProductsProps) => {
  const { t } = useI18n()
  const hrefFor = useSortHref()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const selectId = useId()

  return (
    <div className="flex items-center gap-3" data-testid={dataTestId}>
      <label
        htmlFor={selectId}
        className="shrink-0 text-sm font-medium text-ak-ink/70"
      >
        {t.store.sortLabel}
      </label>

      <select
        id={selectId}
        value={sortBy}
        onChange={(event) => {
          const next = event.target.value as SortOptions
          startTransition(() => router.push(hrefFor(next), { scroll: false }))
        }}
        className={clx(
          "min-h-10 min-w-0 flex-1 rounded-full border border-ak-ink/10 bg-white/80 px-4 text-sm font-semibold text-ak-ink sm:hidden",
          isPending && "opacity-60"
        )}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {t.store.sort[option]}
          </option>
        ))}
      </select>

      <ul
        className="hidden items-center gap-1 rounded-full bg-ak-ink/5 p-1 sm:flex"
        aria-label={t.store.sortLabel}
      >
        {SORT_OPTIONS.map((option) => {
          const active = option === sortBy
          return (
            <li key={option}>
              <Link
                href={hrefFor(option)}
                scroll={false}
                aria-current={active ? "true" : undefined}
                className={clx(
                  "flex min-h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors",
                  active
                    ? "bg-white text-ak-ink shadow"
                    : "text-ak-ink/70 hover:bg-white/60 hover:text-ak-ink"
                )}
                data-testid="sort-option"
                data-active={active}
              >
                <PendingLabel>{t.store.sort[option]}</PendingLabel>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SortProducts
