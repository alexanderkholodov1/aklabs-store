"use client"
import { useEffect } from "react"
import Link from "next/link"
export default function Entry() {
  useEffect(() => {
    location.replace(
      navigator.language.toLowerCase().startsWith("es") ? "/es" : "/en"
    )
  }, [])
  return (
    <main className="entry">
      <span className="eyebrow">AKLABS / STORE</span>
      <h1>
        Everyday experiments.
        <br />
        Experimentos cotidianos.
      </h1>
      <p>
        <Link prefetch={false} className="button" href="/en">
          Explore in English
        </Link>{" "}
        <Link
          prefetch={false}
          className="button secondary"
          href="/es"
          lang="es"
        >
          Explorar en español
        </Link>
      </p>
    </main>
  )
}
