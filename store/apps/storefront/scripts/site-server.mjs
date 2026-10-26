import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import path from "node:path"
import { gzipSync } from "node:zlib"
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
}
export async function startServer(out) {
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://local").pathname
      )
      const safe = path.resolve(out, `.${pathname}`)
      if (!safe.startsWith(out + path.sep) && safe !== out) {
        res.writeHead(403).end()
        return
      }
      const candidates =
        pathname === "/"
          ? [path.join(out, "index.html")]
          : [safe, `${safe}.html`, path.join(safe, "index.html")]
      let file
      for (const candidate of candidates) {
        try {
          if ((await stat(candidate)).isFile()) {
            file = candidate
            break
          }
        } catch {
          /* Try next clean URL. */
        }
      }
      if (!file) {
        res.writeHead(404).end("Not found")
        return
      }
      res.setHeader(
        "content-type",
        types[path.extname(file)] || "application/octet-stream"
      )
      const body = await readFile(file)
      if (
        /\.(js|css|html|txt|json)$/.test(file) &&
        req.headers["accept-encoding"]?.includes("gzip")
      ) {
        res.setHeader("content-encoding", "gzip")
        res.end(gzipSync(body))
      } else res.end(body)
    } catch {
      res.writeHead(500).end("Server error")
    }
  })
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
  return { server, base: `http://127.0.0.1:${server.address().port}` }
}
