import {
  defineMiddlewares,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

const TTL_MS = 5 * 60 * 1000

type Entry = { expires: number; body: unknown }

function cacheBucket() {
  const g = globalThis as typeof globalThis & {
    __aklabsStoreCache?: Map<string, Entry>
  }
  g.__aklabsStoreCache ??= new Map()
  return g.__aklabsStoreCache
}

/**
 * Medusa runs many SQL round trips against a remote Supabase pooler.
 * Catalog GETs are safe to reuse for a few minutes; cart and checkout are not.
 */
function catalogCache(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  if (req.method !== "GET") {
    return next()
  }

  const key = req.originalUrl
  const hit = cacheBucket().get(key)

  if (hit && hit.expires > Date.now()) {
    res.setHeader("x-catalog-cache", "hit")
    return res.json(hit.body)
  }

  const originalJson = res.json.bind(res)
  res.json = ((body: unknown) => {
    if (res.statusCode < 400) {
      cacheBucket().set(key, { expires: Date.now() + TTL_MS, body })
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
