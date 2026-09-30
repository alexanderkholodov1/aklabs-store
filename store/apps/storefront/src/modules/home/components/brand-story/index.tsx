import { getMessages } from "@lib/i18n/get-messages"
import { Eyebrow } from "@modules/common/components/brand"
import Image from "next/image"

const SWATCHES = [
  "bg-gradient-to-br from-[#ff2a33] to-[#9a0610]",
  "bg-gradient-to-br from-[#2436ff] to-[#0710a8]",
  "bg-gradient-to-br from-[#62cff6] to-[#0a8fc0]",
]

const BrandStory = async () => {
  const { t } = await getMessages()

  return (
    <section className="content-container py-16 small:py-24">
      <div className="grid grid-cols-1 items-center gap-10 small:grid-cols-2 small:gap-16">
        <div className="glass liquid rim-ak relative mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center overflow-hidden rounded-[48px]">
          <div
            aria-hidden="true"
            className="absolute inset-10 rounded-full bg-gradient-ak opacity-25 blur-3xl animate-aurora"
          />
          <Image
            src="/aklabs/brand/logo-circle.png"
            alt={t.story.alt}
            width={340}
            height={321}
            className="relative drop-shadow-[0_30px_40px_rgba(11,30,216,0.35)] animate-float-slow"
          />
          <span className="glass absolute bottom-6 left-6 chip text-ak-ink">
            {t.story.mark}
          </span>
          <span className="glass absolute right-6 top-6 chip text-ak-ink">
            {t.story.official}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <Eyebrow>{t.story.eyebrow}</Eyebrow>
          <h2 className="font-display text-5xl leading-[0.95] tracking-wide text-ak-ink small:text-7xl">
            {t.story.titleA}
            <br />
            <span className="text-gradient-ak">{t.story.titleB}</span>
          </h2>
          <p className="text-lg text-ak-ink/70">{t.story.body}</p>

          <ul className="flex flex-col gap-3">
            {t.story.colors.map((color, index) => (
              <li
                key={color.hex}
                className="glass flex items-center gap-4 rounded-3xl p-3 pr-5"
              >
                <span
                  className={`h-14 w-14 shrink-0 rounded-2xl ${SWATCHES[index]} shadow-lg`}
                />
                <div>
                  <p className="flex items-center gap-2 font-semibold text-ak-ink">
                    {color.name}
                    <span className="font-mono text-xs font-normal text-ak-ink/45">
                      {color.hex}
                    </span>
                  </p>
                  <p className="text-sm text-ak-ink/65">{color.meaning}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default BrandStory
