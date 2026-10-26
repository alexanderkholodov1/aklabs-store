"use client"
import { useState } from "react"
import { money } from "@lib/catalog"
import type { Locale } from "@lib/i18n/locales"
import { commerceCopy } from "@lib/i18n/commerce-copy"
import { useCart, lineDetail } from "@lib/sim/cart"
import { usePreferences } from "@lib/sim/preferences"
import { totals } from "@lib/sim/orders"
import { ProductImage } from "@modules/catalog/product-image"
export function Totals({
  cart,
  currency,
  locale,
}: {
  cart: ReturnType<typeof useCart>["cart"]
  currency: "USD" | "EUR"
  locale: Locale
}) {
  const t = commerceCopy(locale),
    amounts = totals(cart, currency)
  return (
    <dl className="totals">
      <div>
        <dt>{t.subtotal}</dt>
        <dd>{money(amounts.subtotal, currency, locale)}</dd>
      </div>
      {amounts.discount > 0 && (
        <div>
          <dt>
            {t.discount} · {cart.promotion}
          </dt>
          <dd>−{money(amounts.discount, currency, locale)}</dd>
        </div>
      )}
      <div>
        <dt>{t.delivery}</dt>
        <dd>{t.free}</dd>
      </div>
      <div className="sim-total">
        <dt>{t.total}</dt>
        <dd>{money(amounts.total, currency, locale)}</dd>
      </div>
      <div className="actual-total">
        <dt>{t.charged}</dt>
        <dd>{money(0, currency, locale)}</dd>
      </div>
    </dl>
  )
}
export function CartPage({ locale }: { locale: Locale }) {
  const t = commerceCopy(locale),
    { cart, ready, quantity, remove, undo, removed, apply, message } =
      useCart(),
    { currency } = usePreferences()
  const [code, setCode] = useState(""),
    [error, setError] = useState("")
  if (!ready)
    return (
      <section className="container section">
        <h1>{t.bag}</h1>
        <p role="status">{t.bagLoading}</p>
        <div className="loading-skeleton" />
      </section>
    )
  return (
    <section className="container commerce-page">
      <div className="page-intro">
        <p className="eyebrow">AK / {t.deviceNote}</p>
        <h1>
          {t.bag}
          <span className="title-count">
            {" "}
            / {cart.lines.reduce((n, l) => n + l.quantity, 0)}
          </span>
        </h1>
        <p>{t.bagBody}</p>
      </div>
      {removed && (
        <div className="undo-banner">
          <span>{message || t.removed}</span>
          <button onClick={undo}>{t.undo} ↶</button>
        </div>
      )}
      {!cart.lines.length ? (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">
            ↗
          </span>
          <h2>{t.empty}</h2>
          <p>{t.emptyBody}</p>
          <a className="button" href={`/${locale}/store`}>
            {t.explore}
          </a>
        </div>
      ) : (
        <div className="commerce-grid">
          <div className="cart-lines">
            {cart.lines.map((line) => {
              const detail = lineDetail(line)
              if (!detail) return null
              const { product, variant } = detail
              return (
                <article className="cart-line" key={line.variantId}>
                  <a
                    className="cart-art"
                    href={`/${locale}/products/${product.handle}`}
                  >
                    <ProductImage image={product.images[0]} locale={locale} />
                  </a>
                  <div className="cart-line-info">
                    <h2>
                      <a href={`/${locale}/products/${product.handle}`}>
                        {product.copy[locale].title.replace(/^AKLabs /, "")}
                      </a>
                    </h2>
                    <p>
                      {product.options
                        .map(
                          (o) =>
                            o.values.find((v) => v.id === variant.options[o.id])
                              ?.label[locale]
                        )
                        .join(" / ")}
                    </p>
                    <strong>
                      {money(
                        (variant.salePrices || variant.prices)[currency] *
                          line.quantity,
                        currency,
                        locale
                      )}
                    </strong>
                    <div className="cart-line-controls">
                      <label>
                        <span className="sr-only">
                          {t.quantity}: {product.copy[locale].title}
                        </span>
                        <select
                          aria-label={`${t.quantity}: ${product.copy[locale].title}`}
                          value={line.quantity}
                          onChange={(e) =>
                            quantity(line.variantId, Number(e.target.value))
                          }
                        >
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i}>{i + 1}</option>
                          ))}
                        </select>
                      </label>
                      <button
                        onClick={() => remove(line.variantId)}
                        aria-label={`${t.remove}: ${product.copy[locale].title}`}
                      >
                        {t.remove}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
            <a className="text-link" href={`/${locale}/store`}>
              ← {t.continue}
            </a>
          </div>
          <aside className="order-summary">
            <h2>{t.summary}</h2>
            <form
              className="promo-form"
              onSubmit={(e) => {
                e.preventDefault()
                if (apply(code)) {
                  setError("")
                } else setError(t.invalidPromo)
              }}
            >
              <label htmlFor="promotion">{t.promo}</label>
              <div>
                <input
                  id="promotion"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={30}
                  aria-invalid={!!error}
                  aria-describedby="promo-hint promo-error"
                  autoComplete="off"
                />
                <button type="submit">{t.apply}</button>
              </div>
              <p id="promo-hint">{t.promoHint}</p>
              <p id="promo-error" className="form-error" role="status">
                {error}
              </p>
              {cart.promotion && (
                <p className="promo-success" role="status">
                  {t.promoApplied}
                </p>
              )}
            </form>
            <Totals cart={cart} currency={currency} locale={locale} />
            <a className="button full" href={`/${locale}/checkout`}>
              {t.checkout} →
            </a>
            <p className="quiet-note">{t.simulationNote}</p>
          </aside>
        </div>
      )}
    </section>
  )
}
