import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createShippingOptionsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
  updateProductVariantsWorkflow,
  updateProductsWorkflow,
  updateShippingOptionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

import { AKLABS_PRODUCTS, buildPrices } from "./seed-aklabs-products"

/**
 * Idempotent maintenance for the AKLabs catalog:
 *
 * 0. Names the store "AKLabs Store" (shown in the admin).
 * 1. Keeps AKLabs product copy (subtitle, description, material, origin) in sync.
 * 2. Gives every AKLabs variant a USD price (Ecuador) and an EUR price (Europe),
 *    so /ec and /dk can both sell the same catalog.
 * 3. Soft-deletes the demo catalog created by the Medusa starter
 *    (products and categories), leaving only the AKLabs merch.
 * 4. Names the Ecuador shipping options and adds an express option.
 *
 * Category / option labels are left as seeded. Storefront locale dictionaries
 * (and product-copy overlays) own EN/ES display strings — this script must not
 * rewrite Spanish labels to English in Postgres.
 */

const STORE_NAME = "AKLabs Store"
const DEMO_PRODUCT_HANDLES = ["t-shirt", "sweatshirt", "sweatpants", "shorts"]
const DEMO_CATEGORY_NAMES = ["Shirts", "Sweatshirts", "Pants", "Merch"]

const EC_STANDARD = {
  name: "Standard shipping",
  label: "Standard",
  description: "Delivery in 2 to 4 business days across Ecuador.",
}

const EC_EXPRESS = {
  name: "Express shipping",
  label: "Express",
  description: "Delivery in 24 to 48 hours in major cities.",
  amount: 15,
}

export default async function syncAklabsCatalog({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // 0. Store name shown in the admin
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "name"],
  })
  const store = stores[0]
  if (store && store.name !== STORE_NAME) {
    await updateStoresWorkflow(container).run({
      input: { selector: { id: store.id }, update: { name: STORE_NAME } },
    })
    logger.info(`Tienda renombrada a "${STORE_NAME}".`)
  }

  // 1 + 2. Product copy and multi-currency prices
  const { data: aklabsProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "variants.id"],
    filters: { handle: AKLABS_PRODUCTS.map((p) => p.handle) },
  })

  if (!aklabsProducts.length) {
    logger.warn(
      "No hay productos AKLabs. Ejecuta primero src/scripts/seed-aklabs-products.ts"
    )
  }

  for (const product of aklabsProducts) {
    const seed = AKLABS_PRODUCTS.find((p) => p.handle === product.handle)
    if (!seed) {
      continue
    }

    await updateProductsWorkflow(container).run({
      input: {
        products: [
          {
            id: product.id,
            title: seed.title,
            subtitle: seed.subtitle,
            description: seed.description,
            material: seed.material,
            origin_country: "EC",
            thumbnail: seed.images[0],
          },
        ],
      },
    })

    const variantIds = (product.variants ?? [])
      .map((v: { id?: string } | null) => v?.id)
      .filter((id): id is string => !!id)

    if (variantIds.length) {
      await updateProductVariantsWorkflow(container).run({
        input: {
          product_variants: variantIds.map((id) => ({
            id,
            prices: buildPrices(seed),
          })),
        },
      })
    }

    logger.info(
      `AKLabs: ${seed.handle} actualizado (${variantIds.length} variantes, USD ${seed.prices.usd} / EUR ${seed.prices.eur}).`
    )
  }

  // Category / option display names stay as seeded in Postgres.
  // English/Spanish UI labels live in the storefront locale dictionaries —
  // do not rename Spanish labels to English here.

  // 3. Remove the starter demo catalog (soft delete, recoverable)
  const { data: demoProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: DEMO_PRODUCT_HANDLES },
  })

  if (demoProducts.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: demoProducts.map((p: { id: string }) => p.id) },
    })
    logger.info(
      `Catálogo demo eliminado: ${demoProducts
        .map((p: { handle: string }) => p.handle)
        .join(", ")}`
    )
  } else {
    logger.info("El catálogo demo ya no existe, nada que eliminar.")
  }

  const { data: demoCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "category_children.id"],
    filters: { name: DEMO_CATEGORY_NAMES },
  })

  const removableCategories = demoCategories.filter(
    (c: { category_children?: unknown[] }) => !c.category_children?.length
  )

  if (removableCategories.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: removableCategories.map((c: { id: string }) => c.id),
    })
    logger.info(
      `Categorías demo eliminadas: ${removableCategories
        .map((c: { name: string }) => c.name)
        .join(", ")}`
    )
  }

  // 4. Ecuador shipping options in Spanish (+ express)
  const { data: fulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: [
      "id",
      "service_zones.id",
      "service_zones.geo_zones.country_code",
      "service_zones.shipping_options.id",
      "service_zones.shipping_options.name",
      "service_zones.shipping_options.shipping_profile_id",
    ],
  })

  const ecZone = fulfillmentSets
    .flatMap((set) => set.service_zones ?? [])
    .find((zone) =>
      zone?.geo_zones?.some(
        (geo: { country_code?: string } | null) =>
          geo?.country_code?.toLowerCase() === "ec"
      )
    )

  if (!ecZone) {
    logger.warn(
      "No existe zona de envío para Ecuador. Ejecuta src/scripts/add-ec-region.ts"
    )
    return
  }

  const ecOptions = (ecZone.shipping_options ?? []).filter(
    (o): o is NonNullable<typeof o> => !!o
  )

  const standard = ecOptions.find(
    (o) =>
      o.name === "Standard" ||
      o.name === "Standard Shipping" ||
      o.name === "Envío estándar Ecuador" ||
      o.name === EC_STANDARD.name
  )

  if (standard && standard.name !== EC_STANDARD.name) {
    await updateShippingOptionsWorkflow(container).run({
      input: [
        {
          id: standard.id,
          name: EC_STANDARD.name,
          type: {
            label: EC_STANDARD.label,
            description: EC_STANDARD.description,
            code: "standard",
          },
        },
      ],
    })
    logger.info(`Opción de envío renombrada a "${EC_STANDARD.name}".`)
  }

  const hasExpress = ecOptions.some((o) => o.name === EC_EXPRESS.name)
  const shippingProfileId = standard?.shipping_profile_id

  if (!hasExpress && shippingProfileId) {
    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id", "countries.iso_2"],
    })
    const ecRegion = regions.find((r) =>
      r.countries?.some(
        (c: { iso_2?: string } | null) => c?.iso_2?.toLowerCase() === "ec"
      )
    )

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: EC_EXPRESS.name,
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: ecZone.id,
          shipping_profile_id: shippingProfileId,
          type: {
            label: EC_EXPRESS.label,
            description: EC_EXPRESS.description,
            code: "express",
          },
          prices: [
            { currency_code: "usd", amount: EC_EXPRESS.amount },
            ...(ecRegion
              ? [{ region_id: ecRegion.id, amount: EC_EXPRESS.amount }]
              : []),
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })
    logger.info(`Opción "${EC_EXPRESS.name}" creada (USD ${EC_EXPRESS.amount}).`)
  }

  logger.info("Catálogo AKLabs sincronizado.")
}
