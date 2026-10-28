"use client"
import { Icon } from "@modules/common/icon"
import { useCart } from "@lib/sim/cart"
import { useState } from "react"
import type { Product } from "@lib/catalog"
import type { Locale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
import { Price } from "./price"
import { ProductImage } from "./product-image"
export function ProductDetail({
  product,
  locale,
}: {
  product: Product
  locale: Locale
}) {
  const t = siteCopy(locale),
    copy = product.copy[locale]
  const { add, ready } = useCart()
  const [added, setAdded] = useState(false)
  const [image, setImage] = useState(0)
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.id, o.values[0].id]))
  )
  return (
    <div className="product-detail">
      <div className="product-gallery">
        <div className="detail-art">
          <ProductImage
            image={product.images[image]}
            locale={locale}
            priority
            sizes="(max-width: 760px) 92vw, 52vw"
          />
        </div>
        {product.images.length > 1 && (
          <div className="gallery-thumbs" role="group" aria-label={t.gallery}>
            {product.images.map((img, i) => (
              <button
                key={img.id}
                aria-pressed={image === i}
                aria-label={img.alt[locale]}
                onClick={() => setImage(i)}
              >
                <ProductImage image={img} locale={locale} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="product-information">
        <p className="eyebrow">AK / {t.collection}</p>
        <h1>{copy.title.replace(/^AKLabs /, "")}</h1>
        <p className="product-subtitle">{copy.subtitle}</p>
        <div className="detail-price">
          <Price
            prices={product.prices}
            salePrices={product.salePrices}
            locale={locale}
          />
          <span>{t.productNote}</span>
        </div>
        <div className="option-groups">
          {product.options.map((option) => (
            <fieldset key={option.id}>
              <legend>{option.name[locale]}</legend>
              <div className="option-values">
                {option.values.map((value) => (
                  <label
                    key={value.id}
                    className={
                      options[option.id] === value.id ? "selected" : ""
                    }
                  >
                    <input
                      type="radio"
                      name={option.id}
                      value={value.id}
                      checked={options[option.id] === value.id}
                      onChange={() => {
                        setOptions({ ...options, [option.id]: value.id })
                        if (option.id === "color") {
                          const match = product.images.findIndex((image) =>
                            image.id.includes(value.id)
                          )
                          if (match >= 0) setImage(match)
                        }
                      }}
                    />
                    <span>{value.label[locale]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <button
          className="button full add-to-bag"
          disabled={!ready}
          onClick={() => {
            if (add(product, options)) setAdded(true)
          }}
        >
          {t.add}
          <span aria-hidden="true"> +</span>
        </button>
        {added && (
          <div className="added-feedback">
            <span>
              {t.added} <Icon name="check" />
            </span>
            <a
              className="text-link"
              aria-label={t.viewBag}
              href={`/${locale}/cart`}
            >
              {t.viewBag} <Icon name="arrow-right" />
            </a>
          </div>
        )}
        <p className="quiet-note">{t.noCharge}</p>
        <div className="product-story">
          <h2>{t.details}</h2>
          <p>{copy.description}</p>
          <dl>
            <dt>{t.material}</dt>
            <dd>{product.material[locale]}</dd>
          </dl>
          <details>
            <summary>{t.delivery}</summary>
            <p>{t.deliveryBody}</p>
          </details>
        </div>
      </div>
    </div>
  )
}
