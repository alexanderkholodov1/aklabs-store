/**
 * Supported UI locales for the AKLabs storefront.
 *
 * To add a language (e.g. `fr`):
 * 1. Append the code here.
 * 2. Add a full dictionary object in `messages.ts` and register it in `messages`.
 * 3. Optionally add product overlays in `product-copy.ts`.
 * LanguageSwitch and getMessages() pick it up from this list — no component rewrites.
 */
export const SUPPORTED_LOCALES = ["en", "es"] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
}

export function isLocale(code: string): code is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(code)
}

/** Resolve a cookie / Accept-Language style code to a supported locale. */
export function resolveLocale(code: string | null | undefined): Locale {
  if (!code) {
    return DEFAULT_LOCALE
  }

  const normalized = code.toLowerCase().replace("_", "-")
  if (isLocale(normalized)) {
    return normalized
  }

  const prefix = normalized.split("-")[0]
  if (isLocale(prefix)) {
    return prefix
  }

  return DEFAULT_LOCALE
}
