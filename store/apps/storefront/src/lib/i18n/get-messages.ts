import { getLocale } from "@lib/data/locale-actions"
import { dictionaryFor } from "./dictionary"
import { Locale, resolveLocale } from "./locales"
import { Messages } from "./messages"

/**
 * Server-side translations for the current request (locale from the cookie).
 * Client Components use `useI18n()` from `@lib/i18n/client` instead.
 */
export async function getMessages(): Promise<{ locale: Locale; t: Messages }> {
  const code = await getLocale()
  const locale = resolveLocale(code)
  return { locale, t: dictionaryFor(locale) }
}
