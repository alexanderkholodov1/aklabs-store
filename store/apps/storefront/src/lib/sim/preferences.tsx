"use client"
import { createContext, useContext, useEffect, useState } from "react"
import type { Currency } from "@lib/catalog"
import type { Locale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
const Preferences = createContext({
  currency: "USD" as Currency,
  ready: false,
  setCurrency: (_value: Currency) => {},
  dark: false,
  toggleDark: () => {},
})
export const usePreferences = () => useContext(Preferences)
export function PreferencesProvider({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: Locale
}) {
  const [currency, update] = useState<Currency>("USD")
  const [ready, setReady] = useState(false)
  const [dark, setDark] = useState(false)
  const [warning, setWarning] = useState(false)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aklabs.currency")
      if (saved === "EUR" || saved === "USD") update(saved)
      setDark(localStorage.getItem("aklabs.theme") === "dark")
    } catch {
      setWarning(true)
    }
    setReady(true)
  }, [])
  useEffect(() => {
    if (ready) document.documentElement.dataset.theme = dark ? "dark" : "light"
  }, [dark, ready])
  const setCurrency = (value: Currency) => {
    update(value)
    try {
      localStorage.setItem("aklabs.currency", value)
    } catch {
      setWarning(true)
    }
  }
  const toggleDark = () => {
    setDark(!dark)
    try {
      localStorage.setItem("aklabs.theme", dark ? "light" : "dark")
    } catch {
      setWarning(true)
    }
  }
  return (
    <Preferences.Provider
      value={{ currency, setCurrency, dark, toggleDark, ready }}
    >
      {warning && (
        <p className="storage-warning" role="status">
          {siteCopy(locale).storageWarning}
        </p>
      )}
      {children}
    </Preferences.Provider>
  )
}
