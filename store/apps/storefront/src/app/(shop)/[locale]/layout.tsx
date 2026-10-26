import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { isLocale, SUPPORTED_LOCALES } from "@lib/i18n/locales"
import { PreferencesProvider } from "@lib/sim/preferences"
import { Shell } from "@modules/layout/shell"
import { SITE } from "@lib/site"
import "styles/globals.css"
export const dynamicParams = false
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "AKLabs Store — Everyday experiments",
    template: "%s | AKLabs Store",
  },
  description:
    "Explore fictional AKLabs merch. A complete shopping experiment with zero charges, built by Alexander Kholodov.",
  icons: { icon: "/aklabs/brand/logo-circle.png" },
}
export const viewport: Viewport = { themeColor: "#101d39" }
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <html lang={locale}>
      <body>
        <PreferencesProvider locale={locale}>
          <Shell locale={locale}>{children}</Shell>
        </PreferencesProvider>
      </body>
    </html>
  )
}
