import { catalog } from "@lib/catalog"
import { resolveLocale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
import { Listing } from "@modules/catalog/listing"
export default async function Store({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = resolveLocale((await params).locale),
    t = siteCopy(locale)
  return (
    <section className="container catalog-page">
      <div className="page-intro">
        <p className="eyebrow">AK / 001 — {t.collection}</p>
        <h1>
          {t.catalog}
          <span className="title-count"> / {catalog.products.length}</span>
        </h1>
        <p>{t.catalogBody}</p>
      </div>
      <Listing products={catalog.products} locale={locale} />
    </section>
  )
}
