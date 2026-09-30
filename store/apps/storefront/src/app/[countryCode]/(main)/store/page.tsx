import { Metadata } from "next"

import { getMessages } from "@lib/i18n/get-messages"
import { parseOptionValueIds } from "@lib/util/product-option-filters"
import {
  parsePage,
  parseSortOption,
} from "@modules/store/components/refinement-list/sort-options"
import StoreTemplate from "@modules/store/templates"

type StorePageSearchParams = Record<string, string | string[] | undefined> & {
  sortBy?: string
  page?: string
  optionValueIds?: string | string[]
}

type Params = {
  searchParams: Promise<StorePageSearchParams>
  params: Promise<{
    countryCode: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getMessages()

  return {
    title: t.store.metaTitle,
    description: t.store.metaDescription,
  }
}

export default async function StorePage(props: Params) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])

  return (
    <StoreTemplate
      sortBy={parseSortOption(searchParams.sortBy)}
      page={parsePage(searchParams.page)}
      countryCode={params.countryCode}
      optionValueIds={parseOptionValueIds(searchParams)}
    />
  )
}
