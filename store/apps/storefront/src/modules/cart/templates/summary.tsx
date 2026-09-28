"use client"

import { Button } from "@modules/common/components/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-4xl tracking-wide text-ak-ink">
          Resumen
        </h2>
        <span className="chip bg-ak-mist text-ak-royal">
          {cart.region?.name} · {cart.currency_code?.toUpperCase()}
        </span>
      </div>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button size="large" className="w-full">
          Ir al checkout <span aria-hidden="true">→</span>
        </Button>
      </LocalizedClientLink>
      <LocalizedClientLink
        href="/store"
        className="text-center text-sm font-medium text-ak-ink/60 hover:text-ak-ink"
      >
        Seguir comprando
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
