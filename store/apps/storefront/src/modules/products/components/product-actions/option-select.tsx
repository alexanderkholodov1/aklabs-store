import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

// The API returns option values alphabetically (L, M, S, XL); sizes read
// better in their natural order.
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"]

const sortValues = (values: string[]) =>
  [...values].sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a.toUpperCase())
    const ib = SIZE_ORDER.indexOf(b.toUpperCase())
    if (ia === -1 && ib === -1) return 0
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = sortValues((option.values ?? []).map((v) => v.value))

  return (
    <div className="flex flex-col gap-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ak-ink">{title}</span>
        {current && (
          <span className="text-xs text-ak-ink/55">
            Seleccionado: <strong className="text-ak-ink">{current}</strong>
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions.map((v) => {
          const selected = v === current
          return (
            <button
              type="button"
              onClick={() => updateOption(option.id, v)}
              key={v}
              aria-pressed={selected}
              className={clx(
                "h-11 min-w-[3.25rem] flex-1 rounded-full border px-4 text-sm font-semibold transition-all duration-200 disabled:opacity-50",
                selected
                  ? "border-transparent bg-ak-ink text-white shadow-lg shadow-ak-blue/25"
                  : "border-ak-ink/10 bg-white/80 text-ak-ink/80 hover:border-ak-sky hover:text-ak-ink"
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
