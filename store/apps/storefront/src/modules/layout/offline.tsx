"use client"
import { useEffect, useState } from "react"
import { siteCopy } from "@lib/i18n/site-copy"
import type { Locale } from "@lib/i18n/locales"
export function OfflineStatus({ locale }: { locale: Locale }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let active = true
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => navigator.serviceWorker.ready)
        .then(() => {
          if (active) setReady(true)
        })
        .catch(() => {
          /* The online experience remains available. */
        })
    }
    return () => {
      active = false
    }
  }, [])
  const t = siteCopy(locale)
  return (
    <span className="offline-status" data-offline-ready={ready}>
      {ready ? t.offlineReady : t.offlineDefault}
    </span>
  )
}
