import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Inicia sesión en tu cuenta AKLabs.",
}

export default function Login() {
  return <LoginTemplate />
}
