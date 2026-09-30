import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createTaxRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

const COUNTRY_CODE = "ec"

export default async function addEcRegion({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  })

  let ecRegion: { id: string; name: string } | undefined = regions.find(
    (region) =>
      region.countries?.some(
        (country) => country?.iso_2?.toLowerCase() === COUNTRY_CODE
      )
  )

  if (ecRegion) {
    logger.info(
      `Region for ${COUNTRY_CODE.toUpperCase()} already exists (${ecRegion.name}), skipping region creation.`
    )
  } else {
    logger.info("Creating Ecuador region...")
    const { result: regionResult } = await createRegionsWorkflow(container).run(
      {
        input: {
          regions: [
            {
              name: "Ecuador",
              currency_code: "usd",
              countries: [COUNTRY_CODE],
              payment_providers: ["pp_system_default"],
            },
          ],
        },
      }
    )
    ecRegion = regionResult[0]
    logger.info("Ecuador region created.")
  }

  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
    filters: { country_code: COUNTRY_CODE },
  })

  if (taxRegions.length) {
    logger.info(
      `Tax region for ${COUNTRY_CODE.toUpperCase()} already exists, skipping.`
    )
  } else {
    logger.info("Creating tax region for Ecuador...")
    await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: COUNTRY_CODE,
          provider_id: "tp_system",
        },
      ],
    })
    logger.info("Tax region for Ecuador created.")
  }

  const { data: stores } = await query.graph({
    entity: "store",
    fields: [
      "id",
      "supported_currencies.currency_code",
      "supported_currencies.is_default",
    ],
  })

  const store = stores[0]
  if (!store) {
    throw new Error("No store found")
  }

  const supportedCurrencies = store.supported_currencies ?? []
  const hasUsdDefault = supportedCurrencies.some(
    (currency) => currency?.currency_code === "usd" && currency.is_default
  )

  if (hasUsdDefault) {
    logger.info("Store default currency is already USD, skipping store update.")
  } else {
    logger.info("Setting USD as default store currency...")
    // Typed explicitly: without the types Medusa generates in .medusa/types
    // (absent in CI), query.graph returns loosely typed records.
    const currencyCodes = new Set<string>(
      supportedCurrencies
        .map((currency) => currency?.currency_code)
        .filter((code): code is string => typeof code === "string" && code !== "")
    )
    currencyCodes.add("usd")
    currencyCodes.add("eur")

    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: Array.from(currencyCodes).map((currency_code) => ({
            currency_code,
            is_default: currency_code === "usd",
          })),
        },
      },
    })
    logger.info("Store default currency updated to USD.")
  }

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  const stockLocation = stockLocations[0]
  if (!stockLocation) {
    throw new Error("No stock location found")
  }

  const { data: fulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: [
      "id",
      "name",
      "service_zones.id",
      "service_zones.name",
      "service_zones.geo_zones.country_code",
    ],
  })

  let ecServiceZone: { id: string } | undefined = fulfillmentSets
    .flatMap((set) =>
      (set.service_zones ?? []).map((zone) => ({
        set,
        zone,
      }))
    )
    .find(({ zone }) =>
      zone.geo_zones?.some(
        (geo) => geo?.country_code?.toLowerCase() === COUNTRY_CODE
      )
    )?.zone

  if (ecServiceZone) {
    logger.info(
      `Service zone for ${COUNTRY_CODE.toUpperCase()} already exists, skipping fulfillment setup.`
    )
  } else {
    logger.info("Creating fulfillment service zone for Ecuador...")
    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Ecuador delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Ecuador",
          geo_zones: [
            {
              country_code: COUNTRY_CODE,
              type: "country",
            },
          ],
        },
      ],
    })

    ecServiceZone = fulfillmentSet.service_zones[0]

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    })
    logger.info("Ecuador service zone created.")
  }

  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name", "service_zone_id"],
    filters: { service_zone_id: ecServiceZone.id },
  })

  const hasStandardOption = shippingOptions.some(
    (option: { name?: string }) =>
      option.name === "Standard" || option.name === "Standard Shipping"
  )

  if (hasStandardOption) {
    logger.info("Standard shipping option for Ecuador already exists, skipping.")
  } else {
    const { data: shippingProfiles } = await query.graph({
      entity: "shipping_profile",
      fields: ["id"],
    })
    const shippingProfile = shippingProfiles[0]
    if (!shippingProfile) {
      throw new Error("No shipping profile found")
    }

    logger.info("Creating Standard shipping option for Ecuador (10 USD)...")
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: ecServiceZone.id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Standard shipping to Ecuador.",
            code: "standard",
          },
          prices: [
            {
              currency_code: "usd",
              amount: 10,
            },
            {
              region_id: ecRegion!.id,
              amount: 10,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    })
    logger.info("Standard shipping option created.")
  }

  logger.info("Ecuador region setup complete.")
}
