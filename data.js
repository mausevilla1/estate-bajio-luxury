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
//   · Casa Córdoba y Casa Granada: heroImage y gallery pobladas con fotografías en alta resolución (1280px).
//   · Casa Olivos: heroImage provisional en espera de material en alta.
//   · Sin campo flujo: la ficha individual se construye dinámicamente a partir de heroImage y gallery.
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
    heroImage: "assets/propiedades/casa-cordoba/fotos/21.jpeg",
    gallery: [
      "assets/propiedades/casa-cordoba/fotos/21.jpeg",
      "assets/propiedades/casa-cordoba/fotos/22.jpeg",
      "assets/propiedades/casa-cordoba/fotos/7.jpeg",
      "assets/propiedades/casa-cordoba/fotos/17.jpeg",
      "assets/propiedades/casa-cordoba/fotos/20.jpeg",
      "assets/propiedades/casa-cordoba/fotos/24.jpeg",
      "assets/propiedades/casa-cordoba/fotos/10.jpeg",
      "assets/propiedades/casa-cordoba/fotos/1.jpeg",
      "assets/propiedades/casa-cordoba/fotos/14.jpeg",
      "assets/propiedades/casa-cordoba/fotos/18.jpeg"
    ],
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
    heroImage: "assets/propiedades/casa-granada/fotos/11.jpeg",
    gallery: [
      "assets/propiedades/casa-granada/fotos/11.jpeg",
      "assets/propiedades/casa-granada/fotos/2.jpeg",
      "assets/propiedades/casa-granada/fotos/10.jpeg",
      "assets/propiedades/casa-granada/fotos/12.jpeg",
      "assets/propiedades/casa-granada/fotos/14.jpeg",
      "assets/propiedades/casa-granada/fotos/18.jpeg",
      "assets/propiedades/casa-granada/fotos/20.jpeg",
      "assets/propiedades/casa-granada/fotos/28.jpeg",
      "assets/propiedades/casa-granada/fotos/29.jpeg",
      "assets/propiedades/casa-granada/fotos/5.jpeg"
    ],
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

const ACTIVOS_INVERSION = [
  {
    id: "activo-1",
    slug: "casa-julieta",
    title: "Casa Julieta",
    zone: "San Miguel de Allende",
    subzone: "Centro Histórico, Umarán 27 / Zacateros",
    type: "Hotel boutique + renta comercial",
    priceMXN: null,
    priceUSD: null,
    precioEstado: "Por confirmar", // CADENA de texto, nunca un número
    objetoVenta: "Por confirmar: inmueble completo o participación",
    m2Terreno: 295,
    m2Construccion: 530,
    anoConstruccion: "Siglo XIX",
    llaves: 6,
    llavesDetalle: "4 Junior Suites, 1 Deluxe y 1 Presidencial. Tres con balcón y vista a la Parroquia.",
    inquilino: "Birkenstock",
    rentaMensualMXN: 95000,
    booking: "9.7 / 10 en Booking sobre 60 reseñas",
    caminando: "3 minutos a pie de la Parroquia y el Jardín Allende",
    roofNota: "Terraza con vistas a la Parroquia y a Las Monjas. Potencial adicional sujeto a las autorizaciones del INAH y municipales aplicables.",
    status: "Consultar",
    amenities: [],
    heroImage: "assets/propiedades/hotel/fotos/1.jpeg",
    description: "Casona histórica del siglo XIX en el corazón de San Miguel de Allende, ubicada en la esquina de Umarán y Zacateros a tres minutos a pie de la Parroquia y el Jardín Allende. El activo combina la operación de un hotel boutique de 6 suites con alta calificación en hospitalidad, local comercial en planta baja arrendado a Birkenstock y terraza panorámica con vistas abiertas al centro virreinal.",
    flujo: [
      {
        src: "assets/propiedades/hotel/fotos/1.jpeg",
        prop: "16:9",
        alto: "b",
        pie: "Fachada histórica del siglo XIX en Umarán y Zacateros, con local Birkenstock en planta baja."
      },
      {
        src: "assets/propiedades/hotel/fotos/2.jpeg",
        prop: "2:3",
        alto: "a",
        pie: "Patio interior empedrado y acceso principal a las suites."
      },
      {
        src: "assets/propiedades/hotel/fotos/5.jpeg",
        prop: "3:4",
        alto: "c",
        pie: "Roof garden con vistas panorámicas al Centro Histórico y al atardecer."
      },
      {
        src: "assets/propiedades/hotel/fotos/12.jpeg",
        prop: "2:3",
        alto: "b",
        pie: "Terraza superior con vista a las cúpulas de San Miguel de Allende."
      },
      {
        src: "assets/propiedades/hotel/fotos/11.jpeg",
        prop: "3:4",
        alto: "a",
        pie: "Balcón colonial con herrería tradicional e iluminación cálida."
      },
      {
        src: "assets/propiedades/hotel/fotos/8.jpeg",
        prop: "2:3",
        alto: "c",
        pie: "Fuente colonial y escalinata de cantera hacia niveles superiores."
      },
      {
        tipo: "video",
        src: "assets/propiedades/hotel/video/28.mp4",
        poster: "assets/propiedades/hotel/video/28-poster.jpg",
        prop: "9:16",
        alto: "b",
        pie: "Recorrido por la arquitectura y los patios coloniales de Casa Julieta."
      },
      {
        src: "assets/propiedades/hotel/fotos/15.jpeg",
        prop: "3:4",
        alto: "a",
        pie: "Suite Presidencial con techos de vigas de madera y arquitectura de época."
      },
      {
        src: "assets/propiedades/hotel/fotos/20.jpeg",
        prop: "2:3",
        alto: "c",
        pie: "Junior Suite con acabados artesanales y candelabro contemporáneo."
      },
      {
        src: "assets/propiedades/hotel/fotos/22.jpeg",
        prop: "3:4",
        alto: "b",
        pie: "Suite con vigas expuestas y vistas interiores al patio."
      },
      {
        src: "assets/propiedades/hotel/fotos/21.jpeg",
        prop: "2:3",
        alto: "a",
        pie: "Acceso privado y balcón en suite de planta alta."
      },
      {
        src: "assets/propiedades/hotel/fotos/13.jpeg",
        prop: "3:4",
        alto: "c",
        pie: "Ambiente de hospitalidad y coctelería en la terraza."
      },
      {
        src: "assets/propiedades/hotel/fotos/7.jpeg",
        prop: "2:3",
        alto: "b",
        pie: "Solárium y área lounge en terraza con horizonte abierto."
      },
      {
        src: "assets/propiedades/hotel/fotos/9.jpeg",
        prop: "3:4",
        alto: "a",
        pie: "Vista exterior hacia la cúpula del Templo de las Monjas."
      }
    ]
  }
];
