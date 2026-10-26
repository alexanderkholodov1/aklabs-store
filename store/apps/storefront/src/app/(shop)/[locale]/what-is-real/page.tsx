import type { Metadata } from "next"
import { resolveLocale } from "@lib/i18n/locales"
import { showcaseCopy } from "@modules/showcase/copy"
import { WhatIsRealPage } from "@modules/showcase/pages"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = showcaseCopy(resolveLocale((await params).locale)).real
  return { title: t.title, description: t.description }
}

export default async function Page({ params }: Props) {
  return <WhatIsRealPage locale={resolveLocale((await params).locale)} />
}
