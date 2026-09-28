import { cookies as nextCookies } from "next/headers"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Aurora } from "@modules/common/components/brand"
import CartTotals from "@modules/common/components/cart-totals"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import PaymentDetails from "@modules/order/components/payment-details"
import ShippingDetails from "@modules/order/components/shipping-details"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  const createdAt = new Date(order.created_at).toLocaleString("es-EC", {
    dateStyle: "long",
    timeStyle: "short",
  })

  return (
    <div className="py-8 small:py-12">
      <div className="content-container flex max-w-4xl flex-col gap-6">
        {isOnboarding && <OnboardingCta orderId={order.id} />}

        <section
          className="relative overflow-hidden rounded-[40px] bg-ak-navy px-6 py-10 text-white small:px-12 small:py-14"
          data-testid="order-complete-container"
        >
          <Aurora />
          <div className="relative flex flex-col gap-6">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-ak text-3xl font-bold shadow-lg shadow-ak-blue/40">
              ✓
            </span>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ak-sky-light">
                Pedido confirmado
              </p>
              <h1 className="font-display text-6xl leading-[0.9] tracking-wide small:text-7xl">
                ¡Gracias por
                <br />
                <span className="text-gradient-ak">tu compra!</span>
              </h1>
              <p className="max-w-xl text-white/70">
                Tu pedido quedó registrado. Enviamos la confirmación a{" "}
                <span
                  className="font-semibold text-white"
                  data-testid="order-email"
                >
                  {order.email}
                </span>
                .
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3 small:grid-cols-4">
              <div className="glass-dark rounded-2xl p-4">
                <dt className="text-xs text-white/55">N.º de pedido</dt>
                <dd
                  className="font-display text-4xl tracking-wide"
                  data-testid="order-id"
                >
                  #{order.display_id}
                </dd>
              </div>
              <div className="glass-dark rounded-2xl p-4">
                <dt className="text-xs text-white/55">Total</dt>
                <dd className="font-display text-4xl tracking-wide">
                  {convertToLocale({
                    amount: order.total ?? 0,
                    currency_code: order.currency_code,
                  })}
                </dd>
              </div>
              <div className="glass-dark col-span-2 rounded-2xl p-4">
                <dt className="text-xs text-white/55">Fecha</dt>
                <dd className="mt-1 text-sm font-semibold" data-testid="order-date">
                  {createdAt}
                </dd>
                <dd className="mt-1 text-xs text-white/55">
                  Moneda {order.currency_code?.toUpperCase()}
                </dd>
              </div>
            </dl>

            <div className="glass-dark flex flex-col gap-2 rounded-2xl p-4 xsmall:flex-row xsmall:items-center xsmall:justify-between">
              <div>
                <p className="text-xs text-white/55">
                  ID de la orden en la base de datos (tabla <code>order</code>)
                </p>
                <code
                  className="break-all font-mono text-sm text-ak-sky-light"
                  data-testid="order-db-id"
                >
                  {order.id}
                </code>
              </div>
              <LocalizedClientLink
                href="/store"
                className="btn-ak-gradient inline-flex h-11 shrink-0 items-center justify-center rounded-full px-5 text-sm font-semibold text-white"
              >
                Seguir comprando
              </LocalizedClientLink>
            </div>
          </div>
        </section>

        <section className="glass liquid flex flex-col gap-4 rounded-[32px] p-6 small:p-8">
          <h2 className="font-display text-4xl tracking-wide text-ak-ink">
            Resumen del pedido
          </h2>
          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </section>
      </div>
    </div>
  )
}
