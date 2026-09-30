import { Locale, SUPPORTED_LOCALES } from "./locales"

/**
 * Localized catalog copy.
 *
 * Resolution order for every field:
 * 1. `metadata.i18n[locale]` on the record (managed from the Medusa admin),
 * 2. the storefront overlay below (products only, keyed by handle),
 * 3. the base Medusa field (English).
 */
export type ProductCopyFields = {
  title: string
  subtitle: string
  description: string
}

/**
 * Storefront overlay for product title / subtitle / description by handle.
 * It predates `metadata.i18n` and stays as a safety net while the catalog is
 * migrated. English is the default; Spanish stays a first-class entry.
 */
export type ProductCopyEntry = Partial<Record<Locale, ProductCopyFields>> & {
  en: ProductCopyFields
}

export const productCopy: Record<string, ProductCopyEntry> = {
  "aklabs-essential-hoodie": {
    en: {
      title: "AKLabs Essential Hoodie",
      subtitle: "Heavyweight fleece with an embroidered AK monogram",
      description:
        "The piece the lab is known for. A 320 gsm premium fleece hoodie with a brushed interior and a high-density embroidered AK monogram on the chest. Relaxed unisex fit, deep kangaroo pocket, and reinforced seams made for late nights and cold mornings.",
    },
    es: {
      title: "AKLabs Essential Hoodie",
      subtitle: "Felpa premium con monograma AK bordado",
      description:
        "La pieza insignia de AKLabs. Sudadera con capucha de felpa premium (320 g/m2) con interior afelpado y el monograma AK bordado en alta densidad sobre el pecho. Corte unisex relajado, bolsillo canguro amplio y costuras reforzadas: pensada para las madrugadas frías de la sierra y las sesiones largas de código.",
    },
  },
  "aklabs-zip-hoodie": {
    en: {
      title: "AKLabs Zip Hoodie",
      subtitle: "Full zip, same fleece, three lab colors",
      description:
        "A full-zip version of the Essential fleece. Metal zipper, ribbed cuffs, and the AK monogram embroidered small on the chest. Cut to layer over a tee on a flight or in a studio that never quite warms up.",
    },
    es: {
      title: "AKLabs Zip Hoodie",
      subtitle: "Cierre completo, misma felpa, tres colores del lab",
      description:
        "Versión con cierre completo de la felpa Essential. Cremallera metálica, puños ribeteados y el monograma AK bordado pequeño en el pecho. Pensada para llevarla sobre una camiseta en un vuelo o en un estudio que nunca termina de calentarse.",
    },
  },
  "aklabs-pro-cap": {
    en: {
      title: "AKLabs Pro Cap",
      subtitle: "Six panels, curved brim, raised embroidery",
      description:
        "A structured six-panel cap with a curved brim and an adjustable metal clasp. The AK monogram is embroidered in relief using the three brand colors. Cotton twill that works in a studio, a gym, or on the street.",
    },
    es: {
      title: "AKLabs Pro Cap",
      subtitle: "Seis paneles, visera curva y bordado en relieve",
      description:
        "Gorra estructurada de seis paneles con visera curva y cierre metálico ajustable. El monograma AK va bordado en relieve con los tres colores de la marca. Twill de algodón respirable para el día a día, el gimnasio o el streetwear.",
    },
  },
  "aklabs-dad-hat": {
    en: {
      title: "AKLabs Dad Hat",
      subtitle: "Unstructured cotton, low profile",
      description:
        "An unstructured dad hat in washed cotton with a soft brim. The AK mark is embroidered small on the front panel. Lighter than the Pro Cap, meant for everyday wear.",
    },
    es: {
      title: "AKLabs Dad Hat",
      subtitle: "Algodón sin estructura, perfil bajo",
      description:
        "Dad hat sin estructura en algodón lavado con visera suave. La marca AK va bordada pequeña en el panel frontal. Más ligera que la Pro Cap, pensada para el uso diario.",
    },
  },
  "aklabs-steel-thermo": {
    en: {
      title: "AKLabs Steel Thermo 750 ml",
      subtitle: "12 hours hot, 24 hours cold",
      description:
        "A double-wall vacuum bottle that keeps drinks hot for 12 hours and cold for 24. Leak-resistant lid, matte black finish, and a vertical AK printed in red, blue, and cyan. 750 ml.",
    },
    es: {
      title: "AKLabs Steel Thermo 750 ml",
      subtitle: "12 h caliente, 24 h frío",
      description:
        "Termo de acero inoxidable con doble pared al vacío: mantiene tus bebidas calientes hasta 12 horas y frías hasta 24. Tapa hermética a prueba de derrames, acabado negro mate y el AK vertical impreso en rojo, azul y celeste. Capacidad de 750 ml.",
    },
  },
  "aklabs-insulated-bottle": {
    en: {
      title: "AKLabs Insulated Bottle 1 L",
      subtitle: "Brushed steel with a laser-etched wordmark",
      description:
        "A one-liter brushed stainless bottle with vacuum insulation and a screw cap. The AKLABS wordmark is laser-etched on the side. Built to stay on a desk or in a bag all day.",
    },
    es: {
      title: "AKLabs Insulated Bottle 1 L",
      subtitle: "Acero cepillado con grabado láser",
      description:
        "Botella térmica de acero inoxidable cepillado con aislamiento al vacío y tapa a rosca. Wordmark AKLABS grabado con láser. Un litro de capacidad para hidratarte todo el día, en la oficina o en la montaña.",
    },
  },
  "aklabs-tech-tee": {
    en: {
      title: "AKLabs Tech Tee",
      subtitle: "Ringspun cotton with a gradient AK",
      description:
        "A unisex ringspun tee at 180 gsm, soft from the first wash. Large-format DTG print of the AK monogram in a gradient. Modern fit, on its own or under the hoodie.",
    },
    es: {
      title: "AKLabs Tech Tee",
      subtitle: "Algodón ringspun con AK en gradiente",
      description:
        "Camiseta unisex de algodón ringspun de 180 g/m2, suave desde el primer uso. Estampado DTG de gran formato con el monograma AK en gradiente. Corte moderno que funciona sola o como capa debajo de la hoodie AKLabs.",
    },
  },
  "aklabs-studio-tee": {
    en: {
      title: "AKLabs Studio Tee",
      subtitle: "Heavyweight blank with a centered mark",
      description:
        "A heavier 220 gsm tee with a centered AK monogram. The print uses the lab palette: red, royal blue, and cyan. Boxy unisex fit.",
    },
    es: {
      title: "AKLabs Studio Tee",
      subtitle: "Blank de peso grueso con marca centrada",
      description:
        "Camiseta más pesada de 220 g/m2 con el monograma AK centrado. El estampado usa la paleta del lab: rojo, azul royal y celeste. Corte unisex boxy.",
    },
  },
  "aklabs-performance-joggers": {
    en: {
      title: "AKLabs Performance Joggers",
      subtitle: "Premium fleece and zip pockets",
      description:
        "Premium fleece joggers with an elastic waist, drawcord, and ribbed cuffs. An embroidered AK on the thigh and zippered side pockets. For remote work, the gym, or a long trip.",
    },
    es: {
      title: "AKLabs Performance Joggers",
      subtitle: "Felpa premium y bolsillos con cierre",
      description:
        "Joggers de felpa premium con cintura elástica, cordón y puños ribeteados. Logo AK bordado en el muslo y bolsillos laterales con cierre oculto para llevar lo esencial. Comodidad total para trabajo remoto, gimnasio o viaje.",
    },
  },
  "aklabs-monogram-sticker-pack": {
    en: {
      title: "AK Monogram Sticker Pack",
      subtitle: "Die-cut vinyl in the three lab marks",
      description:
        "Weatherproof vinyl stickers of the AK monogram, the circular badge, and the AKLABS wordmark. Matte or holographic. Made to live on a laptop, a bottle, or a flight case.",
    },
    es: {
      title: "Pack de stickers monograma AK",
      subtitle: "Vinilo troquelado con las tres marcas del lab",
      description:
        "Stickers de vinilo resistente al clima con el monograma AK, el badge circular y el wordmark AKLABS. Acabado mate u holográfico. Pensados para la laptop, el termo o el estuche de viaje.",
    },
  },
  "aklabs-wordmark-sticker-sheet": {
    en: {
      title: "AKLABS Sticker Sheet",
      subtitle: "A sheet of small marks for sharing",
      description:
        "One sheet of smaller AK marks and wordmarks, kiss-cut so you can peel just one. Useful when a single logo is too big and you still want the brand on a notebook.",
    },
    es: {
      title: "Hoja de stickers AKLABS",
      subtitle: "Una hoja de marcas pequeñas para compartir",
      description:
        "Una hoja con marcas AK y wordmarks más pequeños, troquelados para despegar solo uno. Útil cuando un logo grande es demasiado y aun así quieres la marca en un cuaderno.",
    },
  },
  "aklabs-enamel-keychain": {
    en: {
      title: "AK Enamel Keychain",
      subtitle: "Hard enamel and a steel ring",
      description:
        "A hard-enamel charm of the AK monogram with a metal outline and a short steel chain. The red, blue, and cyan fills match the logo. Clips to a bag or a key ring without feeling like a souvenir.",
    },
    es: {
      title: "Llavero de esmalte AK",
      subtitle: "Esmalte duro y aro de acero",
      description:
        "Charm de esmalte duro del monograma AK con contorno metálico y cadena corta de acero. Los rellenos en rojo, azul y celeste coinciden con el logo. Se engancha a una mochila o llaves sin parecer un recuerdo de feria.",
    },
  },
  "aklabs-acrylic-charm": {
    en: {
      title: "AK Acrylic Charm",
      subtitle: "Clear charm with the circular badge",
      description:
        "A clear acrylic charm printed with the circular AK badge and a silver split ring. Lighter than the enamel piece, and the print stays sharp against the transparency.",
    },
    es: {
      title: "Charm acrílico AK",
      subtitle: "Charm transparente con el badge circular",
      description:
        "Charm de acrílico transparente con el badge circular AK impreso y un aro partido plateado. Más ligero que la pieza de esmalte, y el print se ve nítido sobre la transparencia.",
    },
  },
  "aklabs-mini-figure": {
    en: {
      title: "AK Mini Figure",
      subtitle: "A 10 cm vinyl figure from the lab",
      description:
        "A small designer vinyl figure in the AK palette: red, royal blue, and cyan. Faceless, hood up, laptop in hand. It sits on a shelf next to the work, not in a toy aisle.",
    },
    es: {
      title: "Mini figura AK",
      subtitle: "Figura de vinilo de 10 cm del laboratorio",
      description:
        "Una pequeña figura de vinilo de diseñador en la paleta AK: rojo, azul royal y celeste. Sin rostro, capucha puesta, laptop en la mano. Vive en el estante junto al trabajo, no en el pasillo de juguetes.",
    },
  },
  "aklabs-desk-buddy": {
    en: {
      title: "AK Desk Buddy",
      subtitle: "A seated figure for the corner of the desk",
      description:
        "A chibi figure in a color-block jacket, seated on a stack of books. Two poses: one mid-code, one packing an order. Matte vinyl, meant to stay next to the keyboard.",
    },
    es: {
      title: "AK Desk Buddy",
      subtitle: "Figura sentada para la esquina del escritorio",
      description:
        "Figura chibi con chaqueta a bloques de color, sentada sobre una pila de libros. Dos poses: una programando, otra empacando un pedido. Vinilo mate, pensada para quedarse junto al teclado.",
    },
  },
  "aklabs-crew-socks": {
    en: {
      title: "AKLabs Crew Socks",
      subtitle: "Cushioned crew height with a subtle AK cuff mark",
      description:
        "Crew-height socks with a reinforced heel and toe and a soft cushioned sole. The AK monogram sits small on the cuff in the lab palette. Built for long days on hard floors, not as a novelty pair.",
    },
    es: {
      title: "Calcetines crew AKLabs",
      subtitle: "Altura crew acolchada con marca AK sutil en el puño",
      description:
        "Calcetines a la altura crew con talón y punta reforzados y suela acolchada. El monograma AK va pequeño en el puño con la paleta del lab. Hechos para jornadas largas sobre piso duro, no como un par de novedad.",
    },
  },
  "aklabs-beanie": {
    en: {
      title: "AKLabs Beanie",
      subtitle: "Ribbed knit with a folded cuff monogram",
      description:
        "A ribbed knit beanie with a double-fold cuff and a small embroidered AK on the front. Soft acrylic blend that keeps its shape after washing. Made for cold studios and early outdoor shoots.",
    },
    es: {
      title: "Beanie AKLabs",
      subtitle: "Punto acanalado con monograma en el doblez",
      description:
        "Beanie de punto acanalado con doblez doble y un AK pequeño bordado al frente. Mezcla de acrílico suave que mantiene la forma tras lavar. Para estudios fríos y rodajes tempranos al aire libre.",
    },
  },
  "aklabs-trucker-hat": {
    en: {
      title: "AKLabs Trucker Hat",
      subtitle: "Mesh back, flat brim, raised front panel",
      description:
        "A classic trucker with a structured front panel, breathable mesh back, and an adjustable snap. The AK mark is embroidered high on the front. Lighter than the Pro Cap when the day runs warm.",
    },
    es: {
      title: "Gorra trucker AKLabs",
      subtitle: "Malla atrás, visera plana, panel frontal alto",
      description:
        "Trucker clásica con panel frontal estructurado, malla transpirable atrás y cierre snap ajustable. La marca AK va bordada alta al frente. Más ligera que la Pro Cap cuando el día aprieta.",
    },
  },
  "aklabs-long-sleeve": {
    en: {
      title: "AKLabs Long Sleeve",
      subtitle: "Clean ringspun long sleeve with a chest mark",
      description:
        "A ringspun long-sleeve tee at a midweight that layers under a jacket or stands alone. Small AK print on the chest, clean hem, and a modern unisex cut. Soft enough for travel days and studio nights.",
    },
    es: {
      title: "Manga larga AKLabs",
      subtitle: "Ringspun limpia con marca en el pecho",
      description:
        "Camiseta de manga larga ringspun de peso medio que funciona bajo una chaqueta o sola. Print AK pequeño en el pecho, ruedo limpio y corte unisex moderno. Suave para días de viaje y noches de estudio.",
    },
  },
  "aklabs-canvas-tote": {
    en: {
      title: "AKLabs Canvas Tote",
      subtitle: "Heavy canvas with a printed wordmark",
      description:
        "A durable canvas tote with long shoulder straps and an interior pocket. The AKLABS wordmark is printed on one face. Carries a laptop sleeve, a notebook, and the rest of a workday without stretching out.",
    },
    es: {
      title: "Tote de canvas AKLabs",
      subtitle: "Canvas grueso con wordmark impreso",
      description:
        "Tote de canvas resistente con asas largas y bolsillo interior. El wordmark AKLABS va impreso en una cara. Carga una funda de laptop, un cuaderno y el resto del día de trabajo sin deformarse.",
    },
  },
  "aklabs-sling-bag": {
    en: {
      title: "AKLabs Sling Bag",
      subtitle: "Crossbody sling with a water-resistant shell",
      description:
        "A compact crossbody sling with a water-resistant shell, an adjustable strap, and a padded phone pocket. The AK mark sits discreet on the flap. Hands-free for markets, airports, and short city runs.",
    },
    es: {
      title: "Sling bag AKLabs",
      subtitle: "Sling cruzado con carcasa resistente al agua",
      description:
        "Sling compacto cruzado con carcasa resistente al agua, correa ajustable y bolsillo acolchado para el teléfono. La marca AK va discreta en la solapa. Manos libres para mercados, aeropuertos y trayectos cortos por la ciudad.",
    },
  },
  "aklabs-enamel-pin-set": {
    en: {
      title: "AK Enamel Pin Set",
      subtitle: "Hard enamel pins of the lab marks",
      description:
        "Hard enamel pins of the AK monogram and circular badge, with rubber clutch backs. Available as a single pin or a three-piece set. Gold or black metal outlines that sit clean on a jacket or tote.",
    },
    es: {
      title: "Set de pines de esmalte AK",
      subtitle: "Pines de esmalte duro con las marcas del lab",
      description:
        "Pines de esmalte duro del monograma AK y el badge circular, con cierre de goma. Disponibles como pin suelto o set de tres. Contornos en oro o negro que quedan limpios en una chaqueta o un tote.",
    },
  },
  "aklabs-woven-patch": {
    en: {
      title: "AK Woven Patch",
      subtitle: "Iron-on woven mark for jackets and bags",
      description:
        "A tightly woven patch of the AK monogram with a heat-activated backing. Small or large, ready for a coach jacket, a tote, or a backpack. Edges stay clean after pressing.",
    },
    es: {
      title: "Parche tejido AK",
      subtitle: "Marca tejida termoadhesiva para chaquetas y bolsos",
      description:
        "Parche tejido denso del monograma AK con respaldo termoadhesivo. Pequeño o grande, listo para una coach jacket, un tote o una mochila. Los bordes se mantienen limpios después de planchar.",
    },
  },
  "aklabs-lanyard": {
    en: {
      title: "AKLabs Lanyard",
      subtitle: "Woven strap with a metal clip and breakaway",
      description:
        "A woven lanyard with the AKLABS wordmark repeating along the strap, a swivel metal clip, and a safety breakaway. Built for badges, keys, and event passes without looking temporary.",
    },
    es: {
      title: "Lanyard AKLabs",
      subtitle: "Cinta tejida con clip metálico y rotura de seguridad",
      description:
        "Lanyard tejido con el wordmark AKLABS repetido a lo largo de la cinta, clip metálico giratorio y rotura de seguridad. Para credenciales, llaves y pases de eventos sin verse improvisado.",
    },
  },
  "aklabs-lab-notebook": {
    en: {
      title: "AKLabs Lab Notebook",
      subtitle: "A5 notebook with a printed AK cover",
      description:
        "An A5 notebook with thick paper that takes pen and marker without bleed. Choose blank or lined pages and a soft or hard cover. The AK mark sits centered on the front—made for sketches, standups, and shipping notes.",
    },
    es: {
      title: "Cuaderno de lab AKLabs",
      subtitle: "Cuaderno A5 con portada AK impresa",
      description:
        "Cuaderno A5 con papel grueso que aguanta pluma y marcador sin traspasar. Elige páginas en blanco o rayadas y tapa blanda o dura. La marca AK va centrada al frente: para bocetos, standups y notas de envío.",
    },
  },
  "aklabs-mark-poster": {
    en: {
      title: "AK Mark Poster",
      subtitle: "Print of the circular AK badge",
      description:
        "A museum-grade print of the circular AK badge on heavy matte stock. Available in A3 or A2. Ships flat-packed so the edges stay sharp until it hits the wall.",
    },
    es: {
      title: "Póster del mark AK",
      subtitle: "Print del badge circular AK",
      description:
        "Print de calidad museo del badge circular AK sobre papel mate grueso. Disponible en A3 o A2. Se envía plano para que los bordes lleguen nítidos hasta la pared.",
    },
  },
  "aklabs-ceramic-mug": {
    en: {
      title: "AKLabs Ceramic Mug",
      subtitle: "Dishwasher-safe mug with a wrap print",
      description:
        "A ceramic mug with a wrap-around AK print and a comfortable C-handle. Dishwasher and microwave safe. The everyday desk cup when the steel bottle is already full.",
    },
    es: {
      title: "Taza de cerámica AKLabs",
      subtitle: "Taza apta para lavavajillas con print envolvente",
      description:
        "Taza de cerámica con print AK envolvente y asa cómoda en C. Apta para lavavajillas y microondas. La taza de escritorio de todos los días cuando la botella de acero ya está llena.",
    },
  },
  "aklabs-mousepad": {
    en: {
      title: "AKLabs Desk Mat",
      subtitle: "Low-friction surface with a stitched edge",
      description:
        "A low-friction desk mat with a non-slip rubber base and a stitched edge that will not fray. Standard for a laptop setup or XL for keyboard plus mouse. A faint AK mark sits in the corner.",
    },
    es: {
      title: "Desk mat AKLabs",
      subtitle: "Superficie de baja fricción con borde cosido",
      description:
        "Desk mat de baja fricción con base de goma antideslizante y borde cosido que no se deshilacha. Tamaño estándar para laptop o XL para teclado y mouse. Una marca AK sutil en la esquina.",
    },
  },
  "aklabs-card-sleeve": {
    en: {
      title: "AKLabs Card Sleeve",
      subtitle: "Slim RFID sleeve for cards and cash",
      description:
        "A slim card sleeve with RFID lining and a pull-tab compartment for IDs. Holds a few cards and folded cash without the bulk of a full wallet. Embossed AK on the front face.",
    },
    es: {
      title: "Fundas de tarjetas AKLabs",
      subtitle: "Funda slim RFID para tarjetas y efectivo",
      description:
        "Funda slim con forro RFID y compartimento con lengüeta para IDs. Guarda unas tarjetas y billetes doblados sin el volumen de una billetera completa. AK en relieve en la cara frontal.",
    },
  },
  "aklabs-coach-jacket": {
    en: {
      title: "AKLabs Coach Jacket",
      subtitle: "Lightweight shell with a snap front",
      description:
        "A lightweight coach jacket with a snap front, elastic cuffs, and a water-resistant shell. The AK monogram is embroidered on the left chest. Layers over a tee when the hoodie is too heavy.",
    },
    es: {
      title: "Coach jacket AKLabs",
      subtitle: "Shell ligera con cierre a broches",
      description:
        "Coach jacket ligera con cierre a broches, puños elásticos y shell resistente al agua. El monograma AK va bordado en el pecho izquierdo. Se lleva sobre una camiseta cuando la hoodie pesa demasiado.",
    },
  },
}

type Metadata = Record<string, unknown> | null | undefined

type ProductLike = {
  handle?: string | null
  title?: string | null
  subtitle?: string | null
  description?: string | null
  metadata?: Metadata
}

type CategoryLike = {
  name?: string | null
  description?: string | null
  metadata?: Metadata
}

type CollectionLike = {
  title?: string | null
  metadata?: Metadata
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

/** Admin tools sometimes store nested metadata as a JSON string. */
const asRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (isRecord(value)) {
    return value
  }
  if (typeof value === "string" && value.trim().startsWith("{")) {
    try {
      const parsed: unknown = JSON.parse(value)
      return isRecord(parsed) ? parsed : undefined
    } catch {
      return undefined
    }
  }
  return undefined
}

/** `metadata.i18n[locale]` as a plain object, when present. */
export function localizedMetadata(
  metadata: Metadata,
  locale: Locale
): Record<string, unknown> | undefined {
  const i18n = asRecord(metadata?.i18n)
  return asRecord(i18n?.[locale])
}

/** First non-empty string among the candidates. */
const firstText = (...values: unknown[]): string | undefined =>
  values.find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0
  )

export function resolveProductCopy(
  product: ProductLike,
  locale: Locale
): ProductCopyFields {
  const fromMetadata = localizedMetadata(product.metadata, locale)
  const overlay = product.handle ? productCopy[product.handle]?.[locale] : undefined

  return {
    title:
      firstText(fromMetadata?.title, overlay?.title, product.title) ?? "",
    subtitle:
      firstText(fromMetadata?.subtitle, overlay?.subtitle, product.subtitle) ??
      "",
    description:
      firstText(
        fromMetadata?.description,
        overlay?.description,
        product.description
      ) ?? "",
  }
}

export function resolveCategoryCopy(
  category: CategoryLike,
  locale: Locale
): { name: string; description: string } {
  const fromMetadata = localizedMetadata(category.metadata, locale)

  return {
    name: firstText(fromMetadata?.name, fromMetadata?.title, category.name) ?? "",
    description:
      firstText(fromMetadata?.description, category.description) ?? "",
  }
}

export function resolveCollectionTitle(
  collection: CollectionLike,
  locale: Locale
): string {
  const fromMetadata = localizedMetadata(collection.metadata, locale)
  return firstText(fromMetadata?.title, collection.title) ?? ""
}

/**
 * Option names and values ("Size", "Black"), region names and similar short
 * catalog terms are stored once in Medusa. This glossary shows them in the
 * visitor's language; unknown terms are returned unchanged. Selection logic
 * always keeps the raw value.
 */
type Term = Record<Locale, string> & { aliases?: string[] }

const CATALOG_TERMS: Term[] = [
  { en: "Size", es: "Talla" },
  { en: "Capacity", es: "Capacidad" },
  { en: "Finish", es: "Acabado" },
  { en: "Edition", es: "Edición" },
  { en: "Cover", es: "Tapa" },
  { en: "Ruling", es: "Páginas" },
  { en: "One size", es: "Talla única", aliases: ["Única", "Unica"] },
  { en: "Small", es: "Pequeño" },
  { en: "Large", es: "Grande" },
  { en: "Standard", es: "Estándar" },
  { en: "Black", es: "Negro" },
  { en: "Navy", es: "Azul marino" },
  { en: "Red", es: "Rojo" },
  { en: "Blue", es: "Azul" },
  { en: "Cyan", es: "Celeste" },
  { en: "White", es: "Blanco" },
  { en: "Silver", es: "Plateado" },
  { en: "Gold", es: "Dorado" },
  { en: "Charcoal", es: "Carbón" },
  { en: "Heather gray", es: "Gris jaspeado", aliases: ["Gris jaspe"] },
  { en: "Matte black", es: "Negro mate" },
  { en: "Black enamel", es: "Esmalte negro" },
  { en: "Brushed steel", es: "Acero cepillado" },
  { en: "Matte", es: "Mate" },
  { en: "Holographic", es: "Holográfico" },
  { en: "Classic", es: "Clásica" },
  { en: "Coding", es: "Programando" },
  { en: "Shipping", es: "Empacando" },
  { en: "Soft", es: "Blanda" },
  { en: "Hard", es: "Dura" },
  { en: "Blank", es: "En blanco" },
  { en: "Lined", es: "Rayadas" },
  { en: "3 pins", es: "3 pines" },
  { en: "Europe", es: "Europa" },
]

const termIndex = new Map<string, Term>()
for (const term of CATALOG_TERMS) {
  const forms = [
    ...SUPPORTED_LOCALES.map((code) => term[code]),
    ...(term.aliases ?? []),
  ]
  forms.forEach((form) => termIndex.set(form.trim().toLowerCase(), term))
}

export function translateCatalogTerm(term: string, locale: Locale): string {
  const match = termIndex.get(term.trim().toLowerCase())
  return match ? match[locale] : term
}

/** "S / Negro" becomes "S / Black" in English. */
export function translateVariantTitle(
  title: string | null | undefined,
  locale: Locale
): string {
  if (!title) {
    return ""
  }
  return title
    .split(" / ")
    .map((part) => translateCatalogTerm(part, locale))
    .join(" / ")
}
