// ==========================================================================
// PRAETORA - Dataset del catálogo
// --------------------------------------------------------------------------
// Inventario real: 3 residencias en Club de Golf Malanquín, San Miguel de Allende.
//
// QUÉ ES REAL:
//   · Todos los datos provienen directamente de las fichas oficiales y flyers.
//   · zone: "San Miguel de Allende"
//   · subzone: "Club de Golf Malanquín"
//   · priceMXN, m2Construccion, m2Terreno, bedrooms, bathrooms, features.
//
// FOTOGRAFÍAS:
//   · heroImage: recorte de fachada provisional en espera de material en alta.
//   · gallery: [] vacía en esta tanda para no estirar miniaturas en la ficha individual.
//   · Sin campo flujo: la ficha individual se construye a partir de heroImage.
//
// PENDIENTE DE DECISIÓN:
//   · priceUSD: null (tipo de cambio pendiente de decisión de Luis; no calcular ni deducir).
// ==========================================================================

const LUXURY_PROPERTIES = [
  {
    id: "prop-1",
    slug: "casa-cordoba",
    title: "Casa Córdoba",
    zone: "San Miguel de Allende",
    subzone: "Club de Golf Malanquín",
    priceMXN: 24400000,
    priceUSD: null, // Tipo de cambio pendiente de definición por Luis
    type: "Residencia en Club de Golf",
    status: "Disponible",
    isExclusive: true,
    m2Construccion: 407,
    m2Terreno: 576,
    bedrooms: 4,
    bathrooms: 5.5,
    garage: 2,
    // heroImage provisional: recorte de fachada en espera de fotos en alta resolución
    heroImage: "assets/propiedades/casa-cordoba/fotos/01-fachada-jardin.jpg",
    gallery: [],
    floorplan: null,
    architect: "Autoría contemporánea",
    amenities: ["golf", "garden"],
    features: [
      "407 m² de construcción sobre 576 m² de terreno",
      "Vistas panorámicas a las montañas de Los Picachos",
      "Acceso directo al campo de golf",
      "4 recámaras y 5.5 baños con acabados en cantera y piedra",
      "Cocina abierta, sala de medios, terraza con asador y jardín amplio"
    ],
    projectedYield: "Consultar",
    description: "Increíble residencia de lujo en el Club de Golf Malanquín con vistas a las montañas de Los Picachos y acceso directo al campo de golf. Esta casa de dos niveles combina amplitud, techos altos de madera estilo San Miguel, cantera y acabados de autor contemporáneos con todas las comodidades y amenidades de club de golf."
  },
  {
    id: "prop-2",
    slug: "casa-granada",
    title: "Casa Granada",
    zone: "San Miguel de Allende",
    subzone: "Club de Golf Malanquín",
    priceMXN: 16800000,
    priceUSD: null, // Tipo de cambio pendiente de definición por Luis
    type: "Residencia en Club de Golf",
    status: "Disponible",
    isExclusive: true,
    m2Construccion: 350,
    m2Terreno: 400,
    bedrooms: 4,
    bathrooms: 5.5,
    garage: 2,
    // heroImage provisional: recorte de fachada en espera de fotos en alta resolución
    heroImage: "assets/propiedades/casa-granada/fotos/01-fachada-jardin.jpg",
    gallery: [],
    floorplan: null,
    architect: "Autoría contemporánea",
    amenities: ["golf", "garden"],
    features: [
      "350 m² de construcción sobre 400 m² de terreno",
      "Vistas a las montañas de Los Picachos",
      "Jacuzzi privado y terraza con asador",
      "4 recámaras y 5.5 baños",
      "Techos altos con vigas de madera estilo San Miguel, cantera y acabados modernos"
    ],
    projectedYield: "Consultar",
    description: "Residencia nueva en el Club de Golf Malanquín con vistas imponentes a Los Picachos. Dos niveles con iluminación natural, techos altos de madera y cantera que integran elegancia moderna con el carácter rústico de San Miguel de Allende. Cuenta con jacuzzi privado, terraza con asador y amplio jardín."
  },
  {
    id: "prop-3",
    slug: "casa-olivos",
    title: "Casa Olivos",
    zone: "San Miguel de Allende",
    subzone: "Club de Golf Malanquín",
    priceMXN: 14500000,
    priceUSD: null, // Tipo de cambio pendiente de definición por Luis
    type: "Residencia contemporánea",
    status: "Disponible",
    isExclusive: true,
    m2Construccion: 300,
    m2Terreno: 350,
    bedrooms: 3,
    bathrooms: 3.5,
    garage: 2,
    // heroImage provisional: recorte de fachada en espera de fotos en alta resolución
    heroImage: "assets/propiedades/casa-olivos/fotos/01-fachada-acceso.jpg",
    gallery: [],
    floorplan: null,
    architect: "Autoría contemporánea",
    amenities: ["golf", "garden"],
    features: [
      "300 m² de construcción sobre 350 m² de terreno",
      "Vistas a las montañas de Los Picachos",
      "Despacho privado o biblioteca",
      "3 recámaras y 3.5 baños",
      "Patios interiores, techos altos de madera y acabados en piedra y cantera"
    ],
    projectedYield: "Consultar",
    description: "Casa contemporánea en el Club de Golf Malanquín que fusiona arquitectura moderna y elementos tradicionales de San Miguel. Espacios a doble altura con cantera y techos de vigas de madera, patio interior, despacho/biblioteca independiente y vistas abiertas a Los Picachos."
  }
];

const ACTIVOS_INVERSION = [];  // Hotel — en espera de ficha de Luis.
// Campos previstos: llaves, ocupacion, retorno, licencias.
