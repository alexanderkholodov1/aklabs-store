import { DEFAULT_LOCALE, Locale } from "./locales"
import { Messages, messages } from "./messages"

/**
 * Deep-merge `primary` onto `fallback` so missing keys in a partial locale
 * dictionary still resolve to English (or whatever DEFAULT_LOCALE is).
 */
function withFallback<T>(primary: T, fallback: T): T {
  if (primary === undefined || primary === null) {
    return fallback
  }

  if (
    typeof primary !== "object" ||
    Array.isArray(primary) ||
    typeof primary === "function"
  ) {
    return primary
  }

  if (typeof fallback !== "object" || fallback === null || Array.isArray(fallback)) {
    return primary
  }

  const result = { ...(fallback as Record<string, unknown>) }
  for (const key of Object.keys(primary as object)) {
    const p = (primary as Record<string, unknown>)[key]
    const f = (fallback as Record<string, unknown>)[key]
    result[key] = withFallback(p as never, f as never)
  }
  return result as T
}

const cache = new Map<Locale, Messages>()

/**
 * Dictionary for a locale, with English as the fallback for missing keys.
 * Pure and synchronous, so it works in Server and Client Components alike.
 */
export function dictionaryFor(locale: Locale): Messages {
  const hit = cache.get(locale)
  if (hit) {
    return hit
  }

  const base = messages[DEFAULT_LOCALE]
  const dict = locale === DEFAULT_LOCALE ? base : withFallback(messages[locale], base)
  cache.set(locale, dict)
  return dict
}
