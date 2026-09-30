import { listCategories } from "@lib/data/categories"
import { getMessages } from "@lib/i18n/get-messages"
import { SectionTitle } from "@modules/common/components/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import Image from "next/image"

// Visuals for each AKLabs category, keyed by category handle.
const CATEGORY_ART: Record<
  string,
  { image: string; blurb: string; tint: string }
> = {
  hoodies: {
    image: "/aklabs/products/hoodie-navy-front.png",
    blurb: "Felpa premium y bordado AK",
    tint: "from-ak-blue/25",
  },
  camisetas: {
    image: "/aklabs/products/tee-gray-front.png",
    blurb: "Algodón ringspun, corte unisex",
    tint: "from-ak-red/20",
  },
  joggers: {
    image: "/aklabs/products/joggers-charcoal.png",
    blurb: "Comodidad para remoto o gym",
    tint: "from-ak-sky/25",
  },
  gorras: {
    image: "/aklabs/products/cap-black-front.png",
    blurb: "Seis paneles, visera curva",
    tint: "from-ak-red/20",
  },
  "termos-y-botellas": {
    image: "/aklabs/products/bottle-steel.png",
    blurb: "Acero inoxidable al vacío",
    tint: "from-ak-sky/25",
  },
  stickers: {
    image: "/aklabs/products/sticker-pack.png",
    blurb: "Vinyl packs and wordmark sheets",
    tint: "from-ak-red/20",
  },
  keychains: {
    image: "/aklabs/products/keychain-enamel.png",
    blurb: "Enamel keys and acrylic charms",
    tint: "from-ak-blue/20",
  },
  figures: {
    image: "/aklabs/products/mini-figure.png",
    blurb: "Desk buddies and mini figures",
    tint: "from-ak-sky/25",
  },
  socks: {
    image: "/aklabs/products/crew-socks.png",
    blurb: "Cushioned crew socks with an AK cuff mark",
    tint: "from-ak-blue/20",
  },
  bags: {
    image: "/aklabs/products/canvas-tote.png",
    blurb: "Canvas totes and compact slings",
    tint: "from-ak-sky/25",
  },
  pins: {
    image: "/aklabs/products/enamel-pins.png",
    blurb: "Enamel pins and woven patches",
    tint: "from-ak-red/20",
  },
  stationery: {
    image: "/aklabs/products/lab-notebook.png",
    blurb: "Notebooks and mark posters",
    tint: "from-ak-blue/20",
  },
  accessories: {
    image: "/aklabs/products/mousepad.png",
    blurb: "Desk mats, lanyards, and sleeves",
    tint: "from-ak-sky/20",
  },
}

export default async function CategoryShowcase() {
  const { t } = await getMessages()
  const categories = await listCategories().catch(() => [])

  const visible = (categories ?? []).filter(
    (c) =>
      !c.parent_category && (c.products?.length ?? 0) > 0 && CATEGORY_ART[c.handle]
  )

  if (!visible.length) {
    return null
  }

  return (
    <section className="content-container py-16 small:py-20">
      <SectionTitle
        eyebrow={t.categories.eyebrow}
        title={t.categories.title}
        description={t.categories.description}
      />

      <ul className="mt-10 grid grid-cols-2 gap-3 xsmall:gap-4 small:grid-cols-6 small:gap-5">
        {visible.map((category, index) => {
          const art = CATEGORY_ART[category.handle]
          const isWide = index < 2

          return (
            <li
              key={category.id}
              className={clx(
                "col-span-1",
                isWide ? "small:col-span-3" : "small:col-span-2",
                index === 0 && "col-span-2"
              )}
            >
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="group glass liquid relative flex h-full min-h-[220px] overflow-hidden rounded-[32px] p-5 small:min-h-[280px]"
                data-testid="category-card"
              >
                <div
                  aria-hidden="true"
                  className={clx(
                    "absolute inset-0 bg-gradient-to-br to-transparent opacity-80",
                    art.tint
                  )}
                />
                <div className="relative z-10 flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="font-display text-4xl tracking-wide text-ak-ink small:text-5xl">
                      {category.name}
                    </h3>
                    <p className="mt-1 max-w-[14rem] text-sm text-ak-ink/65">
                      {t.categories.blurbs[category.handle] ?? art.blurb}
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ak-ink px-4 py-2 text-xs font-semibold text-white transition-transform group-hover:translate-x-1">
                    {category.products?.length}{" "}
                    {category.products?.length === 1
                      ? t.categories.product
                      : t.categories.products}
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
                <div className="absolute -bottom-4 -right-4 h-[78%] w-[55%] overflow-hidden rounded-[28px] bg-white shadow-xl ring-1 ring-ak-ink/5 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-2deg]">
                  <Image
                    src={art.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 1024px) 45vw, 320px"
                    className="object-cover"
                  />
                </div>
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
