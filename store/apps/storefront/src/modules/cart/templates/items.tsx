import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table } from "@modules/common/components/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const totalItems = items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0

  return (
    <div>
      <div className="flex items-end justify-between pb-3">
        <h1 className="font-display text-5xl tracking-wide text-ak-ink small:text-6xl">
          Tu carrito
        </h1>
        <span className="chip bg-ak-mist text-ak-royal">
          {totalItems} {totalItems === 1 ? "producto" : "productos"}
        </span>
      </div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ak-ink/50 txt-medium-plus hover:bg-transparent">
            <Table.HeaderCell className="!pl-0">Producto</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Cantidad</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Precio
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
