import "styles/globals.css"
import "styles/brand.css"
import { fontVariables } from "styles/fonts"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
