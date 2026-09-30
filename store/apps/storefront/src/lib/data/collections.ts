"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { remember } from "./catalog-cache"

export const retrieveCollection = async (id: string) => {
  const { collections } = await listCollections()
  return collections.find((collection) => collection.id === id) ?? null
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  const limit = queryParams.limit || "100"
  const offset = queryParams.offset || "0"

  return remember(`collections:${limit}:${offset}`, async () => {
    const { collections } = await sdk.client.fetch<{
      collections: HttpTypes.StoreCollection[]
      count: number
    }>("/store/collections", {
      query: { ...queryParams, limit, offset },
      cache: "no-store",
    })

    return { collections, count: collections.length }
  })
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  const { collections } = await listCollections()
  return collections.find((collection) => collection.handle === handle) ?? null
}
