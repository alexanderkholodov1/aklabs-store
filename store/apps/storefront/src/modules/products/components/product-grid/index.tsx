import { clx } from "@modules/common/components/ui"

/**
 * The one product grid of the store: 2 columns on phones, 3 on tablets and
 * 4 from laptop widths up. Listings, the home row, related products and the
 * skeletons share it, so they always line up.
 */
const ProductGrid = ({
  children,
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  className?: string
  "data-testid"?: string
}) => (
  <ul
    className={clx(
      "grid w-full grid-cols-2 gap-[clamp(0.625rem,0.3rem+1.2vw,1.5rem)] md:grid-cols-3 medium:grid-cols-4",
      className
    )}
    data-testid={dataTestId}
  >
    {children}
  </ul>
)

export default ProductGrid
