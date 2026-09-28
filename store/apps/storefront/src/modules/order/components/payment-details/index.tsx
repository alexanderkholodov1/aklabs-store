import { Heading, Text } from "@modules/common/components/ui"

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]
  const info = payment ? paymentInfoMap[payment.provider_id] : undefined

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-xl my-6">
        Pago
      </Heading>
      <div>
        {payment && (
          <div className="grid grid-cols-1 gap-6 xsmall:grid-cols-3">
            <div className="flex flex-col">
              <Text className="txt-medium-plus text-ak-ink mb-1">
                Método de pago
              </Text>
              <Text
                className="txt-medium text-ak-ink/60"
                data-testid="payment-method"
              >
                {info?.title ?? payment.provider_id}
              </Text>
            </div>
            <div className="flex flex-col xsmall:col-span-2">
              <Text className="txt-medium-plus text-ak-ink mb-1">
                Detalles del pago
              </Text>
              <div className="flex gap-2 txt-medium text-ak-ink/60 items-center">
                <span className="flex items-center h-7 w-fit rounded-lg bg-ak-mist px-2 text-ak-royal">
                  {info?.icon}
                </span>
                <Text data-testid="payment-amount">
                  {isStripeLike(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} autorizado el ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString("es-EC")}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
