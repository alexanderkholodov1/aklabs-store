import { notFound } from "next/navigation"
import { catalog } from "@lib/catalog"
import { resolveLocale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
import { Listing } from "@modules/catalog/listing"
export function generateStaticParams() {
  return catalog.categories.map((c) => ({ handle: c.handle }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { locale, handle } = await params
  return {
    title: catalog.categories.find((c) => c.handle === handle)?.name[
      resolveLocale(locale)
    ],
  }
}
export default async function Category({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const p = await params,
    locale = resolveLocale(p.locale),
    t = siteCopy(locale),
    category = catalog.categories.find((c) => c.handle === p.handle)
  if (!category) notFound()
  return (
    <section className="container catalog-page">
      <div className="page-intro">
        <a className="text-link" href={`/${locale}/store`}>
          ← {t.back}
        </a>
        <p className="eyebrow">AK / {t.collection}</p>
        <h1>{category.name[locale]}</h1>
        <p>{t.catalogBody}</p>
      </div>
      <Listing
        products={catalog.products.filter((p) => p.categoryId === category.id)}
        locale={locale}
        category={category}
      />
    </section>
  )
}
