import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * AKLabs merch catalog.
 *
 * Images live in the storefront (`apps/storefront/public/aklabs/products`) and
 * are referenced with an absolute URL so both the storefront and the Medusa
 * admin can render them.
 */
const IMAGE_BASE =
  process.env.STOREFRONT_PUBLIC_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:8000"

const img = (file: string) => `${IMAGE_BASE}/aklabs/products/${file}`

export type AklabsProductSeed = {
  handle: string
  title: string
  subtitle: string
  description: string
  material: string
  category: string
  weight: number
  images: string[]
  options: { title: string; values: string[] }[]
  // Ecuador sells in USD (official currency since 2000), Europe in EUR.
  prices: { usd: number; eur: number }
}

const SIZES = ["S", "M", "L", "XL"]

export const AKLABS_PRODUCTS: AklabsProductSeed[] = [
  {
    handle: "aklabs-essential-hoodie",
    title: "AKLabs Essential Hoodie",
    subtitle: "Heavyweight fleece with an embroidered AK monogram",
    description:
      "The piece the lab is known for. A 320 gsm premium fleece hoodie with a brushed interior and a high-density embroidered AK monogram on the chest. Relaxed unisex fit, deep kangaroo pocket, and reinforced seams made for late nights and cold mornings.",
    material: "80% combed cotton, 20% polyester",
    category: "Hoodies",
    weight: 650,
    images: [img("hoodie-black-front.png"), img("hoodie-navy-front.png")],
    options: [
      { title: "Size", values: SIZES },
      { title: "Color", values: ["Black", "Navy"] },
    ],
    prices: { usd: 58, eur: 54 },
  },
  {
    handle: "aklabs-zip-hoodie",
    title: "AKLabs Zip Hoodie",
    subtitle: "Full zip, same fleece, three lab colors",
    description:
      "A full-zip version of the Essential fleece. Metal zipper, ribbed cuffs, and the AK monogram embroidered small on the chest. Cut to layer over a tee on a flight or in a studio that never quite warms up.",
    material: "80% combed cotton, 20% polyester",
    category: "Hoodies",
    weight: 680,
    images: [img("zip-hoodie-navy.png")],
    options: [
      { title: "Size", values: SIZES },
      { title: "Color", values: ["Navy", "Black", "Red"] },
    ],
    prices: { usd: 64, eur: 59 },
  },
  {
    handle: "aklabs-pro-cap",
    title: "AKLabs Pro Cap",
    subtitle: "Six panels, curved brim, raised embroidery",
    description:
      "A structured six-panel cap with a curved brim and an adjustable metal clasp. The AK monogram is embroidered in relief using the three brand colors. Cotton twill that works in a studio, a gym, or on the street.",
    material: "100% cotton twill",
    category: "Gorras",
    weight: 120,
    images: [img("cap-black-front.png"), img("cap-navy-front.png")],
    options: [
      { title: "Size", values: ["One size"] },
      { title: "Color", values: ["Black", "Navy"] },
    ],
    prices: { usd: 28, eur: 26 },
  },
  {
    handle: "aklabs-dad-hat",
    title: "AKLabs Dad Hat",
    subtitle: "Unstructured cotton, low profile",
    description:
      "An unstructured dad hat in washed cotton with a soft brim. The AK mark is embroidered small on the front panel. Lighter than the Pro Cap, meant for everyday wear.",
    material: "100% washed cotton",
    category: "Gorras",
    weight: 90,
    images: [img("dad-hat-black.png")],
    options: [
      { title: "Size", values: ["One size"] },
      { title: "Color", values: ["Black", "Navy", "Red"] },
    ],
    prices: { usd: 24, eur: 22 },
  },
  {
    handle: "aklabs-steel-thermo",
    title: "AKLabs Steel Thermo 750 ml",
    subtitle: "12 hours hot, 24 hours cold",
    description:
      "A double-wall vacuum bottle that keeps drinks hot for 12 hours and cold for 24. Leak-resistant lid, matte black finish, and a vertical AK printed in red, blue, and cyan. 750 ml.",
    material: "18/8 stainless steel, double wall vacuum",
    category: "Termos y botellas",
    weight: 380,
    images: [img("thermo-black.png")],
    options: [
      { title: "Capacity", values: ["750 ml"] },
      { title: "Color", values: ["Matte black"] },
    ],
    prices: { usd: 34, eur: 32 },
  },
  {
    handle: "aklabs-insulated-bottle",
    title: "AKLabs Insulated Bottle 1 L",
    subtitle: "Brushed steel with a laser-etched wordmark",
    description:
      "A one-liter brushed stainless bottle with vacuum insulation and a screw cap. The AKLABS wordmark is laser-etched on the side. Built to stay on a desk or in a bag all day.",
    material: "Brushed 18/8 stainless steel",
    category: "Termos y botellas",
    weight: 420,
    images: [img("bottle-steel.png")],
    options: [
      { title: "Capacity", values: ["1 L"] },
      { title: "Finish", values: ["Brushed steel"] },
    ],
    prices: { usd: 36, eur: 34 },
  },
  {
    handle: "aklabs-tech-tee",
    title: "AKLabs Tech Tee",
    subtitle: "Ringspun cotton with a gradient AK",
    description:
      "A unisex ringspun tee at 180 gsm, soft from the first wash. Large-format DTG print of the AK monogram in a gradient. Modern fit, on its own or under the hoodie.",
    material: "100% ringspun cotton",
    category: "Camisetas",
    weight: 220,
    images: [img("tee-gray-front.png")],
    options: [
      { title: "Size", values: SIZES },
      { title: "Color", values: ["Heather gray", "Black"] },
    ],
    prices: { usd: 26, eur: 24 },
  },
  {
    handle: "aklabs-studio-tee",
    title: "AKLabs Studio Tee",
    subtitle: "Heavyweight blank with a centered mark",
    description:
      "A heavier 220 gsm tee with a centered AK monogram. The print uses the lab palette: red, royal blue, and cyan. Boxy unisex fit.",
    material: "100% cotton, 220 gsm",
    category: "Camisetas",
    weight: 240,
    images: [img("studio-tee-white.png")],
    options: [
      { title: "Size", values: SIZES },
      { title: "Color", values: ["White", "Black"] },
    ],
    prices: { usd: 29, eur: 27 },
  },
  {
    handle: "aklabs-performance-joggers",
    title: "AKLabs Performance Joggers",
    subtitle: "Premium fleece and zip pockets",
    description:
      "Premium fleece joggers with an elastic waist, drawcord, and ribbed cuffs. An embroidered AK on the thigh and zippered side pockets. For remote work, the gym, or a long trip.",
    material: "80% cotton, 20% polyester",
    category: "Joggers",
    weight: 520,
    images: [img("joggers-charcoal.png")],
    options: [
      { title: "Size", values: SIZES },
      { title: "Color", values: ["Charcoal", "Black"] },
    ],
    prices: { usd: 48, eur: 45 },
  },
  {
    handle: "aklabs-monogram-sticker-pack",
    title: "AK Monogram Sticker Pack",
    subtitle: "Die-cut vinyl in the three lab marks",
    description:
      "Weatherproof vinyl stickers of the AK monogram, the circular badge, and the AKLABS wordmark. Matte or holographic. Made to live on a laptop, a bottle, or a flight case.",
    material: "Weatherproof vinyl",
    category: "Stickers",
    weight: 20,
    images: [img("sticker-pack.png"), img("sticker-circle.png"), img("sticker-wordmark.png")],
    options: [
      { title: "Pack", values: ["3 stickers", "6 stickers", "12 stickers"] },
      { title: "Finish", values: ["Matte", "Holographic"] },
    ],
    prices: { usd: 8, eur: 7 },
  },
  {
    handle: "aklabs-wordmark-sticker-sheet",
    title: "AKLABS Sticker Sheet",
    subtitle: "A sheet of small marks for sharing",
    description:
      "One sheet of smaller AK marks and wordmarks, kiss-cut so you can peel just one. Useful when a single logo is too big and you still want the brand on a notebook.",
    material: "Kiss-cut vinyl sheet",
    category: "Stickers",
    weight: 15,
    images: [img("sticker-wordmark.png"), img("sticker-mark.png")],
    options: [
      { title: "Size", values: ["A6", "A5"] },
    ],
    prices: { usd: 6, eur: 5 },
  },
  {
    handle: "aklabs-enamel-keychain",
    title: "AK Enamel Keychain",
    subtitle: "Hard enamel and a steel ring",
    description:
      "A hard-enamel charm of the AK monogram with a metal outline and a short steel chain. The red, blue, and cyan fills match the logo. Clips to a bag or a key ring without feeling like a souvenir.",
    material: "Hard enamel on metal",
    category: "Keychains",
    weight: 35,
    images: [img("keychain-enamel.png")],
    options: [
      { title: "Finish", values: ["Black enamel", "Silver", "Cyan"] },
    ],
    prices: { usd: 14, eur: 13 },
  },
  {
    handle: "aklabs-acrylic-charm",
    title: "AK Acrylic Charm",
    subtitle: "Clear charm with the circular badge",
    description:
      "A clear acrylic charm printed with the circular AK badge and a silver split ring. Lighter than the enamel piece, and the print stays sharp against the transparency.",
    material: "Printed acrylic",
    category: "Keychains",
    weight: 18,
    images: [img("acrylic-charm.png")],
    options: [
      { title: "Color", values: ["Red", "Blue", "Cyan"] },
    ],
    prices: { usd: 10, eur: 9 },
  },
  {
    handle: "aklabs-mini-figure",
    title: "AK Mini Figure",
    subtitle: "A 10 cm vinyl figure from the lab",
    description:
      "A small designer vinyl figure in the AK palette: red, royal blue, and cyan. Faceless, hood up, laptop in hand. It sits on a shelf next to the work, not in a toy aisle.",
    material: "Matte vinyl",
    category: "Figures",
    weight: 140,
    images: [img("mini-figure.png")],
    options: [
      { title: "Edition", values: ["Classic", "Night lab"] },
    ],
    prices: { usd: 32, eur: 30 },
  },
  {
    handle: "aklabs-desk-buddy",
    title: "AK Desk Buddy",
    subtitle: "A seated figure for the corner of the desk",
    description:
      "A chibi figure in a color-block jacket, seated on a stack of books. Two poses: one mid-code, one packing an order. Matte vinyl, meant to stay next to the keyboard.",
    material: "Matte vinyl",
    category: "Figures",
    weight: 160,
    images: [img("desk-buddy.png")],
    options: [
      { title: "Pose", values: ["Coding", "Shipping"] },
    ],
    prices: { usd: 28, eur: 26 },
  },
  {
    handle: "aklabs-crew-socks",
    title: "AKLabs Crew Socks",
    subtitle: "Cushioned crew height with a subtle AK cuff mark",
    description:
      "Crew-height socks with a reinforced heel and toe and a soft cushioned sole. The AK monogram sits small on the cuff in the lab palette. Built for long days on hard floors, not as a novelty pair.",
    material: "80% cotton, 18% polyamide, 2% elastane",
    category: "Socks",
    weight: 80,
    images: [img("crew-socks.png")],
    options: [
      { title: "Size", values: ["S/M", "L/XL"] },
      { title: "Color", values: ["Black", "Navy", "White"] },
    ],
    prices: { usd: 16, eur: 15 },
  },
  {
    handle: "aklabs-beanie",
    title: "AKLabs Beanie",
    subtitle: "Ribbed knit with a folded cuff monogram",
    description:
      "A ribbed knit beanie with a double-fold cuff and a small embroidered AK on the front. Soft acrylic blend that keeps its shape after washing. Made for cold studios and early outdoor shoots.",
    material: "100% acrylic knit",
    category: "Gorras",
    weight: 95,
    images: [img("beanie.png")],
    options: [
      { title: "Color", values: ["Black", "Navy", "Red"] },
    ],
    prices: { usd: 22, eur: 20 },
  },
  {
    handle: "aklabs-trucker-hat",
    title: "AKLabs Trucker Hat",
    subtitle: "Mesh back, flat brim, raised front panel",
    description:
      "A classic trucker with a structured front panel, breathable mesh back, and an adjustable snap. The AK mark is embroidered high on the front. Lighter than the Pro Cap when the day runs warm.",
    material: "Cotton twill front, polyester mesh back",
    category: "Gorras",
    weight: 110,
    images: [img("trucker-hat.png")],
    options: [
      { title: "Color", values: ["Navy", "Black", "Red"] },
    ],
    prices: { usd: 26, eur: 24 },
  },
  {
    handle: "aklabs-long-sleeve",
    title: "AKLabs Long Sleeve",
    subtitle: "Clean ringspun long sleeve with a chest mark",
    description:
      "A ringspun long-sleeve tee at a midweight that layers under a jacket or stands alone. Small AK print on the chest, clean hem, and a modern unisex cut. Soft enough for travel days and studio nights.",
    material: "100% ringspun cotton",
    category: "Camisetas",
    weight: 280,
    images: [img("long-sleeve.png")],
    options: [
      { title: "Size", values: SIZES },
      { title: "Color", values: ["White", "Navy"] },
    ],
    prices: { usd: 34, eur: 32 },
  },
  {
    handle: "aklabs-canvas-tote",
    title: "AKLabs Canvas Tote",
    subtitle: "Heavy canvas with a printed wordmark",
    description:
      "A durable canvas tote with long shoulder straps and an interior pocket. The AKLABS wordmark is printed on one face. Carries a laptop sleeve, a notebook, and the rest of a workday without stretching out.",
    material: "12 oz cotton canvas",
    category: "Bags",
    weight: 320,
    images: [img("canvas-tote.png")],
    options: [
      { title: "Color", values: ["Natural", "Black"] },
    ],
    prices: { usd: 22, eur: 20 },
  },
  {
    handle: "aklabs-sling-bag",
    title: "AKLabs Sling Bag",
    subtitle: "Crossbody sling with a water-resistant shell",
    description:
      "A compact crossbody sling with a water-resistant shell, an adjustable strap, and a padded phone pocket. The AK mark sits discreet on the flap. Hands-free for markets, airports, and short city runs.",
    material: "Water-resistant nylon, YKK zippers",
    category: "Bags",
    weight: 280,
    images: [img("sling-bag.png")],
    options: [
      { title: "Color", values: ["Navy", "Black"] },
    ],
    prices: { usd: 38, eur: 35 },
  },
  {
    handle: "aklabs-enamel-pin-set",
    title: "AK Enamel Pin Set",
    subtitle: "Hard enamel pins of the lab marks",
    description:
      "Hard enamel pins of the AK monogram and circular badge, with rubber clutch backs. Available as a single pin or a three-piece set. Gold or black metal outlines that sit clean on a jacket or tote.",
    material: "Hard enamel on metal",
    category: "Pins",
    weight: 25,
    images: [img("enamel-pins.png")],
    options: [
      { title: "Set", values: ["1 pin", "3 pins"] },
      { title: "Finish", values: ["Gold", "Black"] },
    ],
    prices: { usd: 12, eur: 11 },
  },
  {
    handle: "aklabs-woven-patch",
    title: "AK Woven Patch",
    subtitle: "Iron-on woven mark for jackets and bags",
    description:
      "A tightly woven patch of the AK monogram with a heat-activated backing. Small or large, ready for a coach jacket, a tote, or a backpack. Edges stay clean after pressing.",
    material: "Woven polyester with iron-on backing",
    category: "Pins",
    weight: 15,
    images: [img("woven-patch.png")],
    options: [
      { title: "Size", values: ["Small", "Large"] },
    ],
    prices: { usd: 8, eur: 7 },
  },
  {
    handle: "aklabs-lanyard",
    title: "AKLabs Lanyard",
    subtitle: "Woven strap with a metal clip and breakaway",
    description:
      "A woven lanyard with the AKLABS wordmark repeating along the strap, a swivel metal clip, and a safety breakaway. Built for badges, keys, and event passes without looking temporary.",
    material: "Woven polyester, metal clip",
    category: "Accessories",
    weight: 40,
    images: [img("lanyard.png")],
    options: [
      { title: "Color", values: ["Navy", "Black", "Cyan"] },
    ],
    prices: { usd: 12, eur: 11 },
  },
  {
    handle: "aklabs-lab-notebook",
    title: "AKLabs Lab Notebook",
    subtitle: "A5 notebook with a printed AK cover",
    description:
      "An A5 notebook with thick paper that takes pen and marker without bleed. Choose blank or lined pages and a soft or hard cover. The AK mark sits centered on the front—made for sketches, standups, and shipping notes.",
    material: "120 gsm paper, printed cover",
    category: "Stationery",
    weight: 280,
    images: [img("lab-notebook.png")],
    options: [
      { title: "Ruling", values: ["Blank", "Lined"] },
      { title: "Cover", values: ["Soft", "Hard"] },
    ],
    prices: { usd: 16, eur: 15 },
  },
  {
    handle: "aklabs-mark-poster",
    title: "AK Mark Poster",
    subtitle: "Print of the circular AK badge",
    description:
      "A museum-grade print of the circular AK badge on heavy matte stock. Available in A3 or A2. Ships flat-packed so the edges stay sharp until it hits the wall.",
    material: "Matte archival paper, 200 gsm",
    category: "Stationery",
    weight: 120,
    images: [img("mark-poster.png")],
    options: [
      { title: "Size", values: ["A3", "A2"] },
    ],
    prices: { usd: 18, eur: 16 },
  },
  {
    handle: "aklabs-ceramic-mug",
    title: "AKLabs Ceramic Mug",
    subtitle: "Dishwasher-safe mug with a wrap print",
    description:
      "A ceramic mug with a wrap-around AK print and a comfortable C-handle. Dishwasher and microwave safe. The everyday desk cup when the steel bottle is already full.",
    material: "Ceramic, dishwasher safe",
    category: "Termos y botellas",
    weight: 350,
    images: [img("ceramic-mug.png")],
    options: [
      { title: "Color", values: ["White", "Navy"] },
    ],
    prices: { usd: 18, eur: 16 },
  },
  {
    handle: "aklabs-mousepad",
    title: "AKLabs Desk Mat",
    subtitle: "Low-friction surface with a stitched edge",
    description:
      "A low-friction desk mat with a non-slip rubber base and a stitched edge that will not fray. Standard for a laptop setup or XL for keyboard plus mouse. A faint AK mark sits in the corner.",
    material: "Cloth top, natural rubber base",
    category: "Accessories",
    weight: 400,
    images: [img("mousepad.png")],
    options: [
      { title: "Size", values: ["Standard", "XL"] },
    ],
    prices: { usd: 20, eur: 18 },
  },
  {
    handle: "aklabs-card-sleeve",
    title: "AKLabs Card Sleeve",
    subtitle: "Slim RFID sleeve for cards and cash",
    description:
      "A slim card sleeve with RFID lining and a pull-tab compartment for IDs. Holds a few cards and folded cash without the bulk of a full wallet. Embossed AK on the front face.",
    material: "Vegan leather with RFID lining",
    category: "Accessories",
    weight: 60,
    images: [img("card-sleeve.png")],
    options: [
      { title: "Color", values: ["Black", "Navy"] },
    ],
    prices: { usd: 24, eur: 22 },
  },
  {
    handle: "aklabs-coach-jacket",
    title: "AKLabs Coach Jacket",
    subtitle: "Lightweight shell with a snap front",
    description:
      "A lightweight coach jacket with a snap front, elastic cuffs, and a water-resistant shell. The AK monogram is embroidered on the left chest. Layers over a tee when the hoodie is too heavy.",
    material: "100% polyester shell, mesh lining",
    category: "Hoodies",
    weight: 480,
    images: [img("coach-jacket.png")],
    options: [
      { title: "Size", values: SIZES },
      { title: "Color", values: ["Navy", "Black"] },
    ],
    prices: { usd: 72, eur: 66 },
  },
]

export const skuPrefix = (product: AklabsProductSeed) =>
  product.handle.toUpperCase().replace(/-/g, "")

export const buildPrices = (product: AklabsProductSeed) => [
  { amount: product.prices.usd, currency_code: "usd" },
  { amount: product.prices.eur, currency_code: "eur" },
]

export function buildVariants(product: AklabsProductSeed): {
  title: string
  sku: string
  options: Record<string, string>
  prices: { amount: number; currency_code: string }[]
}[] {
  const optionTitles = product.options.map((o) => o.title)
  const valueLists = product.options.map((o) => o.values)

  const combos: Record<string, string>[] = []

  function walk(depth: number, current: Record<string, string>) {
    if (depth === valueLists.length) {
      combos.push({ ...current })
      return
    }
    for (const value of valueLists[depth]) {
      current[optionTitles[depth]] = value
      walk(depth + 1, current)
    }
  }

  walk(0, {})

  return combos.map((options) => {
    const label = Object.values(options).join(" / ")
    const skuParts = Object.values(options)
      .join("-")
      .toUpperCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^A-Z0-9-]/g, "")

    return {
      title: label,
      sku: `${skuPrefix(product)}-${skuParts}`,
      options,
      prices: buildPrices(product),
    }
  })
}

export default async function seedAklabsProducts({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: {
      handle: AKLABS_PRODUCTS.map((p) => p.handle),
    },
  })

  const existingHandles = new Set(
    existingProducts.map((p: { handle?: string }) => p.handle)
  )

  const toCreate = AKLABS_PRODUCTS.filter((p) => !existingHandles.has(p.handle))

  if (!toCreate.length) {
    logger.info("Todos los productos AKLabs ya existen. Nada que crear.")
    return
  }

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]
  if (!shippingProfile) {
    throw new Error("No shipping profile found")
  }

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const salesChannel = salesChannels[0]
  if (!salesChannel) {
    throw new Error("No sales channel found")
  }

  const categoryNames = [...new Set(toCreate.map((p) => p.category))]
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: { name: categoryNames },
  })

  const categoryByName = new Map(
    existingCategories.map((c: { name: string; id: string }) => [c.name, c.id])
  )

  const missingCategories = categoryNames.filter((n) => !categoryByName.has(n))
  if (missingCategories.length) {
    const { result: createdCategories } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: missingCategories.map((name) => ({
          name,
          is_active: true,
        })),
      },
    })
    for (const cat of createdCategories) {
      categoryByName.set(cat.name, cat.id)
    }
  }

  const productsInput = toCreate.map((product) => ({
    title: product.title,
    subtitle: product.subtitle,
    handle: product.handle,
    description: product.description,
    material: product.material,
    origin_country: "EC",
    weight: product.weight,
    status: ProductStatus.PUBLISHED,
    shipping_profile_id: shippingProfile.id,
    category_ids: [categoryByName.get(product.category)!],
    thumbnail: product.images[0],
    images: product.images.map((url) => ({ url })),
    options: product.options,
    variants: buildVariants(product),
    sales_channels: [{ id: salesChannel.id }],
  }))

  logger.info(`Creando ${productsInput.length} productos AKLabs...`)

  await createProductsWorkflow(container).run({
    input: { products: productsInput },
  })

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  })
  const stockLocation = stockLocations[0]
  if (!stockLocation) {
    throw new Error("No stock location found")
  }

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })

  const newSkus = new Set(
    toCreate.flatMap((p) => buildVariants(p).map((v) => v.sku))
  )

  const itemsToStock = inventoryItems.filter((item: { sku?: string }) =>
    item.sku ? newSkus.has(item.sku) : false
  )

  if (itemsToStock.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: itemsToStock.map((item: { id: string }) => ({
          location_id: stockLocation.id,
          stocked_quantity: 500,
          inventory_item_id: item.id,
        })),
      },
    })
  }

  logger.info("Catálogo AKLabs cargado correctamente.")
}
