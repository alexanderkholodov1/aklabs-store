import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <div className="flex flex-col-reverse gap-y-8 small:sticky small:top-28 small:flex-col">
      <div className="glass-strong flex w-full flex-col rounded-[32px] p-6 small:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-4xl tracking-wide text-ak-ink">
            Tu pedido
          </h2>
          <span className="chip bg-ak-mist text-ak-royal">
            {cart.region?.name} · {cart.currency_code?.toUpperCase()}
          </span>
        </div>
        <Divider className="my-5" />
        <ItemsPreviewTemplate cart={cart} />
        <Divider className="my-5" />
        <CartTotals totals={cart} />
        <div className="mt-4">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
