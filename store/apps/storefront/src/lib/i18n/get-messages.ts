import { getLocale } from "@lib/data/locale-actions"
import { DEFAULT_LOCALE, Locale, resolveLocale } from "./locales"
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

function dictionaryFor(locale: Locale): Messages {
  const base = messages[DEFAULT_LOCALE]
  if (locale === DEFAULT_LOCALE) {
    return base
  }
  return withFallback(messages[locale], base)
}

export async function getMessages(): Promise<{ locale: Locale; t: Messages }> {
  const code = await getLocale()
  const locale = resolveLocale(code)
  return { locale, t: dictionaryFor(locale) }
}
