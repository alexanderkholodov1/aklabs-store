"use client"

import { createContext, useContext, useMemo } from "react"

import { dictionaryFor } from "./dictionary"
import { DEFAULT_LOCALE, Locale } from "./locales"
import { Messages } from "./messages"

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

/**
 * Makes the request locale available to Client Components. Only the locale
 * code crosses the server/client boundary; dictionaries are imported here,
 * so entries may contain formatter functions.
 */
export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

/** Translations for Client Components: `const { t, locale } = useI18n()`. */
export function useI18n(): { locale: Locale; t: Messages } {
  const locale = useContext(LocaleContext)
  const t = useMemo(() => dictionaryFor(locale), [locale])
  return { locale, t }
}
