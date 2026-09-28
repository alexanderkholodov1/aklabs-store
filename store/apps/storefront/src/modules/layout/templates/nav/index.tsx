import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import { Logo } from "@modules/common/components/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import User from "@modules/common/icons/user"
import CartButton from "@modules/layout/components/cart-button"
import RegionSwitcher from "@modules/layout/components/region-switcher"
import SideMenu from "@modules/layout/components/side-menu"

const NAV_LINKS = [
  { href: "/store", label: "Tienda" },
  { href: "/categories/hoodies", label: "Hoodies" },
  { href: "/categories/camisetas", label: "Camisetas" },
  { href: "/categories/gorras", label: "Gorras" },
  { href: "/categories/termos-y-botellas", label: "Termos" },
]

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 px-3 pt-3 small:px-6">
      <header className="glass liquid mx-auto h-16 max-w-[1440px] rounded-full px-2 small:px-4">
        <nav className="flex h-full w-full items-center justify-between gap-3 text-sm font-medium text-ak-ink">
          <div className="flex h-full flex-1 basis-0 items-center gap-1">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
            <ul className="hidden medium:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <LocalizedClientLink
                    href={link.href}
                    className="rounded-full px-3.5 py-2 text-ak-ink/75 transition-colors hover:bg-white/90 hover:text-ak-ink"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          <LocalizedClientLink
            href="/"
            className="flex items-center"
            data-testid="nav-store-link"
            aria-label="AKLabs, ir al inicio"
          >
            <Logo size={38} />
          </LocalizedClientLink>

          <div className="flex h-full flex-1 basis-0 items-center justify-end gap-1.5">
            <div className="hidden small:block">
              <RegionSwitcher regions={regions} />
            </div>
            <LocalizedClientLink
              className="hidden small:flex h-10 w-10 items-center justify-center rounded-full text-ak-ink/80 transition-colors hover:bg-white/90 hover:text-ak-ink"
              href="/account"
              aria-label="Mi cuenta"
              title="Mi cuenta"
              data-testid="nav-account-link"
            >
              <User size={20} />
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex h-10 items-center gap-2 rounded-full bg-ak-ink px-4 text-white"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Carrito (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
