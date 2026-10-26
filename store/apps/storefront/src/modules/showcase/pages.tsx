import { Icon } from "@modules/common/icon"
import type { Locale } from "@lib/i18n/locales"
import { profileFor } from "@lib/profile"
import { SITE, SOCIAL_BY_LOCALE } from "@lib/site"
import { showcaseCopy } from "./copy"
import "./showcase.css"

function Arrow() {
  return (
    <span aria-hidden="true">
      <Icon name="arrow-up" />
    </span>
  )
}

export function AboutPage({ locale }: { locale: Locale }) {
  const t = showcaseCopy(locale).about
  const profile = profileFor(locale)
  const contact = SOCIAL_BY_LOCALE[locale]

  return (
    <div className="showcase container">
      <section className="showcase-about-hero">
        <div className="page-intro">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.headline}</h1>
          <p className="showcase-name">{SITE.owner}</p>
          <p>{profile.short}</p>
          <a className="text-link" href={contact.href}>
            {t.contact} · {contact.label} <Arrow />
          </a>
        </div>
        <div className="showcase-identity">
          <div className="showcase-monogram" aria-hidden="true">
            <svg viewBox="0 0 245 190" fill="none">
              <path
                d="M19 163 89 27h28L58 163H19Zm50-45h72v24H57l12-24Zm62-91h29v57l40-57h34l-58 71 64 65h-39l-58-63V27Z"
                fill="currentColor"
              />
            </svg>
            <span className="showcase-orbit showcase-orbit-one" />
            <span className="showcase-orbit showcase-orbit-two" />
          </div>
          <div className="showcase-identity-caption">
            <strong>{SITE.brand}</strong>
            <span>{t.monogramCaption}</span>
          </div>
        </div>
      </section>

      <section className="showcase-split showcase-divider">
        <div>
          <p className="eyebrow">01 / {SITE.brand}</p>
          <h2>{t.practice}</h2>
        </div>
        <div className="showcase-prose">
          <p>{profile.long[1]}</p>
          <p>{t.practiceBody}</p>
          <a className="text-link" href={`/${locale}/store`}>
            {t.explore} <Arrow />
          </a>
        </div>
      </section>

      <section className="showcase-divider showcase-highlights">
        <p className="eyebrow">02 / {t.highlights}</p>
        <dl className="showcase-facts">
          {profile.highlights.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="showcase-split showcase-divider">
        <h2>{t.toolkit}</h2>
        <ul className="showcase-skills">
          {profile.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      <section className="showcase-contact">
        <div>
          <p className="eyebrow">{SITE.owner}</p>
          <h2>{t.connect}</h2>
          <p>{t.connectBody}</p>
        </div>
        <div className="showcase-actions">
          <a className="button" href={contact.href}>
            {t.contact} <Arrow />
          </a>
          <a className="text-link" href={SITE.github}>
            GitHub <Arrow />
          </a>
        </div>
      </section>
    </div>
  )
}

export function HowItWorksPage({ locale }: { locale: Locale }) {
  const t = showcaseCopy(locale).how
  return (
    <div className="showcase container">
      <header className="page-intro showcase-intro">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.headline}</h1>
        <p>{t.intro}</p>
        <a className="text-link" href={`/${locale}/store`}>
          {t.play} <Arrow />
        </a>
      </header>

      <section className="showcase-divider">
        <div className="showcase-split">
          <div>
            <p className="eyebrow">01 / {t.architecture}</p>
            <h2>{t.architecture}</h2>
          </div>
          <p className="showcase-prose">{t.architectureBody}</p>
        </div>
        <ol className="showcase-flow">
          {t.flow.map((step, index) => (
            <li key={step.title}>
              <span className="showcase-step" aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <span className="showcase-technology">{step.technology}</span>
              {index < t.flow.length - 1 && (
                <span className="showcase-flow-arrow" aria-hidden="true">
                  <Icon name="arrow-right" />
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className="showcase-boundary">
          <span aria-hidden="true">↳</span> {t.boundary}
        </p>
      </section>

      <section className="showcase-divider">
        <div className="showcase-split">
          <div>
            <p className="eyebrow">02 / {SITE.brand}</p>
            <h2>{t.security}</h2>
          </div>
          <p className="showcase-prose">{t.securityBody}</p>
        </div>
        <div className="showcase-card-grid">
          {t.safeguards.map((item) => (
            <article className="showcase-detail-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase-business">
        <p className="eyebrow">03 / {SITE.brand}</p>
        <h2>{t.business}</h2>
        <p>{t.businessBody}</p>
        <p className="showcase-business-note">{t.businessNote}</p>
        <div className="showcase-actions">
          <a className="button light" href={SOCIAL_BY_LOCALE[locale].href}>
            {t.contact} <Arrow />
          </a>
          <a className="text-link" href={SITE.repository}>
            {t.source} <Arrow />
          </a>
        </div>
      </section>
    </div>
  )
}

export function WhatIsRealPage({ locale }: { locale: Locale }) {
  const t = showcaseCopy(locale).real
  return (
    <div className="showcase container">
      <header className="showcase-reality-hero">
        <div className="page-intro">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.headline}</h1>
          <p>{t.intro}</p>
        </div>
        <div className="showcase-zero">
          <p className="eyebrow">{t.amountLabel}</p>
          <strong>{t.amount}</strong>
          <p>{t.amountNote}</p>
        </div>
      </header>

      <section className="showcase-card-grid showcase-reality-facts">
        {t.facts.map((item, index) => (
          <article className="showcase-detail-card" key={item.title}>
            <span className="showcase-fact-number" aria-hidden="true">
              0{index + 1}
            </span>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="showcase-split showcase-divider">
        <h2>{t.donations}</h2>
        <p className="showcase-prose">{t.donationsBody}</p>
      </section>
      <section className="showcase-split showcase-divider">
        <h2>{t.local}</h2>
        <p className="showcase-prose">{t.localBody}</p>
      </section>
      <section className="showcase-split showcase-divider">
        <h2>{t.inspiration}</h2>
        <div className="showcase-prose">
          <p>{t.inspirationBody}</p>
          <a
            className="text-link"
            href={`${SITE.repository}/blob/main/docs/research/shopping-simulators.md`}
          >
            {t.credit} <Arrow />
          </a>
        </div>
      </section>
      <div className="showcase-actions showcase-outro">
        <a className="button" href={`/${locale}/store`}>
          {t.explore} <Arrow />
        </a>
        <a className="text-link" href={`/${locale}/how-it-works`}>
          {t.architecture} <Arrow />
        </a>
      </div>
    </div>
  )
}
