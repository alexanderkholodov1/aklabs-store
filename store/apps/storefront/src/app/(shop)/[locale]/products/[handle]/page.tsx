import { notFound } from "next/navigation"
import { catalog, productFor } from "@lib/catalog"
import { resolveLocale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
import { ProductDetail } from "@modules/catalog/product-detail"
import { ProductCard } from "@modules/catalog/product-card"
export function generateStaticParams() {
  return catalog.products.map((p) => ({ handle: p.handle }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const p = await params
  const product = productFor(p.handle)
  const copy = product?.copy[resolveLocale(p.locale)]
  return { title: copy?.title, description: copy?.subtitle }
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const p = await params,
    locale = resolveLocale(p.locale),
    t = siteCopy(locale),
    product = productFor(p.handle)
  if (!product) notFound()
  return (
    <div className="container product-page">
      <a className="text-link breadcrumb" href={`/${locale}/store`}>
        ← {t.back}
      </a>
      <ProductDetail product={product} locale={locale} />
      <section className="section">
        <div className="section-heading">
          <h2>{t.related}</h2>
          <a className="text-link" href={`/${locale}/store`}>
            {t.all} ↗
          </a>
        </div>
        <div className="product-grid">
          {catalog.products
            .filter(
              (p) => p.id !== product.id && p.categoryId === product.categoryId
            )
            .concat(
              catalog.products.filter(
                (p) =>
                  p.id !== product.id && p.categoryId !== product.categoryId
              )
            )
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
        </div>
      </section>
    </div>
  )
}
