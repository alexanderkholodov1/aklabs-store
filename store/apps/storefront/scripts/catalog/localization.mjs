// Reviewed display labels supplement the bilingual product-copy overlay.
const pair = (en, es) => ({ en, es })

export const categories = {
  Hoodies: {
    handle: "hoodies",
    name: pair("Hoodies & jackets", "Sudaderas y chaquetas"),
  },
  Gorras: { handle: "caps", name: pair("Caps & beanies", "Gorras y gorros") },
  "Termos y botellas": {
    handle: "drinkware",
    name: pair("Drinkware", "Termos y tazas"),
  },
  Camisetas: { handle: "tees", name: pair("T-shirts", "Camisetas") },
  Joggers: {
    handle: "joggers",
    name: pair("Joggers", "Pantalones deportivos"),
  },
  Stickers: { handle: "stickers", name: pair("Stickers", "Pegatinas") },
  Keychains: { handle: "keychains", name: pair("Keychains", "Llaveros") },
  Figures: { handle: "figures", name: pair("Figures", "Figuras") },
  Socks: { handle: "socks", name: pair("Socks", "Calcetines") },
  Bags: { handle: "bags", name: pair("Bags", "Bolsos") },
  Pins: { handle: "pins", name: pair("Pins & patches", "Pines y parches") },
  Accessories: {
    handle: "accessories",
    name: pair("Accessories", "Accesorios"),
  },
  Stationery: { handle: "stationery", name: pair("Stationery", "Papelería") },
}

export const optionNames = {
  Size: pair("Size", "Talla"),
  Color: pair("Color", "Color"),
  Capacity: pair("Capacity", "Capacidad"),
  Finish: pair("Finish", "Acabado"),
  Pack: pair("Pack", "Paquete"),
  Edition: pair("Edition", "Edición"),
  Pose: pair("Pose", "Pose"),
  Set: pair("Set", "Conjunto"),
  Ruling: pair("Pages", "Páginas"),
  Cover: pair("Cover", "Tapa"),
}

export const optionValues = Object.fromEntries(
  [
    ["Black", "Negro"],
    ["Navy", "Azul marino"],
    ["Red", "Rojo"],
    ["Blue", "Azul"],
    ["Cyan", "Celeste"],
    ["White", "Blanco"],
    ["One size", "Talla única"],
    ["Matte black", "Negro mate"],
    ["Brushed steel", "Acero cepillado"],
    ["Heather gray", "Gris jaspeado"],
    ["Charcoal", "Gris carbón"],
    ["Matte", "Mate"],
    ["Holographic", "Holográfico"],
    ["3 stickers", "3 pegatinas"],
    ["6 stickers", "6 pegatinas"],
    ["12 stickers", "12 pegatinas"],
    ["Black enamel", "Esmalte negro"],
    ["Silver", "Plateado"],
    ["Classic", "Clásica"],
    ["Night lab", "Laboratorio nocturno"],
    ["Coding", "Programando"],
    ["Shipping", "Empacando"],
    ["Natural", "Natural"],
    ["1 pin", "1 pin"],
    ["3 pins", "3 pines"],
    ["Gold", "Dorado"],
    ["Small", "Pequeño"],
    ["Large", "Grande"],
    ["Blank", "En blanco"],
    ["Lined", "Rayadas"],
    ["Soft", "Blanda"],
    ["Hard", "Dura"],
    ["Standard", "Estándar"],
    ...[
      "S",
      "M",
      "L",
      "XL",
      "S/M",
      "L/XL",
      "750 ml",
      "1 L",
      "A6",
      "A5",
      "A3",
      "A2",
    ].map((value) => [value, value]),
  ].map(([en, es]) => [en, pair(en, es)])
)

export const materials = Object.fromEntries(
  [
    [
      "80% combed cotton, 20% polyester",
      "80 % algodón peinado, 20 % poliéster",
    ],
    ["100% cotton twill", "Sarga de algodón 100 %"],
    ["100% washed cotton", "Algodón lavado 100 %"],
    [
      "18/8 stainless steel, double wall vacuum",
      "Acero inoxidable 18/8, doble pared al vacío",
    ],
    ["Brushed 18/8 stainless steel", "Acero inoxidable 18/8 cepillado"],
    ["100% ringspun cotton", "Algodón hilado en anillos 100 %"],
    ["100% cotton, 220 gsm", "Algodón 100 %, 220 g/m²"],
    ["80% cotton, 20% polyester", "80 % algodón, 20 % poliéster"],
    ["Weatherproof vinyl", "Vinilo resistente a la intemperie"],
    ["Kiss-cut vinyl sheet", "Hoja de vinilo troquelado"],
    ["Hard enamel on metal", "Esmalte duro sobre metal"],
    ["Printed acrylic", "Acrílico impreso"],
    ["Matte vinyl", "Vinilo mate"],
    [
      "80% cotton, 18% polyamide, 2% elastane",
      "80 % algodón, 18 % poliamida, 2 % elastano",
    ],
    ["100% acrylic knit", "Punto acrílico 100 %"],
    [
      "Cotton twill front, polyester mesh back",
      "Frente de sarga de algodón y malla de poliéster atrás",
    ],
    ["12 oz cotton canvas", "Lona de algodón de 12 oz"],
    [
      "Water-resistant nylon, YKK zippers",
      "Nailon resistente al agua, cremalleras YKK",
    ],
    [
      "Woven polyester with iron-on backing",
      "Poliéster tejido con respaldo termoadhesivo",
    ],
    ["Woven polyester, metal clip", "Poliéster tejido, clip metálico"],
    ["120 gsm paper, printed cover", "Papel de 120 g/m², tapa impresa"],
    ["Matte archival paper, 200 gsm", "Papel mate de conservación, 200 g/m²"],
    ["Ceramic, dishwasher safe", "Cerámica apta para lavavajillas"],
    [
      "Cloth top, natural rubber base",
      "Superficie textil y base de caucho natural",
    ],
    ["Vegan leather with RFID lining", "Cuero vegano con forro RFID"],
    [
      "100% polyester shell, mesh lining",
      "Exterior de poliéster 100 % y forro de malla",
    ],
  ].map(([en, es]) => [en, pair(en, es)])
)

export const imageAlt = {
  "hoodie-black-front": pair(
    "Black AKLabs pullover hoodie with a red, blue and cyan AK chest monogram.",
    "Sudadera negra AKLabs con capucha y monograma AK rojo, azul y celeste en el pecho."
  ),
  "hoodie-navy-front": pair(
    "Navy AKLabs pullover hoodie with a red, blue and cyan AK chest monogram.",
    "Sudadera azul marino AKLabs con capucha y monograma AK rojo, azul y celeste en el pecho."
  ),
  "zip-hoodie-navy": pair(
    "Navy AKLabs zip hoodie with a small multicolor AK chest mark.",
    "Sudadera azul marino AKLabs con cremallera y marca AK multicolor en el pecho."
  ),
  "cap-black-front": pair(
    "Black curved-brim AKLabs cap with a red, blue and cyan embroidered AK.",
    "Gorra negra AKLabs de visera curva con AK bordado en rojo, azul y celeste."
  ),
  "cap-navy-front": pair(
    "Navy curved-brim AKLabs cap with a red, blue and cyan embroidered AK.",
    "Gorra azul marino AKLabs de visera curva con AK bordado en rojo, azul y celeste."
  ),
  "dad-hat-black": pair(
    "Black low-profile AKLabs dad hat with a multicolor AK front mark.",
    "Gorra negra AKLabs de perfil bajo con marca AK multicolor al frente."
  ),
  "thermo-black": pair(
    "Matte black AKLabs thermos with a vertical red, blue and cyan AK print.",
    "Termo negro mate AKLabs con estampado AK vertical en rojo, azul y celeste."
  ),
  "bottle-steel": pair(
    "Silver brushed steel AKLabs bottle with a blue and cyan AKLABS wordmark.",
    "Botella plateada AKLabs de acero cepillado con nombre AKLABS azul y celeste."
  ),
  "tee-gray-front": pair(
    "Heather gray AKLabs T-shirt with a large red, blue and cyan AK print.",
    "Camiseta gris jaspeado AKLabs con estampado AK grande en rojo, azul y celeste."
  ),
  "studio-tee-white": pair(
    "White AKLabs T-shirt with a centered red, blue and cyan AK print.",
    "Camiseta blanca AKLabs con estampado AK centrado en rojo, azul y celeste."
  ),
  "joggers-charcoal": pair(
    "Charcoal AKLabs joggers with a small multicolor AK thigh mark.",
    "Pantalones deportivos gris carbón AKLabs con marca AK multicolor en el muslo."
  ),
  "sticker-pack": pair(
    "AKLabs sticker pack featuring red, blue and cyan AK monograms and wordmarks.",
    "Paquete de pegatinas AKLabs con monogramas AK y nombres en rojo, azul y celeste."
  ),
  "sticker-circle": pair(
    "Circular AKLabs sticker with a red, blue and cyan AK badge.",
    "Pegatina circular AKLabs con emblema AK rojo, azul y celeste."
  ),
  "sticker-wordmark": pair(
    "AKLABS wordmark sticker in blue and cyan on a white background.",
    "Pegatina con el nombre AKLABS en azul y celeste sobre fondo blanco."
  ),
  "sticker-mark": pair(
    "Die-cut AK monogram sticker in red, blue and cyan.",
    "Pegatina troquelada del monograma AK en rojo, azul y celeste."
  ),
  "keychain-enamel": pair(
    "Metal AKLabs keychain with a red, blue and cyan enamel AK charm.",
    "Llavero metálico AKLabs con charm AK de esmalte rojo, azul y celeste."
  ),
  "acrylic-charm": pair(
    "Clear acrylic AKLabs keychain with a multicolor circular AK badge.",
    "Llavero AKLabs de acrílico transparente con emblema circular AK multicolor."
  ),
  "mini-figure": pair(
    "AKLabs hooded vinyl figure in red, blue and cyan, holding a laptop.",
    "Figura AKLabs de vinilo con capucha en rojo, azul y celeste, sosteniendo una laptop."
  ),
  "desk-buddy": pair(
    "Brown-haired AKLabs desk figure in a red, blue and cyan color-block jacket, seated on three books.",
    "Figura de escritorio AKLabs de pelo castaño con chaqueta a bloques rojos, azules y celestes, sentada en tres libros."
  ),
  "crew-socks": pair(
    "Black AKLabs crew socks with red, blue and cyan AK cuff marks.",
    "Calcetines altos negros AKLabs con marcas AK rojas, azules y celestes en los puños."
  ),
  beanie: pair(
    "Navy ribbed AKLabs beanie with an embroidered red, blue and cyan AK cuff mark.",
    "Gorro azul marino acanalado AKLabs con marca AK bordada en rojo, azul y celeste en el doblez."
  ),
  "trucker-hat": pair(
    "Navy AKLabs mesh-back trucker cap with a red, blue and cyan AK front mark.",
    "Gorra trucker azul marino AKLabs con malla trasera y marca AK roja, azul y celeste al frente."
  ),
  "long-sleeve": pair(
    "Folded white AKLabs long-sleeve T-shirt with a small red, blue and cyan AK chest print.",
    "Camiseta blanca doblada de manga larga AKLabs con estampado AK rojo, azul y celeste en el pecho."
  ),
  "canvas-tote": pair(
    "Natural cream AKLabs canvas tote bag with long handles and a large red, blue and cyan AK print.",
    "Bolso AKLabs de lona color crema natural con asas largas y gran estampado AK rojo, azul y celeste."
  ),
  "sling-bag": pair(
    "Navy AKLabs crossbody sling bag with an adjustable strap and a red, blue and cyan AK front mark.",
    "Bolso cruzado azul marino AKLabs con correa ajustable y marca AK roja, azul y celeste al frente."
  ),
  "enamel-pins": pair(
    "AKLabs metal enamel pins with red, blue and cyan AK marks.",
    "Pines metálicos AKLabs de esmalte con marcas AK rojas, azules y celestes."
  ),
  "woven-patch": pair(
    "Woven AKLabs patch with a red, blue and cyan AK monogram.",
    "Parche tejido AKLabs con monograma AK rojo, azul y celeste."
  ),
  lanyard: pair(
    "Navy AKLabs woven lanyard with repeating red, blue and cyan AK monograms and a silver clip.",
    "Cinta tejida azul marino AKLabs con monogramas AK rojos, azules y celestes repetidos y clip plateado."
  ),
  "lab-notebook": pair(
    "Navy AKLabs notebook with a centered red, blue and cyan AK cover print.",
    "Cuaderno azul marino AKLabs con estampado AK rojo, azul y celeste centrado en la tapa."
  ),
  "mark-poster": pair(
    "Cream AKLabs poster featuring a large red, blue and cyan AK monogram.",
    "Póster color crema AKLabs con un gran monograma AK rojo, azul y celeste."
  ),
  "ceramic-mug": pair(
    "White AKLabs ceramic mug with a C-shaped handle and red, blue and cyan AK print.",
    "Taza blanca de cerámica AKLabs con asa en C y estampado AK rojo, azul y celeste."
  ),
  mousepad: pair(
    "Navy rectangular AKLabs desk mat with a red, blue and cyan AK corner mark.",
    "Alfombrilla rectangular azul marino de escritorio AKLabs con marca AK roja, azul y celeste en la esquina."
  ),
  "card-sleeve": pair(
    "Black AKLabs slim card sleeve with an embossed red, blue and cyan AK front mark.",
    "Tarjetero negro delgado AKLabs con marca AK roja, azul y celeste en relieve al frente."
  ),
  "coach-jacket": pair(
    "Navy AKLabs snap-front coach jacket with an embroidered red, blue and cyan AK chest mark.",
    "Chaqueta azul marino AKLabs con broches y marca AK roja, azul y celeste bordada en el pecho."
  ),
}
