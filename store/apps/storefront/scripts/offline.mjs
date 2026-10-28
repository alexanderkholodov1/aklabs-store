import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { createHash } from "node:crypto"
const out = path.resolve("out")
async function walk(dir) {
  const files = []
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name)
    if (item.isDirectory()) files.push(...(await walk(file)))
    else files.push(file)
  }
  return files
}
const files = (await walk(out)).filter(
  (file) =>
    path.basename(file) !== "sw.js" &&
    (/\.(html|js|css)$/.test(file) || /-400\.(avif|webp)$/.test(file))
)
const entries = []
const hash = createHash("sha256")
for (const file of files.sort()) {
  const relative = "/" + path.relative(out, file).split(path.sep).join("/")
  hash.update(relative).update(await readFile(file))
  entries.push(
    encodeURI(
      relative.endsWith("index.html")
        ? relative.slice(0, -10) || "/"
        : relative.endsWith(".html")
          ? relative.slice(0, -5)
          : relative
    )
  )
}
hash.update(await readFile(new URL(import.meta.url)))
const version = hash.digest("hex").slice(0, 16)
// Cache after the page renders. Requests are local-origin only and never include user data.
const worker = `const CACHE="aklabs-${version}";const URLS=${JSON.stringify(entries)};
self.addEventListener("install",event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);for(let i=0;i<URLS.length;i+=6)await cache.addAll(URLS.slice(i,i+6));await self.skipWaiting()})())});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith("aklabs-")&&key!==CACHE)await caches.delete(key);await self.clients.claim()})())});
self.addEventListener("fetch",event=>{const url=new URL(event.request.url);if(url.origin!==self.location.origin||event.request.method!=="GET")return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const navigation=event.request.mode==="navigate";const key=navigation?url.pathname.replace(/\\/$/,"")||"/":event.request;const cached=await cache.match(key);if(cached)return cached;try{const response=await fetch(event.request);if(response.ok&&(/\\.(avif|webp|js|css)$/.test(url.pathname)))await cache.put(event.request,response.clone());return response}catch{if(/-800\\.(avif|webp)$/.test(url.pathname)){const small=await cache.match(url.pathname.replace("-800.","-400."));if(small)return small}return new Response("Offline / Sin conexión",{status:503,headers:{"content-type":"text/plain; charset=utf-8"}})}})())});
`
await writeFile(path.join(out, "sw.js"), worker)
console.log(
  `Offline package: ${entries.length} local assets; version ${version}`
)
