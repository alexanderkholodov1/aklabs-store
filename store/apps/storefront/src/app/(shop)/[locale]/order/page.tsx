import { resolveLocale } from "@lib/i18n/locales"
import { OrderPage } from "@modules/commerce/order-page"
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <OrderPage locale={resolveLocale((await params).locale)} />
}
