import { resolveLocale } from "@lib/i18n/locales"
import { Checkout } from "@modules/commerce/checkout"
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <Checkout locale={resolveLocale((await params).locale)} />
}
