# AKLabs Store · Medusa v2 + Next.js + Supabase

Tienda en línea del merch **AKLabs** (hoodies, camisetas, joggers, gorras, termos y
botellas) construida con **Medusa v2** como backend de comercio, un **storefront
Next.js** y **PostgreSQL de Supabase** como base de datos.

- Región **Ecuador** en **USD** (`/ec`) con envío estándar y express.
- Región **Europe** en **EUR** (`/dk`, `/de`, `/es`...) con el mismo catálogo.
- Flujo de compra completo: producto → carrito → checkout en 4 pasos → orden
  registrada en la tabla `order` de Supabase.

> Presentación y guion de la demo: [`PRESENTACION.md`](./PRESENTACION.md)

---

## Arquitectura

```
Navegador ──HTTP──▶ Storefront Next.js (localhost:8000)
                     │  Server Components + Server Actions
                     │  @medusajs/js-sdk + publishable API key
                     ▼
                  Medusa v2 (localhost:9000)  ← Admin en /app
                     │  Store API / Admin API, workflows, módulos
                     │  knex + MikroORM (pool de conexiones)
                     ▼
        Supabase Postgres (Session pooler, puerto 5432)
```

- El navegador **nunca** habla con Supabase: no hay `supabase-js`, ni Supabase
  Auth, ni RLS. Supabase se usa solo como Postgres administrado.
- Toda la lógica (precios por región, impuestos, envíos, pagos, órdenes) vive en
  Medusa. El storefront solo consume la Store API.

## Estructura

```
.
├── README.md                 ← este archivo
├── PRESENTACION.md           ← contenido para la presentación y la demo
└── store/                    ← monorepo pnpm + Turborepo
    ├── apps/backend/         ← Medusa v2 (@dtc/backend)
    │   ├── medusa-config.ts
    │   ├── .env.example
    │   └── src/
    │       ├── migration-scripts/initial-data-seed.ts   (datos base del starter)
    │       └── scripts/
    │           ├── add-ec-region.ts         región Ecuador USD + impuestos + envío
    │           ├── seed-aklabs-products.ts  catálogo AKLabs (USD y EUR)
    │           ├── sync-aklabs-catalog.ts   textos, precios, limpieza del demo, envíos en español
    │           └── setup-aklabs.ts          ejecuta los tres anteriores en orden
    └── apps/storefront/      ← Next.js 15 (@dtc/storefront)
        ├── .env.example
        ├── public/aklabs/    logos e imágenes de productos
        └── src/              app router, módulos y sistema de diseño AKLabs
```

## Requisitos

- Node.js **20.19+** o **22.12+**
- **pnpm 10+** (el proyecto declara `pnpm@11.5.2`; con Corepack: `corepack enable`)
- Un proyecto de **Supabase** (plan gratuito sirve)

## Arranque local (paso a paso)

### 1. Instalar dependencias

```bash
git clone https://github.com/alexanderkholodov1/supaday-ecommerce.git
cd supaday-ecommerce/store
pnpm install
```

### 2. Base de datos en Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **Connect**, copia la cadena del **Session pooler** (puerto **5432**). Es
   compatible con IPv4 y mantiene sesiones largas, que es lo que necesita Medusa
   (migraciones y transacciones).

### 3. Variables del backend

```bash
cp apps/backend/.env.example apps/backend/.env
```

Edita `apps/backend/.env`:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | Cadena del Session pooler: `postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres` |
| `JWT_SECRET`, `COOKIE_SECRET` | Cadenas aleatorias largas |
| `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` | Déjalas como en el ejemplo para trabajo local |

`REDIS_URL` **no existe** en el archivo: se eliminó a propósito, no se dejó vacía.
Sin Redis, Medusa usa event bus, caché y locking en memoria, suficiente para
desarrollo.

### 4. Migraciones y datos

```bash
cd apps/backend
pnpm medusa db:migrate          # crea las tablas (product, region, cart, order, payment...)
pnpm seed                       # = medusa exec ./src/scripts/setup-aklabs.ts
pnpm medusa user -e admin@aklabs.test -p <tu-contraseña>
```

- `db:migrate` crea las tablas y ejecuta el script de datos iniciales del
  starter: región Europe (EUR), canal de venta, almacén y publishable API key.
- `pnpm seed` agrega la región Ecuador (USD), las opciones de envío, el catálogo
  AKLabs con precios en USD y EUR, y elimina (borrado lógico) los productos demo
  del starter. Es idempotente: se puede ejecutar varias veces.

### 5. Levantar el backend

```bash
pnpm dev                        # desde apps/backend → http://localhost:9000
```

Admin: <http://localhost:9000/app>. Entra con el usuario creado en el paso 4 y
copia la clave en **Settings → Publishable API Keys**.

### 6. Variables del storefront y arranque

```bash
cd ../storefront
cp .env.example .env.local      # pega la publishable key en NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
pnpm dev                        # → http://localhost:8000 (redirige a /ec)
```

También se pueden levantar ambos desde `store/` con `pnpm dev`.

## Scripts útiles

| Comando (en `store/apps/backend`) | Qué hace |
|---|---|
| `pnpm dev` | Backend Medusa en modo desarrollo |
| `pnpm medusa db:migrate` | Ejecuta migraciones pendientes |
| `pnpm seed` | Setup completo AKLabs (región EC, catálogo, limpieza) |
| `pnpm medusa exec ./src/scripts/sync-aklabs-catalog.ts` | Re-sincroniza textos, precios USD/EUR y envíos |
| `pnpm medusa user -e <email> -p <pass>` | Crea un usuario administrador |

## Regiones, moneda y envíos

| Región | Países | Moneda | Envíos |
|---|---|---|---|
| Ecuador | `ec` | USD | Envío estándar Ecuador ($10), Envío express Ecuador ($15) |
| Europe | `de, dk, es, fr, gb, it, se` | EUR | Standard Shipping (10 €), Express Shipping (10 €) |

El país va en la URL (`/ec`, `/dk`). El middleware del storefront la resuelve con
la lista de regiones de Medusa, y el carrito se crea en esa región. Por eso el
mismo producto cuesta **$58,00** en `/ec` y **54,00 €** en `/dk`.

## Comprobar una compra en Supabase

Después de comprar, la página de confirmación muestra el número de pedido
(`#display_id`) y el ID de la fila (`order_...`). En el SQL Editor de Supabase:

```sql
select o.id, o.display_id, o.email, o.currency_code, r.name as region, o.created_at
from "order" o
join region r on r.id = o.region_id
order by o.created_at desc
limit 5;
```

## Solución de problemas

- **Cada paso del checkout tarda varios segundos.** Es normal con una base remota:
  cada consulta viaja al pooler de Supabase (unos 150 ms) y los workflows de Medusa
  hacen muchas consultas por paso.
- **`Missing required environment variables: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`**:
  falta la clave en `apps/storefront/.env.local`.
- **Error de publishable key al cargar productos**: la clave debe pertenecer al
  canal de venta "Default Sales Channel".
- **Puerto ocupado**: libera el 9000 (backend) o el 8000 (storefront).

## Despliegue (opcional)

- Backend: cualquier servicio Node con proceso persistente (Railway, Render,
  Medusa Cloud) usando el mismo `DATABASE_URL` del Session pooler, `medusa build`
  y `medusa start`. Agrega el dominio del storefront a `STORE_CORS` y `AUTH_CORS`.
- Storefront: Vercel u otro host de Next.js, con `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
  apuntando al backend público.
- Imágenes: el catálogo usa URLs absolutas `STOREFRONT_PUBLIC_URL/aklabs/...`.
  Ejecuta el seed con esa variable apuntando al dominio público.
