/**
 * Namespace "store": catalog listings (shop, category and collection pages),
 * their toolbar, pagination and empty states. Keep en and es in sync.
 */
export const en = {
  store: {
    eyebrow: "Collection 01",
    title: "The AKLabs shop",
    description:
      "All the lab merch in one place. Filter by category or sort by price.",
    metaTitle: "Shop",
    metaDescription:
      "All AKLabs merch: hoodies, tees, caps, drinkware, stickers, figures, and more.",
    categoryEyebrow: "Category",
    collectionEyebrow: "Collection",
    categoryFallback: (name: string) =>
      `Every piece of the ${name} line, with the AK mark.`,
    categoryMeta: (name: string) => `${name} from the AKLabs store.`,
    collectionMeta: (title: string) => `The ${title} collection from AKLabs.`,
    subcategories: "Subcategories",
    filterLabel: "Filter by category",
    all: "All",
    sortLabel: "Sort by",
    sort: {
      created_at: "Newest",
      price_asc: "Price: low to high",
      price_desc: "Price: high to low",
    },
    results: (count: number, currency: string) =>
      `${count} ${count === 1 ? "product" : "products"} · prices in ${currency}`,
    showing: (from: number, to: number, count: number) =>
      `Showing ${from}–${to} of ${count}`,
    emptyTitle: "Nothing here yet",
    emptyBody:
      "We could not find products with these filters. Try another category or browse the whole collection.",
    emptyCta: "See all products",
    pageEmptyTitle: "This page is empty",
    pageEmptyBody: (pages: number) =>
      `The catalog only has ${pages} ${pages === 1 ? "page" : "pages"} right now.`,
    pageEmptyCta: "Go to the first page",
    pagination: {
      label: "Pages",
      previous: "Previous",
      next: "Next",
      page: (page: number) => `Page ${page}`,
      status: (page: number, pages: number) => `Page ${page} of ${pages}`,
    },
  },
}

export const es: typeof en = {
  store: {
    eyebrow: "Colección 01",
    title: "La tienda AKLabs",
    description:
      "Todo el merch del laboratorio en un solo lugar. Filtra por categoría u ordena por precio.",
    metaTitle: "Tienda",
    metaDescription:
      "Todo el merch AKLabs: hoodies, camisetas, gorras, termos, stickers, figuras y más.",
    categoryEyebrow: "Categoría",
    collectionEyebrow: "Colección",
    categoryFallback: (name) =>
      `Todas las piezas de la línea ${name}, con la marca AK.`,
    categoryMeta: (name) => `${name} de la tienda AKLabs.`,
    collectionMeta: (title) => `La colección ${title} de AKLabs.`,
    subcategories: "Subcategorías",
    filterLabel: "Filtrar por categoría",
    all: "Todo",
    sortLabel: "Ordenar por",
    sort: {
      created_at: "Novedades",
      price_asc: "Precio: menor a mayor",
      price_desc: "Precio: mayor a menor",
    },
    results: (count, currency) =>
      `${count} ${count === 1 ? "producto" : "productos"} · precios en ${currency}`,
    showing: (from, to, count) => `Mostrando ${from}–${to} de ${count}`,
    emptyTitle: "Nada por aquí todavía",
    emptyBody:
      "No encontramos productos con estos filtros. Prueba con otra categoría o mira toda la colección.",
    emptyCta: "Ver todos los productos",
    pageEmptyTitle: "Esta página está vacía",
    pageEmptyBody: (pages) =>
      `Por ahora el catálogo tiene ${pages} ${pages === 1 ? "página" : "páginas"}.`,
    pageEmptyCta: "Ir a la primera página",
    pagination: {
      label: "Páginas",
      previous: "Anterior",
      next: "Siguiente",
      page: (page) => `Página ${page}`,
      status: (page, pages) => `Página ${page} de ${pages}`,
    },
  },
}
