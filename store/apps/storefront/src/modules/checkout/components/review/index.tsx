"use client"

import { Text } from "@modules/common/components/ui"
import StepHeading from "../step-heading"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

const Review = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards && ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])?.length > 0 && cart?.total === 0
  )

  const previousStepsCompleted =
    cart.shipping_address &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-6">
        <StepHeading step={4} title="Revisión" muted={!isOpen} />
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="rounded-2xl bg-white/60 p-4 text-sm text-ak-ink/70 ring-1 ring-ak-ink/5">
                Al hacer clic en <strong>Confirmar pedido</strong> confirmas que
                leíste y aceptas los Términos de uso, las Condiciones de venta y
                la Política de cambios y devoluciones de AKLabs, así como su
                Política de privacidad.
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
