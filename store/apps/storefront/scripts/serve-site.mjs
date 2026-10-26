import path from "node:path"
import { startServer } from "./site-server.mjs"
const { server, base } = await startServer(path.resolve("out"), 8000)
console.log(`AKLabs static preview: ${base}`)
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close(() => process.exit(0)))
