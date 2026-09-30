import { getLocale } from "@lib/data/locale-actions"
import { I18nProvider } from "@lib/i18n/client"
import { resolveLocale } from "@lib/i18n/locales"
import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import { Bebas_Neue, Inter } from "next/font/google"
import "styles/globals.css"

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "AKLabs Store",
    template: "%s | AKLabs Store",
  },
  description:
    "AKLabs merch: hoodies, caps, tees, stickers, keychains, and figures. Ships across Ecuador in US dollars.",
  icons: {
    icon: "/aklabs/brand/logo-circle.png",
    apple: "/aklabs/brand/logo-circle.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#060B2B",
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = resolveLocale(await getLocale())

  return (
    <html
      lang={locale}
      data-mode="light"
      className={`${sans.variable} ${display.variable}`}
    >
      <body className="font-sans">
        <I18nProvider locale={locale}>
          <main className="relative">{props.children}</main>
        </I18nProvider>
      </body>
    </html>
  )
}
