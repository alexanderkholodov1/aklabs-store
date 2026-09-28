import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="glass liquid grid w-full grid-cols-1 gap-y-8 rounded-[32px] p-5 small:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-5xl tracking-wide text-ak-ink small:text-6xl">
          Finaliza tu compra
        </h1>
        <p className="text-sm text-ak-ink/60">
          Cuatro pasos: dirección, entrega, pago y revisión. Región{" "}
          {cart.region?.name} · precios en {cart.currency_code?.toUpperCase()}.
        </p>
      </div>

      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      <Payment cart={cart} availablePaymentMethods={paymentMethods} />

      <Review cart={cart} />
    </div>
  )
}
