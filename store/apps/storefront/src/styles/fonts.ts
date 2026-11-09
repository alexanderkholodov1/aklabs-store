import { Bebas_Neue, Inter } from "next/font/google"

// The AKLabs design system (2026-09-28): Bebas Neue for headlines, the face of
// the AKLABS wordmark, and Inter for text. next/font downloads both at build
// time and serves them from this site, so no request leaves for Google.
export const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
})

export const textFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

export const fontVariables = `${displayFont.variable} ${textFont.variable}`
