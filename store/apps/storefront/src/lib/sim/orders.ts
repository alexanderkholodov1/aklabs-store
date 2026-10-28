import { catalog, type Currency } from "@lib/catalog"
import { lineDetail, type Cart } from "./cart"
export type Address = {
  name: string
  street: string
  city: string
  postal: string
  country: string
}
export type Order = {
  version: 1
  id: string
  createdAt: number
  duration: number
  currency: Currency
  cart: Cart
  address: Address
  subtotal: number
  discount: number
  total: number
}
export const ORDERS_KEY = "aklabs.orders.v1"
export function totals(cart: Cart, currency: Currency) {
  const subtotal = cart.lines.reduce((sum, line) => {
    const detail = lineDetail(line)
    return (
      sum +
      (detail
        ? (detail.variant.salePrices || detail.variant.prices)[currency] *
          line.quantity
        : 0)
    )
  }, 0)
  const promo = catalog.promotions.find((p) => p.code === cart.promotion)
  const discount = promo ? Math.round((subtotal * promo.value) / 100) : 0
  return { subtotal, discount, total: subtotal - discount }
}
export function validAddress(address: Address) {
  const errors: Partial<Record<keyof Address, boolean>> = {}
  for (const field of ["name", "street", "city", "country"] as const)
    if (
      address[field].trim().length < 2 ||
      address[field].trim().length > 100 ||
      /[<>\u0000-\u001f]/.test(address[field])
    )
      errors[field] = true
  if (!/^[\p{L}\d -]{3,12}$/u.test(address.postal.trim())) errors.postal = true
  return errors
}
export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (!raw || raw.length > 300000) return []
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data.slice(0, 20).filter((o): o is Order => {
      if (
        !o ||
        typeof o !== "object" ||
        o.version !== 1 ||
        typeof o.id !== "string" ||
        !/^AK-[A-Z0-9]{8}$/.test(o.id) ||
        !Number.isFinite(o.createdAt) ||
        o.createdAt < 0 ||
        ![60000, 120000].includes(o.duration) ||
        !["USD", "EUR"].includes(o.currency) ||
        !o.address ||
        typeof o.address !== "object" ||
        !["name", "street", "city", "postal", "country"].every(
          (k) => typeof o.address[k] === "string"
        ) ||
        Object.keys(validAddress(o.address)).length ||
        !o.cart ||
        o.cart.version !== 1 ||
        !Array.isArray(o.cart.lines) ||
        !o.cart.lines.length ||
        o.cart.lines.length > 40 ||
        typeof o.cart.promotion !== "string"
      )
        return false
      if (
        !o.cart.lines.every(
          (l: { variantId?: unknown; quantity?: unknown }) =>
            typeof l.variantId === "string" &&
            typeof l.quantity === "number" &&
            Number.isInteger(l.quantity) &&
            l.quantity >= 1 &&
            l.quantity <= 10 &&
            !!lineDetail(l as { variantId: string; quantity: number })
        )
      )
        return false
      const expected = totals(o.cart, o.currency)
      return (
        o.total === expected.total &&
        o.subtotal === expected.subtotal &&
        o.discount === expected.discount
      )
    })
  } catch {
    return []
  }
}
export function placeOrder(
  cart: Cart,
  currency: Currency,
  address: Address,
  duration: number
): Order | null {
  if (
    !cart.lines.length ||
    Object.keys(validAddress(address)).length ||
    ![60000, 120000].includes(duration)
  )
    return null
  const order: Order = {
    version: 1,
    id: `AK-${crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`,
    createdAt: Date.now(),
    duration,
    currency,
    address: Object.fromEntries(
      Object.entries(address).map(([k, v]) => [k, v.trim()])
    ) as Address,
    cart: JSON.parse(JSON.stringify(cart)),
    ...totals(cart, currency),
  }
  try {
    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify([order, ...loadOrders()].slice(0, 20))
    )
    return order
  } catch {
    return null
  }
}
export function courierStage(order: Order, now: number) {
  const elapsed = Math.max(0, now - order.createdAt)
  return elapsed >= order.duration
    ? 3
    : elapsed >= order.duration * 0.4
      ? 2
      : elapsed >= order.duration * 0.15
        ? 1
        : 0
}
