/* eslint-disable @next/next/no-img-element */
import type { CatalogImage } from "@lib/catalog"
import type { Locale } from "@lib/i18n/locales"
export function ProductImage({
  image,
  locale,
  priority = false,
  sizes = "(max-width: 600px) 46vw, (max-width: 1000px) 30vw, 320px",
}: {
  image: CatalogImage
  locale: Locale
  priority?: boolean
  sizes?: string
}) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${image.avif[400]} 400w, ${image.avif[800]} 800w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`${image.webp[400]} 400w, ${image.webp[800]} 800w`}
        sizes={sizes}
      />
      <img
        src={image.webp[400]}
        width={image.width}
        height={image.height}
        alt={image.alt[locale]}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  )
}
