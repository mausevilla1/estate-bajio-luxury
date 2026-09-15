// ==========================================================================
// PRAETORA - Dataset del catálogo
// --------------------------------------------------------------------------
// 10 casas de León, Guanajuato capital y San Miguel de Allende.
//
// QUÉ ES REAL Y QUÉ NO — leer antes de tocar:
//   · REAL (verificado en anuncios vivos de icasas.mx, 14-sep-2026):
//     zone, subzone, priceMXN, m2Construccion, m2Terreno, bedrooms, bathrooms.
//   · COPY DE PRAETORA (redactado, no es dato del anuncio):
//     title, type, status, architect, description, features, y los pies del flujo.
//   · PENDIENTE DE DECISIÓN:
//     priceUSD está calculado a 18.00 MXN/USD (14-sep-2026). Es provisional:
//     o se fija un tipo de cambio con fecha visible en el sitio, o se quita el dato.
//   · m2Terreno: null en las 7 casas cuyo anuncio no lo publica. NO inventar.
//     Ojo: hoy app.js lo imprime directo en lookbook y comparador — necesita
//     guarda para que no aparezca "null m²".
//   · projectedYield: "Consultar" a propósito. No se le inventa un rendimiento
//     a una casa real.
//   · Las fotos son de banco libre (Unsplash), NO son las fotos del anuncio.
//     Son andamio: se reemplazan cuando lleguen las de la casa real.
//
// El campo `flujo` alimenta la ficha individual estilo MANNA.
// Si una casa no lo trae, la ficha lo arma sola con heroImage + gallery.
// ==========================================================================

const U = 'https://images.unsplash.com/photo-';
const Q = (w, h) => `?auto=format&fit=crop&w=${w}&h=${h}&q=85`;

const LUXURY_PROPERTIES = [
  {
    id: "prop-1",
    slug: "casa-pedregal",
    title: "Casa Pedregal",
    zone: "León",
    subzone: "Pedregal del Carmen",
    priceMXN: 55000000,
    priceUSD: 3055556,
    type: "Residencia de autor",
    status: "Disponible",
    isExclusive: true,
    m2Construccion: 1250,
    m2Terreno: 5206,
    bedrooms: 4,
    bathrooms: 6,
    garage: 4,
    heroImage: U + "1757361652977-218a1173e8d6" + Q(1600,900),
    gallery: [
      U + "1757361652977-218a1173e8d6" + Q(1600,900),
      U + "1773693826585-14752c377505" + Q(1600,900),
      U + "1776362355123-ca966d36e29c" + Q(1600,900)
    ],
    floorplan: null,
    architect: "Autoría por confirmar",
    amenities: ["garden", "pool"],
    features: [
      "1,250 m² de construcción sobre un terreno de 5,206 m²",
      "Planta de corte colonial con patios interiores",
      "Cuatro recámaras, seis baños",
      "Jardín maduro en más de media hectárea"
    ],
    projectedYield: "Consultar",
    description: "La casa más grande del catálogo. Pedregal del Carmen es de las pocas zonas de León donde un terreno de media hectárea sigue siendo posible dentro de la ciudad.",
    flujo: [
      { src: U + "1757361652977-218a1173e8d6" + Q(1600,1200), prop: "4:3", alto: "a", pie: "Fachada principal desde el acceso vehicular." },
      { src: U + "1788378736102-e4085ec5c557" + Q(1100,1650), prop: "2:3", alto: "c", pie: "Zaguán de madera hacia el primer patio." },
      { src: U + "1773693826585-14752c377505" + Q(1600,900), prop: "16:9", alto: "b", pie: "Arcada del patio central." },
      { src: U + "1776362355123-ca966d36e29c" + Q(1600,1067), prop: "3:2", alto: "b", pie: "Sala principal con doble altura y ventanal a jardín." },
      { src: U + "1682888813913-e13f18692019" + Q(1200,1600), prop: "3:4", alto: "a", pie: "Cocina con isla y acceso de servicio independiente." },
      { src: U + "1649083048770-82e8ffd80431" + Q(1100,1650), prop: "2:3", alto: "c", pie: "Estancia con chimenea." },
      { src: U + "1750420556288-d0e32a6f517b" + Q(1200,1600), prop: "3:4", alto: "c", pie: "Recámara principal, ala poniente." },
      { src: U + "1783125127100-89c21c31b6bb" + Q(1600,1067), prop: "3:2", alto: "b", pie: "Jardín posterior. 5,206 m² de terreno." },
      { src: U + "1702777526211-275242233c72" + Q(1600,900), prop: "16:9", alto: "a", pie: "La casa al anochecer." }
    ]
  },
  {
    id: "prop-2",
    slug: "casa-condominio-seis",
    title: "Casa Condominio Seis",
    zone: "León",
    subzone: "El Molino Residencial & Golf",
    priceMXN: 24900000,
    priceUSD: 1383333,
    type: "Residencia en condominio",
    status: "Disponible",
    isExclusive: true,
    m2Construccion: 648,
    m2Terreno: null,
    bedrooms: 4,
    bathrooms: 4,
    garage: 3,
    heroImage: U + "1706855203772-c249b75fe016" + Q(1600,900),
    gallery: [
      U + "1706855203772-c249b75fe016" + Q(1600,900),
      U + "1760067537524-a0c0703d9721" + Q(1600,900),
      U + "1783125127094-ea962d41ba42" + Q(1600,900)
    ],
    floorplan: null,
    architect: "Autoría por confirmar",
    amenities: ["golf", "pool"],
    features: [
      "648 m² de construcción en condominio cerrado",
      "Cuatro recámaras, cuatro baños",
      "Dentro de El Molino Residencial & Golf",
      "Avenida Paseo del Molino, Condominio 6"
    ],
    projectedYield: "Consultar",
    description: "El techo de precio de El Molino. En metros construidos no hay muchas casas por encima de ésta dentro del fraccionamiento.",
    flujo: [
      { src: U + "1706855203772-c249b75fe016" + Q(1600,1200), prop: "4:3", alto: "a", pie: "Fachada sobre Paseo del Molino." },
      { src: U + "1766848834878-8278605cb754" + Q(1600,1067), prop: "3:2", alto: "c", pie: "Acceso vehicular y cochera techada." },
      { src: U + "1760067537524-a0c0703d9721" + Q(1600,900), prop: "16:9", alto: "b", pie: "Sala de doble altura con lambrín de madera." },
      { src: U + "1592506119503-c0b18879bd5a" + Q(1200,1600), prop: "3:4", alto: "b", pie: "Cocina con isla central." },
      { src: U + "1724582586529-62622e50c0b3" + Q(1100,1650), prop: "2:3", alto: "a", pie: "Comedor, ventanal de piso a techo." },
      { src: U + "1765279333918-949ddcb655ba" + Q(1200,1600), prop: "3:4", alto: "c", pie: "Recámara principal." },
      { src: U + "1663811397207-418a92396ad5" + Q(1100,1650), prop: "2:3", alto: "c", pie: "Vestidor y baño principal." },
      { src: U + "1783125127094-ea962d41ba42" + Q(1600,900), prop: "16:9", alto: "b", pie: "Terraza posterior." },
      { src: U + "1711110065954-1c79c1dec505" + Q(1600,1067), prop: "3:2", alto: "a", pie: "El condominio desde el aire." }
    ]
  },
  {
    id: "prop-3",
    slug: "casa-hoyo-siete",
    title: "Casa Hoyo Siete",
    zone: "León",
    subzone: "El Bosque Country Club",
    priceMXN: 22300000,
    priceUSD: 1238889,
    type: "Residencia de golf",
    status: "Disponible",
    isExclusive: true,
    m2Construccion: 580,
    m2Terreno: null,
    bedrooms: 4,
    bathrooms: 5,
    garage: 3,
    heroImage: U + "1766603636700-e9d80473f40f" + Q(1600,900),
    gallery: [
      U + "1766603636700-e9d80473f40f" + Q(1600,900),
      U + "1763479142678-8e29f4edb538" + Q(1600,900),
      U + "1651376589881-0e5a7eb15ae4" + Q(1600,900)
    ],
    floorplan: null,
    architect: "Autoría por confirmar",
    amenities: ["golf", "pool", "spa"],
    features: [
      "580 m² de construcción colindante al campo de golf",
      "Frente al green del hoyo 7",
      "Cuatro recámaras, cinco baños",
      "Boulevard Country Club Gran Jardín"
    ],
    projectedYield: "Consultar",
    description: "Colinda con el green del hoyo 7. En El Bosque las casas que dan directo al campo se cuentan con los dedos y no rotan seguido.",
    flujo: [
      { src: U + "1766603636700-e9d80473f40f" + Q(1600,900), prop: "16:9", alto: "a", pie: "Fachada sobre el boulevard." },
      { src: U + "1783125127229-0850d689e014" + Q(1100,1650), prop: "2:3", alto: "c", pie: "Acceso peatonal." },
      { src: U + "1724582586458-a51791349977" + Q(1600,900), prop: "16:9", alto: "b", pie: "Sala con ventanal al campo." },
      { src: U + "1665507279644-67d8ed143a84" + Q(1100,1650), prop: "2:3", alto: "b", pie: "Cocina." },
      { src: U + "1765862835193-3c37388a409e" + Q(1200,1600), prop: "3:4", alto: "a", pie: "Recámara principal con vista al green." },
      { src: U + "1758448755969-8791367cf5c5" + Q(1100,1650), prop: "2:3", alto: "c", pie: "Baño principal." },
      { src: U + "1763479142678-8e29f4edb538" + Q(1200,1600), prop: "3:4", alto: "c", pie: "Terraza y comedor exterior sobre el hoyo 7." },
      { src: U + "1651376589881-0e5a7eb15ae4" + Q(1600,1067), prop: "3:2", alto: "b", pie: "Alberca." },
      { src: U + "1711110065992-6d6aff9ae35c" + Q(1600,900), prop: "16:9", alto: "a", pie: "El conjunto desde el aire." }
    ]
  },
  {
    id: "prop-4",
    slug: "casa-campina",
    title: "Casa Campiña",
    zone: "León",
    subzone: "La Campiña del Bosque",
    priceMXN: 11499000,
    priceUSD: 638833,
    type: "Residencia familiar",
    status: "Disponible",
    isExclusive: false,
    m2Construccion: 427,
    m2Terreno: 400,
    bedrooms: 4,
    bathrooms: 4,
    garage: 2,
    heroImage: U + "1766603636483-84b2a2b8ee89" + Q(1600,900),
    gallery: [
      U + "1766603636483-84b2a2b8ee89" + Q(1600,900),
      U + "1670360414483-64e6d9ba9038" + Q(1600,900),
      U + "1560185127-1902ccdc5094" + Q(1600,900)
    ],
    floorplan: null,
    architect: "Autoría por confirmar",
    amenities: ["garden", "golf"],
    features: [
      "427 m² de construcción sobre 400 m² de terreno",
      "Sala y comedor con doble altura",
      "Cocina con isla en granito",
      "Cuatro recámaras, cuatro baños"
    ],
    projectedYield: "Consultar",
    description: "La entrada al catálogo. Construye más metros de los que ocupa el terreno: todo el programa está resuelto en vertical.",
    flujo: [
      { src: U + "1766603636483-84b2a2b8ee89" + Q(1600,1200), prop: "4:3", alto: "a", pie: "Fachada." },
      { src: U + "1706808849780-7a04fbac83ef" + Q(1600,1067), prop: "3:2", alto: "c", pie: "Acceso." },
      { src: U + "1670360414483-64e6d9ba9038" + Q(1100,1650), prop: "2:3", alto: "b", pie: "Sala y comedor en doble altura." },
      { src: U + "1560185127-1902ccdc5094" + Q(1200,1600), prop: "3:4", alto: "b", pie: "Cocina con isla en granito." },
      { src: U + "1705321963943-de94bb3f0dd3" + Q(1100,1650), prop: "2:3", alto: "a", pie: "Estancia de televisión." },
      { src: U + "1766733041960-0de62f403e7b" + Q(1200,1600), prop: "3:4", alto: "c", pie: "Recámara principal." },
      { src: U + "1786051385612-5fac26efaf88" + Q(1600,1067), prop: "3:2", alto: "c", pie: "Patio posterior." },
      { src: U + "1706164971302-e30c0640cc3b" + Q(1600,900), prop: "16:9", alto: "b", pie: "Al caer la tarde." }
    ]
  },
  {
    id: "prop-5",
    slug: "casa-candelaria",
    title: "Casa Candelaria",
    zone: "San Miguel de Allende",
    subzone: "Fraccionamiento Candelaria, Centro",
    priceMXN: 31700000,
    priceUSD: 1761111,
    type: "Casa de centro histórico",
    status: "Disponible",
    isExclusive: true,
    m2Construccion: 552,
    m2Terreno: null,
    bedrooms: 4,
    bathrooms: 3,
    garage: 2,
    heroImage: U + "1780213269655-52e615f65011" + Q(1600,900),
    gallery: [
      U + "1780213269655-52e615f65011" + Q(1600,900),
      U + "1766902771541-04432cd21868" + Q(1600,900),
      U + "1780283507389-f4cb280df250" + Q(1600,900)
    ],
    floorplan: null,
    architect: "Autoría por confirmar",
    amenities: [],
    features: [
      "552 m² de construcción dentro del Centro",
      "Patio interior con fuente",
      "Cuatro recámaras, tres baños",
      "Fraccionamiento Candelaria"
    ],
    projectedYield: "Consultar",
    description: "Dentro del polígono del Centro de San Miguel. La superficie construida es lo raro aquí: 552 m² a esta distancia de la Parroquia casi no existen.",
    flujo: [
      { src: U + "1780213269655-52e615f65011" + Q(1600,900), prop: "16:9", alto: "a", pie: "Fachada sobre la calle." },
      { src: U + "1772047927594-4436be593f8e" + Q(1200,1600), prop: "3:4", alto: "a", pie: "Escalera de cantera al primer nivel." },
      { src: U + "1766902771541-04432cd21868" + Q(1600,1067), prop: "3:2", alto: "c", pie: "Patio interior con fuente." },
      { src: U + "1780283507389-f4cb280df250" + Q(1600,900), prop: "16:9", alto: "b", pie: "Arcada del patio." },
      { src: U + "1706140675031-1e0548986ad1" + Q(1600,1200), prop: "4:3", alto: "b", pie: "Sala." },
      { src: U + "1682888813795-192fca4a10d9" + Q(1200,1600), prop: "3:4", alto: "a", pie: "Cocina." },
      { src: U + "1642541070065-3912f347e7c6" + Q(1100,1650), prop: "2:3", alto: "c", pie: "Recámara principal." },
      { src: U + "1589296956373-b9fed26f6a3d" + Q(1600,900), prop: "16:9", alto: "c", pie: "Azotea y vista al poniente." }
    ]
  },
  {
    id: "prop-6",
    slug: "casa-la-palmita",
    title: "Casa La Palmita",
    zone: "San Miguel de Allende",
    subzone: "La Palmita",
    priceMXN: 24430000,
    priceUSD: 1357222,
    type: "Residencia de autor",
    status: "Disponible",
    isExclusive: true,
    m2Construccion: 487,
    m2Terreno: null,
    bedrooms: 4,
    bathrooms: 4,
    garage: 2,
    heroImage: U + "1780094653264-f5cd430fcd0d" + Q(1600,900),
    gallery: [
      U + "1780094653264-f5cd430fcd0d" + Q(1600,900),
      U + "1637649228998-6c78a67dfa6c" + Q(1600,900),
      U + "1766848834872-fa8158c94a5d" + Q(1600,900)
    ],
    floorplan: null,
    architect: "Autoría por confirmar",
    amenities: ["pool", "garden", "spa"],
    features: [
      "487 m² de construcción",
      "Cuatro recámaras, cuatro baños",
      "Alberca y terraza",
      "Colonia La Palmita"
    ],
    projectedYield: "Consultar",
    description: "La Palmita está lo bastante afuera del Centro para tener terreno y lo bastante adentro para llegar caminando a la Parroquia en veinte minutos.",
    flujo: [
      { src: U + "1780094653264-f5cd430fcd0d" + Q(1600,1067), prop: "3:2", alto: "b", pie: "Fachada de piedra." },
      { src: U + "1780283507375-e221d1877067" + Q(1600,900), prop: "16:9", alto: "a", pie: "Acceso." },
      { src: U + "1637649228998-6c78a67dfa6c" + Q(1600,1200), prop: "4:3", alto: "a", pie: "Sala con ventanal." },
      { src: U + "1613545564259-ede280773613" + Q(1200,1600), prop: "3:4", alto: "c", pie: "Cocina." },
      { src: U + "1653204095671-3ed81a4bc561" + Q(1100,1650), prop: "2:3", alto: "b", pie: "Recámara principal." },
      { src: U + "1678978866819-306ed8608e7f" + Q(1200,1600), prop: "3:4", alto: "b", pie: "Baño principal." },
      { src: U + "1651376589993-e0b37872f3e7" + Q(1600,1067), prop: "3:2", alto: "a", pie: "Terraza." },
      { src: U + "1766848834872-fa8158c94a5d" + Q(1600,900), prop: "16:9", alto: "c", pie: "Alberca y jardín." }
    ]
  },
  {
    id: "prop-7",
    slug: "casa-labradores",
    title: "Casa Labradores",
    zone: "San Miguel de Allende",
    subzone: "Rancho Los Labradores",
    priceMXN: 15400000,
    priceUSD: 855556,
    type: "Casa de campo",
    status: "Disponible",
    isExclusive: false,
    m2Construccion: 354,
    m2Terreno: null,
    bedrooms: 3,
    bathrooms: 2,
    garage: 2,
    heroImage: U + "1706808849802-8f876ade0d1f" + Q(1600,900),
    gallery: [
      U + "1706808849802-8f876ade0d1f" + Q(1600,900),
      U + "1723901831135-782c98d8d8e0" + Q(1600,900),
      U + "1679689453846-0c51cc7fee53" + Q(1600,900)
    ],
    floorplan: null,
    architect: "Autoría por confirmar",
    amenities: ["garden", "pool"],
    features: [
      "354 m² de construcción",
      "Tres recámaras, dos baños",
      "Dentro de Rancho Los Labradores",
      "Carretera Celaya – Dolores Hidalgo"
    ],
    projectedYield: "Consultar",
    description: "Rancho Los Labradores es club de campo antes que fraccionamiento. Se compra el entorno tanto como la casa.",
    flujo: [
      { src: U + "1706808849802-8f876ade0d1f" + Q(1600,1200), prop: "4:3", alto: "c", pie: "Fachada." },
      { src: U + "1706808849777-96e0d7be3bb7" + Q(1600,1067), prop: "3:2", alto: "b", pie: "Acceso." },
      { src: U + "1723901831135-782c98d8d8e0" + Q(1600,900), prop: "16:9", alto: "a", pie: "Sala." },
      { src: U + "1682888813789-c39fe30921e2" + Q(1200,1600), prop: "3:4", alto: "a", pie: "Cocina." },
      { src: U + "1644057501622-dfa7dd26dbfb" + Q(1100,1650), prop: "2:3", alto: "c", pie: "Recámara principal." },
      { src: U + "1780898259326-4ad741d812bc" + Q(1600,900), prop: "16:9", alto: "b", pie: "Jardín." },
      { src: U + "1679689453846-0c51cc7fee53" + Q(1100,1650), prop: "2:3", alto: "b", pie: "Alberca vista desde la estancia." }
    ]
  },
  {
    id: "prop-8",
    slug: "casa-los-fresnos",
    title: "Casa Los Fresnos",
    zone: "San Miguel de Allende",
    subzone: "Rancho Los Labradores",
    priceMXN: 12860000,
    priceUSD: 714444,
    type: "Casa de campo",
    status: "Disponible",
    isExclusive: false,
    m2Construccion: 449,
    m2Terreno: null,
    bedrooms: 4,
    bathrooms: 4,
    garage: 2,
    heroImage: U + "1706808849803-f61304e024ab" + Q(1600,900),
    gallery: [
      U + "1706808849803-f61304e024ab" + Q(1600,900),
      U + "1724582586580-8b52c02e99dd" + Q(1600,900),
      U + "1711110066231-cb235d6e117e" + Q(1600,900)
    ],
    floorplan: null,
    architect: "Autoría por confirmar",
    amenities: ["garden", "pool"],
    features: [
      "449 m² de construcción",
      "Cuatro recámaras, cuatro baños",
      "Dentro de Rancho Los Labradores",
      "Carretera Celaya – Dolores Hidalgo"
    ],
    projectedYield: "Consultar",
    description: "Casi cien metros más construidos que su vecina de este mismo catálogo, y dos millones y medio menos. La diferencia está en el estado de la casa, no en la ubicación.",
    flujo: [
      { src: U + "1706808849803-f61304e024ab" + Q(1600,1067), prop: "3:2", alto: "a", pie: "Fachada." },
      { src: U + "1706808849827-7366c098b317" + Q(1600,900), prop: "16:9", alto: "c", pie: "Acceso." },
      { src: U + "1724582586580-8b52c02e99dd" + Q(1600,900), prop: "16:9", alto: "c", pie: "Sala con puertas corredizas al jardín." },
      { src: U + "1665507279638-5b48073c637b" + Q(1100,1650), prop: "2:3", alto: "b", pie: "Cocina." },
      { src: U + "1635321349359-333da6bb6da9" + Q(1200,1600), prop: "3:4", alto: "a", pie: "Recámara principal." },
      { src: U + "1616594092403-fb65629b0a46" + Q(1100,1650), prop: "2:3", alto: "a", pie: "Segunda recámara." },
      { src: U + "1711110066231-cb235d6e117e" + Q(1600,900), prop: "16:9", alto: "c", pie: "El predio desde el aire." }
    ]
  },
  {
    id: "prop-9",
    slug: "casa-exhacienda",
    title: "Casa Exhacienda",
    zone: "Guanajuato",
    subzone: "Guanajuato Centro",
    priceMXN: 17500000,
    priceUSD: 972222,
    type: "Casa de centro histórico",
    status: "Disponible",
    isExclusive: true,
    m2Construccion: 590,
    m2Terreno: null,
    bedrooms: 3,
    bathrooms: 2,
    garage: 1,
    heroImage: U + "1780283507294-178aa6bceb67" + Q(1600,900),
    gallery: [
      U + "1780283507294-178aa6bceb67" + Q(1600,900),
      U + "1780283507288-a14a59a24844" + Q(1600,900),
      U + "1687075197041-91fba1013e1d" + Q(1600,900)
    ],
    floorplan: null,
    architect: "Autoría por confirmar",
    amenities: [],
    features: [
      "590 m² de construcción en el Centro de Guanajuato",
      "Tres recámaras, dos baños",
      "Inmueble de exhacienda",
      "A pie del centro histórico"
    ],
    projectedYield: "Consultar",
    description: "590 m² dentro del casco histórico de Guanajuato, donde el suelo se mide en callejones. Es la superficie, no el precio, lo que hace rara a esta casa.",
    flujo: [
      { src: U + "1780283507294-178aa6bceb67" + Q(1600,900), prop: "16:9", alto: "b", pie: "La casa vista desde el arco de acceso." },
      { src: U + "1780283507282-4563c6186427" + Q(1200,1600), prop: "3:4", alto: "b", pie: "Portón y vestíbulo." },
      { src: U + "1780283507288-a14a59a24844" + Q(1600,1067), prop: "3:2", alto: "a", pie: "Patio principal." },
      { src: U + "1687075197041-91fba1013e1d" + Q(1600,900), prop: "16:9", alto: "c", pie: "Sala." },
      { src: U + "1682888818620-94875adf5bb9" + Q(1100,1650), prop: "2:3", alto: "c", pie: "Cocina." },
      { src: U + "1663811397561-32239541a455" + Q(1200,1600), prop: "3:4", alto: "b", pie: "Recámara principal." },
      { src: U + "1780213269575-e5aab50ce786" + Q(1600,1067), prop: "3:2", alto: "a", pie: "El callejón de acceso." }
    ]
  },
  {
    id: "prop-10",
    slug: "casa-san-javier",
    title: "Casa San Javier",
    zone: "Guanajuato",
    subzone: "San Javier",
    priceMXN: 12000000,
    priceUSD: 666667,
    type: "Residencia familiar",
    status: "Disponible",
    isExclusive: false,
    m2Construccion: 271,
    m2Terreno: 566,
    bedrooms: 4,
    bathrooms: 2,
    garage: 2,
    heroImage: U + "1779996226569-0be0724735f5" + Q(1600,900),
    gallery: [
      U + "1779996226569-0be0724735f5" + Q(1600,900),
      U + "1676823547752-1d24e8597047" + Q(1600,900),
      U + "1783125127082-3fb6c1bccd72" + Q(1600,900)
    ],
    floorplan: null,
    architect: "Autoría por confirmar",
    amenities: ["garden"],
    features: [
      "271 m² de construcción sobre 566 m² de terreno",
      "Sala y comedor con chimenea",
      "Cocina integral",
      "Cuatro recámaras, dos baños"
    ],
    projectedYield: "Consultar",
    description: "San Javier es la zona alta de Guanajuato: la única parte de la ciudad donde una casa tiene jardín de verdad y sigue estando a diez minutos del Centro.",
    flujo: [
      { src: U + "1779996226569-0be0724735f5" + Q(1600,1200), prop: "4:3", alto: "a", pie: "Fachada." },
      { src: U + "1778166166366-26a67894fa9f" + Q(1600,1067), prop: "3:2", alto: "c", pie: "Acceso." },
      { src: U + "1676823547752-1d24e8597047" + Q(1200,1600), prop: "3:4", alto: "b", pie: "Sala y comedor con chimenea." },
      { src: U + "1759147960461-b74a7e9a75d4" + Q(1100,1650), prop: "2:3", alto: "b", pie: "Cocina integral." },
      { src: U + "1765434669956-afcd50058d69" + Q(1200,1600), prop: "3:4", alto: "a", pie: "Recámara principal." },
      { src: U + "1783125127082-3fb6c1bccd72" + Q(1600,1067), prop: "3:2", alto: "c", pie: "Jardín. 566 m² de terreno." },
      { src: U + "1638008313433-11ce583a90d2" + Q(1600,900), prop: "16:9", alto: "c", pie: "De noche." }
    ]
  }
];

// ==========================================================================
// Showcase de preventa — SIN TOCAR.
// Sigue siendo material ficticio. No se publica hasta que haya un desarrollo real.
// ==========================================================================
const PRESALE_SHOWCASE = {
  id: "presale-obsidian",
  title: "The Alabaster Sanctuary & Residences",
  zone: "Querétaro - Juriquilla Reserve",
  masterPlanTotalUnits: 28,
  soldPercentage: 65,
  startingPriceMXN: 24900000,
  startingPriceUSD: 1380000,
  completionDate: "Q4 2027",
  projectedROI: "26.8% en Fase 1",
  levels: [
    {
      id: "lvl-sky",
      name: "Nivel Sky: Penthouses Triplex",
      unitsAvailable: 2,
      priceFrom: "$38,500,000 MXN",
      m2: "580 m² - 720 m²",
      image: U + "1600596542815-ffad4c1539a9" + Q(1600,900),
      features: "Plunge Pool Privada, Doble Altura, Helipad Access"
    },
    {
      id: "lvl-residence",
      name: "Nivel Residencial: Signature Suites",
      unitsAvailable: 4,
      priceFrom: "$28,900,000 MXN",
      m2: "390 m² - 460 m²",
      image: U + "1600607687939-ce8a6c25118c" + Q(1600,900),
      features: "Terrazas Voladas en Travertino, Cava Climatizada, Master Suite 120m²"
    },
    {
      id: "lvl-garden",
      name: "Nivel Jardín: Garden Villas",
      unitsAvailable: 3,
      priceFrom: "$24,900,000 MXN",
      m2: "480 m² + 250 m² Jardín Privado",
      image: U + "1600585154340-be6161a56a0c" + Q(1600,900),
      features: "Acceso Directo al Valle, Alberca Privada, Firepit Lounge"
    }
  ],
  amenities: [
    { name: "Private Wellness Spa & Cryo Chamber", icon: "spa" },
    { name: "Helipuerto de Acceso Restringido", icon: "flight" },
    { name: "Cava Subterránea con Sommelier Residente", icon: "wine_bar" },
    { name: "Simulador de Golf TrackMan 4K", icon: "sports_golf" },
    { name: "Club de Arte y Salón de Fumadores", icon: "meeting_room" }
  ]
};
