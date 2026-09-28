import { clx } from "@modules/common/components/ui"

/** Numbered heading for each checkout step. */
const StepHeading = ({
  step,
  title,
  done,
  muted,
}: {
  step: number
  title: string
  done?: boolean
  muted?: boolean
}) => {
  return (
    <h2
      className={clx(
        "flex items-center gap-3 text-2xl font-semibold tracking-tight text-ak-ink",
        muted && "opacity-50 pointer-events-none select-none"
      )}
    >
      <span
        className={clx(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white",
          done ? "bg-emerald-500" : "bg-gradient-ak"
        )}
        aria-hidden="true"
      >
        {done ? "✓" : step}
      </span>
      {title}
    </h2>
  )
}

export default StepHeading
