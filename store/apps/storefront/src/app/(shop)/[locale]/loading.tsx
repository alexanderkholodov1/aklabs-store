import { resolveLocale } from "@lib/i18n/locales"
export default function Loading() {
  return (
    <div className="container section" aria-busy="true">
      <span className="sr-only" lang={resolveLocale("en")}>
        AKLabs
      </span>
      <div className="loading-skeleton" />
    </div>
  )
}
