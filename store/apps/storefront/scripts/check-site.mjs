import { startServer } from "./site-server.mjs"
import assert from "node:assert/strict"
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises"
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
async function walk(dir) {
  const all = []
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const name = path.join(dir, item.name)
    if (item.isDirectory()) all.push(...(await walk(name)))
    else all.push(name)
  }
  return all
}
const { server, base } = await startServer(out)
let browser
const report = {
  routes: 0,
  pages: [],
  states: [],
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
    env: {
      ...process.env,
      XDG_CONFIG_HOME: path.join(temp, "browser-config"),
      XDG_CACHE_HOME: path.join(temp, "browser-cache"),
    },
  })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  })
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (error) => {
    const detail = { route: page.url(), message: error.message }
    errors.push(detail)
    console.error("BROWSER_ERROR", JSON.stringify(detail))
  })
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
    if (process.env.CAPTURE_SITE === "1") {
      await mkdir(path.join(temp, "screenshots"), { recursive: true })
      await page.screenshot({
        path: path.join(
          temp,
          "screenshots",
          `${label}-${route.startsWith("/es") ? "es" : "en"}-${page.viewportSize().width}.png`
        ),
        fullPage: true,
      })
    }
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
  assert.ok(commerce, "Commerce routes must be exported")
  for (const locale of ["en", "es"])
    for (const segment of [
      "cart",
      "checkout",
      "order",
      "tracking",
      "about",
      "how-it-works",
      "what-is-real",
    ])
      assert.ok(
        routes.includes(`/${locale}/${segment}`),
        `Missing ${locale}/${segment}`
      )
  async function auditState(label) {
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze()
    assert.deepEqual(
      result.violations
        .filter((v) => ["serious", "critical"].includes(v.impact))
        .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      [],
      `axe state ${label}`
    )
    report.states.push({ label, serious: 0, critical: 0 })
  }
  for (const locale of ["en", "es"]) {
    const basePages = [
      [`/${locale}`, "home"],
      [`/${locale}/store`, "collection"],
      [`/${locale}/categories/${catalog.categories[0].handle}`, "category"],
      [`/${locale}/products/aklabs-essential-hoodie`, "product"],
    ]
    for (const [route, label] of basePages) await audit(route, label)
    if (commerce) {
      await page.goto(base + `/${locale}`, { waitUntil: "networkidle" })
      await page.locator(".hero-actions .button").click()
      await page
        .locator(`.category-chips a[href$="/${catalog.categories[0].handle}"]`)
        .click()
      await page
        .locator('.product-link[href$="/aklabs-essential-hoodie"]')
        .click()
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
      await page
        .getByRole("button", {
          name: new RegExp(`^${locale === "en" ? "Remove:" : "Quitar:"}`),
        })
        .click()
      await page
        .getByRole("button", {
          name: locale === "en" ? "Undo removal" : "Deshacer eliminación",
        })
        .click()
      assert.equal(await page.locator(".cart-line").count(), 1)
      await page.reload({ waitUntil: "networkidle" })
      assert.equal(await page.locator(".cart-line").count(), 1)
      await page.locator("#promotion").fill("INVALID")
      await page
        .getByRole("button", {
          name: locale === "en" ? "Apply code" : "Aplicar código",
          exact: true,
        })
        .click()
      await page
        .locator("#promo-error")
        .filter({
          hasText: locale === "en" ? "Try AKLABS10" : "Prueba AKLABS10",
        })
        .waitFor()
      await page.locator("#promotion").fill("aklabs10")
      await page
        .getByRole("button", {
          name: locale === "en" ? "Apply code" : "Aplicar código",
          exact: true,
        })
        .click()
      await page.locator(".promo-success").waitFor()
      await audit(`/${locale}/checkout`, "checkout")
      await page
        .getByRole("button", {
          name:
            locale === "en" ? "Continue to delivery" : "Continuar a la entrega",
        })
        .click()
      assert.equal(
        await page.locator("#address-name").getAttribute("aria-invalid"),
        "true"
      )
      assert.equal(
        await page
          .locator("#address-name")
          .evaluate((el) => el === document.activeElement),
        true
      )
      await auditState(`${locale}: address validation`)
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
      await auditState(`${locale}: delivery`)
      await page
        .getByRole("button", {
          name: locale === "en" ? "Review order" : "Revisar pedido",
          exact: true,
        })
        .click()
      await auditState(`${locale}: review`)
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
  await page.goto(base + "/en", { waitUntil: "networkidle" })
  await page.getByRole("button", { name: "Explore", exact: true }).click()
  await page.locator("#mobile-menu a").first().focus()
  await page.keyboard.press("Escape")
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "false"
  )
  assert.equal(
    await page
      .locator(".menu-toggle")
      .evaluate((el) => el === document.activeElement),
    true
  )
  await page
    .getByRole("combobox", { name: "Currency", exact: true })
    .selectOption("EUR")
  await page.reload({ waitUntil: "networkidle" })
  assert.equal(
    await page
      .getByRole("combobox", { name: "Currency", exact: true })
      .inputValue(),
    "EUR"
  )
  await page.locator("a.language-link").click()
  await page.waitForURL(/\/es$/)
  await page.locator('[data-preferences-ready="true"]').waitFor()
  assert.equal(
    await page
      .getByRole("combobox", { name: "Moneda", exact: true })
      .inputValue(),
    "EUR"
  )
  // A fresh browser context caches the complete package from its first page, then purchases offline.
  const offlineContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  })
  const offline = await offlineContext.newPage()
  await offline.clock.install({ time: new Date("2026-10-26T12:00:00Z") })
  await offline.goto(base + "/en", { waitUntil: "networkidle" })
  await offline
    .locator('[data-offline-ready="true"]')
    .waitFor({ timeout: 60000 })
  await offlineContext.setOffline(true)
  await offline.locator(".hero-actions .button").click()
  await offline
    .locator('.product-link[href$="/aklabs-essential-hoodie"]')
    .click()
  await offline.getByRole("button", { name: "Add to bag", exact: true }).click()
  await offline.getByRole("link", { name: "View bag", exact: true }).click()
  await offline.getByRole("link", { name: /Try checkout/ }).click()
  await offline.getByRole("button", { name: "Fill demo address" }).click()
  await offline.getByRole("button", { name: "Continue to delivery" }).click()
  await offline
    .getByRole("button", { name: "Review order", exact: true })
    .click()
  await offline
    .getByRole("button", { name: "Place simulated order", exact: true })
    .click()
  await offline.waitForURL(/\/order\?id=/)
  await offline
    .getByRole("link", { name: "Track your delivery", exact: true })
    .click()
  await offline.waitForURL(/\/tracking\?id=/)
  await offline.clock.fastForward(125000)
  await offline
    .getByRole("heading", {
      name: "Delivered. Enjoy the experiment.",
      exact: true,
    })
    .waitFor()
  assert.equal(
    await offline.locator('li[aria-current="step"] h2').textContent(),
    "Delivered. Enjoy the experiment."
  )
  assert.equal(
    await offline.evaluate(
      () => JSON.parse(localStorage.getItem("aklabs.orders.v1")).length
    ),
    1
  )
  report.flow.push(
    "en: first load → offline browse → checkout → order → delivered (clock advanced)"
  )
  await offlineContext.close()
  for (const locale of ["en", "es"]) {
    await page.goto(base + `/${locale}/about`, { waitUntil: "networkidle" })
    await page.evaluate(() => {
      localStorage.setItem("aklabs.theme", "dark")
      document.documentElement.dataset.theme = "dark"
    })
    await auditState(`${locale}: dark About`)
    await page.goto(base + `/${locale}`, { waitUntil: "networkidle" })
    await auditState(`${locale}: dark home`)
    await page.evaluate(() => {
      localStorage.setItem("aklabs.theme", "light")
      document.documentElement.dataset.theme = "light"
    })
  }
  // Purchases clear the cart. Restore a real catalog line so desktop and reflow
  // checks exercise populated commerce forms, including the maximum quantity.
  await page.evaluate(
    (variantId) =>
      localStorage.setItem(
        "aklabs.cart.v1",
        JSON.stringify({
          version: 1,
          lines: [{ variantId, quantity: 10 }],
          promotion: "AKLABS10",
        })
      ),
    catalog.products[0].variants[0].id
  )
  const mobilePages = [...report.pages]
  await page.setViewportSize({ width: 1280, height: 900 })
  for (const item of mobilePages)
    await audit(item.route, `${item.label}-desktop`)
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
    for (const { route } of mobilePages) {
      await page.goto(base + route, { waitUntil: "networkidle" })
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        ),
        `overflow ${width}: ${route}`
      )
    }
    if (process.env.CAPTURE_SITE === "1" && [320, 1280, 2560].includes(width)) {
      await page.goto(base + "/en", { waitUntil: "networkidle" })
      await page.screenshot({
        path: path.join(temp, "screenshots", `home-en-${width}.png`),
        fullPage: true,
      })
    }
    report.reflow.push({ width, pass: true })
  }
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    for (const { route } of mobilePages) {
      await page.goto(base + route, { waitUntil: "networkidle" })
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%"
      })
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        ),
        `200% text overflow ${width}: ${route}`
      )
    }
    report.reflow.push({ width, textSize: "200%", pass: true })
  }
  // Corrupt browser data must recover to safe empty states, without affecting the main test order history.
  const recoveryContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  })
  const recovery = await recoveryContext.newPage()
  await recovery.goto(base + "/en", { waitUntil: "networkidle" })
  await recovery.evaluate(() => {
    localStorage.setItem(
      "aklabs.cart.v1",
      '{"version":1,"lines":[{"variantId":"unknown","quantity":1000000}],"promotion":"INVALID"}'
    )
    localStorage.setItem("aklabs.orders.v1", "{broken")
  })
  await recovery.goto(base + "/en/cart", { waitUntil: "networkidle" })
  await recovery
    .getByRole("heading", { name: "A little room for curiosity.", exact: true })
    .waitFor()
  await recovery.goto(base + "/en/order?id=AK-INVALID0", {
    waitUntil: "networkidle",
  })
  await recovery
    .getByRole("heading", { name: "No order on this device.", exact: true })
    .waitFor()
  await recoveryContext.close()
  report.states.push({ label: "Corrupt storage recovers safely", pass: true })
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
