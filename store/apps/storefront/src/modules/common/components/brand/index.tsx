import { clx } from "@modules/common/components/ui"
import Image from "next/image"

type LogoProps = {
  className?: string
  size?: number
  tone?: "light" | "dark"
  showWordmark?: boolean
}

/**
 * AKLabs lockup: the circular AK monogram plus the wordmark set in the
 * condensed display face, tinted with the brand blues.
 */
export const Logo = ({
  className,
  size = 40,
  tone = "light",
  showWordmark = true,
}: LogoProps) => {
  return (
    <span className={clx("flex items-center gap-2", className)}>
      <Image
        src="/aklabs/brand/logo-circle.png"
        alt="AKLabs"
        width={size}
        height={Math.round(size * 0.945)}
        priority
      />
      {showWordmark && (
        <span
          className={clx(
            "font-display leading-none tracking-[0.06em] pt-1",
            tone === "light" ? "text-gradient-cool" : "text-white"
          )}
          style={{ fontSize: Math.round(size * 0.72) }}
        >
          AKLABS
        </span>
      )}
    </span>
  )
}

/** Soft animated colour blobs used behind dark hero-like sections. */
export const Aurora = ({ className }: { className?: string }) => {
  return (
    <div
      aria-hidden="true"
      className={clx("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute -left-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-ak-red/40 blur-[110px] animate-aurora" />
      <div className="absolute -right-24 top-10 h-[30rem] w-[30rem] rounded-full bg-ak-sky/40 blur-[120px] animate-aurora [animation-delay:-5s]" />
      <div className="absolute bottom-[-12rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-ak-blue/50 blur-[120px] animate-aurora [animation-delay:-9s]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  )
}

/** Small uppercase label that sits above section titles. */
export const Eyebrow = ({
  children,
  className,
  tone = "light",
}: {
  children: React.ReactNode
  className?: string
  tone?: "light" | "dark"
}) => {
  return (
    <span
      className={clx(
        "chip w-fit uppercase tracking-[0.16em] text-[11px]",
        tone === "light"
          ? "glass text-ak-royal"
          : "glass-dark text-ak-sky-light",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-ak" />
      {children}
    </span>
  )
}

/** Section heading used across the storefront. */
export const SectionTitle = ({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  children,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  tone?: "light" | "dark"
  children?: React.ReactNode
}) => {
  return (
    <div
      className={clx(
        "flex flex-col gap-4 small:flex-row small:items-end small:justify-between",
        align === "center" && "items-center text-center small:flex-col small:items-center"
      )}
    >
      <div
        className={clx(
          "flex flex-col gap-3 max-w-2xl",
          align === "center" && "items-center"
        )}
      >
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <h2
          className={clx(
            "font-display text-5xl small:text-6xl leading-[0.95] tracking-wide",
            tone === "light" ? "text-ak-ink" : "text-white"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={clx(
              "text-base small:text-lg",
              tone === "light" ? "text-ak-ink/65" : "text-white/70"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}
