"use client"
import { useEffect, useState } from "react"
import { resolveLocale, type Locale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
export default function ErrorPage({ reset }: { reset: () => void }) {
  const [locale, setLocale] = useState<Locale>("en")
  useEffect(() => {
    setLocale(resolveLocale(location.pathname.split("/")[1]))
  }, [])
  const t = siteCopy(locale)
  return (
    <section className="container section">
      <h1>{t.errorTitle}</h1>
      <p>{t.errorBody}</p>
      <button className="button" onClick={reset}>
        {t.retry}
      </button>
    </section>
  )
}
