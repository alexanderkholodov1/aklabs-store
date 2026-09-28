import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-2 flex flex-col gap-3 rounded-2xl bg-white/60 p-4 ring-1 ring-ak-ink/5 xsmall:flex-row xsmall:items-center xsmall:justify-between">
      <div>
        <p className="text-base font-semibold text-ak-ink">¿Necesitas ayuda?</p>
        <p className="text-sm text-ak-ink/60">
          Revisa el estado de tus pedidos o solicita un cambio de talla desde
          tu cuenta.
        </p>
      </div>
      <div className="flex gap-2">
        <LocalizedClientLink
          href="/account/orders"
          className="rounded-full bg-ak-ink px-4 py-2 text-sm font-semibold text-white"
        >
          Mis pedidos
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/store"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ak-ink ring-1 ring-ak-ink/10"
        >
          Tienda
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Help
