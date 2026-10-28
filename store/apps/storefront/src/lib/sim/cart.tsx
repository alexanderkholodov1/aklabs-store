"use client"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { catalog, type Product } from "@lib/catalog"
import type { Locale } from "@lib/i18n/locales"
import { siteCopy } from "@lib/i18n/site-copy"
import { commerceCopy } from "@lib/i18n/commerce-copy"
export type Line = { variantId: string; quantity: number }
export type Cart = { version: 1; lines: Line[]; promotion: string }
const empty: Cart = { version: 1, lines: [], promotion: "" }
export const CART_KEY = "aklabs.cart.v1"
const variants = new Map(
  catalog.products.flatMap((product) =>
    product.variants.map(
      (variant) => [variant.id, { product, variant }] as const
    )
  )
)
export const lineDetail = (line: Line) => variants.get(line.variantId)
export function readCart(raw: string | null): Cart {
  try {
    if (!raw || raw.length > 30000) return empty
    const data: unknown = JSON.parse(raw)
    if (
      !data ||
      typeof data !== "object" ||
      !("version" in data) ||
      data.version !== 1 ||
      !("lines" in data) ||
      !Array.isArray(data.lines)
    )
      return empty
    const seen = new Set<string>()
    const lines: Line[] = data.lines.slice(0, 40).flatMap((line: unknown) => {
      if (
        !line ||
        typeof line !== "object" ||
        !("variantId" in line) ||
        typeof line.variantId !== "string" ||
        !variants.has(line.variantId) ||
        seen.has(line.variantId) ||
        !("quantity" in line) ||
        typeof line.quantity !== "number" ||
        !Number.isInteger(line.quantity) ||
        line.quantity < 1 ||
        line.quantity > 10
      )
        return []
      seen.add(line.variantId)
      return [{ variantId: line.variantId, quantity: line.quantity }]
    })
    const promotion =
      "promotion" in data &&
      typeof data.promotion === "string" &&
      catalog.promotions.some((p) => p.code === data.promotion)
        ? data.promotion
        : ""
    return { version: 1, lines, promotion }
  } catch {
    return empty
  }
}
type CartContext = {
  cart: Cart
  ready: boolean
  message: string
  count: number
  add: (product: Product, options: Record<string, string>) => boolean
  quantity: (id: string, n: number) => void
  remove: (id: string) => void
  undo: () => void
  removed: boolean
  apply: (code: string) => boolean
  clear: () => void
}
const Context = createContext<CartContext | null>(null)
export function useCart() {
  const value = useContext(Context)
  if (!value) throw new Error("Cart provider missing")
  return value
}
export function CartProvider({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: Locale
}) {
  const t = commerceCopy(locale)
  const [cart, setCart] = useState<Cart>(empty),
    [ready, setReady] = useState(false),
    [message, setMessage] = useState("")
  const [storageError, setStorageError] = useState(false)
  const [removed, setRemoved] = useState<Line | null>(null)
  useEffect(() => {
    try {
      setCart(readCart(localStorage.getItem(CART_KEY)))
    } catch {
      setStorageError(true)
    }
    setReady(true)
    const sync = (e: StorageEvent) => {
      if (e.key === CART_KEY) setCart(readCart(e.newValue))
    }
    addEventListener("storage", sync)
    return () => removeEventListener("storage", sync)
  }, [])
  const save = useCallback((update: (current: Cart) => Cart) => {
    setCart((current) => {
      const next = update(current)
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(next))
      } catch {
        setStorageError(true)
      }
      return next
    })
  }, [])
  function add(product: Product, options: Record<string, string>) {
    const variant = product.variants.find((v) =>
      Object.entries(v.options).every(([key, value]) => options[key] === value)
    )
    if (!variant) return false
    const existing = cart.lines.find((l) => l.variantId === variant.id)
    if (existing?.quantity === 10 || (!existing && cart.lines.length >= 40)) {
      setMessage(t.limit)
      return false
    }
    save((c) => {
      const present = c.lines.find((line) => line.variantId === variant.id)
      return {
        ...c,
        lines: present
          ? c.lines.map((line) =>
              line.variantId === variant.id
                ? { ...line, quantity: Math.min(10, line.quantity + 1) }
                : line
            )
          : c.lines.length < 40
            ? [...c.lines, { variantId: variant.id, quantity: 1 }]
            : c.lines,
      }
    })
    setMessage(
      `${t.added} (${cart.lines.reduce((n, line) => n + line.quantity, 0) + 1})`
    )
    return true
  }
  function quantity(id: string, n: number) {
    if (!Number.isInteger(n) || n < 1 || n > 10) return
    save((c) => ({
      ...c,
      lines: c.lines.map((l) =>
        l.variantId === id ? { ...l, quantity: n } : l
      ),
    }))
    setMessage(t.updated)
  }
  function remove(id: string) {
    setRemoved(cart.lines.find((l) => l.variantId === id) || null)
    save((c) => ({ ...c, lines: c.lines.filter((l) => l.variantId !== id) }))
    setMessage(t.removed)
  }
  function undo() {
    if (!removed) return
    save((c) => {
      const existing = c.lines.find((l) => l.variantId === removed.variantId)
      return {
        ...c,
        lines: existing
          ? c.lines.map((l) =>
              l.variantId === removed.variantId
                ? {
                    ...l,
                    quantity: Math.min(10, l.quantity + removed.quantity),
                  }
                : l
            )
          : [...c.lines, removed],
      }
    })
    setRemoved(null)
    setMessage(t.undoDone)
  }
  function apply(input: string) {
    const code = input.trim().toUpperCase()
    if (!catalog.promotions.some((p) => p.code === code)) return false
    save((c) => ({ ...c, promotion: code }))
    setMessage(t.promoApplied)
    return true
  }
  return (
    <Context.Provider
      value={{
        cart,
        ready,
        message,
        count: cart.lines.reduce((sum, l) => sum + l.quantity, 0),
        add,
        quantity,
        remove,
        undo,
        removed: !!removed,
        apply,
        clear: () => {
          try {
            localStorage.setItem(CART_KEY, JSON.stringify(empty))
          } catch {
            setStorageError(true)
          }
          setCart(empty)
          setRemoved(null)
        },
      }}
    >
      {storageError && (
        <p className="storage-warning" role="status">
          {siteCopy(locale).storageWarning}
        </p>
      )}
      {children}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
    </Context.Provider>
  )
}
