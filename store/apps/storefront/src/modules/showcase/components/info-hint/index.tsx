"use client"

import { useI18n } from "@lib/i18n/client"
import { Messages } from "@lib/i18n/messages"
import { clx } from "@modules/common/components/ui"
import { useEffect, useId, useRef, useState } from "react"

export type InfoHintTopic = keyof Messages["showcase"]["hints"]

/**
 * Small "i" button that explains how a part of the store is built.
 * Drop it next to any UI element: <InfoHint topic="pricing" />.
 * Owned by the showcase workstream; other modules only place it.
 */
export default function InfoHint({
  topic,
  align = "left",
  className,
}: {
  topic: InfoHintTopic
  align?: "left" | "right"
  className?: string
}) {
  const { t } = useI18n()
  const hint = t.showcase.hints[topic]
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [open])

  return (
    <span ref={ref} className={clx("relative inline-flex align-middle", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${t.showcase.hintLabel} ${hint.title}`}
        onClick={() => setOpen((v) => !v)}
        className="grid h-5 w-5 place-items-center rounded-full bg-gradient-ak text-[11px] font-bold italic text-white shadow-md shadow-ak-blue/30 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ak-sky"
      >
        i
      </button>
      {open && (
        <span
          id={panelId}
          role="note"
          className={clx(
            "glass-strong absolute top-7 z-[70] w-[min(18rem,80vw)] rounded-2xl p-4 text-left text-sm normal-case tracking-normal text-ak-ink",
            align === "left" ? "left-0" : "right-0"
          )}
        >
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ak-royal">
            {t.showcase.hintLabel}
          </span>
          <span className="block font-semibold">{hint.title}</span>
          <span className="mt-1 block text-ak-ink/70">{hint.body}</span>
        </span>
      )}
    </span>
  )
}
