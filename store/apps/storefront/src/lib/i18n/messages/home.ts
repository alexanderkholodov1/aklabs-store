/** Home page sections. */
const numberWord = (count: number, words: string[]) =>
  words[count] ?? String(count)

export const en = {
  hero: {
    eyebrow: "Collection 01 · Designed in Ecuador",
    titleA: "Built for",
    titleB: "people who make things",
    bodyBefore: "Hoodies, caps, tees, and objects with the AKLabs mark: ",
    red: "red",
    redRole: " that starts the work, ",
    blue: "blue",
    blueRole: " that holds it together, and ",
    cyan: "cyan",
    cyanRole: " that makes the idea clear.",
    shop: "Shop the collection",
    howItWorks: "See how it is built",
    pieces: "pieces in the catalog",
    pricesIn: (region: string) => `prices in ${region}`,
    express: "express shipping",
    artLabel: "Featured pieces",
  },
  featured: {
    eyebrow: "Collection 01",
    titleA: "Merch from the",
    titleB: "lab",
    description: (currency: string, region: string) =>
      `Apparel, stickers, keychains, and figures. Prices in ${currency} for ${region}.`,
    all: "Shop all",
  },
  categories: {
    eyebrow: "Categories",
    title: "Build the uniform",
    description: "From the hoodie to the desk figure. Every piece carries the AK mark.",
    count: (count: number) => `${count} ${count === 1 ? "item" : "items"}`,
    more: "More categories",
    fallback: (name: string) => `The ${name} line from the lab.`,
  },
  perks: {
    shipTitle: (region: string) => `Shipping across ${region}`,
    shipText: "Standard in 2 to 4 business days, or express in 24 to 48 hours.",
    currencyTitle: (currency: string) => `Prices in ${currency}`,
    currencyText: "Each region has its own currency and taxes. You pay what you see.",
    sizeTitle: "Size exchanges",
    sizeText: "If the fit is wrong, we exchange it free for 30 days.",
    safeTitle: "A clear checkout",
    safeText: "A few steps, then a confirmed order.",
  },
  regions: {
    eyebrow: (count: number) => `${count} ${count === 1 ? "region" : "regions"}`,
    titleA: "One store,",
    titleB: (count: number) =>
      `${numberWord(count, ["no", "one", "two", "three", "four"])} ${
        count === 1 ? "currency" : "currencies"
      }`,
    body: (name: string, currency: string) =>
      `You are shopping in ${name} with prices in ${currency}. The same catalog sells in every region, each with its own currency, taxes, and shipping.`,
    countries: (count: number) =>
      `${count} ${count === 1 ? "country" : "countries"}`,
    current: "Current region",
    switchTo: (name: string) => `Switch to ${name}`,
  },
  home: {
    description:
      "AKLabs merch: hoodies, caps, tees, stickers, keychains, and figures. Ships across Ecuador in US dollars.",
    ctaTitleA: "The next project",
    ctaTitleB: "needs a uniform",
    ctaBody: "Pick a size, add it to the cart, and we ship it.",
    cta: "Go to the shop",
  },
  story: {
    alt: "AK monogram",
    mark: "AK monogram",
    official: "Official merch",
    eyebrow: "The AKLabs DNA",
    titleA: "Three colors,",
    titleB: "one idea",
    body: "AKLabs started as a personal lab for projects, code, and experiments. This merch takes that into the street: comfortable pieces for people who build things.",
    colors: [
      {
        name: "Red",
        hex: "#E3161F",
        meaning: "Energy to start. The spark that turns an idea into a project.",
      },
      {
        name: "Blue",
        hex: "#0B1ED8",
        meaning: "Structure and technology. The solid base everything is built on.",
      },
      {
        name: "Cyan",
        hex: "#12B5EA",
        meaning: "Clarity and curiosity. Seeing the problem from another angle.",
      },
    ],
  },
}

export const es: typeof en = {
  hero: {
    eyebrow: "Colección 01 · Diseñado en Ecuador",
    titleA: "Diseñado para",
    titleB: "los que crean",
    bodyBefore: "Hoodies, gorras, camisetas y objetos con la marca AKLabs: ",
    red: "rojo",
    redRole: " que impulsa, ",
    blue: "azul",
    blueRole: " que construye y ",
    cyan: "celeste",
    cyanRole: " que aclara las ideas.",
    shop: "Comprar la colección",
    howItWorks: "Mira cómo está hecha",
    pieces: "piezas en el catálogo",
    pricesIn: (region) => `precios en ${region}`,
    express: "envío express",
    artLabel: "Piezas destacadas",
  },
  featured: {
    eyebrow: "Colección 01",
    titleA: "Merch del",
    titleB: "laboratorio",
    description: (currency, region) =>
      `Ropa, stickers, llaveros y figuras. Precios en ${currency} para ${region}.`,
    all: "Ver todo",
  },
  categories: {
    eyebrow: "Categorías",
    title: "Arma el uniforme",
    description: "De la hoodie a la figura de escritorio. Cada pieza lleva la marca AK.",
    count: (count) => `${count} ${count === 1 ? "pieza" : "piezas"}`,
    more: "Más categorías",
    fallback: (name) => `La línea ${name} del laboratorio.`,
  },
  perks: {
    shipTitle: (region) => `Envíos a todo ${region}`,
    shipText: "Estándar en 2 a 4 días hábiles, o express en 24 a 48 horas.",
    currencyTitle: (currency) => `Precios en ${currency}`,
    currencyText: "Cada región tiene su moneda e impuestos. Pagas lo que ves.",
    sizeTitle: "Cambios de talla",
    sizeText: "Si no te queda, lo cambiamos sin costo por 30 días.",
    safeTitle: "Checkout claro",
    safeText: "Unos pasos y el pedido queda confirmado.",
  },
  regions: {
    eyebrow: (count) => `${count} ${count === 1 ? "región" : "regiones"}`,
    titleA: "Una tienda,",
    titleB: (count) =>
      `${numberWord(count, ["ninguna", "una", "dos", "tres", "cuatro"])} ${
        count === 1 ? "moneda" : "monedas"
      }`,
    body: (name, currency) =>
      `Estás comprando en ${name} con precios en ${currency}. El mismo catálogo se vende en cada región, con su propia moneda, impuestos y envíos.`,
    countries: (count) => `${count} ${count === 1 ? "país" : "países"}`,
    current: "Región actual",
    switchTo: (name) => `Cambiar a ${name}`,
  },
  home: {
    description:
      "Merch AKLabs: hoodies, gorras, camisetas, stickers, llaveros y figuras. Envíos a todo Ecuador en dólares.",
    ctaTitleA: "El próximo proyecto",
    ctaTitleB: "merece uniforme",
    ctaBody: "Elige la talla, agrégala al carrito y la enviamos.",
    cta: "Ir a la tienda",
  },
  story: {
    alt: "Monograma AK",
    mark: "Monograma AK",
    official: "Merch oficial",
    eyebrow: "El ADN AKLabs",
    titleA: "Tres colores,",
    titleB: "una misma idea",
    body: "AKLabs nace como un laboratorio personal de proyectos, código y experimentos. Este merch lleva esa filosofía a la calle: piezas cómodas y duraderas para la gente que construye cosas.",
    colors: [
      {
        name: "Rojo",
        hex: "#E3161F",
        meaning: "Energía para empezar. La chispa que convierte una idea en proyecto.",
      },
      {
        name: "Azul",
        hex: "#0B1ED8",
        meaning: "Estructura y tecnología. La base sólida sobre la que se construye.",
      },
      {
        name: "Celeste",
        hex: "#12B5EA",
        meaning: "Claridad y curiosidad. Ver el problema desde otro ángulo.",
      },
    ],
  },
}
