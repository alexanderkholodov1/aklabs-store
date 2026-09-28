import { Logo } from "@modules/common/components/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative w-full small:min-h-screen">
      <div className="sticky top-0 z-50 px-3 pt-3 small:px-6">
        <nav className="glass liquid mx-auto flex h-16 max-w-[1440px] items-center justify-between rounded-full px-4 small:px-6">
          <LocalizedClientLink
            href="/cart"
            className="flex flex-1 basis-0 items-center gap-x-2 text-sm font-semibold text-ak-ink/70 hover:text-ak-ink"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block">
              Volver al carrito
            </span>
            <span className="mt-px block small:hidden">Volver</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="flex items-center"
            data-testid="store-link"
            aria-label="AKLabs, ir al inicio"
          >
            <Logo size={36} />
          </LocalizedClientLink>
          <div className="flex flex-1 basis-0 justify-end">
            <span className="chip hidden bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 xsmall:inline-flex">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 10V8a6 6 0 1 1 12 0v2m-13 0h14v11H5V10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              Checkout seguro
            </span>
          </div>
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
      <div className="w-full py-6 text-center text-xs text-ak-ink/45">
        AKLabs Store · Medusa v2 + Next.js + Supabase Postgres
      </div>
    </div>
  )
}
