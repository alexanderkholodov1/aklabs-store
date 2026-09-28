import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe",
}

export default function NotFound() {
  return (
    <div className="content-container flex min-h-[calc(100vh-64px)] items-center justify-center py-16">
      <div className="glass liquid rim-ak flex max-w-xl flex-col items-center gap-5 rounded-[40px] px-8 py-16 text-center">
        <span className="font-display text-8xl leading-none tracking-wide text-gradient-ak">
          404
        </span>
        <h1 className="text-2xl font-semibold text-ak-ink">
          Página no encontrada
        </h1>
        <p className="text-ak-ink/65">
          La página que intentaste abrir no existe o fue movida.
        </p>
        <LocalizedClientLink
          href="/"
          className="btn-ak-gradient inline-flex h-12 items-center rounded-full px-7 font-semibold text-white"
        >
          Volver al inicio
        </LocalizedClientLink>
      </div>
    </div>
  )
}
