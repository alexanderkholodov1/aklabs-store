"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Detalles del producto",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Envíos y cambios",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple" defaultValue={[tabs[0].label]}>
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const countryName = (code?: string | null) => {
  if (!code) {
    return "-"
  }
  try {
    return (
      new Intl.DisplayNames(["es"], { type: "region" }).of(code.toUpperCase()) ??
      code
    )
  } catch {
    return code
  }
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const rows = [
    { label: "Material", value: product.material || "-" },
    { label: "País de origen", value: countryName(product.origin_country) },
    { label: "Tipo", value: product.type?.value || product.categories?.[0]?.name || "-" },
    { label: "Peso", value: product.weight ? `${product.weight} g` : "-" },
    {
      label: "Dimensiones",
      value:
        product.length && product.width && product.height
          ? `${product.length} x ${product.width} x ${product.height} cm`
          : "-",
    },
    {
      label: "Variantes",
      value: `${product.variants?.length ?? 0} combinaciones`,
    },
  ]

  return (
    <div className="text-small-regular pb-6 pt-2">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-ak-ink/45">
              {row.label}
            </dt>
            <dd className="mt-0.5 text-sm text-ak-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const ShippingInfoTab = () => {
  const items = [
    {
      icon: <FastDelivery />,
      title: "Envío a todo Ecuador",
      text: "Estándar en 2 a 4 días hábiles o express en 24 a 48 horas en ciudades principales. Elige el método en el checkout.",
    },
    {
      icon: <Refresh />,
      title: "Cambios de talla",
      text: "¿No te quedó? Cambiamos tu prenda por otra talla sin costo durante los primeros 30 días.",
    },
    {
      icon: <Back />,
      title: "Devoluciones simples",
      text: "Si el producto llega con algún defecto, te devolvemos el dinero. Sin letra pequeña.",
    },
  ]

  return (
    <div className="text-small-regular pb-6 pt-2">
      <div className="grid grid-cols-1 gap-y-5">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-x-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ak-mist text-ak-royal">
              {item.icon}
            </span>
            <div>
              <span className="text-sm font-semibold text-ak-ink">
                {item.title}
              </span>
              <p className="max-w-sm text-sm text-ak-ink/65">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductTabs
