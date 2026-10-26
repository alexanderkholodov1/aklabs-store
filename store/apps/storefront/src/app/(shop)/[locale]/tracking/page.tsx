import { resolveLocale } from "@lib/i18n/locales"
import { TrackingPage } from "@modules/commerce/order-page"
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <TrackingPage locale={resolveLocale((await params).locale)} />
}
