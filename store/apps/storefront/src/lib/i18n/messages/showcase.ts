/**
 * Namespace "showcase": portfolio layer (about page, how-it-works page,
 * builder hints, demo disclaimer). Keep en and es in sync.
 */
export const en = {
  showcase: {
    hintLabel: "How is this built?",
    hints: {
      pricing: {
        title: "Prices per region",
        body: "Medusa's pricing module stores one price per currency. The cart's region decides which one you see: USD in Ecuador, EUR in Europe.",
      },
      regions: {
        title: "Multi-region commerce",
        body: "Each region bundles its currency, taxes, payment providers and shipping zones. Switching country moves the cart to that region.",
      },
      catalog: {
        title: "Catalog as data",
        body: "Products, variants, inventory and translations live in the database and are managed from the admin. No code changes to add a product.",
      },
      cart: {
        title: "Server-side cart",
        body: "The cart lives in Postgres, not in the browser. Totals, taxes and promotions are recalculated by backend workflows on every change.",
      },
      checkout: {
        title: "Checkout workflow",
        body: "Placing an order runs a transactional workflow: validate, authorize payment, reserve stock, create the order. If a step fails, it rolls back.",
      },
      tracking: {
        title: "Order tracking",
        body: "Fulfillment steps come from real Medusa fulfillment workflows. The courier is simulated, the data model is not.",
      },
      i18n: {
        title: "Built for many languages",
        body: "Interface copy and product content are translated per locale, with English as the fallback.",
      },
      security: {
        title: "Secure by default",
        body: "The browser never touches the database. Secrets stay on the server, and the store API only exposes what a shopper needs.",
      },
    },
  },
}

export const es: typeof en = {
  showcase: {
    hintLabel: "¿Cómo está hecho?",
    hints: {
      pricing: {
        title: "Precios por región",
        body: "El módulo de precios de Medusa guarda un precio por moneda. La región del carrito decide cuál ves: USD en Ecuador, EUR en Europa.",
      },
      regions: {
        title: "Comercio multi-región",
        body: "Cada región agrupa moneda, impuestos, proveedores de pago y zonas de envío. Cambiar de país mueve el carrito a esa región.",
      },
      catalog: {
        title: "El catálogo son datos",
        body: "Productos, variantes, inventario y traducciones viven en la base y se gestionan desde el admin. Agregar un producto no requiere tocar código.",
      },
      cart: {
        title: "Carrito en el servidor",
        body: "El carrito vive en Postgres, no en el navegador. Totales, impuestos y promociones se recalculan con workflows del backend en cada cambio.",
      },
      checkout: {
        title: "Checkout transaccional",
        body: "Confirmar un pedido ejecuta un workflow: valida, autoriza el pago, reserva stock y crea la orden. Si un paso falla, se revierte.",
      },
      tracking: {
        title: "Seguimiento del pedido",
        body: "Los pasos del envío usan los workflows reales de fulfillment de Medusa. El courier es simulado; el modelo de datos no.",
      },
      i18n: {
        title: "Pensado para varios idiomas",
        body: "Los textos de la interfaz y del catálogo se traducen por idioma, con inglés como respaldo.",
      },
      security: {
        title: "Seguro por defecto",
        body: "El navegador nunca toca la base de datos. Los secretos se quedan en el servidor y la API de tienda solo expone lo que un comprador necesita.",
      },
    },
  },
}
