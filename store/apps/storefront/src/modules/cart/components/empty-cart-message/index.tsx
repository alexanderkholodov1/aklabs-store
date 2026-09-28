import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="glass liquid rim-ak mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-[40px] px-6 py-20 text-center"
      data-testid="empty-cart-message"
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-ak text-white shadow-lg shadow-ak-blue/30">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 10V7a3 3 0 0 1 6 0v3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h1 className="font-display text-5xl tracking-wide text-ak-ink small:text-6xl">
        Tu carrito está vacío
      </h1>
      <p className="max-w-md text-ak-ink/65">
        Todavía no agregaste nada. Explora la colección AKLabs y encuentra tu
        próxima pieza favorita.
      </p>
      <LocalizedClientLink
        href="/store"
        className="btn-ak-gradient inline-flex h-12 items-center gap-2 rounded-full px-7 font-semibold text-white"
      >
        Explorar productos <span aria-hidden="true">→</span>
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
