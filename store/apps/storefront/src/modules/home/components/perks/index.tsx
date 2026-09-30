import { HttpTypes } from "@medusajs/types"
import { getMessages } from "@lib/i18n/get-messages"
import { Aurora, Eyebrow } from "@modules/common/components/brand"
import { SwitchRegionButton } from "@modules/layout/components/region-switcher"
import ReactCountryFlag from "react-country-flag"

const PERK_ICONS = [
  <path
    key="ship"
    d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinejoin="round"
    fill="none"
  />,
  <path
    key="usd"
    d="M12 3v18M16.5 7.5c-.8-1.2-2.4-2-4.5-2-2.6 0-4.3 1.3-4.3 3.1 0 4.3 9 2.3 9 6.6 0 1.9-1.9 3.3-4.7 3.3-2.3 0-4.1-.9-5-2.4"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    fill="none"
  />,
  <path
    key="size"
    d="M4 9h13l-3-3M20 15H7l3 3"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />,
  <path
    key="safe"
    d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6l-7-3Zm-3 9 2 2 4-4"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />,
]

export const Perks = async () => {
  const { t } = await getMessages()

  const perks = [
    { title: t.perks.shipTitle, text: t.perks.shipText, icon: PERK_ICONS[0] },
    { title: t.perks.usdTitle, text: t.perks.usdText, icon: PERK_ICONS[1] },
    { title: t.perks.sizeTitle, text: t.perks.sizeText, icon: PERK_ICONS[2] },
    { title: t.perks.safeTitle, text: t.perks.safeText, icon: PERK_ICONS[3] },
  ]

  return (
    <section className="content-container py-10">
      <ul className="grid grid-cols-1 gap-3 xsmall:grid-cols-2 small:grid-cols-4 small:gap-5">
        {perks.map((perk) => (
          <li key={perk.title} className="glass liquid rounded-[28px] p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-ak text-white shadow-lg shadow-ak-blue/25">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                {perk.icon}
              </svg>
            </span>
            <h3 className="mt-5 text-lg font-semibold text-ak-ink">
              {perk.title}
            </h3>
            <p className="mt-1 text-sm text-ak-ink/65">{perk.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Explains the two sales regions. Switching links go straight to the
 * country path, which is how Medusa picks the region and its currency.
 */
export const RegionsBanner = async ({
  region,
}: {
  region: HttpTypes.StoreRegion
}) => {
  const { t } = await getMessages()
  const isEcuador = region.currency_code?.toLowerCase() === "usd"
  const currency = region.currency_code?.toUpperCase() ?? ""

  return (
    <section className="px-3 py-10 small:px-6">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[40px] bg-ak-navy px-6 py-14 text-white small:px-14">
        <Aurora className="opacity-70" />
        <div className="relative grid grid-cols-1 items-center gap-10 small:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col items-start gap-5">
            <Eyebrow tone="dark">{t.regions.eyebrow}</Eyebrow>
            <h2 className="font-display text-5xl leading-[0.95] tracking-wide small:text-7xl">
              {t.regions.titleA}
              <br />
              <span className="text-gradient-ak">{t.regions.titleB}</span>
            </h2>
            <p className="max-w-lg text-white/70">
              {t.regions.body(region.name, currency)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 xsmall:grid-cols-2">
            {[
              {
                country: "ec",
                flag: "EC",
                name: "Ecuador",
                detail: "Ecuador · USD",
                active: isEcuador,
              },
              {
                country: "dk",
                flag: "EU",
                name: "Europe",
                detail: "Europe · EUR (e.g. /dk)",
                active: !isEcuador,
              },
            ].map((option) => (
              <SwitchRegionButton
                key={option.country}
                country={option.country}
                className={`glass-dark rim-ak w-full rounded-[28px] p-6 transition-transform hover:-translate-y-1 ${
                  option.active ? "ring-2 ring-ak-sky" : ""
                }`}
              >
                <ReactCountryFlag
                  svg
                  countryCode={option.flag}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "9999px",
                  }}
                />
                <p className="mt-4 font-display text-4xl tracking-wide">
                  {option.name}
                </p>
                <p className="text-sm text-white/60">{option.detail}</p>
                <p className="mt-3 text-xs text-ak-sky-light">
                  {option.active
                    ? t.regions.current
                    : `${t.regions.switchTo} /${option.country} →`}
                </p>
              </SwitchRegionButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
