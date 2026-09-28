import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="font-display text-5xl tracking-wide text-ak-ink mb-3">Bienvenido</h1>
      <p className="text-center text-base-regular text-ak-ink/65 mb-8">
        Inicia sesión para ver tus pedidos y guardar tus direcciones.
      </p>
      {message?.state === "verification_required" && (
        <div
          className="w-full mb-6 text-center text-base-regular text-ui-fg-base bg-ui-bg-subtle border border-ui-border-base rounded-rounded p-4"
          data-testid="login-verification-message"
        >
          Enviamos un enlace de verificación a <strong>{message.email}</strong>.
          Verifica tu correo y luego inicia sesión.
        </div>
      )}
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            title="Ingresa un correo válido."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="login-error-message"
        />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          Iniciar sesión
        </SubmitButton>
      </form>
      <span className="text-center text-ak-ink/70 text-small-regular mt-6">
        ¿Aún no tienes cuenta?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="font-semibold text-ak-royal underline underline-offset-4"
          data-testid="register-button"
        >
          Regístrate
        </button>
        .
      </span>
    </div>
  )
}

export default Login
