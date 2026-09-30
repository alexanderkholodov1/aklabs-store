import { getMessages } from "@lib/i18n/get-messages"
import { Aurora, Eyebrow } from "@modules/common/components/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InfoHint, { type InfoHintTopic } from "@modules/showcase/components/info-hint"

type Crumb = { label: string; href?: string }

/** Dark glass banner on top of listing pages (shop, categories, collections). */
const StoreHeader = async ({
  eyebrow,
  title,
  description,
  crumbs = [],
  hint,
  testId,
}: {
  eyebrow?: string
  title: string
  description?: string | null
  crumbs?: Crumb[]
  hint?: InfoHintTopic
  testId?: string
}) => {
  const { t } = await getMessages()

  return (
    <header className="relative mb-5 rounded-[clamp(1.75rem,1rem+2vw,2.25rem)] bg-ak-navy px-[clamp(1.25rem,0.6rem+2.8vw,3.5rem)] py-[clamp(1.75rem,1rem+3vw,3.5rem)] text-white">
      <Aurora className="opacity-70" />
      <div className="relative flex flex-col gap-[clamp(0.75rem,0.5rem+1vw,1.25rem)]">
        {crumbs.length > 0 && (
          <nav aria-label={t.common.breadcrumb}>
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/70">
              <li>
                <LocalizedClientLink href="/" className="hover:text-white">
                  {t.common.home}
                </LocalizedClientLink>
              </li>
              {crumbs.map((crumb) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  {crumb.href ? (
                    <LocalizedClientLink href={crumb.href} className="hover:text-white">
                      {crumb.label}
                    </LocalizedClientLink>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {(eyebrow || hint) && (
          <div className="flex items-center gap-2">
            {eyebrow && <Eyebrow tone="dark">{eyebrow}</Eyebrow>}
            {hint && <InfoHint topic={hint} />}
          </div>
        )}
        <h1
          className="font-display type-display-lg break-words tracking-wide"
          data-testid={testId}
        >
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-white/75 type-lead">{description}</p>
        )}
      </div>
    </header>
  )
}

export default StoreHeader
