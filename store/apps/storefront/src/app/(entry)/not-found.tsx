import Link from "next/link"
export default function NotFound() {
  return (
    <main className="entry">
      <p className="eyebrow">AKLABS / 404</p>
      <h1>This experiment took a wrong turn.</h1>
      <p>That page is not in the lab. / Esa página no está en el lab.</p>
      <Link prefetch={false} className="button" href="/en/store">
        Explore the collection
      </Link>{" "}
      <Link
        prefetch={false}
        className="button secondary"
        href="/es/store"
        lang="es"
      >
        Explorar la colección
      </Link>
    </main>
  )
}
