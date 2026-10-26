import assert from "node:assert/strict"
import { createServer } from "node:http"
import { readFile, readdir, stat, mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import { gzipSync } from "node:zlib"
import { chromium } from "playwright"
import AxeBuilder from "@axe-core/playwright"

const app = process.cwd()
const root = path.resolve(app, "../../..")
const temp = path.join(root, ".tmp")
await mkdir(path.join(temp, "t"), { recursive: true })
process.env.TMPDIR = path.join(temp, "t")
const out = path.join(app, "out")
const catalog = JSON.parse(
  await readFile(path.join(app, "src/data/catalog.json"), "utf8")
)
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
export async function startServer() {
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
async function walk(dir) {
  const all = []
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const name = path.join(dir, item.name)
    if (item.isDirectory()) all.push(...(await walk(name)))
    else all.push(name)
  }
  return all
}
const { server, base } = await startServer()
let browser
const report = {
  routes: 0,
  pages: [],
  flow: [],
  reflow: [],
  budgets: { javascript: 150 * 1024, firstView: 300 * 1024 },
}
try {
  const allFiles = await walk(out)
  const routes = allFiles
    .filter((f) => f.endsWith(".html") && !f.endsWith("404.html"))
    .map(
      (f) =>
        "/" +
        path
          .relative(out, f)
          .replace(/index\.html$/, " ")
          .trim()
          .replace(/\.html$/, "")
    )
  for (const route of routes)
    assert.equal((await fetch(base + route)).status, 200, route)
  report.routes = routes.length
  const executable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  let installed
  try {
    const dirs = await readdir(path.join(os.homedir(), ".cache/ms-playwright"))
    const found = dirs
      .filter((d) => d.startsWith("chromium-"))
      .sort()
      .reverse()[0]
    if (found)
      installed = path.join(
        os.homedir(),
        ".cache/ms-playwright",
        found,
        "chrome-linux64/chrome"
      )
  } catch {
    /* CI installs a matching browser below. */
  }
  // CI images may not include Playwright's browser cache. Install only when absent.
  if (!executable && !installed) {
    const { execFileSync } = await import("node:child_process")
    execFileSync(
      process.execPath,
      [
        path.join(app, "node_modules/playwright/cli.js"),
        "install",
        "--with-deps",
        "chromium",
      ],
      { stdio: "inherit", env: process.env }
    )
  }
  browser = await chromium.launch({
    executablePath: executable || installed,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  })
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  async function audit(route, label) {
    const assets = new Map()
    const responseHandler = (response) => {
      const url = new URL(response.url())
      if (url.origin === base) assets.set(url.pathname, response)
    }
    page.on("response", responseHandler)
    await page.goto(base + route, { waitUntil: "networkidle" })
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all(
        Array.from(document.images)
          .filter(
            (i) =>
              i.loading !== "lazy" ||
              i.getBoundingClientRect().top < innerHeight
          )
          .map((i) => i.decode().catch(() => {}))
      )
    })
    page.off("response", responseHandler)
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze()
    const violations = result.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact)
    )
    assert.deepEqual(
      violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
      `axe ${route}`
    )
    assert.equal(await page.locator("h1").count(), 1, `h1 ${route}`)
    assert.equal(
      await page.locator("html").getAttribute("lang"),
      route.startsWith("/es") ? "es" : "en"
    )
    let js = 0,
      total = 0
    for (const [url, response] of assets) {
      const body = await response.body()
      const bytes =
        /\.(js|css|html|txt|json)$/.test(url) || !path.extname(url)
          ? gzipSync(body).length
          : body.length
      total += bytes
      if (url.endsWith(".js")) js += bytes
    }
    assert.ok(js <= report.budgets.javascript, `JS ${route}: ${js}`)
    assert.ok(
      total <= report.budgets.firstView,
      `first view ${route}: ${total}`
    )
    const item = {
      route,
      label,
      javascript: js,
      firstView: total,
      serious: 0,
      critical: 0,
    }
    report.pages.push(item)
    console.log(JSON.stringify(item))
  }
  const commerce = routes.includes("/en/checkout")
  for (const locale of ["en", "es"]) {
    const basePages = [
      [`/${locale}`, "home"],
      [`/${locale}/store`, "collection"],
      [`/${locale}/categories/${catalog.categories[0].handle}`, "category"],
      [`/${locale}/products/aklabs-essential-hoodie`, "product"],
    ]
    for (const [route, label] of basePages) await audit(route, label)
    if (commerce) {
      await page
        .getByRole("button", {
          name: locale === "en" ? "Add to bag" : "Añadir a la bolsa",
          exact: true,
        })
        .click()
      await page
        .getByRole("link", {
          name: locale === "en" ? "View bag" : "Ver bolsa",
          exact: true,
        })
        .click()
      await audit(`/${locale}/cart`, "cart")
      await audit(`/${locale}/checkout`, "checkout")
      await page
        .getByRole("button", {
          name:
            locale === "en" ? "Fill demo address" : "Usar dirección de ejemplo",
        })
        .click()
      await page
        .getByRole("button", {
          name:
            locale === "en" ? "Continue to delivery" : "Continuar a la entrega",
        })
        .click()
      await page
        .getByRole("button", {
          name: locale === "en" ? "Review order" : "Revisar pedido",
          exact: true,
        })
        .click()
      await page
        .getByRole("button", {
          name:
            locale === "en"
              ? "Place simulated order"
              : "Confirmar pedido simulado",
          exact: true,
        })
        .click()
      await page.waitForURL(/\/order\?id=/)
      await page
        .getByRole("heading", {
          name:
            locale === "en"
              ? "Your experiment is on its way."
              : "Tu experimento está en camino.",
        })
        .waitFor()
      await audit(
        new URL(page.url()).pathname + new URL(page.url()).search,
        "order"
      )
      await page
        .getByRole("link", {
          name: locale === "en" ? "Track your delivery" : "Seguir tu entrega",
          exact: true,
        })
        .click()
      await page.waitForURL(/\/tracking\?id=/)
      await audit(
        new URL(page.url()).pathname + new URL(page.url()).search,
        "tracking"
      )
      report.flow.push(
        `${locale}: browse → bag → demo address → delivery → review → order → tracking`
      )
      assert.equal(await page.locator("input[autocomplete^='cc-']").count(), 0)
    }
    if (routes.includes(`/${locale}/about`))
      await audit(`/${locale}/about`, "about")
    for (const extra of ["how-it-works", "what-is-real"])
      if (routes.includes(`/${locale}/${extra}`))
        await audit(`/${locale}/${extra}`, extra)
  }
  // Every internal anchor in every exported page must resolve, including links only in the footer.
  const internal = new Set()
  for (const file of allFiles.filter((f) => f.endsWith(".html"))) {
    const html = await readFile(file, "utf8")
    for (const match of html.matchAll(/href="(\/[^"#?]*)/g))
      internal.add(match[1].replaceAll("&amp;", "&"))
  }
  for (const href of internal)
    assert.equal(
      (await fetch(base + href)).status,
      200,
      `internal link ${href}`
    )
  for (const width of [320, 360, 768, 1280, 2560]) {
    await page.setViewportSize({ width, height: 900 })
    for (const { route } of report.pages) {
      await page.goto(base + route, { waitUntil: "networkidle" })
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        ),
        `overflow ${width}: ${route}`
      )
    }
    report.reflow.push({ width, pass: true })
  }
  assert.deepEqual(errors, [], "browser errors")
  await context.close()
  console.log(
    `PASS: ${report.routes} routes; ${report.pages.length} audits; ${report.flow.length} purchase flows`
  )
} finally {
  await writeFile(
    path.join(temp, "site-report.json"),
    JSON.stringify(report, null, 2) + "\n"
  )
  await browser?.close()
  await new Promise((resolve) => server.close(resolve))
}
