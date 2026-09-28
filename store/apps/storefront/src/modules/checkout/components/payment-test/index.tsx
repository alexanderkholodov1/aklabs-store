import { Badge } from "@modules/common/components/ui"

const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">Modo prueba:</span> no se cobra dinero
      real.
    </Badge>
  )
}

export default PaymentTest
