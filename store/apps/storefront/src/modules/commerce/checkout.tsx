"use client"
import { useEffect, useRef, useState } from "react"
import type { Locale } from "@lib/i18n/locales"
import { commerceCopy } from "@lib/i18n/commerce-copy"
import { useCart, CART_KEY, readCart, lineDetail } from "@lib/sim/cart"
import { placeOrder, validAddress, type Address } from "@lib/sim/orders"
import { usePreferences } from "@lib/sim/preferences"
import { Totals } from "./cart-page"
const blank: Address = {
  name: "",
  street: "",
  city: "",
  postal: "",
  country: "Ecuador",
}
export function Checkout({ locale }: { locale: Locale }) {
  const t = commerceCopy(locale),
    { cart, ready, clear } = useCart(),
    { currency } = usePreferences()
  const [step, setStep] = useState(0),
    [address, setAddress] = useState<Address>(blank),
    [errors, setErrors] = useState<Partial<Record<keyof Address, boolean>>>({}),
    [duration, setDuration] = useState(120000),
    [error, setError] = useState(""),
    [placing, setPlacing] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null),
    initial = useRef(true)
  useEffect(() => {
    if (initial.current) {
      initial.current = false
      return
    }
    heading.current?.focus()
  }, [step])
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("aklabs.checkout")
      if (raw && raw.length < 2000) {
        const a = JSON.parse(raw)
        if (
          a &&
          typeof a === "object" &&
          Object.keys(blank).every(
            (k) => typeof a[k] === "string" && a[k].length <= 100
          )
        )
          setAddress(a)
      }
    } catch {
      /* Empty form is safe. */
    }
  }, [])
  function update(a: Address) {
    setAddress(a)
    try {
      sessionStorage.setItem("aklabs.checkout", JSON.stringify(a))
    } catch {
      /* Checkout remains usable. */
    }
  }
  function next() {
    const invalid = validAddress(address)
    setErrors(invalid)
    if (Object.keys(invalid).length) {
      const field = Object.keys(invalid)[0]
      document.getElementById(`address-${field}`)?.focus()
      return
    }
    setStep(1)
  }
  function submit() {
    if (placing) return
    setPlacing(true)
    setError("")
    try {
      const saved = readCart(localStorage.getItem(CART_KEY))
      if (JSON.stringify(saved) !== JSON.stringify(cart)) {
        setError(t.cartChanged)
        setPlacing(false)
        return
      }
    } catch {
      /* Saving the order below handles storage failure. */
    }
    const order = placeOrder(cart, currency, address, duration)
    if (!order) {
      setError(t.storageFail)
      setPlacing(false)
      return
    }
    clear()
    try {
      sessionStorage.removeItem("aklabs.checkout")
    } catch {
      /* Order was saved. */
    }
    location.assign(`/${locale}/order?id=${encodeURIComponent(order.id)}`)
  }
  if (!ready)
    return (
      <section className="container section">
        <h1>{t.checkoutTitle}</h1>
        <p role="status">{t.bagLoading}</p>
      </section>
    )
  if (!cart.lines.length)
    return (
      <section className="container section">
        <h1>{t.bag}</h1>
        <div className="empty-state">
          <h2>{t.empty}</h2>
          <p>{t.emptyBody}</p>
          <a className="button" href={`/${locale}/store`}>
            {t.explore}
          </a>
        </div>
      </section>
    )
  const steps = [t.address, t.deliveryStep, t.review]
  return (
    <section className="container commerce-page">
      <div className="checkout-heading">
        <a className="text-link" href={`/${locale}/cart`}>
          ← {t.bag}
        </a>
        <h1>{t.checkoutTitle}</h1>
        <p>{t.checkoutBody}</p>
      </div>
      <div className="simulation-notice">
        <span aria-hidden="true">◎</span>
        <p>{t.simulationNote}</p>
      </div>
      <nav className="checkout-steps" aria-label={t.progress}>
        <ol>
          {steps.map((label, i) => (
            <li key={label} aria-current={step === i ? "step" : undefined}>
              <span aria-hidden="true">{i < step ? "✓" : i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
      </nav>
      <div className="commerce-grid">
        <div className="checkout-panel">
          <h2 ref={heading} tabIndex={-1}>
            {steps[step]}
          </h2>
          {step === 0 && (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                next()
              }}
            >
              <button
                className="button secondary demo-button"
                type="button"
                onClick={() => {
                  update({
                    name: t.demoName,
                    street: t.demoStreet,
                    city: t.demoCity,
                    postal: t.demoPostal,
                    country: t.countryName,
                  })
                  setErrors({})
                }}
              >
                {t.demo} ↗
              </button>
              <p className="address-note" id="address-note">
                {t.addressNote}
              </p>
              <div className="address-fields">
                {(["name", "street", "city", "postal", "country"] as const).map(
                  (field) => (
                    <label
                      key={field}
                      className={
                        field === "street" || field === "name" ? "wide" : ""
                      }
                      htmlFor={`address-${field}`}
                    >
                      {t[field]}
                      <input
                        id={`address-${field}`}
                        name={field}
                        autoComplete={
                          field === "name"
                            ? "shipping name"
                            : field === "street"
                              ? "shipping street-address"
                              : field === "city"
                                ? "shipping address-level2"
                                : field === "postal"
                                  ? "shipping postal-code"
                                  : "shipping country-name"
                        }
                        value={address[field]}
                        onChange={(e) =>
                          update({ ...address, [field]: e.target.value })
                        }
                        required
                        maxLength={field === "postal" ? 12 : 100}
                        aria-invalid={!!errors[field]}
                        aria-describedby={
                          errors[field] ? `${field}-error` : "address-note"
                        }
                      />
                      {errors[field] && (
                        <span className="form-error" id={`${field}-error`}>
                          {field === "postal" ? t.postalRequired : t.required}
                        </span>
                      )}
                    </label>
                  )
                )}
              </div>
              <button className="button full" type="submit">
                {t.toDelivery} →
              </button>
            </form>
          )}
          {step === 1 && (
            <>
              <fieldset className="delivery-options">
                <legend className="sr-only">{t.deliveryStep}</legend>
                {[
                  { value: 120000, title: t.standard, body: t.standardBody },
                  { value: 60000, title: t.express, body: t.expressBody },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={duration === option.value ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={option.value}
                      checked={duration === option.value}
                      onChange={() => setDuration(option.value)}
                    />
                    <span>
                      <strong>{option.title}</strong>
                      <small>{option.body}</small>
                    </span>
                    <b>{t.free}</b>
                  </label>
                ))}
              </fieldset>
              <div className="checkout-buttons">
                <button className="button secondary" onClick={() => setStep(0)}>
                  ← {t.back}
                </button>
                <button
                  className="button"
                  aria-label={t.reviewOrder}
                  onClick={() => setStep(2)}
                >
                  {t.reviewOrder} →
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="review-address">
                <h3>{t.address}</h3>
                <p>
                  {address.name}
                  <br />
                  {address.street}
                  <br />
                  {address.city} · {address.postal}
                  <br />
                  {address.country}
                </p>
                <button className="text-link" onClick={() => setStep(0)}>
                  {t.edit} ↗
                </button>
              </div>
              <div className="review-delivery">
                <h3>{t.delivery}</h3>
                <p>{duration === 120000 ? t.standardBody : t.expressBody}</p>
              </div>
              <div className="payment-free">
                <h3>{t.payment}</h3>
                <p>{t.paymentBody}</p>
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error} <a href={`/${locale}/cart`}>{t.refreshCart} →</a>
                </p>
              )}
              <div className="checkout-buttons">
                <button
                  className="button secondary"
                  disabled={placing}
                  onClick={() => setStep(1)}
                >
                  ← {t.back}
                </button>
                <button
                  className="button"
                  aria-label={t.place}
                  disabled={placing}
                  onClick={submit}
                >
                  {t.place} →
                </button>
              </div>
            </>
          )}
        </div>
        <aside className="order-summary">
          <h2>{t.summary}</h2>
          <ul className="checkout-item-list">
            {cart.lines.map((line) => (
              <li key={line.variantId}>
                <span>{lineDetail(line)?.product.copy[locale].title}</span>
                <strong>×{line.quantity}</strong>
              </li>
            ))}
          </ul>
          <Totals cart={cart} currency={currency} locale={locale} />
          <p className="quiet-note">{t.receiptNote}</p>
        </aside>
      </div>
    </section>
  )
}
