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
    subtitle: "Felpa premium con monograma AK bordado",
    description:
      "La pieza insignia de AKLabs. Sudadera con capucha de felpa premium (320 g/m2) con interior afelpado y el monograma AK bordado en alta densidad sobre el pecho. Corte unisex relajado, bolsillo canguro amplio y costuras reforzadas: pensada para las madrugadas frías de la sierra y las sesiones largas de código.",
    material: "80% algodón peinado, 20% poliéster",
    category: "Hoodies",
    weight: 650,
    images: [img("hoodie-black-front.png"), img("hoodie-navy-front.png")],
    options: [
      { title: "Talla", values: SIZES },
      { title: "Color", values: ["Negro", "Azul marino"] },
    ],
    prices: { usd: 58, eur: 54 },
  },
  {
    handle: "aklabs-pro-cap",
    title: "AKLabs Pro Cap",
    subtitle: "Seis paneles, visera curva y bordado en relieve",
    description:
      "Gorra estructurada de seis paneles con visera curva y cierre metálico ajustable. El monograma AK va bordado en relieve con los tres colores de la marca. Twill de algodón respirable para el día a día, el gimnasio o el streetwear.",
    material: "100% algodón twill",
    category: "Gorras",
    weight: 120,
    images: [img("cap-black-front.png"), img("cap-navy-front.png")],
    options: [
      { title: "Talla", values: ["Única"] },
      { title: "Color", values: ["Negro", "Azul marino"] },
    ],
    prices: { usd: 28, eur: 26 },
  },
  {
    handle: "aklabs-steel-thermo",
    title: "AKLabs Steel Thermo 750 ml",
    subtitle: "12 h caliente, 24 h frío",
    description:
      "Termo de acero inoxidable con doble pared al vacío: mantiene tus bebidas calientes hasta 12 horas y frías hasta 24. Tapa hermética a prueba de derrames, acabado negro mate y el AK vertical impreso en rojo, azul y celeste. Capacidad de 750 ml.",
    material: "Acero inoxidable 18/8 con doble pared al vacío",
    category: "Termos y botellas",
    weight: 380,
    images: [img("thermo-black.png")],
    options: [
      { title: "Capacidad", values: ["750 ml"] },
      { title: "Color", values: ["Negro mate"] },
    ],
    prices: { usd: 34, eur: 32 },
  },
  {
    handle: "aklabs-tech-tee",
    title: "AKLabs Tech Tee",
    subtitle: "Algodón ringspun con AK en gradiente",
    description:
      "Camiseta unisex de algodón ringspun de 180 g/m2, suave desde el primer uso. Estampado DTG de gran formato con el monograma AK en gradiente. Corte moderno que funciona sola o como capa debajo de la hoodie AKLabs.",
    material: "100% algodón ringspun",
    category: "Camisetas",
    weight: 220,
    images: [img("tee-gray-front.png")],
    options: [
      { title: "Talla", values: SIZES },
      { title: "Color", values: ["Gris jaspe", "Negro"] },
    ],
    prices: { usd: 26, eur: 24 },
  },
  {
    handle: "aklabs-performance-joggers",
    title: "AKLabs Performance Joggers",
    subtitle: "Felpa premium y bolsillos con cierre",
    description:
      "Joggers de felpa premium con cintura elástica, cordón y puños ribeteados. Logo AK bordado en el muslo y bolsillos laterales con cierre oculto para llevar lo esencial. Comodidad total para trabajo remoto, gimnasio o viaje.",
    material: "80% algodón, 20% poliéster",
    category: "Joggers",
    weight: 520,
    images: [img("joggers-charcoal.png")],
    options: [
      { title: "Talla", values: SIZES },
      { title: "Color", values: ["Carbón", "Negro"] },
    ],
    prices: { usd: 48, eur: 45 },
  },
  {
    handle: "aklabs-insulated-bottle",
    title: "AKLabs Insulated Bottle 1 L",
    subtitle: "Acero cepillado con grabado láser",
    description:
      "Botella térmica de acero inoxidable cepillado con aislamiento al vacío y tapa a rosca. Wordmark AKLABS grabado con láser. Un litro de capacidad para hidratarte todo el día, en la oficina o en la montaña.",
    material: "Acero inoxidable cepillado 18/8",
    category: "Termos y botellas",
    weight: 420,
    images: [img("bottle-steel.png")],
    options: [
      { title: "Capacidad", values: ["1 L"] },
      { title: "Acabado", values: ["Acero cepillado"] },
    ],
    prices: { usd: 36, eur: 34 },
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
