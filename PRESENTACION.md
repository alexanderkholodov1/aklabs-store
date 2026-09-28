# AKLabs Store: material para la presentación

Diapositivas listas: [`presentacion/AKLabs_Store.pptx`](./presentacion/AKLabs_Store.pptx)
(15 slides con notas del orador, en la identidad visual de la tienda; usa la fuente
Bebas Neue para los titulares).

Documento base para armar el PPT y guiar la demo en vivo. Cada sección se puede
convertir en una o dos diapositivas. Al final hay un esquema de diapositivas
sugerido, un guion de demo cronometrado y preguntas probables con respuestas.

---

## 1. Resumen en una frase

**AKLabs Store** es la tienda en línea del merch propio de AKLabs: un
e-commerce headless con **Medusa v2** (backend de comercio), un **storefront
Next.js** con diseño propio y **Supabase Postgres** como base de datos. Vende en
**Ecuador en dólares** (`/ec`) y en **Europa en euros** (`/dk`), y completa el
ciclo de compra hasta registrar la orden en la base.

## 2. Stack y versiones

| Capa | Tecnología | Versión |
|---|---|---|
| Base de datos | Supabase Postgres (región `us-west-2`) | PostgreSQL 17.6 |
| Conexión | Supavisor **Session pooler**, puerto **5432**, SSL | — |
| Backend | Medusa v2 (`@medusajs/medusa`) | 2.21.0 |
| Admin | Medusa Admin (incluido en el backend, `/app`) | 2.21.0 |
| Storefront | Next.js (App Router, Server Components, Server Actions) | 15.5 |
| UI | React 19 + Tailwind CSS 3.4 + Headless UI | — |
| Monorepo | pnpm workspaces + Turborepo | pnpm 11.5 |
| Runtime | Node.js | 20.19+ / 22.12+ |

## 3. Checklist de la rúbrica → evidencia

| Criterio | Qué mostrar | Dónde |
|---|---|---|
| **Proyecto Supabase propio y sano; Session pooler 5432** | Dashboard del proyecto `supaday-ecommerce` en estado *Healthy*; botón **Connect → Session pooler**; `DATABASE_URL` con `pooler.supabase.com:5432` (sin mostrar la contraseña) | Supabase + `apps/backend/.env.example` |
| **Medusa v2 + storefront levantan limpios; admin accesible; REDIS_URL removido** | `pnpm dev` en backend ("Server is ready on port: 9000") y storefront ("Ready"); login en `localhost:9000/app`; `.env` sin `REDIS_URL`; log: *redisUrl not found. A fake redis instance will be used* | Terminal + navegador |
| **Conexión backend ↔ Supabase y migraciones** | `pnpm medusa db:migrate` sin pendientes; Table Editor con **147 tablas** en `public` (product, region, cart, order, payment...) y la tabla `mikro_orm_migrations` | Supabase Table Editor |
| **Región Ecuador en USD** | `/ec` con precios en `$`; `/dk` con precios en `€`; opciones de envío en el checkout | Storefront + tabla `region` |
| **Catálogo propio y flujo completo** | 6 productos AKLabs con variantes, imágenes, categorías y precios; compra completa hasta la página de confirmación | Storefront |
| **Higiene y reproducibilidad** | `.gitignore`, `.env.example` (backend y storefront), `README.md` con los pasos, historial de commits, sin `supabase-js` ni Supabase Auth ni RLS | GitHub |
| **Evidencia en vivo** | Mostrar tablas → comprar → refrescar `order` → la fila nueva coincide con el `#` y el `order_...` de la confirmación | Supabase + storefront |
| **Arquitectura y decisiones** | Diagrama de la sección 4 y respuestas de la sección 13 | Diapositivas |

## 4. Arquitectura: storefront → backend → Postgres

```
┌──────────────┐   HTTP    ┌────────────────────────┐  Store API  ┌──────────────────────┐   SQL/TLS   ┌─────────────────────┐
│  Navegador   │ ────────▶ │ Next.js storefront     │ ──────────▶ │ Medusa v2 backend    │ ──────────▶ │ Supabase Postgres    │
│ (cliente)    │ ◀──────── │ :8000  SSR + Actions   │ ◀────────── │ :9000  workflows     │ ◀────────── │ Session pooler :5432 │
└──────────────┘   HTML    └────────────────────────┘    JSON     └──────────────────────┘             └─────────────────────┘
                              cookies: _medusa_cart_id              publishable API key                  knex + MikroORM
                                                                     módulos: product, pricing,          pool de conexiones
                                                                     cart, order, payment...
```

### Recorrido de una compra (qué pasa en cada capa)

1. **Navegación**: el middleware de Next.js lee el país de la URL (`/ec`). Si no
   viene, usa `NEXT_PUBLIC_DEFAULT_REGION=ec`. La lista de regiones sale de
   `GET /store/regions`.
2. **Catálogo**: un Server Component llama a `GET /store/products?region_id=...`
   con la **publishable API key**. Medusa calcula `calculated_price` según la
   moneda de la región: USD para Ecuador, EUR para Europa.
3. **Agregar al carrito**: la Server Action `addToCart` crea el carrito
   (`POST /store/carts` con `region_id`), guarda su ID en la cookie
   `_medusa_cart_id` y agrega la línea (`POST /store/carts/:id/line-items`).
   → tablas `cart`, `cart_line_item`.
4. **Dirección**: `POST /store/carts/:id` con dirección y email
   → `cart_address`.
5. **Envío**: `GET /store/shipping-options?cart_id=` lista las opciones de la
   *service zone* de Ecuador; `POST /store/carts/:id/shipping-methods`
   → `cart_shipping_method`.
6. **Pago**: se crea la colección y la sesión de pago con el proveedor
   `pp_system_default` (pago manual de prueba) → `payment_collection`,
   `payment_session`.
7. **Confirmar**: `POST /store/carts/:id/complete` ejecuta el workflow
   `completeCartWorkflow`, que autoriza el pago, reserva inventario y crea la orden.
   → `order`, `order_item`, `order_line_item`, `order_shipping`,
   `order_summary`, `payment`, `order_payment_collection`.
8. **Confirmación**: el storefront redirige a `/ec/order/:id/confirmed` y muestra
   `#display_id` y el `id` de la fila en la tabla `order`.

**Clave:** el storefront no conoce la base de datos. Solo habla HTTP con Medusa.
Medusa es el único que abre conexiones a Postgres, a través del Session pooler.

## 5. ¿Por qué no se usa supabase-js en el front?

1. **Medusa ya es el backend.** Toda la lógica de comercio vive en los workflows
   de Medusa: precios por región, impuestos, inventario, envíos, pagos y órdenes.
   Si el front escribiera en las tablas con supabase-js, se saltaría esa lógica y
   dejaría datos inconsistentes (una orden sin pago, stock sin reservar, totales
   mal calculados).
2. **Seguridad.** supabase-js en el navegador expone la Data API de Supabase con
   la *anon key*. Habría que mantener políticas **RLS** sobre las 147 tablas de
   Medusa, que no fueron diseñadas para eso. Con Medusa, las credenciales de la
   base viven solo en el servidor (`.env` del backend) y el navegador únicamente
   tiene una *publishable key* de solo lectura del catálogo, limitada al canal
   de venta.
3. **Una sola fuente de verdad.** Medusa es dueño del esquema: sus migraciones
   crean y versionan las tablas. Tocarlas desde otro cliente rompe esa
   propiedad.
4. **Separación de responsabilidades.** Supabase aporta Postgres administrado
   (backups, dashboard, SQL editor, pooler). Medusa aporta el dominio de
   comercio. El storefront aporta la experiencia. Por eso tampoco se usa Supabase
   Auth: los clientes se autentican con el módulo de auth de Medusa.

## 6. Supabase y la conexión

- **Proyecto propio**: `supaday-ecommerce`, región `us-west-2`, Postgres 17,
  estado *ACTIVE_HEALTHY*.
- **Session pooler (5432)** en lugar de:
  - *Direct connection* (`db.<ref>.supabase.co:5432`): solo IPv6 en el plan
    gratuito, así que muchas redes domésticas y universitarias (IPv4) no
    conectan.
  - *Transaction pooler* (6543): reasigna la conexión en cada transacción y no
    soporta bien *prepared statements* ni funciones de sesión (locks de
    migración, `SET`). Medusa y MikroORM necesitan sesiones completas, sobre
    todo durante las migraciones.
- **SSL**: `medusa-config.ts` fuerza `ssl: { rejectUnauthorized: false }`, porque
  el pooler exige TLS.
- **Pool**: Medusa mantiene un pool de knex (mínimo 2 conexiones) y las
  reutiliza entre requests.
- **Latencia medida desde Ecuador**: unos 1,1 s para abrir una conexión y entre
  140 y 200 ms por consulta. Explica por qué cada paso del checkout tarda varios
  segundos: los workflows de Medusa ejecutan decenas de consultas secuenciales.
  En producción se elegiría una región de Supabase cercana al backend.

## 7. Instalación y arranque

- Monorepo `store/` con `apps/backend` (Medusa) y `apps/storefront` (Next.js).
- `REDIS_URL` **se eliminó** del `.env`, no se dejó vacía. Medusa lo indica en el
  log (*redisUrl not found. A fake redis instance will be used*) y usa event bus,
  caché y locking en memoria. Para un proyecto local es suficiente; en
  producción se agregaría Redis para colas y caché compartida.
- Arranque en un paso: `pnpm dev` desde `store/` levanta backend (:9000) y
  storefront (:8000).
- Admin accesible en `http://localhost:9000/app`.
- Pasos completos en el `README.md`: instalar → `.env` → `db:migrate` →
  `pnpm seed` → usuario admin → `pnpm dev`.

## 8. Migraciones y tablas

- `pnpm medusa db:migrate` crea **147 tablas** en `public`. Grupos importantes:
  - Catálogo: `product`, `product_variant`, `product_option`,
    `product_category`, `image`
  - Precios: `price_set`, `price`, `price_rule`, `product_variant_price_set`
  - Regiones: `region`, `region_country`, `tax_region`, `currency`
  - Carrito: `cart`, `cart_line_item`, `cart_address`, `cart_shipping_method`
  - Órdenes: `order`, `order_item`, `order_line_item`, `order_shipping`,
    `order_summary`
  - Pagos: `payment_collection`, `payment_session`, `payment`
  - Logística: `stock_location`, `inventory_item`, `inventory_level`,
    `fulfillment_set`, `service_zone`, `geo_zone`, `shipping_option`
- `mikro_orm_migrations` registra cada migración aplicada y `script_migrations`
  los scripts de datos (incluido `initial-data-seed.ts`).
- Cada módulo de Medusa tiene sus propias tablas. Las relaciones entre módulos
  se guardan en tablas *link* (por ejemplo `product_variant_price_set` o
  `order_payment_collection`), no con claves foráneas directas.

## 9. Regiones: decisiones y justificación

| Región | Países | Moneda | Impuestos | Envío |
|---|---|---|---|---|
| **Ecuador** | `ec` | **USD** | tax region `ec` (proveedor del sistema) | Envío estándar Ecuador $10 (2–4 días) · Envío express Ecuador $15 (24–48 h) |
| **Europe** | de, dk, es, fr, gb, it, se | **EUR** | tax regions por país | Standard Shipping 10 € · Express Shipping 10 € |

Argumentos:

- **USD para Ecuador**: el dólar es la moneda oficial de Ecuador desde la
  dolarización del año 2000. Cobrar en otra moneda obligaría a convertir y
  confundiría al cliente.
- **Una región propia para Ecuador** y no Ecuador dentro de otra región: en
  Medusa la región define la moneda, los proveedores de pago, las reglas de
  impuestos y las zonas de envío. Ecuador necesita USD, su propio impuesto y sus
  propios envíos, así que le corresponde una región independiente.
- **Precios explícitos por moneda** (no conversión automática): cada variante
  tiene un precio en USD y otro en EUR (hoodie $58 / 54 €). Así se controla el
  precio psicológico en cada mercado.
- **Envío por service zone**: la región Ecuador tiene su *fulfillment set* con
  una *service zone* cuyo *geo zone* es el país `ec`. Solo los carritos con
  dirección en Ecuador ven esas opciones.
- **/dk sigue vivo en euros**: la región Europe del starter se conservó. El
  mismo catálogo se vende allí en EUR y se demuestra que el sistema es
  multi-región.
- **País en la URL** (`/ec`, `/dk`): hace la región explícita, cacheable y
  compartible. El selector de región del header mueve el carrito a la nueva
  región (`updateRegion`) y recalcula los precios.
- **Región por defecto `ec`**: quien entra a `/` es redirigido a `/ec`, porque
  el mercado principal es Ecuador.

## 10. Catálogo propio

Seis productos AKLabs con imágenes propias en `apps/storefront/public/aklabs/products`:

| Producto | Categoría | Opciones | Variantes | USD | EUR |
|---|---|---|---|---|---|
| AKLabs Essential Hoodie | Hoodies | Talla S–XL · Negro / Azul marino | 8 | 58 | 54 |
| AKLabs Pro Cap | Gorras | Única · Negro / Azul marino | 2 | 28 | 26 |
| AKLabs Steel Thermo 750 ml | Termos y botellas | 750 ml · Negro mate | 1 | 34 | 32 |
| AKLabs Tech Tee | Camisetas | Talla S–XL · Gris jaspe / Negro | 8 | 26 | 24 |
| AKLabs Performance Joggers | Joggers | Talla S–XL · Carbón / Negro | 8 | 48 | 45 |
| AKLabs Insulated Bottle 1 L | Termos y botellas | 1 L · Acero cepillado | 1 | 36 | 34 |

- Cada producto tiene título, subtítulo, descripción, material, país de origen,
  peso, categoría, imágenes, variantes con SKU, precios USD/EUR e inventario
  (500 unidades por variante en el almacén).
- Scripts reproducibles e idempotentes en `apps/backend/src/scripts/`:
  - `add-ec-region.ts`: región Ecuador, tax region, service zone y envío.
  - `seed-aklabs-products.ts`: crea el catálogo AKLabs.
  - `sync-aklabs-catalog.ts`: actualiza textos y precios USD/EUR, borra (borrado
    lógico) el catálogo demo del starter y deja los envíos de Ecuador en español,
    con express.
  - `setup-aklabs.ts` (`pnpm seed`): ejecuta los tres en orden.

## 11. Diseño del storefront

- **Identidad**: colores del monograma AK. Rojo `#E3161F` (la A), azul real
  `#0B1ED8` (el trazo vertical de la K), celeste `#12B5EA` (la pierna de la K) y
  navy `#060B2B` (las prendas).
- **Tipografía**: *Bebas Neue* para titulares (como el wordmark AKLABS) e *Inter*
  para texto.
- **Estilo**: *liquid glass* (superficies translúcidas con `backdrop-filter`,
  brillo especular y bordes con gradiente), gradientes de marca, fondos aurora
  animados y una banda *marquee*.
- **Páginas rediseñadas**: home (hero, colección, categorías, beneficios,
  historia de marca, banner multi-región, CTA), tienda con filtros por categoría
  y orden por precio, categoría, producto (galería, selector de talla y color,
  precio, feedback al agregar, pestañas de detalles y envíos), carrito, checkout
  en 4 pasos numerados, confirmación de pedido, cuenta (login, registro,
  pedidos), 404, header con selector de región y moneda, y footer.
- **Todo en español**, con formato de moneda local: `$58,00` (es-EC) y `54,00 €`
  (es-ES).
- **Responsive**: verificado en 375 px (móvil) y 1440 px (escritorio), sin
  scroll horizontal.

## 12. Guion de la demo en vivo (≈ 6–8 minutos)

> Antes de presentar: levanta backend y storefront y abre una vez `/ec`, `/dk` y
> un producto para calentar la compilación. Ten abierta una pestaña del SQL
> Editor de Supabase con las consultas de la sección 14.

| Min | Acción | Qué decir |
|---|---|---|
| 0:00 | Supabase → proyecto → **Connect → Session pooler** | "Proyecto propio, conexión por Session pooler en el 5432, compatible con IPv4 y con sesiones completas para Medusa." |
| 0:45 | Table Editor: `product`, `region`, `order` | "Las migraciones de Medusa crearon 147 tablas. Aquí están product, region y order." |
| 1:30 | Terminal: backend y storefront corriendo | "Levantan limpios. Sin Redis: Medusa usa implementaciones en memoria." |
| 2:00 | `localhost:9000/app` (Admin) → Products, Regions | "Catálogo propio AKLabs y dos regiones: Ecuador en USD y Europe en EUR." |
| 2:45 | Storefront `/ec` → mostrar precios en `$` → cambiar a Dinamarca en el selector → `€` | "Mismo producto: $58 en Ecuador y 54 € en Europa. /dk sigue vivo." |
| 3:30 | Volver a `/ec` → hoodie → talla M, Negro → **Añadir al carrito** | "El carrito se crea en la región Ecuador." |
| 4:00 | Carrito → **Ir al checkout** → dirección en Quito → envío estándar → pago manual → **Confirmar pedido** | Explicar cada paso (sección 4) mientras carga. |
| 6:00 | Página de confirmación: anotar `#N` y `order_...` | "Este es el ID con el que Medusa guardó la orden." |
| 6:30 | Supabase → ejecutar la consulta 1 (refrescar `order`) | "La fila nueva, con el mismo ID, número, email, moneda USD y región Ecuador." |
| 7:15 | Consulta 2 (detalle) | "Línea, envío, total y pago: todo cuadra con lo que vimos en pantalla." |

**Consejo:** cada paso del checkout tarda unos segundos por la latencia a
Supabase (us-west-2). Aprovecha ese tiempo para explicar qué tabla se está
escribiendo.

## 13. Preguntas probables y respuestas

**¿Por qué Session pooler y no la conexión directa?**
La directa en el plan gratuito es solo IPv6. El Session pooler da una IPv4 y
mantiene la sesión completa durante la conexión, algo que Medusa necesita
(migraciones, *prepared statements*, locks). El Transaction pooler (6543) no
sirve para eso.

**¿Por qué quitaron REDIS_URL?**
Porque no hay un Redis local. Si la variable queda vacía, parece configurada
pero no lo está. Al quitarla, Medusa usa módulos en memoria de forma explícita.
En producción se usaría Redis para el event bus, la caché y las colas de
workflows.

**¿Por qué no hay RLS?**
RLS protege las tablas cuando se accede con la Data API o supabase-js usando la
anon key. Aquí nadie accede así: solo Medusa, por conexión directa de Postgres
con credenciales de servidor. RLS sobre las tablas de Medusa agregaría
complejidad sin beneficio. Lo correcto es no exponerlas por la Data API.

**¿Dónde se calculan los precios?**
En el módulo de pricing de Medusa. Cada variante tiene un *price set* con
precios por moneda. Con el `region_id` del carrito, Medusa elige el precio en la
moneda de la región (`calculated_price`).

**¿Qué pasa si alguien entra a `/`?**
El middleware lo redirige a `/ec`, la región por defecto (`NEXT_PUBLIC_DEFAULT_REGION`).

**¿Cómo se registra la orden?**
`completeCartWorkflow` valida el carrito, autoriza el pago, reserva inventario,
crea la orden con sus líneas, envío y resumen, y marca el carrito como
completado. Todo en un workflow con compensaciones: si un paso falla, se
revierte.

**¿El pago es real?**
No. Se usa el proveedor `pp_system_default` (pago manual) para pruebas. Integrar
Stripe es solo configurar el módulo de pago y la clave pública en el storefront;
el storefront ya soporta Stripe.

**¿Por qué el checkout tarda?**
Por la distancia a la base: unos 160 ms por consulta hasta `us-west-2`, y
decenas de consultas por paso. Con backend y base en la misma región baja a
milisegundos.

**¿Cómo se reproduce el proyecto desde cero?**
README: `pnpm install` → copiar los `.env.example` → `pnpm medusa db:migrate` →
`pnpm seed` → `pnpm medusa user ...` → `pnpm dev`.

**¿Qué es la publishable key?**
Una clave pública que identifica el canal de venta ("Default Sales Channel").
La Store API la exige para saber qué productos puede ver el storefront. No da
acceso de administración.

## 14. Consultas SQL para la demo (Supabase → SQL Editor)

**1. Últimas órdenes (refrescar después de comprar)**

```sql
select o.id, o.display_id, o.email, o.currency_code, r.name as region, o.created_at
from "order" o
join region r on r.id = o.region_id
order by o.created_at desc
limit 5;
```

**2. Detalle de una orden (reemplaza el ID)**

```sql
select 'linea' as tipo, oli.title || ' (' || oli.variant_title || ')' as detalle,
       oi.quantity::text as cantidad, oli.unit_price::text as monto
from order_item oi join order_line_item oli on oli.id = oi.item_id
where oi.order_id = 'order_REEMPLAZAR'
union all
select 'envio', osm.name, '1', osm.amount::text
from order_shipping os join order_shipping_method osm on osm.id = os.shipping_method_id
where os.order_id = 'order_REEMPLAZAR'
union all
select 'total', 'current_order_total', '-', s.totals->>'current_order_total'
from order_summary s where s.order_id = 'order_REEMPLAZAR'
union all
select 'pago', p.provider_id, '-', p.amount::text
from order_payment_collection opc
join payment p on p.payment_collection_id = opc.payment_collection_id
where opc.order_id = 'order_REEMPLAZAR';
```

**3. Regiones y monedas**

```sql
select r.name, r.currency_code, string_agg(rc.iso_2, ', ' order by rc.iso_2) as paises
from region r
join region_country rc on rc.region_id = r.id
where r.deleted_at is null
group by r.name, r.currency_code;
```

**4. Precios del catálogo en USD y EUR**

```sql
select p.title, pr.currency_code, min(pr.amount) as precio
from product p
join product_variant v on v.product_id = p.id and v.deleted_at is null
join product_variant_price_set vps on vps.variant_id = v.id
join price pr on pr.price_set_id = vps.price_set_id and pr.deleted_at is null
where p.deleted_at is null
group by p.title, pr.currency_code
order by p.title, pr.currency_code;
```

**5. Cantidad de tablas y migraciones**

```sql
select (select count(*) from information_schema.tables where table_schema = 'public') as tablas,
       (select count(*) from mikro_orm_migrations) as migraciones;
```

Resultado actual: 147 tablas y 181 migraciones aplicadas.

## 15. Evidencia de la prueba realizada

Compra de prueba completada el 28/09/2026 en `/ec`:

| Campo | Valor |
|---|---|
| Orden | `#1` · `order_01M3M4DH3FAV6KGJPMAS1HC3WX` |
| Producto | AKLabs Essential Hoodie (M / Negro), $58,00 |
| Envío | Envío estándar Ecuador, $10,00 |
| Total | $68,00 USD |
| Región | Ecuador |
| Pago | `pp_system_default` (manual), $68,00 autorizado |

La fila aparece en `order` con `currency_code = usd` y la región Ecuador.

Segunda compra de verificación en la región Europe (EUR), hecha por la Store API
con los mismos pasos que sigue el storefront en `/dk`:

| Campo | Valor |
|---|---|
| Orden | `#2` · `order_01M3M54VTRZYRMCCJXS5F1AA0A` |
| Producto | AKLabs Pro Cap (Única / Negro), 26,00 € |
| Envío | Standard Shipping, 10,00 € |
| Total | 36,00 € EUR |
| Región | Europe (Copenhague, `dk`) |

## 16. Higiene del repositorio

- `.gitignore` en la raíz y en `store/`: excluye `node_modules`, `.next`,
  `.medusa`, `.turbo`, `*.tsbuildinfo` y todos los `.env` salvo los `.env.example`.
- `apps/backend/.env.example` y `apps/storefront/.env.example` documentan cada
  variable sin secretos.
- `README.md` con arquitectura, arranque paso a paso, scripts, regiones y
  solución de problemas.
- Commits pequeños con mensajes descriptivos: datos y catálogo, sistema de
  diseño, páginas, checkout, documentación.
- Sin `supabase-js`, sin Supabase Auth y sin RLS en el storefront (se puede
  verificar con `grep -r supabase store/apps/storefront/src`).

## 17. Limitaciones y mejoras futuras

- **Latencia**: mover Supabase (o el backend) a una región cercana a los
  usuarios.
- **IVA Ecuador (15%)**: agregar la tasa en la tax region `ec` y decidir si los
  precios incluyen impuesto (`is_tax_inclusive`).
- **Pagos reales**: Stripe o un proveedor local (PayPhone, Kushki).
- **Redis** para el event bus y la caché en producción.
- **Imágenes por variante**: mostrar la foto azul marino al elegir ese color.
- **Despliegue**: backend en Railway/Render/Medusa Cloud y storefront en Vercel,
  apuntando al mismo Supabase.

## 18. Esquema sugerido de diapositivas (12–14 slides)

1. **Portada**: AKLabs Store, merch oficial. Logo, nombre, stack
   (Medusa · Next.js · Supabase).
2. **El problema y la idea**: vender el merch propio en Ecuador y en Europa con
   una tienda moderna.
3. **Demo visual**: capturas de la home, producto y checkout (diseño liquid glass).
4. **Arquitectura**: diagrama navegador → Next.js → Medusa → Supabase (sección 4).
5. **Recorrido de una compra**: los 8 pasos y las tablas que toca cada uno.
6. **Supabase**: proyecto, Session pooler 5432 y por qué (sección 6).
7. **Medusa v2**: módulos, workflows, admin, sin Redis (sección 7).
8. **Migraciones y tablas**: 147 tablas y grupos principales (sección 8).
9. **Regiones**: Ecuador USD / Europe EUR con argumentos (sección 9).
10. **Catálogo propio**: tabla de productos y scripts reproducibles (sección 10).
11. **¿Por qué no supabase-js?** Los 4 argumentos (sección 5).
12. **Diseño**: paleta, tipografía y componentes (sección 11).
13. **Demo en vivo**: comprar y ver la fila en `order` (secciones 12 y 14).
14. **Higiene, aprendizajes y mejoras** (secciones 16 y 17).
