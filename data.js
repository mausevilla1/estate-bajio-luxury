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
    fotoTarjeta: "assets/propiedades/casa-cordoba/fotos/22.jpeg",
    fotoTarjetaPos: "55% center",
    resumen: "Residencia en Club de Golf Malanquín con vistas a Los Picachos y acceso al campo. Dos niveles con techos de madera estilo San Miguel, cantera y acabados de autor contemporáneos.",
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
    fotoTarjeta: "assets/propiedades/casa-granada/fotos/08.webp",
    resumen: "Residencia en Club de Golf Malanquín con vistas a Los Picachos. Dos niveles con techos altos de madera, cantera, jacuzzi privado, terraza con asador y jardín.",
    heroImage: "assets/propiedades/casa-granada/fotos/07.webp",
    gallery: [
      "assets/propiedades/casa-granada/fotos/07.webp",
      "assets/propiedades/casa-granada/fotos/09.webp",
      "assets/propiedades/casa-granada/fotos/25.webp",
      "assets/propiedades/casa-granada/fotos/30.webp",
      "assets/propiedades/casa-granada/fotos/12.webp",
      "assets/propiedades/casa-granada/fotos/08.webp",
      "assets/propiedades/casa-granada/fotos/27.webp",
      "assets/propiedades/casa-granada/fotos/60.webp",
      "assets/propiedades/casa-granada/fotos/49.webp",
      "assets/propiedades/casa-granada/fotos/11.webp"
    ],
    flujo: [
      { src: "assets/propiedades/casa-granada/fotos/04.webp", prop: "4:3", alto: "a", pie: "Fachada principal con acceso vehicular y jardinera de agaves." },
      { src: "assets/propiedades/casa-granada/fotos/10.webp", prop: "3:4", alto: "b", pie: "Zaguán de madera antigua hacia el patio de acceso." },
      { src: "assets/propiedades/casa-granada/fotos/12.webp", prop: "2:3", alto: "c", pie: "Patio empedrado entre muros blancos." },
      { src: "assets/propiedades/casa-granada/fotos/11.webp", prop: "3:4", alto: "a", pie: "La puerta de madera abierta hacia el patio." },
      { src: "assets/propiedades/casa-granada/fotos/30.webp", prop: "3:2", alto: "b", pie: "Estancia con chimenea y ventanal corrido al jardín." },
      { src: "assets/propiedades/casa-granada/fotos/29.webp", prop: "3:2", alto: "c", pie: "La estancia desde el otro extremo, con salida a la terraza." },
      { src: "assets/propiedades/casa-granada/fotos/25.webp", prop: "3:2", alto: "a", pie: "Cocina con isla y carpintería en madera." },
      { src: "assets/propiedades/casa-granada/fotos/26.webp", prop: "3:2", alto: "b", pie: "Zona de cocción con campana y barra de trabajo." },
      { src: "assets/propiedades/casa-granada/fotos/27.webp", prop: "3:2", alto: "c", pie: "Comedor abierto a la cocina, con ventanal al valle." },
      { src: "assets/propiedades/casa-granada/fotos/07.webp", prop: "3:2", alto: "a", pie: "Jardín posterior con pérgola y asador." },
      { src: "assets/propiedades/casa-granada/fotos/09.webp", prop: "3:2", alto: "b", pie: "Pérgola de columnas de madera sobre la terraza." },
      { src: "assets/propiedades/casa-granada/fotos/08.webp", prop: "3:4", alto: "c", pie: "Fachada posterior de dos niveles desde el jardín." },
      { src: "assets/propiedades/casa-granada/fotos/54.webp", prop: "3:4", alto: "a", pie: "Recámara con ventanales de esquina y vista abierta." },
      { src: "assets/propiedades/casa-granada/fotos/49.webp", prop: "3:4", alto: "b", pie: "Baño principal con doble lavabo y tragaluz." },
      { src: "assets/propiedades/casa-granada/fotos/43.webp", prop: "3:4", alto: "c", pie: "Baño con espejo circular y regadera de cristal." },
      { src: "assets/propiedades/casa-granada/fotos/68.webp", prop: "3:4", alto: "a", pie: "Patio de servicio empedrado en planta alta." }
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
    fotoTarjeta: "assets/propiedades/casa-olivos/fotos/01.webp",
    resumen: "Residencia en Club de Golf Malanquín con vistas a Los Picachos. Dos niveles con techos a doble altura de vigas, cantera, patio interior empedrado y cocina con isla.",
    heroImage: "assets/propiedades/casa-olivos/fotos/01.webp",
    gallery: [
      "assets/propiedades/casa-olivos/fotos/01.webp",
      "assets/propiedades/casa-olivos/fotos/02.webp",
      "assets/propiedades/casa-olivos/fotos/07.webp",
      "assets/propiedades/casa-olivos/fotos/09.webp",
      "assets/propiedades/casa-olivos/fotos/10.webp",
      "assets/propiedades/casa-olivos/fotos/12.webp",
      "assets/propiedades/casa-olivos/fotos/11.webp",
      "assets/propiedades/casa-olivos/fotos/18.webp",
      "assets/propiedades/casa-olivos/fotos/13.webp",
      "assets/propiedades/casa-olivos/fotos/16.webp"
    ],
    flujo: [
      { src: "assets/propiedades/casa-olivos/fotos/01.webp", prop: "3:4", alto: "a", pie: "Fachada sobre empedrado, con portón de madera y acceso peatonal." },
      { src: "assets/propiedades/casa-olivos/fotos/02.webp", prop: "4:3", alto: "b", pie: "Acceso bajo pérgola de madera y escalones de cantera." },
      { src: "assets/propiedades/casa-olivos/fotos/03.webp", prop: "3:4", alto: "c", pie: "Vestíbulo: cancel de cristal enmarcado en cantera, con el patio al fondo." },
      { src: "assets/propiedades/casa-olivos/fotos/07.webp", prop: "3:4", alto: "a", pie: "Estancia a doble altura con techo de vigas de madera." },
      { src: "assets/propiedades/casa-olivos/fotos/19.webp", prop: "3:4", alto: "b", pie: "Planta alta con doble ventanal y viguería expuesta." },
      { src: "assets/propiedades/casa-olivos/fotos/09.webp", prop: "3:4", alto: "c", pie: "Cocina con isla y alacenas en madera oscura." },
      { src: "assets/propiedades/casa-olivos/fotos/08.webp", prop: "3:4", alto: "a", pie: "La cocina abierta a la estancia, bajo la doble altura." },
      { src: "assets/propiedades/casa-olivos/fotos/05.webp", prop: "3:4", alto: "b", pie: "Ventanal que enmarca el patio interior." },
      { src: "assets/propiedades/casa-olivos/fotos/10.webp", prop: "3:4", alto: "a", pie: "Patio interior empedrado con enredaderas." },
      { src: "assets/propiedades/casa-olivos/fotos/16.webp", prop: "3:4", alto: "c", pie: "Escalera exterior sobre el patio." },
      { src: "assets/propiedades/casa-olivos/fotos/12.webp", prop: "4:3", alto: "b", pie: "Estancia con cancel corredizo al patio privado." },
      { src: "assets/propiedades/casa-olivos/fotos/11.webp", prop: "4:3", alto: "a", pie: "Recámara con muro en acabado tierra y piso de espiga." },
      { src: "assets/propiedades/casa-olivos/fotos/18.webp", prop: "3:4", alto: "c", pie: "Recámara con viguería y ventanal a la vista abierta." },
      { src: "assets/propiedades/casa-olivos/fotos/14.webp", prop: "3:4", alto: "b", pie: "Vestidor de carpintería oscura con luz cenital." },
      { src: "assets/propiedades/casa-olivos/fotos/13.webp", prop: "3:4", alto: "a", pie: "Baño principal con doble tocador y tragaluz." },
      { src: "assets/propiedades/casa-olivos/fotos/20.webp", prop: "3:4", alto: "c", pie: "Baño con lavabo de piedra y regadera al fondo." }
    ],
    floorplan: null,
    architect: "Autoría contemporánea",
    amenities: ["golf", "garden"],
    features: [
      "300 m² de construcción sobre 350 m² de terreno",
      "Vistas a las montañas de Los Picachos",
      "Patios interiores empedrados con cantera",
      "3 recámaras y 3.5 baños",
      "Techos de doble altura con vigas de madera noble y acabados contemporáneos"
    ],
    projectedYield: "Consultar",
    description: "Increíble residencia nueva en el Club de Golf Malanquín con vistas imponentes a las montañas de Los Picachos. Diseñada en dos niveles con techos a doble altura de vigas de madera, cantera y acabados de autor que combinan elegancia moderna con el carácter rústico de San Miguel de Allende. Cuenta con patio interior empedrado, cocina de diseño con isla y amplios ventanales de luz natural."
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
