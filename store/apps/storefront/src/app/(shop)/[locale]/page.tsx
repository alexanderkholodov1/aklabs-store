import { catalog } from "@lib/catalog"
import { resolveLocale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
import { ProductCard } from "@modules/catalog/product-card"
import { ProductImage } from "@modules/catalog/product-image"
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = resolveLocale((await params).locale),
    t = siteCopy(locale)
  const hero = catalog.products.find(
    (p) => p.handle === "aklabs-essential-hoodie"
  )!
  const favorites = [
    "aklabs-tech-tee",
    "aklabs-pro-cap",
    "aklabs-steel-thermo",
    "aklabs-lab-notebook",
  ].map((h) => catalog.products.find((p) => p.handle === h)!)
  const edits = [
    { label: t.wear, handle: "aklabs-studio-tee", category: "Camisetas" },
    {
      label: t.carry,
      handle: "aklabs-insulated-bottle",
      category: "Termos y botellas",
    },
    { label: t.desk, handle: "aklabs-lab-notebook", category: "Papelería" },
  ]
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            {t.collection}
          </p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-description">{t.heroBody}</p>
          <div className="hero-actions">
            <a className="button" href={`/${locale}/store`}>
              {t.explore}
              <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href={`/${locale}/how-it-works`}>
              {t.behind}
              <span aria-hidden="true"> →</span>
            </a>
          </div>
          <p className="edition">{t.edition}</p>
        </div>
        <a className="hero-visual" href={`/${locale}/products/${hero.handle}`}>
          <div className="hero-art">
            <span className="hero-index" aria-hidden="true">
              01 / 30
            </span>
            <ProductImage
              image={hero.images[0]}
              locale={locale}
              priority
              sizes="(max-width: 760px) 90vw, 48vw"
            />
            <span className="hero-stamp" aria-hidden="true">
              AK
              <br />
              <small>LAB ESSENTIALS</small>
            </span>
          </div>
          <div className="hero-caption">
            <div>
              <strong>{t.heroCaption}</strong>
              <span>{t.heroNote}</span>
            </div>
            <span className="round-arrow" aria-hidden="true">
              ↗
            </span>
          </div>
        </a>
      </section>
      <div className="manifesto-strip">
        <div className="container">
          <span>DESIGN × TECHNOLOGY × CURIOSITY</span>
          <span aria-hidden="true">✳</span>
          <span>EST. IN THE LAB / MADE TO EXPLORE</span>
        </div>
      </div>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / {t.collection}</p>
            <h2>{t.featured}</h2>
            <p>{t.featuredBody}</p>
          </div>
          <a className="text-link" href={`/${locale}/store`}>
            {t.all} ↗
          </a>
        </div>
        <div className="product-grid">
          {favorites.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>
      <section className="section container edits-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / AKLABS</p>
            <h2>{t.categories}</h2>
            <p>{t.categoryBody}</p>
          </div>
        </div>
        <div className="edits-grid">
          {edits.map((edit, i) => {
            const p = catalog.products.find((p) => p.handle === edit.handle)!
            const c = catalog.categories.find((c) => c.id === p.categoryId)!
            return (
              <a
                className="edit-card"
                key={edit.handle}
                href={`/${locale}/categories/${c.handle}`}
              >
                <div className="edit-art">
                  <ProductImage image={p.images[0]} locale={locale} />
                </div>
                <span className="eyebrow">
                  0{i + 1} / {c.name[locale]}
                </span>
                <h3>
                  {edit.label}
                  <span aria-hidden="true"> ↗</span>
                </h3>
              </a>
            )
          })}
        </div>
      </section>
      <section className="promise container">
        <div className="promise-symbol" aria-hidden="true">
          ✳
        </div>
        <div>
          <p className="eyebrow">THE AKLABS EXPERIMENT</p>
          <h2>{t.promiseTitle}</h2>
          <p>{t.promiseBody}</p>
          <a className="button light" href={`/${locale}/how-it-works`}>
            {t.promiseCta} ↗
          </a>
        </div>
        <span className="promise-number" aria-hidden="true">
          0.00
        </span>
      </section>
    </>
  )
}
