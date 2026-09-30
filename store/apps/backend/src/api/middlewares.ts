import {
  defineMiddlewares,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

const TTL_MS = 5 * 60 * 1000
const MAX_ENTRIES = 200

type Entry = { expires: number; body: unknown }

function cacheBucket() {
  const g = globalThis as typeof globalThis & {
    __aklabsStoreCache?: Map<string, Entry>
  }
  g.__aklabsStoreCache ??= new Map()
  return g.__aklabsStoreCache
}

/** Requests tied to a signed-in customer may carry personal prices: never cached. */
function isPersonalized(req: MedusaRequest) {
  return (
    Boolean(req.headers.authorization) ||
    /(^|;\s*)connect\.sid=/.test(req.headers.cookie ?? "")
  )
}

/**
 * Medusa runs many SQL round trips against a remote Supabase pooler.
 * Catalog GETs are safe to reuse for a few minutes; cart and checkout are not.
 *
 * The key includes the publishable key, so a request never receives data
 * cached for another sales channel or skips Medusa's key check. The cache is
 * bounded (oldest entry evicted first) so arbitrary query strings cannot
 * exhaust memory.
 */
function catalogCache(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  if (req.method !== "GET" || isPersonalized(req)) {
    return next()
  }

  const cache = cacheBucket()
  const key = `${req.headers["x-publishable-api-key"] ?? ""}|${req.originalUrl}`
  const hit = cache.get(key)

  if (hit) {
    if (hit.expires > Date.now()) {
      // Re-insert to mark it as recently used.
      cache.delete(key)
      cache.set(key, hit)
      res.setHeader("x-catalog-cache", "hit")
      return res.json(hit.body)
    }
    cache.delete(key)
  }

  const originalJson = res.json.bind(res)
  res.json = ((body: unknown) => {
    if (res.statusCode === 200) {
      if (cache.size >= MAX_ENTRIES) {
        const oldest = cache.keys().next().value
        if (oldest !== undefined) {
          cache.delete(oldest)
        }
      }
      cache.set(key, { expires: Date.now() + TTL_MS, body })
    }
    return originalJson(body)
  }) as MedusaResponse["json"]

  return next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/products*",
      methods: ["GET"],
      middlewares: [catalogCache],
    },
    {
      matcher: "/store/product-categories*",
      methods: ["GET"],
      middlewares: [catalogCache],
    },
    {
      matcher: "/store/regions*",
      methods: ["GET"],
      middlewares: [catalogCache],
    },
    {
      matcher: "/store/collections*",
      methods: ["GET"],
      middlewares: [catalogCache],
    },
  ],
})
