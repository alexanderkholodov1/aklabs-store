import { retrieveCart } from "@lib/data/cart"
import { getMessages } from "@lib/i18n/get-messages"
import CartDropdown from "../cart-dropdown"

export default async function CartButton() {
  const [{ t }, cart] = await Promise.all([
    getMessages(),
    retrieveCart().catch(() => null),
  ])

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const itemLabel =
    totalItems === 1 ? t.nav.cartItemsSingular : t.nav.cartItemsPlural
  const cartLabel = t.nav.cart
  const emptyLabel = t.cart.empty

  return (
    <CartDropdown
      cart={cart}
      labels={{
        cart: cartLabel,
        cartAria: `${cartLabel}, ${totalItems} ${itemLabel}`,
        empty: emptyLabel,
      }}
    />
  )
}
