"use client"

import { updateLocale } from "@lib/data/locale-actions"
import {
  Locale,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
} from "@lib/i18n/locales"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

export default function LanguageSwitch({
  locale,
  className,
}: {
  locale: Locale
  className?: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const choose = (next: Locale) => {
    if (next === locale) {
      return
    }
    startTransition(async () => {
      await updateLocale(next)
      router.refresh()
    })
  }

  return (
    <div
      className={
        className ??
        "hidden small:flex items-center rounded-full bg-white/70 p-1 text-xs font-semibold"
      }
      role="group"
      aria-label={locale === "es" ? "Idioma" : "Language"}
    >
      {SUPPORTED_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          disabled={pending}
          aria-pressed={locale === code}
          onClick={() => choose(code)}
          className={
            locale === code
              ? "rounded-full bg-ak-ink px-2.5 py-1 text-white"
              : "rounded-full px-2.5 py-1 text-ak-ink/60 hover:text-ak-ink"
          }
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  )
}
