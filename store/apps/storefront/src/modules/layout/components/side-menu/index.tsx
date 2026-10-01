"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { Locale } from "@lib/data/locales"
import { resolveLocale } from "@lib/i18n/locales"
import type { Locale as UiLocale } from "@lib/i18n/locales"
import useToggleState from "@lib/hooks/use-toggle-state"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@modules/common/components/ui"
import { Fragment } from "react"
import LanguageSelect from "../language-select"
import LanguageSwitch from "../language-switch"
import { RegionSelect } from "../region-switcher"

const SideMenuItems = [
  { name: "Home", href: "/", testId: "home-link" },
  { name: "Shop", href: "/store", testId: "store-link" },
  { name: "Hoodies", href: "/categories/hoodies", testId: "hoodies-link" },
  { name: "Tees", href: "/categories/camisetas", testId: "camisetas-link" },
  { name: "Stickers", href: "/categories/stickers", testId: "stickers-link" },
  { name: "Figures", href: "/categories/figures", testId: "figures-link" },
]

const SecondaryItems = [
  { name: "Account", href: "/account", testId: "account-link" },
  { name: "Cart", href: "/cart", testId: "cart-link" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const languageToggleState = useToggleState()
  const uiLocale: UiLocale = resolveLocale(currentLocale)

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full items-center">
                <PopoverButton
                  data-testid="nav-menu-button"
                  className="flex h-10 items-center justify-center rounded-full px-3 text-ak-ink/80 transition-colors hover:bg-white/90 hover:text-ak-ink focus:outline-none"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 5h13M2.5 9h9M2.5 13h13"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="hidden xsmall:inline">Menu</span>
                </PopoverButton>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-ak-navy/30 backdrop-blur-sm pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
              >
                <PopoverPanel className="fixed left-3 top-3 bottom-3 z-[51] flex w-[calc(100%-1.5rem)] flex-col text-sm xsmall:w-[380px]">
                  <div
                    data-testid="nav-menu-popup"
                    className="relative flex h-full flex-col justify-between overflow-hidden rounded-[32px] bg-ak-navy p-6 text-white shadow-2xl"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ak-sky/30 blur-[90px]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-ak-red/30 blur-[90px]"
                    />

                    <div className="relative flex items-center justify-between">
                      <span className="font-display text-2xl tracking-[0.08em] text-white/90">
                        AKLABS
                      </span>
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        className="glass-dark flex h-10 w-10 items-center justify-center rounded-full"
                        aria-label="Close menu"
                      >
                        <XMark />
                      </button>
                    </div>

                    <ul className="relative flex flex-col gap-1">
                      {SideMenuItems.map((item) => (
                        <li key={item.href}>
                          <LocalizedClientLink
                            href={item.href}
                            className="group flex items-center justify-between rounded-2xl px-3 py-2 font-display text-4xl tracking-wide text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                            onClick={close}
                            data-testid={item.testId}
                          >
                            {item.name}
                            <ArrowRightMini className="opacity-0 transition-opacity group-hover:opacity-100" />
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>

                    <div className="relative flex flex-col gap-4">
                      <div className="flex gap-2">
                        {SecondaryItems.map((item) => (
                          <LocalizedClientLink
                            key={item.href}
                            href={item.href}
                            onClick={close}
                            className="glass-dark flex-1 rounded-full px-4 py-2.5 text-center font-medium"
                            data-testid={item.testId}
                          >
                            {item.name}
                          </LocalizedClientLink>
                        ))}
                      </div>
                      {!!locales?.length ? (
                        <div
                          className="flex justify-between"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-white/60">Language</span>
                          <LanguageSwitch
                            locale={uiLocale}
                            className="flex items-center rounded-full bg-white/70 p-1 text-xs font-semibold"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-white/60">Region & currency</span>
                        <RegionSelect regions={regions} />
                      </div>
                      <Text className="txt-compact-small text-white/50">
                        © {new Date().getFullYear()} AKLabs
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
