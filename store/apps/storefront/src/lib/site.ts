/**
 * Who built this store and where to reach them. Single source of truth for
 * the about page, footer, navigation and the delivery e-mail business card.
 * Long-form copy about the author lives in `./profile.ts`.
 */
export const SITE = {
  brand: "AKLabs",
  storeName: "AKLabs Store",
  owner: "Alexander Kholodov",
  linkedin: "https://www.linkedin.com/in/alexanderkholodov1/",
  instagram: "https://www.instagram.com/alexanderkholodov1/",
  github: "https://github.com/alexanderkholodov1",
  repository: "https://github.com/alexanderkholodov1/aklabs-store",
  url: "https://aklabs-store.web.app",
  /** Shown everywhere a visitor could mistake the demo for a real shop. */
  isDemoStore: true,
} as const

/**
 * Preferred social link per interface language: LinkedIn is written in
 * English, Instagram in Spanish.
 */
export const SOCIAL_BY_LOCALE = {
  en: { label: "LinkedIn", href: SITE.linkedin },
  es: { label: "Instagram", href: SITE.instagram },
} as const
