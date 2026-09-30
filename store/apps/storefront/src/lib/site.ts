/**
 * Who built this store and where to reach them. Single source of truth for
 * the about page, footer, navigation and the delivery e-mail business card.
 */
export const SITE = {
  brand: "AKLabs",
  storeName: "AKLabs Store",
  owner: "Alexander Kholodov",
  // TODO(owner): replace with the real LinkedIn profile URL.
  linkedin: "https://www.linkedin.com/in/",
  github: "https://github.com/alexanderkholodov1",
  repository: "https://github.com/alexanderkholodov1/supaday-ecommerce",
  /** Shown everywhere a visitor could mistake the demo for a real shop. */
  isDemoStore: true,
} as const
