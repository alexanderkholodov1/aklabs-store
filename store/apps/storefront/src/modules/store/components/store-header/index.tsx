import { Aurora, Eyebrow } from "@modules/common/components/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Crumb = { label: string; href?: string }

/** Dark glass banner shown on top of listing pages (store, categories). */
const StoreHeader = ({
  eyebrow,
  title,
  description,
  crumbs = [],
  testId,
}: {
  eyebrow?: string
  title: string
  description?: string | null
  crumbs?: Crumb[]
  testId?: string
}) => {
  return (
    <div className="relative mb-6 overflow-hidden rounded-[36px] bg-ak-navy px-6 py-10 text-white small:px-10 small:py-14">
      <Aurora className="opacity-70" />
      <div className="relative flex flex-col gap-4">
        {crumbs.length > 0 && (
          <nav aria-label="Ruta" className="flex flex-wrap items-center gap-2 text-sm text-white/60">
            <LocalizedClientLink href="/" className="hover:text-white">
              Inicio
            </LocalizedClientLink>
            {crumbs.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {crumb.href ? (
                  <LocalizedClientLink href={crumb.href} className="hover:text-white">
                    {crumb.label}
                  </LocalizedClientLink>
                ) : (
                  <span className="text-white/85">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <Eyebrow tone="dark">{eyebrow}</Eyebrow>}
        <h1
          className="font-display text-6xl leading-[0.9] tracking-wide small:text-8xl"
          data-testid={testId}
        >
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-base text-white/70 small:text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export default StoreHeader
