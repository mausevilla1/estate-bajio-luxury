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
//   · Las tres casas se entregan SIN MUEBLES y CON COCINA EQUIPADA: ningún texto debe sugerir
//     mobiliario incluido.
//
// FICHA TÉCNICA (después de las fotos): niveles, caracteristicas (de info.md),
//   planos (espacios por planta) y entorno (clave de ENTORNOS, más abajo).
//
// FOTOGRAFÍAS:
//   · Casa Granada y Casa Olivos: campo `flujo`, en el orden del álbum.
//   · Casa Córdoba: sin `flujo`; la ficha se arma con heroImage y gallery.
//   · Casa Granada: YOPE va a volver a editar sus fotos (pendiente).
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
    niveles: 2,
    entorno: "malanquin",
    // Ficha técnica: tomadas de info.md (características y amenidades clave).
    caracteristicas: [
      "Vistas panorámicas a las montañas de Los Picachos",
      "Acceso directo al campo de golf",
      "Arquitectura contemporánea con techos altos de madera estilo San Miguel",
      "Acabados de alta gama en piedra y cantera natural",
      "Espacios amplios con gran iluminación natural",
      "Cocina abierta y equipada",
      "Sala de medios",
      "Terraza con asador",
      "Jardín privado amplio"
    ],
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
    // Maqueta 3D de la distribución: sus imágenes y cuartos.js (app.js, panelDistribucionMaqueta).
    maqueta: "assets/propiedades/casa-cordoba/maqueta",
    planos: [
      {
        nivel: "Planta baja",
        base: "assets/propiedades/casa-cordoba/planos/planta-baja",
        proporcion: 2.679,
        etiquetas: [
          { t: "Recámara principal", x: 56.2, y: 81.2, w: 12.3, xm: 81.2, ym: 43.8, wm: 30 },
          { t: "Baño / vestidor principal", x: 46.4, y: 85.7, w: 13.2, xm: 85.7, ym: 53.6, wm: 21.4 },
          { t: "Estancia / comedor", x: 43.8, y: 34.7, w: 11.7, xm: 34.7, ym: 56.2, wm: 30 },
          { t: "Baño de servicio", x: 35.7, y: 12.9, w: 2.4, xm: 12.9, ym: 64.3, wm: 7.4, oculta: "m" },
          { t: "Recámara de servicio", x: 34.4, y: 26.6, w: 5.1, xm: 26.6, ym: 65.6, wm: 12.8, oculta: "m" },
          { t: "Cocina", x: 31.9, y: 51.4, w: 12.5, xm: 51.4, ym: 68.1, wm: 30 },
          { t: "Lavandería", x: 22.5, y: 25.1, w: 4.8, xm: 25.1, ym: 77.5, wm: 15.6, oculta: "m" },
          { t: "Baño / vestidor 1", x: 21.4, y: 81.7, w: 6.2, xm: 81.7, ym: 78.6, wm: 13.2, oculta: "m" },
          { t: "Toilet", x: 20, y: 41.3, w: 1, xm: 41.3, ym: 80, wm: 7.9, oculta: "m" },
          { t: "Vestíbulo", x: 17.1, y: 55, w: 6.7, xm: 55, ym: 82.9, wm: 18.5, oculta: "m" },
          { t: "Recámara 1", x: 10.4, y: 81.4, w: 12.1, xm: 81.4, ym: 89.6, wm: 30 },
          { t: "Acceso", x: 8.9, y: 54.8, w: 3.2, xm: 54.8, ym: 91.1, wm: 8, oculta: "m" },
          { t: "Cochera", x: 2.6, y: 24.5, w: 7.6, xm: 24.5, ym: 97.4, wm: 30 }
        ]
      },
      {
        nivel: "Planta sótano",
        base: "assets/propiedades/casa-cordoba/planos/planta-sotano",
        proporcion: 2.141,
        etiquetas: [
          { t: "Jardín", x: 82.7, y: 52.3, w: 6, xm: 52.3, ym: 17.3, wm: 30 },
          { t: "Recámara 2", x: 45.2, y: 80.9, w: 15.4, xm: 80.9, ym: 54.8, wm: 30 },
          { t: "Bodega", x: 43.3, y: 6.9, w: 6, xm: 6.9, ym: 56.7, wm: 7, oculta: "m" },
          { t: "Baño / vestidor 2", x: 32.9, y: 85.5, w: 16.3, xm: 85.5, ym: 67.1, wm: 21.4 },
          { t: "Terraza pergolada", x: 39.9, y: 37.1, w: 30, xm: 37.1, ym: 60.1, wm: 30 },
          { t: "Sala de TV / estudio", x: 14.1, y: 43, w: 14, xm: 43, ym: 85.9, wm: 30 },
          { t: "Jardín interior", x: 13.8, y: 86.2, w: 13.6, xm: 86.2, ym: 86.2, wm: 22.4 },
          { t: "Baño", x: 3.9, y: 83.3, w: 4.8, xm: 83.3, ym: 96.1, wm: 11.8 }
        ]
      }
    ],
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
    niveles: 2,
    entorno: "malanquin",
    // Ficha técnica: tomadas de info.md (características y amenidades clave).
    caracteristicas: [
      "Vistas a las montañas de Los Picachos",
      "Gran iluminación natural en dos niveles",
      "Cocina abierta y equipada",
      "Sala y comedor de generosas dimensiones",
      "Terraza con asador",
      "Jardín privado"
    ],
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
      "assets/propiedades/casa-granada/fotos/54.webp",
      "assets/propiedades/casa-granada/fotos/11.webp"
    ],
    maqueta: "assets/propiedades/casa-granada/maqueta",
        planos: [
      {
        nivel: "Planta baja",
        base: "assets/propiedades/casa-granada/planos/planta-baja",
        proporcion: 3.95,
        etiquetas: [
          { t: "Terraza pergolada", x: 91.8, y: 52.1, w: 14.5, xm: 52.1, ym: 8.2, wm: 30 },
          { t: "Jardín", x: 82, y: 43.6, w: 14.3, xm: 43.6, ym: 18, wm: 30 },
          { t: "Jardín", x: 68.8, y: 23.8, w: 23, xm: 23.8, ym: 31.2, wm: 30 },
          { t: "Estancia", x: 69.2, y: 69.5, w: 10.7, xm: 69.5, ym: 30.8, wm: 30 },
          { t: "Patio interior", x: 60.4, y: 77.7, w: 6.2, xm: 77.7, ym: 39.6, wm: 30 },
          { t: "Comedor", x: 50.9, y: 26.6, w: 11.9, xm: 26.6, ym: 49.1, wm: 30 },
          { t: "Cocina", x: 50.9, y: 71.6, w: 11.9, xm: 71.6, ym: 49.1, wm: 30 },
          { t: "Vestíbulo", x: 42.1, y: 47.7, w: 5.3, xm: 47.7, ym: 57.9, wm: 20.8 },
          { t: "Toilet", x: 40, y: 9.8, w: 3.3, xm: 9.8, ym: 60, wm: 12.9 },
          { t: "Recámara", x: 33, y: 72, w: 10, xm: 72, ym: 67, wm: 30 },
          { t: "Jardín", x: 26.8, y: 17.6, w: 21.9, xm: 17.6, ym: 73.2, wm: 29.3 },
          { t: "Baño / vestidor", x: 24.8, y: 64.1, w: 5.6, xm: 64.1, ym: 75.2, wm: 30 },
          { t: "Lavandería", x: 18.8, y: 72.3, w: 5.6, xm: 72.3, ym: 81.2, wm: 30 },
          { t: "Baño de servicio", x: 14, y: 80.5, w: 3.3, xm: 80.5, ym: 86, wm: 11.5, oculta: "m" },
          { t: "Recámara de servicio", x: 6.6, y: 85.9, w: 8.3, xm: 85.9, ym: 93.4, wm: 22.2 },
          { t: "Cochera", x: 2.2, y: 47.4, w: 6.9, xm: 47.4, ym: 97.8, wm: 30 }
        ]
      },
      {
        nivel: "Planta alta",
        base: "assets/propiedades/casa-granada/planos/planta-alta",
        proporcion: 3.95,
        etiquetas: [
          { t: "Recámara principal", x: 69.2, y: 69.8, w: 10.7, xm: 69.8, ym: 30.8, wm: 30 },
          { t: "Baño / vestidor principal", x: 49.1, y: 80.2, w: 8.3, xm: 80.2, ym: 50.9, wm: 30 },
          { t: "Recámara 2", x: 51, y: 23.8, w: 11.9, xm: 23.8, ym: 49, wm: 30 },
          { t: "Baño / vestidor 2", x: 41.3, y: 31.3, w: 5.8, xm: 31.3, ym: 58.7, wm: 26.5 },
          { t: "Baño / vestidor 3", x: 35.7, y: 73, w: 4.7, xm: 73, ym: 64.3, wm: 16.5, oculta: "m" },
          { t: "Recámara 3", x: 27, y: 70.5, w: 10, xm: 70.5, ym: 73, wm: 30 },
          { t: "Terraza", x: 18.9, y: 59.1, w: 5.8, xm: 59.1, ym: 81.1, wm: 26.5 },
          { t: "Azotea", x: 8.9, y: 85.5, w: 13.4, xm: 85.5, ym: 91.1, wm: 22.2 }
        ]
      }
    ],
    flujo: [
      { src: "assets/propiedades/casa-granada/fotos/01.webp", prop: "4:3", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/02.webp", prop: "3:4", alto: "b" },
      { src: "assets/propiedades/casa-granada/fotos/03.webp", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/casa-granada/fotos/04.webp", prop: "4:3", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/06.webp", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/casa-granada/fotos/07.webp", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/casa-granada/fotos/08.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/09.webp", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/casa-granada/fotos/10.webp", prop: "3:4", alto: "c" },
      { src: "assets/propiedades/casa-granada/fotos/11.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/12.webp", prop: "2:3", alto: "b" },
      { src: "assets/propiedades/casa-granada/fotos/13.webp", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/casa-granada/fotos/14.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/15.webp", prop: "3:4", alto: "b" },
      { src: "assets/propiedades/casa-granada/fotos/16.webp", prop: "3:4", alto: "c" },
      { src: "assets/propiedades/casa-granada/fotos/17.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/21.webp", prop: "3:4", alto: "b" },
      { src: "assets/propiedades/casa-granada/fotos/22.webp", prop: "3:4", alto: "c" },
      { src: "assets/propiedades/casa-granada/fotos/23.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/24.webp", prop: "3:4", alto: "b" },
      { src: "assets/propiedades/casa-granada/fotos/25.webp", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/casa-granada/fotos/26.webp", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/27.webp", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/casa-granada/fotos/28.webp", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/casa-granada/fotos/29.webp", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/30.webp", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/casa-granada/fotos/35.webp", prop: "3:4", alto: "c" },
      { src: "assets/propiedades/casa-granada/fotos/36.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/41.webp", prop: "3:4", alto: "b" },
      { src: "assets/propiedades/casa-granada/fotos/42.webp", prop: "3:4", alto: "c" },
      { src: "assets/propiedades/casa-granada/fotos/43.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/50.webp", prop: "3:4", alto: "b" },
      { src: "assets/propiedades/casa-granada/fotos/51.webp", prop: "3:4", alto: "c" },
      { src: "assets/propiedades/casa-granada/fotos/53.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-granada/fotos/54.webp", prop: "3:4", alto: "b" }
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
    niveles: 2,
    entorno: "malanquin",
    // Ficha técnica: tomadas de info.md (características y amenidades clave).
    caracteristicas: [
      "Vistas a las montañas de Los Picachos",
      "Despacho privado / biblioteca",
      "Patios interiores con luz y vegetación",
      "Techos altos de madera y acabados en piedra y cantera",
      "Estilo contemporáneo con detalles rústicos tradicionales",
      "Cocina equipada",
      "Sala y comedor con conexión visual al exterior"
    ],
    fotoTarjeta: "assets/propiedades/casa-olivos/fotos/01.webp",
    fotoTarjetaPos: "35% center",   // la fachada es horizontal: portón y cochera dentro de la tarjeta
    resumen: "Residencia en Club de Golf Malanquín con vistas a Los Picachos. Dos niveles con techos a doble altura de vigas, cantera, patio interior empedrado y cocina con isla.",
    heroImage: "assets/propiedades/casa-olivos/fotos/01.webp",
    gallery: [
      "assets/propiedades/casa-olivos/fotos/01.webp",
      "assets/propiedades/casa-olivos/fotos/02.webp",
      "assets/propiedades/casa-olivos/fotos/03.webp",
      "assets/propiedades/casa-olivos/fotos/04.webp",
      "assets/propiedades/casa-olivos/fotos/05.webp",
      "assets/propiedades/casa-olivos/fotos/06.webp",
      "assets/propiedades/casa-olivos/fotos/07.webp",
      "assets/propiedades/casa-olivos/fotos/08.webp",
      "assets/propiedades/casa-olivos/fotos/09.webp",
      "assets/propiedades/casa-olivos/fotos/10.webp"
    ],
    maqueta: "assets/propiedades/casa-olivos/maqueta",
    planos: [
      {
        nivel: "Planta baja",
        base: "assets/propiedades/casa-olivos/planos/planta-baja",
        proporcion: 3.444,
        etiquetas: [
          { t: "Recibidor", x: 27.1, y: 25.1, w: 10.7, xm: 25.1, ym: 72.9, wm: 30 },
          { t: "Cocina", x: 27, y: 77.8, w: 11, xm: 77.8, ym: 73, wm: 26.8 },
          { t: "Comedor", x: 41.1, y: 70.5, w: 17.2, xm: 70.5, ym: 58.9, wm: 30 },
          { t: "Sala", x: 53.5, y: 70.7, w: 15.4, xm: 70.7, ym: 46.5, wm: 30 },
          { t: "Lavado", x: 66, y: 82, w: 6.9, xm: 82, ym: 34, wm: 25.7 },
          { t: "Vestíbulo", x: 70.2, y: 51, w: 16.3, xm: 51, ym: 29.8, wm: 13.7, oculta: "m" },
          { t: "Recámara 01", x: 69.7, y: 22.7, w: 14.6, xm: 22.7, ym: 30.3, wm: 30 },
          { t: "Baño / vestidor", x: 81.7, y: 31.4, w: 4.7, xm: 31.4, ym: 18.3, wm: 22.6 },
          { t: "Jardín", x: 48.7, y: 26.9, w: 26.8, xm: 26.9, ym: 51.3, wm: 27.8 },
          { t: "Recámara principal", x: 92.6, y: 69.4, w: 12.8, xm: 69.4, ym: 7.4, wm: 30 },
          { t: "Baño / vestidor", x: 79.8, y: 78.1, w: 12.1, xm: 78.1, ym: 20.2, wm: 30 },
          { t: "Jardín", x: 93.4, y: 20.6, w: 11.4, xm: 20.6, ym: 6.6, wm: 30 },
          { t: "Garage", x: 10.1, y: 62.6, w: 15.9, xm: 62.6, ym: 89.9, wm: 30 },
          { t: "Baño", x: 22.1, y: 51, w: 6.1, xm: 51, ym: 77.9, wm: 13.7 }
        ]
      },
      {
        nivel: "Planta alta",
        base: "assets/propiedades/casa-olivos/planos/planta-alta",
        proporcion: 3.444,
        etiquetas: [
          { t: "Azotea", x: 46.3, y: 70, w: 0.8, xm: 70, ym: 53.7, wm: 30 },
          { t: "Azotea", x: 71.7, y: 25.3, w: 18.5, xm: 25.3, ym: 28.3, wm: 30 },
          { t: "Estudio / sala de t.v.", x: 25.3, y: 39.5, w: 12.7, xm: 39.5, ym: 74.7, wm: 30 }
        ]
      }
    ],
    flujo: [
      { src: "assets/propiedades/casa-olivos/fotos/01.webp", prop: "4:3", alto: "a" },
      { src: "assets/propiedades/casa-olivos/fotos/02.webp", prop: "4:3", alto: "b" },
      { src: "assets/propiedades/casa-olivos/fotos/03.webp", prop: "3:4", alto: "c" },
      { src: "assets/propiedades/casa-olivos/fotos/04.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-olivos/fotos/05.webp", prop: "3:4", alto: "b" },
      { src: "assets/propiedades/casa-olivos/fotos/06.webp", prop: "3:4", alto: "c" },
      { src: "assets/propiedades/casa-olivos/fotos/07.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-olivos/fotos/08.webp", prop: "3:4", alto: "b" },
      { src: "assets/propiedades/casa-olivos/fotos/09.webp", prop: "3:4", alto: "c" },
      { src: "assets/propiedades/casa-olivos/fotos/10.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-olivos/fotos/11.webp", prop: "4:3", alto: "b" },
      { src: "assets/propiedades/casa-olivos/fotos/12.webp", prop: "4:3", alto: "c" },
      { src: "assets/propiedades/casa-olivos/fotos/13.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-olivos/fotos/14.webp", prop: "3:4", alto: "b" },
      { src: "assets/propiedades/casa-olivos/fotos/15.webp", prop: "3:4", alto: "c" },
      { src: "assets/propiedades/casa-olivos/fotos/16.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-olivos/fotos/17.webp", prop: "3:4", alto: "b" },
      { src: "assets/propiedades/casa-olivos/fotos/18.webp", prop: "3:4", alto: "c" },
      { src: "assets/propiedades/casa-olivos/fotos/19.webp", prop: "3:4", alto: "a" },
      { src: "assets/propiedades/casa-olivos/fotos/20.webp", prop: "3:4", alto: "b" }
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


// ==========================================================================
// Entornos: el club o barrio donde está cada casa (campo `entorno` de la casa).
// Club de Golf Malanquín: datos verificados contra su sitio oficial y bases de
// golf (ver bóveda: "PRAETORA — Club de Golf Malanquín — Enclave").
// Diseñador del campo y año de fundación: las fuentes se contradicen. NO se publican.
// ==========================================================================
const ENTORNOS = {
  malanquin: {
    nombre: "Club de Golf Malanquín",
    ubicacion: "Km 3, carretera San Miguel de Allende – Celaya",
    // Video vertical del club (19 s); la ficha le pone encima la información (Luis, 27-oct).
    video: "assets/enclave/club-malanquin.mp4",
    poster: "assets/enclave/club-malanquin-poster.webp",
    cifras: [
      { valor: "18", etiqueta: "Hoyos" },
      { valor: "72", etiqueta: "Par" },
      { valor: "7,289", etiqueta: "Yardas" },
      { valor: "+50", etiqueta: "Años" }
    ],
    amenidades: [
      "Casa club con restaurante y bar",
      "Canchas de tenis de arcilla, pádel y pickleball",
      "Alberca semiolímpica climatizada",
      "Campo de fútbol"
    ]
  }
};

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
    caminando: "3 minutos a pie de la Parroquia y el Jardín Allende",
    roofNota: "Terraza con vistas a la Parroquia y a Las Monjas. Potencial adicional sujeto a las autorizaciones del INAH y municipales aplicables.",
    status: "Consultar",
    amenities: [],
    heroImage: "assets/propiedades/hotel/fotos/1.jpg",
    description: "Casona histórica del siglo XIX en el corazón de San Miguel de Allende, ubicada en la esquina de Umarán y Zacateros a tres minutos a pie de la Parroquia y el Jardín Allende. El activo combina la operación de un hotel boutique de 6 suites con alta calificación en hospitalidad, local comercial en planta baja arrendado a Birkenstock y terraza panorámica con vistas abiertas al centro virreinal.",
    flujo: [
      // Fotos del hotel tomadas de su página en Booking (2026-10-11), en el orden de Booking.
      { src: "assets/propiedades/hotel/fotos/1.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/2.jpg", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/3.jpg", prop: "2:3", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/4.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/5.jpg", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/6.jpg", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/7.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/8.jpg", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/9.jpg", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/10.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/11.jpg", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/12.jpg", prop: "2:3", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/13.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/14.jpg", prop: "2:3", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/15.jpg", prop: "2:3", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/16.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/17.jpg", prop: "2:3", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/18.jpg", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/19.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/20.jpg", prop: "2:3", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/21.jpg", prop: "2:3", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/22.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/23.jpg", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/24.jpg", prop: "2:3", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/25.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/26.jpg", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/27.jpg", prop: "2:3", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/28.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/29.jpg", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/30.jpg", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/31.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/32.jpg", prop: "2:3", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/33.jpg", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/34.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/35.jpg", prop: "2:3", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/36.jpg", prop: "2:3", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/37.jpg", prop: "3:2", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/38.jpg", prop: "2:3", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/39.jpg", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/40.jpg", prop: "2:3", alto: "a" },
      { src: "assets/propiedades/hotel/fotos/41.jpg", prop: "3:2", alto: "b" },
      { src: "assets/propiedades/hotel/fotos/42.jpg", prop: "3:2", alto: "c" },
      { src: "assets/propiedades/hotel/fotos/43.jpg", prop: "2:3", alto: "a" }
    ]
  }
];
