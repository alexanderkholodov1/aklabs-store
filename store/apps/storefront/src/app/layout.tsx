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
    default: "AKLabs Store | Merch oficial",
    template: "%s | AKLabs Store",
  },
  description:
    "Hoodies, gorras, camisetas, joggers y termos AKLabs. Envíos a todo Ecuador con precios en dólares.",
  icons: {
    icon: "/aklabs/brand/logo-circle.png",
    apple: "/aklabs/brand/logo-circle.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#060B2B",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      data-mode="light"
      className={`${sans.variable} ${display.variable}`}
    >
      <body className="font-sans">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
