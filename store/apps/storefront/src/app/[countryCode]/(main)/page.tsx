import { Metadata } from "next"
import { Suspense } from "react"

import { getRegion } from "@lib/data/regions"
import { getMessages } from "@lib/i18n/get-messages"
import BrandMarquee from "@modules/home/components/brand-marquee"
import BrandStory from "@modules/home/components/brand-story"
import CategoryShowcase from "@modules/home/components/category-showcase"
import FeaturedCatalog from "@modules/home/components/featured-catalog"
import Hero from "@modules/home/components/hero"
import { Perks, RegionsBanner } from "@modules/home/components/perks"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

async function RegionsBannerSlot({ countryCode }: { countryCode: string }) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return <RegionsBanner region={region} />
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getMessages()

  return {
    title: { absolute: "AKLabs Store" },
    description: t.home.description,
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const { t } = await getMessages()

  return (
    <>
      <Hero />
      <BrandMarquee />
      <Suspense fallback={<div className="content-container py-24" />}>
        <FeaturedCatalog countryCode={countryCode} />
      </Suspense>
      <Suspense fallback={null}>
        <CategoryShowcase />
      </Suspense>
      <Perks />
      <BrandStory />
      <Suspense fallback={null}>
        <RegionsBannerSlot countryCode={countryCode} />
      </Suspense>

      <section className="content-container pb-6 pt-16 small:pt-20">
        <div className="glass liquid rim-ak flex flex-col items-center gap-6 rounded-[40px] px-6 py-14 text-center">
          <h2 className="font-display text-5xl leading-[0.95] tracking-wide text-ak-ink small:text-7xl">
            {t.home.ctaTitleA}
            <br />
            <span className="text-gradient-ak">{t.home.ctaTitleB}</span>
          </h2>
          <p className="max-w-xl text-ak-ink/65">{t.home.ctaBody}</p>
          <LocalizedClientLink
            href="/store"
            className="btn-ak-gradient inline-flex h-14 items-center gap-3 rounded-full px-8 text-base font-semibold text-white transition-all duration-500"
          >
            {t.home.cta} <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </div>
      </section>
    </>
  )
}
