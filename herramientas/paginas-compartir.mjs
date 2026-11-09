// Escribe una página por casa (<slug>.html) a partir de propiedad.html y data.js, con su
// título, su descripción y su imagen para compartir (assets/compartir/<slug>.jpg).
//
// Por qué: WhatsApp, Facebook y Google leen las etiquetas del HTML sin ejecutar JavaScript.
// propiedad.html?id= se ve igual para todas las casas al compartirse; <slug>.html no.
// La ficha es la misma: app.js toma la casa de data-propiedad.
//
// Uso (en la raíz del repo):  node herramientas/paginas-compartir.mjs
// Se corre otra vez cuando cambia propiedad.html o cuando entra una casa nueva a data.js.
// La imagen de cada casa nueva se agrega a mano en assets/compartir/<slug>.jpg (1200 × 630).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const DOMINIO = 'https://praetora.mx';
const plantilla = readFileSync('propiedad.html', 'utf8');
const datos = new Function(readFileSync('data.js', 'utf8') +
  ';return [].concat(typeof LUXURY_PROPERTIES !== "undefined" ? LUXURY_PROPERTIES : [], typeof ACTIVOS_INVERSION !== "undefined" ? ACTIVOS_INVERSION : []);')();

const attr = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const miles = n => Number(n).toLocaleString('es-MX');

function descripcion(p) {
  // Sólo datos publicados: lo que la casa no trae no se escribe.
  const partes = [p.type];
  if (p.llaves) partes.push(p.llaves + ' suites');
  else if (p.bedrooms) partes.push(p.bedrooms + ' recámaras');
  if (p.bathrooms && !p.llaves) partes.push(p.bathrooms + ' baños');
  if (p.m2Construccion) partes.push(miles(p.m2Construccion) + ' m² de construcción');
  if (p.priceMXN != null) partes.push('$' + miles(p.priceMXN) + ' MXN');
  else if (p.precioEstado) partes.push('Precio ' + p.precioEstado.toLowerCase());
  return partes.filter(Boolean).join(' · ');
}

function cambiar(html, de, a) {
  if (!html.includes(de)) throw new Error('propiedad.html ya no trae: ' + de);
  return html.replace(de, a);
}

let hechas = 0;
for (const p of datos) {
  if (!p.slug) continue;
  const imagen = `assets/compartir/${p.slug}.jpg`;
  if (!existsSync(imagen)) console.warn(`ojo: falta ${imagen}; se usa la del catálogo`);
  const img = existsSync(imagen) ? imagen : 'assets/compartir/catalogo.jpg';
  const titulo = `${p.title} — ${p.subzone} | PRAETORA`;
  const desc = descripcion(p);
  const url = `${DOMINIO}/${p.slug}`;
  let h = plantilla.replace(/\r\n/g, '\n');
  h = cambiar(h, '<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- Página de ' + p.title + ': la escribe herramientas/paginas-compartir.mjs a partir de propiedad.html. No se edita a mano. -->');
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${attr(titulo)}</title>`);
  h = h.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${attr(desc)}">`);
  h = cambiar(h, '<meta name="robots" content="index, follow">', `<meta name="robots" content="index, follow">\n  <link rel="canonical" href="${url}">`);
  h = h.replace(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="website">\n  <meta property="og:url" content="${url}">`);
  h = h.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${attr(p.title + ' · ' + p.subzone)}">`);
  h = h.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${attr(desc)}">`);
  h = h.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${DOMINIO}/${img}">`);
  h = h.replace(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="${attr(p.title + ', ' + p.subzone)}">`);
  h = cambiar(h, '<body class="ficha-page">', `<body class="ficha-page" data-propiedad="${attr(p.id)}">`);
  writeFileSync(`${p.slug}.html`, h);
  console.log(`${p.slug}.html · ${desc}`);
  hechas++;
}
console.log(hechas + ' páginas');
