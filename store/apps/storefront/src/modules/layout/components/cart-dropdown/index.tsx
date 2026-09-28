"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const BagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M9 10V7a3 3 0 0 1 6 0v3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    itemRef.current = totalItems
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems])

  return (
    <div
      className="h-full z-50 flex items-center"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full flex items-center">
        <PopoverButton as="div" className="flex items-center">
          <LocalizedClientLink
            className="flex h-10 items-center gap-2 rounded-full bg-ak-ink pl-3.5 pr-2 text-white shadow-lg shadow-ak-blue/20 transition-transform hover:-translate-y-0.5"
            href="/cart"
            data-testid="nav-cart-link"
            aria-label={`Carrito, ${totalItems} ${totalItems === 1 ? "producto" : "productos"}`}
          >
            <BagIcon />
            <span className="hidden xsmall:inline text-sm font-semibold">
              Carrito
            </span>
            <span
              className="grid h-6 min-w-[1.5rem] place-items-center rounded-full bg-gradient-ak px-1.5 text-xs font-bold"
              data-testid="nav-cart-count"
            >
              {totalItems}
            </span>
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="glass-strong hidden small:block absolute top-[calc(100%+14px)] right-0 w-[420px] rounded-[28px] text-ak-ink overflow-hidden"
            data-testid="nav-cart-dropdown"
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h3 className="font-display text-3xl tracking-wide">
                Tu carrito
              </h3>
              <span className="chip bg-ak-mist text-ak-royal">
                {totalItems} {totalItems === 1 ? "producto" : "productos"}
              </span>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-5 grid grid-cols-1 gap-y-4 no-scrollbar p-px">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[88px_1fr] gap-x-4 rounded-2xl bg-white/70 p-2"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-[88px]"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1 py-1 pr-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col min-w-0">
                              <h3 className="text-sm font-semibold truncate">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                  data-testid="product-link"
                                >
                                  {item.title}
                                </LocalizedClientLink>
                              </h3>
                              <LineItemOptions
                                variant={item.variant}
                                data-testid="cart-item-variant"
                                data-value={item.variant}
                              />
                              <span
                                className="text-xs text-ak-ink/60"
                                data-testid="cart-item-quantity"
                                data-value={item.quantity}
                              >
                                Cantidad: {item.quantity}
                              </span>
                            </div>
                            <LineItemPrice
                              item={item}
                              style="tight"
                              currencyCode={cartState.currency_code}
                            />
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-1"
                            data-testid="cart-item-remove-button"
                          >
                            Quitar
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-5 flex flex-col gap-y-4 text-small-regular">
                  <div className="flex items-center justify-between">
                    <span className="text-ak-ink font-semibold">
                      Subtotal{" "}
                      <span className="font-normal text-ak-ink/60">
                        (sin impuestos)
                      </span>
                    </span>
                    <span
                      className="text-lg font-semibold"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref>
                    <Button
                      className="w-full"
                      size="large"
                      data-testid="go-to-cart-button"
                    >
                      Ver carrito
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex py-14 flex-col gap-y-4 items-center justify-center text-center px-6">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-ak text-white">
                  <BagIcon />
                </div>
                <span className="text-ak-ink/70">Tu carrito está vacío.</span>
                <LocalizedClientLink href="/store">
                  <>
                    <span className="sr-only">Ir a todos los productos</span>
                    <Button onClick={close}>Explorar productos</Button>
                  </>
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
