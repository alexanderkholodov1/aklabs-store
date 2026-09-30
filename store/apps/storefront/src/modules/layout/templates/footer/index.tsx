import { listCategories } from "@lib/data/categories"
import { getMessages } from "@lib/i18n/get-messages"
import { Aurora, Logo } from "@modules/common/components/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"

export default async function Footer() {
  const [{ t }, productCategories] = await Promise.all([
    getMessages(),
    listCategories().catch(() => []),
  ])

  const categories = (productCategories ?? []).filter(
    (c) => !c.parent_category && (c.products?.length ?? 0) > 0
  )

  return (
    <footer className="px-3 pb-3 pt-16 small:px-6">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[40px] bg-ak-navy text-white">
        <Aurora className="opacity-60" />
        <div className="relative px-6 py-14 small:px-12 small:py-16">
          <div className="grid grid-cols-1 gap-12 small:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="flex flex-col gap-5 max-w-sm">
              <LocalizedClientLink href="/" aria-label="AKLabs">
                <Logo size={46} tone="dark" />
              </LocalizedClientLink>
              <p className="text-white/65">{t.footer.blurb}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="chip glass-dark text-white/80">
                  Ecuador · USD
                </span>
                <span className="chip glass-dark text-white/80">
                  Europe · EUR
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ak-sky-light">
                {t.footer.shop}
              </span>
              <ul className="flex flex-col gap-2 text-white/70">
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="hover:text-white"
                  >
                    {t.footer.all}
                  </LocalizedClientLink>
                </li>
                {categories.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      className="hover:text-white"
                      href={`/categories/${c.handle}`}
                      data-testid="category-link"
                    >
                      {c.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ak-sky-light">
                {t.footer.account}
              </span>
              <ul className="flex flex-col gap-2 text-white/70">
                <li>
                  <LocalizedClientLink href="/account" className="hover:text-white">
                    {t.footer.myAccount}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="hover:text-white"
                  >
                    {t.footer.orders}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/cart" className="hover:text-white">
                    {t.footer.cart}
                  </LocalizedClientLink>
                </li>
                <li className="text-white/50">{t.footer.shipping}</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ak-sky-light">
                {t.footer.tech}
              </span>
              <ul className="flex flex-col gap-2 text-white/70">
                <li>
                  <a
                    href="https://medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white"
                  >
                    Medusa v2 (backend)
                  </a>
                </li>
                <li>
                  <a
                    href="https://nextjs.org"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white"
                  >
                    Next.js (storefront)
                  </a>
                </li>
                <li>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white"
                  >
                    Supabase Postgres
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 small:flex-row small:items-center small:justify-between">
            <Text className="txt-compact-small text-white/50">
              © {new Date().getFullYear()} AKLabs. All rights reserved.
            </Text>
            <span className="font-display text-[clamp(3rem,10vw,7rem)] leading-none tracking-[0.08em] text-white/[0.06] select-none">
              AKLABS
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
