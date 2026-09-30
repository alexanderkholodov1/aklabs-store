type Entry<T> = { expires: number; value: T }

const DEFAULT_TTL_MS = 10 * 60 * 1000

type CacheGlobal = typeof globalThis & {
  __aklabsCache?: Map<string, Entry<unknown>>
  __aklabsInflight?: Map<string, Promise<unknown>>
}

function buckets() {
  const g = globalThis as CacheGlobal
  g.__aklabsCache ??= new Map()
  g.__aklabsInflight ??= new Map()
  return {
    cache: g.__aklabsCache,
    inflight: g.__aklabsInflight,
  }
}

/**
 * Process-wide cache for read-only Store API responses.
 * The database is a remote Supabase pooler, so an uncached product query
 * costs a couple of seconds. Navigation during a demo should reuse the
 * result. Cart, customer and order calls must not go through this.
 */
export async function remember<T>(
  key: string,
  load: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> {
  const { cache, inflight } = buckets()
  const hit = cache.get(key) as Entry<T> | undefined

  if (hit && hit.expires > Date.now()) {
    return hit.value
  }

  const pending = inflight.get(key) as Promise<T> | undefined
  if (pending) {
    return pending
  }

  const promise = load()
    .then((value) => {
      cache.set(key, { expires: Date.now() + ttlMs, value })
      return value
    })
    .finally(() => {
      inflight.delete(key)
    })

  inflight.set(key, promise)
  return promise
}
