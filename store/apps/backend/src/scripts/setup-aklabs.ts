import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import addEcRegion from "./add-ec-region"
import seedAklabsProducts from "./seed-aklabs-products"
import syncAklabsCatalog from "./sync-aklabs-catalog"

/**
 * One-shot setup for a fresh database (run after `medusa db:migrate`):
 * Ecuador region in USD + AKLabs catalog + cleanup of the starter demo data.
 * Every step is idempotent, so it is safe to run more than once.
 *
 *   pnpm medusa exec ./src/scripts/setup-aklabs.ts
 */
export default async function setupAklabs({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("[1/3] Región Ecuador (USD), impuestos y envío...")
  await addEcRegion({ container })

  logger.info("[2/3] Productos AKLabs...")
  await seedAklabsProducts({ container })

  logger.info("[3/3] Precios USD/EUR, textos y limpieza del catálogo demo...")
  await syncAklabsCatalog({ container })

  logger.info("Setup AKLabs completo.")
}
