const WORDS = [
  "AKLabs",
  "Hoodies",
  "Gorras",
  "Camisetas",
  "Joggers",
  "Termos",
  "Diseñado en Ecuador",
  "Crea · Prueba · Repite",
]

const Row = ({ ariaHidden }: { ariaHidden?: boolean }) => (
  <ul className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
    {WORDS.map((word) => (
      <li
        key={word}
        className="flex items-center gap-8 pr-8 font-display text-3xl tracking-[0.08em] text-white small:text-4xl"
      >
        {word}
        <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
      </li>
    ))}
  </ul>
)

/** Infinite gradient ticker with the collection names. */
const BrandMarquee = () => {
  return (
    <div className="px-3 pt-4 small:px-6">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-full bg-gradient-ak py-3 shadow-[0_20px_40px_-24px_rgba(11,30,216,0.8)]">
        <div className="flex w-max animate-marquee">
          <Row />
          <Row ariaHidden />
        </div>
      </div>
    </div>
  )
}

export default BrandMarquee
