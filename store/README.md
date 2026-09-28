# AKLabs Store · monorepo

Monorepo pnpm + Turborepo con dos aplicaciones:

- `apps/backend`: Medusa v2 conectado a Supabase Postgres (Session pooler, puerto 5432).
- `apps/storefront`: Next.js 15 con el diseño AKLabs (liquid glass, gradientes rojo, azul y celeste).

Las instrucciones completas de arranque, arquitectura y verificación están en el
[README principal](../README.md).

## Resumen rápido

```bash
pnpm install
cp apps/backend/.env.example apps/backend/.env            # DATABASE_URL = Session pooler :5432
cp apps/storefront/.env.example apps/storefront/.env.local # publishable key del admin

cd apps/backend
pnpm medusa db:migrate
pnpm seed                                                 # región EC (USD) + catálogo AKLabs
pnpm medusa user -e admin@aklabs.test -p <contraseña>
cd ../..

pnpm dev                                                  # backend :9000 + storefront :8000
```
