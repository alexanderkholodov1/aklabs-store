/**
 * Namespace "common": strings shared by generic UI pieces (buttons, form
 * controls, totals, the 404 page). Keep en and es in sync; es is typed as
 * typeof en, so a missing key fails the type-check.
 */
export const en = {
  common: {
    processing: "Processing…",
    close: "Close",
    showPassword: "Show password",
    hidePassword: "Hide password",
    selectPlaceholder: "Select…",
    original: "Original:",
    home: "Home",
    breadcrumb: "Breadcrumb",
    newTab: "opens in a new tab",
    totals: {
      subtotal: "Subtotal (excl. shipping and taxes)",
      shipping: "Shipping",
      discount: "Discount",
      taxes: "Taxes",
      total: "Total",
    },
    notFound: {
      metaTitle: "Page not found",
      metaDescription: "The page you are looking for does not exist.",
      title: "Page not found",
      body: "The page you tried to open does not exist or has moved.",
      home: "Back to home",
      shop: "Browse the shop",
    },
  },
}

export const es: typeof en = {
  common: {
    processing: "Procesando…",
    close: "Cerrar",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    selectPlaceholder: "Selecciona…",
    original: "Original:",
    home: "Inicio",
    breadcrumb: "Ruta de navegación",
    newTab: "se abre en una pestaña nueva",
    totals: {
      subtotal: "Subtotal (sin envío ni impuestos)",
      shipping: "Envío",
      discount: "Descuento",
      taxes: "Impuestos",
      total: "Total",
    },
    notFound: {
      metaTitle: "Página no encontrada",
      metaDescription: "La página que buscas no existe.",
      title: "Página no encontrada",
      body: "La página que intentaste abrir no existe o fue movida.",
      home: "Volver al inicio",
      shop: "Ver la tienda",
    },
  },
}
