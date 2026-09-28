"use client"

import { clx } from "@modules/common/components/ui"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
}

const sortOptions: { value: SortOptions; label: string }[] = [
  {
    value: "created_at",
    label: "Novedades",
  },
  {
    value: "price_asc",
    label: "Menor precio",
  },
  {
    value: "price_desc",
    label: "Mayor precio",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  return (
    <div
      className="flex shrink-0 items-center gap-1 rounded-full bg-ak-ink/5 p-1"
      role="radiogroup"
      aria-label="Ordenar productos"
      data-testid={dataTestId}
    >
      {sortOptions.map((option) => {
        const active = option.value === sortBy
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setQueryParams("sortBy", option.value)}
            className={clx(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all xsmall:text-sm",
              active
                ? "bg-white text-ak-ink shadow"
                : "text-ak-ink/60 hover:text-ak-ink"
            )}
            data-testid="radio-label"
            data-active={active}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default SortProducts
