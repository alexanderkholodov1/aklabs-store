"use client"
import { useEffect, useRef, useState } from "react"
import { money } from "@lib/catalog"
import type { Locale } from "@lib/i18n/locales"
import { commerceCopy } from "@lib/i18n/commerce-copy"
import {
  loadOrders,
  ORDERS_KEY,
  courierStage,
  type Order,
} from "@lib/sim/orders"
import { lineDetail } from "@lib/sim/cart"
import { Totals } from "./cart-page"
function useOrder() {
  const [order, setOrder] = useState<Order | null>(null),
    [ready, setReady] = useState(false)
  useEffect(() => {
    const read = () => {
      const id = new URLSearchParams(location.search).get("id")
      setOrder(loadOrders().find((o) => o.id === id) || null)
      setReady(true)
    }
    read()
    addEventListener("storage", read)
    return () => removeEventListener("storage", read)
  }, [])
  return { order, ready, setOrder }
}
function NoOrder({ locale }: { locale: Locale }) {
  const t = commerceCopy(locale),
    [recent, setRecent] = useState<Order | null>(null)
  useEffect(() => {
    setRecent(loadOrders()[0] || null)
  }, [])
  return (
    <section className="container section">
      <h1>{t.noOrder}</h1>
      <p>{t.noOrderBody}</p>
      <div className="hero-actions">
        <a className="button" href={`/${locale}/store`}>
          {t.explore}
        </a>
        {recent && (
          <a className="text-link" href={`/${locale}/order?id=${recent.id}`}>
            {t.recent} →
          </a>
        )}
      </div>
    </section>
  )
}
export function OrderPage({ locale }: { locale: Locale }) {
  const t = commerceCopy(locale),
    { order, ready, setOrder } = useOrder(),
    [confirming, setConfirming] = useState(false),
    [message, setMessage] = useState("")
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (confirming) dialog.current?.showModal()
    else dialog.current?.close()
  }, [confirming])
  function close() {
    setConfirming(false)
    trigger.current?.focus()
  }
  if (!ready)
    return (
      <section className="container section">
        <h1>{t.order}</h1>
        <p role="status">{t.orderLoading}</p>
      </section>
    )
  if (!order) return <NoOrder locale={locale} />
  return (
    <section className="container commerce-page">
      <div className="order-celebration">
        <span className="confirmation-mark" aria-hidden="true">
          ✓
        </span>
        <p className="eyebrow">
          {order.id} / {t.saved}
        </p>
        <h1>{t.confirmed}</h1>
        <p>{t.confirmedBody}</p>
        <a
          className="button"
          aria-label={t.track}
          href={`/${locale}/tracking?id=${order.id}`}
        >
          {t.track} ↗
        </a>
      </div>
      <div className="commerce-grid receipt-grid">
        <div className="receipt-detail">
          <h2>{t.receipt}</h2>
          <ul className="receipt-lines">
            {order.cart.lines.map((line) => {
              const detail = lineDetail(line)
              if (!detail) return null
              return (
                <li key={line.variantId}>
                  <span>
                    {detail.product.copy[locale].title}{" "}
                    <small>× {line.quantity}</small>
                    <em>
                      {detail.product.options
                        .map(
                          (o) =>
                            o.values.find(
                              (v) => v.id === detail.variant.options[o.id]
                            )?.label[locale]
                        )
                        .join(" / ")}
                    </em>
                  </span>
                  <strong>
                    {money(
                      (detail.variant.salePrices || detail.variant.prices)[
                        order.currency
                      ] * line.quantity,
                      order.currency,
                      locale
                    )}
                  </strong>
                </li>
              )
            })}
          </ul>
          <div className="receipt-address">
            <h3>{t.address}</h3>
            <p>
              {order.address.name}
              <br />
              {order.address.street}
              <br />
              {order.address.city} · {order.address.postal}
              <br />
              {order.address.country}
            </p>
          </div>
          <p className="receipt-footer">{t.simulationNote}</p>
        </div>
        <aside className="order-summary">
          <h2>{t.paid}</h2>
          <Totals cart={order.cart} currency={order.currency} locale={locale} />
          <p className="quiet-note">{t.receiptNote}</p>
        </aside>
      </div>
      <div className="privacy-card">
        <div>
          <h2>{t.privacy}</h2>
          <p>{t.privacyBody}</p>
          <p className="quiet-note">{t.savedBody}</p>
        </div>
        <button
          className="text-link"
          ref={trigger}
          onClick={() => setConfirming(true)}
        >
          {t.clearHistory}
        </button>
      </div>
      <p role="status">{message}</p>
      <dialog
        ref={dialog}
        onCancel={(e) => {
          e.preventDefault()
          close()
        }}
        aria-labelledby="delete-title"
      >
        <h2 id="delete-title">{t.deleteQuestion}</h2>
        <div className="hero-actions">
          <button className="button secondary" onClick={close}>
            {t.cancel}
          </button>
          <button
            className="button"
            onClick={() => {
              try {
                localStorage.removeItem(ORDERS_KEY)
                setMessage(t.historyDeleted)
                close()
                setOrder(null)
              } catch {
                setMessage(t.storageFail)
              }
            }}
          >
            {t.confirmDelete}
          </button>
        </div>
      </dialog>
    </section>
  )
}
export function TrackingPage({ locale }: { locale: Locale }) {
  const t = commerceCopy(locale),
    { order, ready } = useOrder(),
    [now, setNow] = useState(0),
    [paused, setPaused] = useState(false)
  useEffect(() => {
    setNow(Date.now())
    if (paused || !order || courierStage(order, Date.now()) === 3) return
    const tick = setInterval(() => {
      const time = Date.now()
      setNow(time)
      if (courierStage(order, time) === 3) clearInterval(tick)
    }, 1000)
    return () => clearInterval(tick)
  }, [order, paused])
  if (!ready)
    return (
      <section className="container section">
        <h1>{t.tracking}</h1>
        <p role="status">{t.orderLoading}</p>
      </section>
    )
  if (!order) return <NoOrder locale={locale} />
  const stage = courierStage(order, now || order.createdAt),
    progress = Math.min(
      1,
      Math.max(0, (now - order.createdAt) / order.duration)
    )
  const steps = [
    { title: t.placed, body: t.placedBody },
    { title: t.preparing, body: t.preparingBody },
    { title: t.transit, body: t.transitBody },
    { title: t.arrived, body: t.arrivedBody },
  ]
  return (
    <section className="container commerce-page tracking-page">
      <div className="page-intro">
        <p className="eyebrow">
          {order.id} / {t.delivery}
        </p>
        <h1>{t.tracking}</h1>
        <p>{t.trackingBody}</p>
      </div>
      <div className="tracking-grid">
        <div className="courier-map">
          <svg viewBox="0 0 600 450" role="img" aria-label={t.route}>
            <title>{t.route}</title>
            <defs>
              <pattern
                id="city-grid"
                width="70"
                height="70"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 70 0 L 0 0 0 70"
                  fill="none"
                  stroke="#c8d2cf"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="600" height="450" fill="#e8ede4" />
            <rect width="600" height="450" fill="url(#city-grid)" />
            <path
              d="M-30 340Q140 200 280 320T650 330"
              stroke="#bddced"
              strokeWidth="55"
              fill="none"
            />
            <path
              d="M-30 340Q140 200 280 320T650 330"
              stroke="#d7eef6"
              strokeWidth="35"
              fill="none"
            />
            <g fill="#cedbc5">
              <rect x="30" y="35" width="110" height="90" rx="14" />
              <rect x="360" y="35" width="170" height="80" rx="14" />
              <rect x="65" y="355" width="110" height="65" rx="12" />
            </g>
            <path
              d="M80 170H220V95H305V230H430V340H525"
              stroke="#fff"
              strokeWidth="18"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M80 170H220V95H305V230H430V340H525"
              stroke="#1739c6"
              strokeWidth="5"
              fill="none"
              strokeLinejoin="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - progress}
            />
            <circle
              cx="80"
              cy="170"
              r="12"
              fill="#101d39"
              stroke="#fff"
              strokeWidth="4"
            />
            <circle
              cx="525"
              cy="340"
              r="12"
              fill="#1739c6"
              stroke="#fff"
              strokeWidth="4"
            />
            <text
              x="60"
              y="145"
              fill="#101d39"
              fontSize="15"
              fontFamily="Arial"
            >
              {t.lab}
            </text>
            <text
              x="420"
              y="380"
              fill="#101d39"
              fontSize="15"
              fontFamily="Arial"
            >
              {t.doorstep}
            </text>
            <g
              transform={`translate(${routePosition(progress).x},${routePosition(progress).y})`}
            >
              <circle r="17" fill="#fff" />
              <circle r="12" fill="#1739c6" />
              <path
                d="m-5 1 4-5 6 8"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
              />
            </g>
          </svg>
          <div className="map-caption">
            <span>{t.simulationNote}</span>
            <span aria-hidden="true">AK / LOCAL</span>
          </div>
        </div>
        <div className="tracking-timeline">
          <p className="eyebrow">{t.estimated}</p>
          <strong className="arrival-time">
            {stage === 3
              ? t.completed
              : new Intl.DateTimeFormat(locale, {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(order.createdAt + order.duration)}
          </strong>
          <ol aria-label={t.timeline}>
            {steps.map((step, i) => (
              <li
                key={step.title}
                className={i <= stage ? "complete" : ""}
                aria-current={i === stage ? "step" : undefined}
              >
                <span aria-hidden="true">{i < stage ? "✓" : i + 1}</span>
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.body}</p>
                  {i === stage && <small>{t.current}</small>}
                </div>
              </li>
            ))}
          </ol>
          <p
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {steps[stage].title}
          </p>
          {stage < 3 && (
            <button
              className="text-link tracking-pause"
              aria-pressed={paused}
              onClick={() => setPaused(!paused)}
            >
              {paused ? t.resume : t.pause}
            </button>
          )}
          {paused && <p className="quiet-note">{t.paused}</p>}
          <a
            className="button secondary full"
            href={`/${locale}/order?id=${order.id}`}
          >
            {t.seeOrder} ↗
          </a>
        </div>
      </div>
      <div className="tracking-outro">
        <a className="text-link" href={`/${locale}/store`}>
          {t.continue} ↗
        </a>
        <p>{t.receiptNote}</p>
      </div>
    </section>
  )
}
// Same polyline as the accessible SVG route; interpolate by distance, independent of frame rate.
export function routePosition(progress: number) {
  const points = [
    [80, 170],
    [220, 170],
    [220, 95],
    [305, 95],
    [305, 230],
    [430, 230],
    [430, 340],
    [525, 340],
  ]
  const lengths = points
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]))
  let remaining = lengths.reduce((a, b) => a + b, 0) * progress
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const r = remaining / lengths[i]
      return {
        x: points[i][0] + (points[i + 1][0] - points[i][0]) * r,
        y: points[i][1] + (points[i + 1][1] - points[i][1]) * r,
      }
    }
    remaining -= lengths[i]
  }
  return { x: 525, y: 340 }
}
