"use client"

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import { useParams, usePathname } from "next/navigation"
import { useMemo, useTransition } from "react"
import ReactCountryFlag from "react-country-flag"

type RegionSwitcherProps = {
  regions: HttpTypes.StoreRegion[] | null
  tone?: "light" | "dark"
}

type CountryOption = {
  country: string
  label: string
  regionName: string
  currency: string
}

const useCountryOptions = (regions: HttpTypes.StoreRegion[] | null) => {
  const { countryCode } = useParams() as { countryCode?: string }
  const pathname = usePathname()

  const options = useMemo<CountryOption[]>(() => {
    return (regions ?? [])
      .flatMap((region) =>
        (region.countries ?? []).map((c) => ({
          country: c.iso_2 ?? "",
          label: c.display_name ?? c.iso_2?.toUpperCase() ?? "",
          regionName: region.name ?? "",
          currency: region.currency_code?.toUpperCase() ?? "",
        }))
      )
      .filter((o) => !!o.country)
      .sort((a, b) => {
        // Ecuador first: it is the main market of the store.
        if (a.country === "ec") return -1
        if (b.country === "ec") return 1
        return a.label.localeCompare(b.label)
      })
  }, [regions])

  const current = options.find((o) => o.country === countryCode)
  const currentPath = countryCode
    ? pathname.split(`/${countryCode}`)[1] ?? ""
    : ""

  return { options, current, countryCode, currentPath }
}

/**
 * Button that moves the cart (if any) to another country's region and
 * navigates to the same page under that country code.
 */
export const SwitchRegionButton = ({
  country,
  className,
  children,
}: {
  country: string
  className?: string
  children: React.ReactNode
}) => {
  const { countryCode } = useParams() as { countryCode?: string }
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const currentPath = countryCode
    ? pathname.split(`/${countryCode}`)[1] ?? ""
    : ""

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (country === countryCode) {
          return
        }
        startTransition(() => {
          updateRegion(country, currentPath)
        })
      }}
      className={clx("text-left", isPending && "opacity-60", className)}
      data-testid={`switch-region-${country}`}
    >
      {children}
    </button>
  )
}

/**
 * Native select version, used inside the side menu where a nested popover
 * would fight with the menu's own outside-click handling.
 */
export const RegionSelect = ({
  regions,
}: {
  regions: HttpTypes.StoreRegion[] | null
}) => {
  const { options, countryCode, currentPath } = useCountryOptions(regions)
  const [isPending, startTransition] = useTransition()

  if (!options.length) {
    return null
  }

  return (
    <select
      value={countryCode}
      disabled={isPending}
      onChange={(e) => {
        const country = e.target.value
        startTransition(() => {
          updateRegion(country, currentPath)
        })
      }}
      className="glass-dark rounded-full px-4 py-2 text-sm font-medium text-white outline-none [&>option]:text-ak-ink"
      aria-label="Región y moneda"
      data-testid="region-select"
    >
      {options.map((o) => (
        <option key={o.country} value={o.country}>
          {o.label} · {o.currency}
        </option>
      ))}
    </select>
  )
}

/**
 * Compact region/currency switcher. Changing the country moves the cart to
 * that region and reloads the page under /{country}, which is how Medusa
 * decides prices (USD for Ecuador, EUR for Europe).
 */
const RegionSwitcher = ({ regions, tone = "light" }: RegionSwitcherProps) => {
  const { options, current, countryCode, currentPath } =
    useCountryOptions(regions)
  const [isPending, startTransition] = useTransition()

  const handleSelect = (option: CountryOption, close: () => void) => {
    close()
    if (option.country === countryCode) {
      return
    }
    startTransition(() => {
      updateRegion(option.country, currentPath)
    })
  }

  if (!options.length) {
    return null
  }

  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <PopoverButton
            className={clx(
              "flex h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold transition-colors focus:outline-none",
              tone === "light"
                ? "text-ak-ink/80 hover:bg-white/90"
                : "glass-dark text-white hover:bg-white/10",
              isPending && "opacity-60"
            )}
            data-testid="region-switcher-button"
          >
            {current && (
              <ReactCountryFlag
                svg
                countryCode={current.country}
                style={{ width: "18px", height: "18px", borderRadius: "9999px" }}
              />
            )}
            <span>{current ? current.currency : "Región"}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              aria-hidden="true"
              className="opacity-60"
            >
              <path
                d="M2 3.5 5 6.5 8 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </PopoverButton>
          <PopoverPanel
            anchor="bottom end"
            className="glass-strong z-[60] mt-3 w-72 rounded-3xl p-2 text-sm text-ak-ink [--anchor-gap:8px]"
          >
            <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ak-ink/50">
              Enviar a
            </p>
            <ul className="max-h-80 overflow-y-auto no-scrollbar">
              {options.map((option) => (
                <li key={option.country}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option, close)}
                    className={clx(
                      "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-ak-mist",
                      option.country === countryCode && "bg-ak-mist"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <ReactCountryFlag
                        svg
                        countryCode={option.country}
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "9999px",
                        }}
                      />
                      <span className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-ak-ink/50">
                          Región {option.regionName}
                        </span>
                      </span>
                    </span>
                    <span className="chip bg-white text-ak-royal ring-1 ring-ak-ink/5">
                      {option.currency}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}

export default RegionSwitcher
