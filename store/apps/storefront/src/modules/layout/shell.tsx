"use client"
import { Icon } from "@modules/common/icon"
import { useCart } from "@lib/sim/cart"
import { OfflineStatus } from "./offline"
import { Suspense, useRef, useState } from "react"
import type { Locale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
import { SITE } from "@lib/site"
import { usePreferences } from "@lib/sim/preferences"
export function Shell({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: Locale
}) {
  const t = siteCopy(locale)
  const { count } = useCart()
  const { currency, setCurrency, dark, toggleDark, ready } = usePreferences()
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const other = locale === "en" ? "es" : "en"
  const switchLanguage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    location.assign(
      location.pathname.replace(/^\/(en|es)(?=\/|$)/, `/${other}`) +
        location.search +
        location.hash
    )
  }
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <div className="announcement">
        <span>{t.announcement}</span>
        <a href={`/${locale}/what-is-real`} className="simulation-chip">
          {t.simulation}
          <span aria-hidden="true">
            {" "}
            <Icon name="arrow-up" />
          </span>
        </a>
      </div>
      <header
        className="site-header"
        onKeyDown={(e) => {
          if (e.key === "Escape" && open) {
            setOpen(false)
            toggle.current?.focus()
          }
        }}
      >
        <div className="header-inner">
          <a href={`/${locale}`} className="wordmark" aria-label="AKLabs Store">
            <img
              src="/aklabs/brand/logo-circle.png"
              width={34}
              height={32}
              alt=""
              decoding="async"
            />
            <span>
              AKLABS<span className="wordmark-store"> / STORE</span>
            </span>
          </a>
          <nav className="desktop-nav" aria-label={t.menu}>
            <a href={`/${locale}/store`}>{t.shop}</a>
            <a href={`/${locale}/how-it-works`}>{t.how}</a>
            <a href={`/${locale}/about`}>{t.about}</a>
          </nav>
          <div className="header-actions">
            <label className="currency-control">
              <span className="sr-only">{t.currency}</span>
              <select
                value={currency}
                disabled={!ready}
                data-preferences-ready={ready}
                onChange={(e) => setCurrency(e.target.value as "USD" | "EUR")}
              >
                <option>USD</option>
                <option>EUR</option>
              </select>
            </label>
            <a
              className="language-link"
              href={`/${other}`}
              onClick={switchLanguage}
              lang={other}
              aria-label={other === "en" ? "English" : "Español"}
            >
              {other.toUpperCase()}
            </a>
            <a
              className="bag-link"
              aria-label={`${t.cart} (${count})`}
              href={`/${locale}/cart`}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M5 7h14l1 14H4L5 7Z" />
                <path d="M8 8V6a4 4 0 0 1 8 0v2" />
              </svg>
              <span>{t.cart}</span>
              <span className="bag-count" aria-hidden="true">
                {count}
              </span>
              <span className="sr-only">{count}</span>
            </a>
            <button
              className="menu-toggle"
              ref={toggle}
              aria-label={open ? t.close : t.menu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(!open)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
        {open && (
          <nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label={t.menu}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false)
                toggle.current?.focus()
              }
            }}
          >
            <a href={`/${locale}/store`}>{t.shop}</a>
            <a href={`/${locale}/how-it-works`}>{t.how}</a>
            <a href={`/${locale}/about`}>{t.about}</a>
            <a href={`/${locale}/what-is-real`}>{t.real}</a>
          </nav>
        )}
      </header>
      <main id="main" tabIndex={-1}>
        <Suspense fallback={null}>{children}</Suspense>
      </main>
      <footer className="site-footer">
        <div className="footer-main container">
          <div>
            <a className="wordmark" href={`/${locale}`}>
              AKLABS<span className="wordmark-store"> / STORE</span>
            </a>
            <p>{t.footerLine}</p>
            <span className="footer-coordinate">
              00° 10′ S / 78° 28′ W · QUITO
            </span>
          </div>
          <nav aria-label={`${t.menu} · AKLabs`}>
            <a href={`/${locale}/store`}>{t.shop}</a>
            <a href={`/${locale}/about`}>{t.about}</a>
            <a href={`/${locale}/how-it-works`}>{t.how}</a>
            <a href={`/${locale}/what-is-real`}>{t.real}</a>
          </nav>
          <div className="footer-social">
            <a href={SITE.github}>
              GitHub <Icon name="arrow-up" />
            </a>
            <a href={SITE.linkedin}>
              LinkedIn <Icon name="arrow-up" />
            </a>
            <a href={SITE.instagram}>
              Instagram <Icon name="arrow-up" />
            </a>
            <button
              className="theme-toggle"
              aria-pressed={dark}
              onClick={toggleDark}
            >
              <Icon name={dark ? "sun" : "moon"} /> {t.theme}
            </button>
          </div>
        </div>
        <div className="footer-bottom container">
          <span>
            {t.madeBy} <a href={`/${locale}/about`}>{SITE.owner}</a>
          </span>
          <span>{t.footerNote}</span>
          <OfflineStatus locale={locale} />
          <span>© 2026 AKLabs</span>
        </div>
      </footer>
    </>
  )
}
