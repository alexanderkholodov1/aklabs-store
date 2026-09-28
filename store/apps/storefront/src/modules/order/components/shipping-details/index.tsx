import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <Heading level="h2" className="flex flex-row text-xl my-6">
        Entrega
      </Heading>
      <div className="grid grid-cols-1 gap-6 xsmall:grid-cols-3">
        <div className="flex flex-col" data-testid="shipping-address-summary">
          <Text className="txt-medium-plus text-ak-ink mb-1">
            Dirección de envío
          </Text>
          <Text className="txt-medium text-ak-ink/60">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="txt-medium text-ak-ink/60">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="txt-medium text-ak-ink/60">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>
          <Text className="txt-medium text-ak-ink/60">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div className="flex flex-col" data-testid="shipping-contact-summary">
          <Text className="txt-medium-plus text-ak-ink mb-1">Contacto</Text>
          <Text className="txt-medium text-ak-ink/60">
            {order.shipping_address?.phone}
          </Text>
          <Text className="txt-medium text-ak-ink/60">{order.email}</Text>
        </div>

        <div className="flex flex-col" data-testid="shipping-method-summary">
          <Text className="txt-medium-plus text-ak-ink mb-1">Método</Text>
          <Text className="txt-medium text-ak-ink/60">
            {(order.shipping_methods?.[0] as { name?: string })?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0]?.total ?? 0,
              currency_code: order.currency_code,
            })}
            )
          </Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
