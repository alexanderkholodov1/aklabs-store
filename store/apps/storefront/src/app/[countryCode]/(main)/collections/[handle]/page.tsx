import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { getMessages } from "@lib/i18n/get-messages"
import { resolveCollectionTitle } from "@lib/i18n/product-copy"
import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import {
  parsePage,
  parseSortOption,
} from "@modules/store/components/refinement-list/sort-options"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<
    Record<string, string | string[] | undefined> & {
      page?: string
      sortBy?: string
      optionValueIds?: string | string[]
    }
  >
}

export async function generateStaticParams() {
  if (process.env.NODE_ENV === "development") {
    return []
  }

  const [{ collections }, regions] = await Promise.all([
    listCollections({ fields: "*products" }),
    listRegions(),
  ])

  if (!collections) {
    return []
  }

  const countryCodes = regions
    ?.map((region: StoreRegion) => region.countries?.map((country) => country.iso_2))
    .flat()
    .filter(Boolean) as string[]

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  )

  return countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const [collection, { t, locale }] = await Promise.all([
    getCollectionByHandle(params.handle),
    getMessages(),
  ])

  if (!collection) {
    notFound()
  }

  const title = resolveCollectionTitle(collection, locale)

  return {
    title,
    description: t.store.collectionMeta(title),
  }
}

export default async function CollectionPage(props: Props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  return (
    <CollectionTemplate
      collection={collection}
      page={parsePage(searchParams.page)}
      sortBy={parseSortOption(searchParams.sortBy)}
      countryCode={params.countryCode}
      optionValueIds={parseOptionValueIds(searchParams)}
    />
  )
}
