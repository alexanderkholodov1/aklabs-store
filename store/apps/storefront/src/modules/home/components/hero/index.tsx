import { Aurora, Eyebrow } from "@modules/common/components/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const Hero = () => {
  return (
    <section className="px-3 pt-4 small:px-6">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[40px] bg-ak-navy text-white">
        <Aurora />

        <div className="relative grid grid-cols-1 gap-12 px-6 pb-14 pt-14 small:grid-cols-[1.05fr_1fr] small:items-center small:px-14 small:pb-20 small:pt-20">
          <div className="flex flex-col items-start gap-7 animate-fade-up">
            <Eyebrow tone="dark">Colección 01 · Diseñado en Ecuador</Eyebrow>

            <h1 className="font-display text-[clamp(3.6rem,9vw,8.5rem)] leading-[0.86] tracking-wide">
              Diseñado para
              <br />
              <span className="text-gradient-ak bg-[length:200%_auto]">
                los que crean
              </span>
            </h1>

            <p className="max-w-xl text-lg text-white/75 small:text-xl">
              Hoodies, gorras, camisetas y termos con la identidad AKLabs:{" "}
              <span className="font-semibold text-[#ff5a61]">rojo</span> que
              impulsa,{" "}
              <span className="font-semibold text-[#6f7dff]">azul</span> que
              construye y{" "}
              <span className="font-semibold text-ak-sky-light">celeste</span>{" "}
              que aclara las ideas.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <LocalizedClientLink
                href="/store"
                className="btn-ak-gradient inline-flex h-14 items-center gap-3 rounded-full px-8 text-base font-semibold text-white transition-all duration-500"
                data-testid="hero-shop-button"
              >
                Comprar la colección
                <span aria-hidden="true">→</span>
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/categories/hoodies"
                className="glass-dark inline-flex h-14 items-center rounded-full px-7 text-base font-semibold text-white transition-colors hover:bg-white/15"
              >
                Ver hoodies
              </LocalizedClientLink>
            </div>

            <dl className="grid w-full max-w-xl grid-cols-3 gap-3 pt-2">
              {[
                { value: "6", label: "piezas de merch" },
                { value: "USD", label: "precios en Ecuador" },
                { value: "24–48 h", label: "envío express" },
              ].map((stat) => (
                <div key={stat.label} className="glass-dark rounded-2xl px-4 py-3">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-3xl tracking-wide">
                    {stat.value}
                  </dd>
                  <dd className="text-xs text-white/60">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto h-[420px] w-full max-w-[560px] small:h-[560px]">
            <LocalizedClientLink
              href="/products/aklabs-essential-hoodie"
              className="glass-dark rim-ak absolute left-[6%] top-0 z-10 w-[64%] rounded-[32px] p-3 animate-float"
            >
              <div className="relative aspect-square overflow-hidden rounded-[24px] bg-white">
                <Image
                  src="/aklabs/products/hoodie-black-front.png"
                  alt="AKLabs Essential Hoodie negra"
                  fill
                  priority
                  sizes="(max-width: 1024px) 60vw, 360px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between px-2 pb-1 pt-3">
                <span className="text-sm font-semibold">Essential Hoodie</span>
              </div>
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/products/aklabs-pro-cap"
              className="glass-dark rim-ak absolute right-0 top-[18%] z-20 w-[42%] rounded-[28px] p-2.5 animate-float-slow [animation-delay:-2s]"
            >
              <div className="relative aspect-square overflow-hidden rounded-[20px] bg-white">
                <Image
                  src="/aklabs/products/cap-navy-front.png"
                  alt="AKLabs Pro Cap azul marino"
                  fill
                  sizes="(max-width: 1024px) 40vw, 240px"
                  className="object-cover"
                />
              </div>
              <p className="px-1.5 pb-1 pt-2 text-xs font-semibold">Pro Cap</p>
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/products/aklabs-steel-thermo"
              className="glass-dark rim-ak absolute bottom-0 right-[10%] z-30 w-[34%] rounded-[26px] p-2.5 animate-float [animation-delay:-3.5s]"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-white">
                <Image
                  src="/aklabs/products/thermo-black.png"
                  alt="AKLabs Steel Thermo"
                  fill
                  sizes="(max-width: 1024px) 34vw, 200px"
                  className="object-cover"
                />
              </div>
              <p className="px-1.5 pb-1 pt-2 text-xs font-semibold">
                Steel Thermo
              </p>
            </LocalizedClientLink>

            <div className="glass-dark absolute bottom-[8%] left-0 z-30 flex items-center gap-3 rounded-2xl px-4 py-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-ak text-lg font-bold">
                ✓
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Envío a todo Ecuador</p>
                <p className="text-xs text-white/60">Estándar o express</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
