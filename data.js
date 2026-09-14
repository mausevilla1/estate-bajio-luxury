// ==========================================================================
// PRAETORA - High-Ticket Real Estate Dataset
// ==========================================================================

const LUXURY_PROPERTIES = [
  {
    id: "prop-1",
    title: "Villa Travertino & Olivos",
    zone: "San Miguel de Allende",
    subzone: "Centro Histórico / Atotonilco",
    priceMXN: 58500000,
    priceUSD: 3250000,
    type: "Hacienda Contemporánea",
    status: "Entrega Inmediata",
    isExclusive: true,
    m2Construccion: 1150,
    m2Terreno: 3800,
    bedrooms: 6,
    bathrooms: 8,
    garage: 6,
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85"
    ],
    floorplan: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    architect: "Legorreta + Taller de Autor",
    amenities: ["cava", "pool", "garden", "spa"],
    features: [
      "Muros en travertino romano y cantera artesanal",
      "Cava subterránea climatizada para 850 botellas",
      "Alberca infinita con calefacción solar e hidromasaje",
      "Huerto privado de olivos centenarios y viñedo boutique",
      "Sistema de domótica integral Lutron & Crestron",
      "Seguridad perimetral biométrica y blindaje acústico"
    ],
    projectedYield: "11.8% Anual (Renta Ultra-VIP)",
    description: "Una obra maestra de arquitectura atemporal donde la tradición virreinal de San Miguel de Allende se funde con el minimalismo cálido contemporáneo. Vistas panorámicas a los valles y atardeceres del Bajío."
  },
  {
    id: "prop-2",
    title: "Residencia Campestre Alabaster",
    zone: "Querétaro",
    subzone: "El Campanario Club de Golf",
    priceMXN: 72000000,
    priceUSD: 4000000,
    type: "Mansión de Autor",
    status: "Private Vault",
    isExclusive: true,
    m2Construccion: 1420,
    m2Terreno: 2100,
    bedrooms: 5,
    bathrooms: 7,
    garage: 8,
    heroImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=85"
    ],
    floorplan: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    architect: "Studio Sordo Madaleno Inspired",
    amenities: ["golf", "spa", "cava", "pool"],
    features: [
      "Frente directo al green del hoyo 14",
      "Mármol Fior di Bosco y duela de nogal europeo",
      "Doble altura en vestíbulo de 7.5 metros",
      "Spa privado con sauna, vapor y jacuzzi de piedra volcánica",
      "Cocina de autor Poliform con electrodomésticos Gaggenau",
      "Subestación eléctrica propia y planta de tratamiento"
    ],
    projectedYield: "14.2% Plusvalía Anual",
    description: "Ubicada en el enclave residencial más codiciado de Querétaro. Diseño de líneas puras, cancelería minimalista de piso a techo y privacidad absoluta protegida por vegetación madura."
  },
  {
    id: "prop-3",
    title: "The Sky Penthouse - Cumbres",
    zone: "Querétaro",
    subzone: "Juriquilla Santa Fe",
    priceMXN: 34500000,
    priceUSD: 1920000,
    type: "Sky Penthouse",
    status: "Preventa Fase 1",
    isExclusive: true,
    m2Construccion: 680,
    m2Terreno: 680,
    bedrooms: 4,
    bathrooms: 5.5,
    garage: 4,
    heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85"
    ],
    floorplan: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    architect: "Aesthetic Habitat QRO",
    amenities: ["helipad", "pool", "spa"],
    features: [
      "Rooftop privado de 220 m² con fogatero y plunge pool",
      "Elevador privado directo al departamento con control biométrico",
      "Vistas panorámicas 360° al valle de Juriquilla",
      "Master suite con doble vestidor boutique y chimenea de etanol",
      "Concierge residencial y helipuerto en torre"
    ],
    projectedYield: "18.5% ROI Plusvalía en Construcción",
    description: "El punto más alto de exclusividad en Juriquilla. Un santuario vertical diseñado para coleccionistas de experiencias y vistas infinitas."
  },
  {
    id: "prop-4",
    title: "Finca Los Encinos & Polo Club",
    zone: "Querétaro",
    subzone: "Balvanera / Corregidora",
    priceMXN: 89000000,
    priceUSD: 4950000,
    type: "Finca Ecuestre",
    status: "Private Vault",
    isExclusive: true,
    m2Construccion: 1650,
    m2Terreno: 12000,
    bedrooms: 7,
    bathrooms: 9,
    garage: 12,
    heroImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85"
    ],
    floorplan: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    architect: "Guanajuato Heritage & Modern Living",
    amenities: ["helipad", "golf", "cava", "pool", "garden"],
    features: [
      "Caballerizas de lujo con 8 boxes y picadero profesional",
      "Acceso directo al campo de golf y club ecuestre Balvanera",
      "Casa de huéspedes independiente de 300 m²",
      "Helipuerto certificado dentro del predio",
      "Lago artificial privado con terraza sobre el agua"
    ],
    projectedYield: "Preservación Patrimonial UHNWI",
    description: "Una finca ecuestre irrepetible en el Bajío. Espacio, nobleza arquitectónica y privacidad total a solo 15 minutos del centro financiero de Querétaro."
  },
  {
    id: "prop-5",
    title: "Villa Mirador del Bosque",
    zone: "León",
    subzone: "El Molino Residencial & Golf",
    priceMXN: 48000000,
    priceUSD: 2670000,
    type: "Mansión de Autor",
    status: "Entrega Inmediata",
    isExclusive: false,
    m2Construccion: 980,
    m2Terreno: 1600,
    bedrooms: 4,
    bathrooms: 6,
    garage: 6,
    heroImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85"
    ],
    floorplan: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    architect: "Vargas Arquitectos",
    amenities: ["golf", "pool", "spa", "garden"],
    features: [
      "Diseño en cantil con vista panorámica a la presa de El Palote",
      "Estructura en concreto aparente, acero y madera de teca",
      "Infinity pool volada con fondo de cristal templado",
      "Cinema room acústico para 12 personas en 4K Dolby Atmos"
    ],
    projectedYield: "12.5% Plusvalía Anual",
    description: "La cumbre del diseño arquitectónico en la zona más prestigiosa de León, Guanajuato. Armonía entre ingeniería audaz y lujo sereno."
  },
  {
    id: "prop-6",
    title: "Hacienda San Jerónimo & Viñedos",
    zone: "San Miguel de Allende",
    subzone: "Valle de los Senderos",
    priceMXN: 64000000,
    priceUSD: 3550000,
    type: "Hacienda Contemporánea",
    status: "Private Vault",
    isExclusive: true,
    m2Construccion: 1280,
    m2Terreno: 5200,
    bedrooms: 5,
    bathrooms: 7,
    garage: 8,
    heroImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85"
    ],
    floorplan: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    architect: "Taller Arquitectura Virreinal",
    amenities: ["cava", "pool", "garden", "spa"],
    features: [
      "Producción vinícola propia con 1,200 botellas anuales",
      "Patios interiores con fuentes de cantera y arcos coloniales",
      "Pabellón de meditación y temazcal contemporáneo",
      "Acabados en piedra caliza, madera de mezquite y herrería forjada a mano"
    ],
    projectedYield: "13.4% Plusvalía Anual",
    description: "Santuario de paz y elegancia colonial refinada a 12 minutos de la Parroquia de San Miguel Arcángel."
  },
  {
    id: "prop-7",
    title: "Casa Cantil Juriquilla Reserve",
    zone: "Querétaro",
    subzone: "Juriquilla Reserve",
    priceMXN: 39800000,
    priceUSD: 2210000,
    type: "Mansión de Autor",
    status: "Entrega Inmediata",
    isExclusive: false,
    m2Construccion: 850,
    m2Terreno: 1250,
    bedrooms: 4,
    bathrooms: 5.5,
    garage: 5,
    heroImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85"
    ],
    floorplan: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
    architect: "Studio QRO Minimal",
    amenities: ["pool", "spa", "garden"],
    features: [
      "Volumetría flotante sobre cañada natural protegida",
      "Paneles solares con batería Tesla Powerwall",
      "Espejo de agua perimetral y terraza de travertino",
      "Master suite con baño spa exterior y ducha de cielo abierto"
    ],
    projectedYield: "15.0% Plusvalía Estimada",
    description: "Vanguardia arquitectónica integrada con el paisaje semidesértico y cactáceas endémicas de Juriquilla."
  }
];

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
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      features: "Plunge Pool Privada, Doble Altura, Helipad Access"
    },
    {
      id: "lvl-residence",
      name: "Nivel Residencial: Signature Suites",
      unitsAvailable: 4,
      priceFrom: "$28,900,000 MXN",
      m2: "390 m² - 460 m²",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
      features: "Terrazas Voladas en Travertino, Cava Climatizada, Master Suite 120m²"
    },
    {
      id: "lvl-garden",
      name: "Nivel Jardín: Garden Villas",
      unitsAvailable: 3,
      priceFrom: "$24,900,000 MXN",
      m2: "480 m² + 250 m² Jardín Privado",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
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
