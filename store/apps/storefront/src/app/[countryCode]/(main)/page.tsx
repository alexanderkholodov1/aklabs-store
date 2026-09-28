import { Metadata } from "next"

import { getRegion } from "@lib/data/regions"
import BrandMarquee from "@modules/home/components/brand-marquee"
import BrandStory from "@modules/home/components/brand-story"
import CategoryShowcase from "@modules/home/components/category-showcase"
import FeaturedCatalog from "@modules/home/components/featured-catalog"
import Hero from "@modules/home/components/hero"
import { Perks, RegionsBanner } from "@modules/home/components/perks"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: { absolute: "AKLabs Store | Merch oficial" },
  description:
    "Hoodies, gorras, camisetas, joggers y termos AKLabs. Envíos a todo Ecuador con precios en dólares.",
}

export const dynamic = "force-dynamic"

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <BrandMarquee />
      <FeaturedCatalog countryCode={countryCode} region={region} />
      <CategoryShowcase />
      <Perks />
      <BrandStory />
      <RegionsBanner region={region} />

      <section className="content-container pb-6 pt-16 small:pt-20">
        <div className="glass liquid rim-ak flex flex-col items-center gap-6 rounded-[40px] px-6 py-14 text-center">
          <h2 className="font-display text-5xl leading-[0.95] tracking-wide text-ak-ink small:text-7xl">
            Tu próximo proyecto
            <br />
            <span className="text-gradient-ak">merece uniforme</span>
          </h2>
          <p className="max-w-xl text-ak-ink/65">
            Elige tu talla, agrégala al carrito y recíbela en casa. Así de
            simple.
          </p>
          <LocalizedClientLink
            href="/store"
            className="btn-ak-gradient inline-flex h-14 items-center gap-3 rounded-full px-8 text-base font-semibold text-white transition-all duration-500"
          >
            Ir a la tienda <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </div>
      </section>
    </>
  )
}
