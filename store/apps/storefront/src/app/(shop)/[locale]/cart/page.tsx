import { resolveLocale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
export default async function Cart({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = resolveLocale((await params).locale),
    t = siteCopy(locale)
  return (
    <section className="container section">
      <h1>{t.cart}</h1>
      <div className="empty-state">
        <h2>{t.choose}</h2>
        <p>{t.noCharge}</p>
        <a className="button" href={`/${locale}/store`}>
          {t.explore} ↗
        </a>
      </div>
    </section>
  )
}
