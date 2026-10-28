import { resolveLocale } from "@lib/i18n/locales"
import { CartPage } from "@modules/commerce/cart-page"
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <CartPage locale={resolveLocale((await params).locale)} />
}
