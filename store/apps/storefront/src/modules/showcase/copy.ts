import type { Locale } from "@lib/i18n/locales"

type ShowcaseCopy = {
  about: {
    title: string
    description: string
    eyebrow: string
    headline: string
    practice: string
    practiceBody: string
    highlights: string
    toolkit: string
    connect: string
    connectBody: string
    contact: string
    explore: string
    monogramCaption: string
  }
  how: {
    title: string
    description: string
    eyebrow: string
    headline: string
    intro: string
    architecture: string
    architectureBody: string
    flow: { title: string; body: string; technology: string }[]
    boundary: string
    security: string
    securityBody: string
    safeguards: { title: string; body: string }[]
    business: string
    businessBody: string
    businessNote: string
    contact: string
    source: string
    play: string
  }
  real: {
    title: string
    description: string
    eyebrow: string
    headline: string
    intro: string
    amountLabel: string
    amount: string
    amountNote: string
    facts: { title: string; body: string }[]
    donations: string
    donationsBody: string
    local: string
    localBody: string
    inspiration: string
    inspirationBody: string
    credit: string
    explore: string
    architecture: string
  }
}

const en: ShowcaseCopy = {
  about: {
    title: "About Alexander",
    description:
      "Meet Alexander Kholodov, the Computer Science Engineering student behind AKLabs Store.",
    eyebrow: "The person behind the experiment",
    headline: "Curiosity, put into practice.",
    practice: "Engineering meets a creative eye.",
    practiceBody:
      "AKLabs Store brings those interests together: a fictional merchandise collection, a complete shopping journey, and an invitation to look at how it is built.",
    highlights: "A few things along the way",
    toolkit: "Across disciplines",
    connect: "An idea worth building?",
    connectBody:
      "For projects, opportunities, or a conversation about the details behind this store, get in touch.",
    contact: "Let’s connect",
    explore: "Explore the experiment",
    monogramCaption: "Ideas → systems → experiences",
  },
  how: {
    title: "How it works",
    description:
      "Inside AKLabs Store: a static catalog, local browser state, and a complete simulated shopping experience.",
    eyebrow: "Behind the experience",
    headline: "A small stack. A complete journey.",
    intro:
      "From the first product to the courier’s last stop, this shop is an experiment in making a thoughtful experience with a light footprint.",
    architecture: "Built once. Played in your browser.",
    architectureBody:
      "The catalog becomes static pages before the site is published. Your browser takes it from there: cart, checkout, order history, and a courier whose progress is calculated from elapsed time.",
    flow: [
      {
        title: "The collection",
        body: "Products, variants, prices, and promotions are prepared from the local back-office sources, with English and Spanish copy.",
        technology: "Medusa sources · catalog.json",
      },
      {
        title: "The storefront",
        body: "Pages are generated ahead of time and delivered as static files. Product images are served in compact modern formats.",
        technology: "Next.js static export · Firebase Hosting",
      },
      {
        title: "Your experiment",
        body: "Cart and orders stay in this browser. Checkout makes a local receipt; the tracking route simulates a delivery.",
        technology: "React · localStorage · SVG",
      },
    ],
    boundary: "No commerce server is involved in your purchase flow.",
    security: "Less to collect. Less to expose.",
    securityBody:
      "The simulation needs no account, payment details, or connection to a live commerce database. Use the demo address to try the whole flow without sharing your own.",
    safeguards: [
      {
        title: "No payment data",
        body: "There are no card fields and no payment processor. Displayed prices help tell the shopping story; the charged amount is always zero.",
      },
      {
        title: "Local by design",
        body: "Cart and order records are saved in localStorage on this device. They do not sync between browsers and can disappear when site data is cleared.",
      },
      {
        title: "A public, static boundary",
        body: "The catalog is public data. Back-office credentials and private keys are not part of the storefront; Medusa remains a separate local tool.",
      },
    ],
    business: "Imagine this journey with your brand.",
    businessBody:
      "A useful store starts with a clear identity, a collection people can explore, and a checkout they understand. This experiment lets you try those decisions together, from first impression to delivery.",
    businessNote:
      "A real store needs a secure backend, a payment provider, and real fulfillment. This demo offers a concrete starting point for that conversation.",
    contact: "Discuss a project",
    source: "Explore the source",
    play: "Try the collection",
  },
  real: {
    title: "What is real?",
    description:
      "AKLabs Store is a shopping simulation. No charges, no physical deliveries, and no real-money features in this version.",
    eyebrow: "A little clarity",
    headline: "The experience is real. The purchase is play.",
    intro:
      "Enjoy the ritual: find a favorite, choose a size, place an order, and follow the courier. Every step belongs to a simulation.",
    amountLabel: "Total money charged",
    amount: "Zero.",
    amountNote: "Every order. Every currency.",
    facts: [
      {
        title: "Fictional merchandise",
        body: "The AKLabs collection is designed for this demo. Products are not for sale, stock is simulated, and no physical package will be sent.",
      },
      {
        title: "A simulated checkout",
        body: "The prices and promotions are part of the experience. Placing an order creates a receipt in your browser and never moves money.",
      },
      {
        title: "An imaginary courier",
        body: "The route and delivery status are calculated from time. They do not represent a real courier, your location, or a real delivery.",
      },
    ],
    donations: "Only donations would involve real money.",
    donationsBody:
      "Donations are the only intended real-money feature of AKLabs Store. They are not enabled in this version: there is no donation link, payment form, or way to send money here.",
    local: "Your order lives here.",
    localBody:
      "The cart and simulated orders stay in this browser on this device. Clearing the site’s browser data removes them. Use the demo address at checkout; a real name or home address is unnecessary.",
    inspiration: "Part of a playful tradition.",
    inspirationBody:
      "AKLabs Store takes inspiration from the shopping-simulator trend associated with Korean sites, and from projects such as DopamineCart and FoodNeverComes. This is our own take: fictional AKLabs merch, an open codebase, and a clear boundary between play and payment.",
    credit: "See the research and inspiration",
    explore: "Find your next favorite",
    architecture: "See how it works",
  },
}

const es: ShowcaseCopy = {
  about: {
    title: "Sobre Alexander",
    description:
      "Conoce a Alexander Kholodov, el estudiante de Ingeniería en Ciencias de la Computación detrás de AKLabs Store.",
    eyebrow: "La persona detrás del experimento",
    headline: "Curiosidad puesta en práctica.",
    practice: "Ingeniería con una mirada creativa.",
    practiceBody:
      "AKLabs Store reúne esos intereses: una colección de productos ficticios, una experiencia de compra completa y una invitación a descubrir cómo está construida.",
    highlights: "Algunas paradas del camino",
    toolkit: "Entre disciplinas",
    connect: "¿Una idea que vale la pena construir?",
    connectBody:
      "Para proyectos, oportunidades o una conversación sobre los detalles de esta tienda, conversemos.",
    contact: "Conectemos",
    explore: "Explora el experimento",
    monogramCaption: "Ideas → sistemas → experiencias",
  },
  how: {
    title: "Cómo funciona",
    description:
      "Por dentro de AKLabs Store: un catálogo estático, datos locales en el navegador y una experiencia de compra simulada completa.",
    eyebrow: "Detrás de la experiencia",
    headline: "Una base pequeña. Un recorrido completo.",
    intro:
      "Desde el primer producto hasta la última parada del repartidor, esta tienda es un experimento para crear una experiencia cuidada con pocos recursos.",
    architecture: "Se construye una vez. Se juega en tu navegador.",
    architectureBody:
      "El catálogo se convierte en páginas estáticas antes de publicar el sitio. Tu navegador hace el resto: carrito, compra, historial de pedidos y un repartidor cuyo avance se calcula según el tiempo transcurrido.",
    flow: [
      {
        title: "La colección",
        body: "Los productos, variantes, precios y promociones se preparan a partir de las fuentes del panel local, con textos en inglés y español.",
        technology: "Fuentes de Medusa · catalog.json",
      },
      {
        title: "La tienda",
        body: "Las páginas se generan por adelantado y se sirven como archivos estáticos. Las imágenes usan formatos modernos y compactos.",
        technology: "Exportación estática de Next.js · Firebase Hosting",
      },
      {
        title: "Tu experimento",
        body: "El carrito y los pedidos quedan en este navegador. La compra crea un recibo local y el seguimiento simula una entrega.",
        technology: "React · localStorage · SVG",
      },
    ],
    boundary: "Ningún servidor de comercio interviene en tu compra.",
    security: "Menos datos que pedir. Menos que exponer.",
    securityBody:
      "La simulación no necesita una cuenta, datos de pago ni conexión con una base de datos comercial. Usa la dirección de ejemplo para probar todo el recorrido sin compartir la tuya.",
    safeguards: [
      {
        title: "Sin datos de pago",
        body: "No hay campos de tarjeta ni procesador de pagos. Los precios forman parte de la experiencia; el importe cobrado siempre es cero.",
      },
      {
        title: "Local por diseño",
        body: "El carrito y los pedidos se guardan en localStorage en este dispositivo. No se sincronizan entre navegadores y pueden desaparecer al borrar los datos del sitio.",
      },
      {
        title: "Un límite público y estático",
        body: "El catálogo es público. Las credenciales del panel y las claves privadas no forman parte de la tienda; Medusa permanece como herramienta local separada.",
      },
    ],
    business: "Imagina este recorrido con tu marca.",
    businessBody:
      "Una buena tienda empieza con una identidad clara, una colección que invite a explorar y una compra fácil de entender. Este experimento permite probar esas decisiones juntas, desde la primera impresión hasta la entrega.",
    businessNote:
      "Una tienda real requiere un backend seguro, un proveedor de pagos y logística real. Esta demo ofrece un punto de partida concreto para esa conversación.",
    contact: "Hablemos de un proyecto",
    source: "Explora el código",
    play: "Prueba la colección",
  },
  real: {
    title: "¿Qué es real?",
    description:
      "AKLabs Store es una simulación de compras. Sin cobros, sin entregas físicas y sin funciones de dinero real en esta versión.",
    eyebrow: "Las cosas claras",
    headline: "La experiencia es real. La compra es un juego.",
    intro:
      "Disfruta el ritual: encuentra tu favorito, elige una talla, haz un pedido y sigue al repartidor. Cada paso es parte de una simulación.",
    amountLabel: "Dinero total cobrado",
    amount: "Cero.",
    amountNote: "En cada pedido. En cualquier moneda.",
    facts: [
      {
        title: "Productos ficticios",
        body: "La colección de AKLabs fue diseñada para esta demo. Los productos no están a la venta, las existencias son simuladas y no se enviará ningún paquete físico.",
      },
      {
        title: "Una compra simulada",
        body: "Los precios y las promociones son parte de la experiencia. Al hacer un pedido se crea un recibo en tu navegador y nunca se mueve dinero.",
      },
      {
        title: "Un repartidor imaginario",
        body: "La ruta y el estado de entrega se calculan según el tiempo. No representan un repartidor real, tu ubicación ni una entrega real.",
      },
    ],
    donations: "Solo las donaciones implicarían dinero real.",
    donationsBody:
      "Las donaciones son la única función prevista de AKLabs Store que implicaría dinero real. No están habilitadas en esta versión: aquí no hay enlaces para donar, formularios de pago ni manera de enviar dinero.",
    local: "Tu pedido se queda aquí.",
    localBody:
      "El carrito y los pedidos simulados quedan en este navegador y dispositivo. Se eliminan al borrar los datos del sitio. Usa la dirección de ejemplo al comprar; no necesitas dar tu nombre ni dirección reales.",
    inspiration: "Parte de una tradición de juego.",
    inspirationBody:
      "AKLabs Store se inspira en la tendencia de simuladores de compras asociada a sitios coreanos y en proyectos como DopamineCart y FoodNeverComes. Esta es nuestra interpretación: productos ficticios de AKLabs, código abierto y un límite claro entre juego y pago.",
    credit: "Consulta la investigación e inspiración",
    explore: "Encuentra tu próximo favorito",
    architecture: "Descubre cómo funciona",
  },
}

export function showcaseCopy(locale: Locale): ShowcaseCopy {
  return locale === "es" ? es : en
}
