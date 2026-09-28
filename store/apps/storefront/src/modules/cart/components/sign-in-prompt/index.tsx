import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-white/70 p-4 ring-1 ring-ak-ink/5 xsmall:flex-row xsmall:items-center xsmall:justify-between">
      <div>
        <h2 className="text-base font-semibold text-ak-ink">
          ¿Ya tienes una cuenta?
        </h2>
        <p className="mt-0.5 text-sm text-ak-ink/60">
          Inicia sesión para guardar tus direcciones y ver tus pedidos.
        </p>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" data-testid="sign-in-button">
            Iniciar sesión
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
