"use client"
import { useEffect, useMemo, useState } from "react"
import { catalog, type Category, type Product } from "@lib/catalog"
import type { Locale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
import { usePreferences } from "@lib/sim/preferences"
import { ProductCard } from "./product-card"
const PER_PAGE = 12
const sorts = ["created_at", "price_asc", "price_desc", "name"]
export function Listing({
  products,
  locale,
  category,
}: {
  products: Product[]
  locale: Locale
  category?: Category
}) {
  const t = siteCopy(locale)
  const { currency } = usePreferences()
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("created_at")
  const [page, setPage] = useState(1)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const read = () => {
      const q = new URLSearchParams(location.search)
      setSearch(q.get("q")?.slice(0, 100) || "")
      setSort(
        sorts.includes(q.get("sort") || "") ? q.get("sort")! : "created_at"
      )
      setPage(Math.max(1, Number.parseInt(q.get("page") || "1", 10) || 1))
      setReady(true)
    }
    read()
    window.addEventListener("popstate", read)
    return () => window.removeEventListener("popstate", read)
  }, [])
  useEffect(() => {
    if (!ready) return
    const q = new URLSearchParams()
    if (search) q.set("q", search)
    if (sort !== "created_at") q.set("sort", sort)
    if (page > 1) q.set("page", String(page))
    history.replaceState(
      null,
      "",
      `${location.pathname}${q.size ? `?${q}` : ""}`
    )
  }, [search, sort, page, ready])
  const filtered = useMemo(() => {
    const list = products.filter((p) =>
      `${p.copy[locale].title} ${p.copy[locale].subtitle}`
        .toLocaleLowerCase(locale)
        .includes(search.toLocaleLowerCase(locale))
    )
    if (sort === "name")
      list.sort((a, b) =>
        a.copy[locale].title.localeCompare(b.copy[locale].title, locale)
      )
    if (sort.startsWith("price"))
      list.sort(
        (a, b) =>
          ((a.salePrices || a.prices)[currency] -
            (b.salePrices || b.prices)[currency]) *
          (sort === "price_desc" ? -1 : 1)
      )
    return list
  }, [products, locale, search, sort, currency])
  const total = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, total)
  return (
    <>
      <div className="listing-tools">
        <label className="search-field">
          {t.search}
          <input
            type="search"
            value={search}
            placeholder={t.searchPlaceholder}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </label>
        <label>
          {t.sort}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
          >
            <option value="created_at">{t.curated}</option>
            <option value="price_asc">{t.low}</option>
            <option value="price_desc">{t.high}</option>
            <option value="name">{t.name}</option>
          </select>
        </label>
      </div>
      <nav className="category-chips" aria-label={t.categories}>
        <a
          href={`/${locale}/store`}
          aria-current={!category ? "page" : undefined}
        >
          {t.all}
        </a>
        {catalog.categories.map((c) => (
          <a
            key={c.id}
            href={`/${locale}/categories/${c.handle}`}
            aria-current={category?.id === c.id ? "page" : undefined}
          >
            {c.name[locale]}
          </a>
        ))}
      </nav>
      <p className="result-count" role="status">
        {filtered.length} {t.pieces} <span>· {currency}</span>
      </p>
      {filtered.length ? (
        <>
          <div className="product-grid">
            {filtered
              .slice((current - 1) * PER_PAGE, current * PER_PAGE)
              .map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  locale={locale}
                  priority={i < 4}
                />
              ))}
          </div>
          <nav className="pagination" aria-label={t.pagination}>
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                aria-label={`${t.page} ${i + 1}`}
                aria-current={i + 1 === current ? "page" : undefined}
                onClick={() => {
                  setPage(i + 1)
                  document.querySelector(".listing-tools")?.scrollIntoView()
                }}
              >
                {i + 1}
              </button>
            ))}
            <span>
              {t.page} {current} {t.of} {total}
            </span>
          </nav>
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">
            ⌕
          </span>
          <h2>{t.emptyTitle}</h2>
          <p>{t.emptyBody}</p>
          <button
            className="button"
            onClick={() => {
              setSearch("")
              setSort("created_at")
              setPage(1)
            }}
          >
            {t.clear}
          </button>
        </div>
      )}
    </>
  )
}
