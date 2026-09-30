import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getMessages } from "@lib/i18n/get-messages"
import { HttpTypes } from "@medusajs/types"
import { SectionTitle } from "@modules/common/components/brand"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const { t } = await getMessages()

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags?.length) {
    queryParams.tag_id = product.tags
      .map((tag) => tag.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-10">
      <SectionTitle
        title={t.product.related}
        description={t.product.relatedBody}
      />

      <ul className="grid grid-cols-2 gap-3 xsmall:gap-4 small:grid-cols-4 small:gap-6">
        {products.slice(0, 4).map((relatedProduct) => (
          <li key={relatedProduct.id}>
            <Product region={region} product={relatedProduct} />
          </li>
        ))}
      </ul>
    </div>
  )
}
