"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { remember } from "./catalog-cache"

export const listRegions = async () => {
  return remember("regions", async () => {
    const { regions } = await sdk.client.fetch<{
      regions: HttpTypes.StoreRegion[]
    }>(`/store/regions`, {
      method: "GET",
      cache: "no-store",
    })

    return regions
  })
}

export const retrieveRegion = async (id: string) => {
  const regions = await listRegions()
  return regions?.find((region) => region.id === id) ?? null
}

export const getRegion = async (countryCode: string) => {
  const regions = await listRegions()

  if (!regions?.length) {
    return null
  }

  const code = (countryCode || "ec").toLowerCase()

  return (
    regions.find((region) =>
      region.countries?.some((country) => country.iso_2?.toLowerCase() === code)
    ) ?? null
  )
}
