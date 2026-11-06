// PRAETORA · D3 «Una torre»: la torre como mapa de las cuatro piezas, videos, galería y formulario.
(() => {
const WHATSAPP = 'https://wa.me/525564738881';
const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hayGsap = typeof window.gsap !== 'undefined';

// ── Las torres: portada, tablero de compu y plano de ubicación del cel
document.querySelectorAll('svg[data-torre]').forEach(s => Torre.dibujar(s, s.dataset.torre));
// Con «reducir movimiento», los puntos del esquema de marketing no se dibujan y nada se mueve.
if (reducir) document.querySelectorAll('svg.mk .mk-punto').forEach(c => c.remove());
if (reducir) document.querySelectorAll('svg animateMotion').forEach(a => a.remove());
// La portada en tableta y cel encuadra la torre sin los nombres largos
const torreP = document.querySelector('.torre-portada');
const celP = matchMedia('(max-width: 900px)');
const encuadraP = () => torreP && torreP.setAttribute('viewBox', (celP.matches ? Torre.VB.cel : Torre.VB.portada).join(' '));
encuadraP(); celP.addEventListener('change', encuadraP);

// ── Cabecera: transparente sobre la película, blanca después
const cab = document.getElementById('cabecera');
const portada = document.getElementById('portada');
new IntersectionObserver(([e]) => cab.classList.toggle('solida', !e.isIntersecting), { rootMargin: '-200px 0px 0px 0px' }).observe(portada);

// ── La pieza activa enciende su zona y mueve la cámara
const NOMBRES = {
  '01': ['Película de lanzamiento', 'La llegada'],
  '02': ['Renders', 'La fachada'],
  '03': ['Maqueta 3D', 'Los pisos'],
  '04': ['Recorrido caminable', 'Una unidad'],
  'todas': ['Un solo modelo', 'Las cuatro piezas'],
  '': ['La torre', 'De la calle a la unidad']
};
const tablero = document.querySelector('.tablero');
const torreT = document.querySelector('.torre-tablero');
const torreM = document.querySelector('.torre-mini');
const mapaNum = document.querySelector('.mapa-num'), mapaNombre = document.querySelector('.mapa-nombre'), mapaLugar = document.querySelector('.mapa-lugar');
const enlaces = [...document.querySelectorAll('.altimetro a')];
let activa = null;
const activar = z => {
  if (z === activa) return;
  activa = z;
  [torreT, torreM, tablero].forEach(el => el && el.setAttribute('data-activa', z));
  enlaces.forEach(a => a.setAttribute('aria-current', a.dataset.z === z));
  const [n, l] = NOMBRES[z] || NOMBRES[''];
  if (mapaNum) { mapaNum.textContent = /^\d/.test(z) ? 'Pieza ' + z : 'Las cuatro piezas'; mapaNombre.textContent = n; mapaLugar.textContent = l; }
  if (torreT) {
    const vb = Torre.vista(z);
    if (hayGsap && !reducir) gsap.to(torreT, { attr: { viewBox: vb }, duration: 1.35, ease: 'power3.inOut', overwrite: true });
    else torreT.setAttribute('viewBox', vb);
  }
};
activar('');
const marcas = [document.querySelector('.piezas-cab'), ...document.querySelectorAll('.pieza, .cierre')];
const banda = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) activar(e.target.dataset.z || ''); });
}, { rootMargin: '-48% 0px -48% 0px' });
marcas.forEach(m => m && banda.observe(m));

// ── Entradas suaves de cada pieza (solo con movimiento)
if (hayGsap && !reducir && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.pieza').forEach(p => {
    const partes = p.querySelectorAll('.pieza-lugar, .pieza-nombre, .pieza-trabajo, .gancho, .medio, .bajada, .renglones li, .acciones');
    gsap.from(partes, { y: 28, autoAlpha: 0, duration: .9, ease: 'power3.out', stagger: .06, scrollTrigger: { trigger: p, start: 'top 78%', once: true } });
  });
  gsap.utils.toArray('.bloque').forEach((el, i) => {
    gsap.from(el, { y: 32, autoAlpha: 0, duration: .9, ease: 'power3.out', delay: (i % 4) * .08, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  // La retícula del tablero se desliza con la subida: la cámara sube por la torre.
  if (tablero) gsap.to('.tablero-in', { backgroundPositionY: '-220px', ease: 'none', scrollTrigger: { trigger: '.piezas-grid', start: 'top top', end: 'bottom bottom', scrub: true } });
}

// ── Videos: sin sonido, con botón de pausa y uno a la vez
const ICONO = {
  pausa: '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 1.5h2.2v11H3.5zM8.3 1.5h2.2v11H8.3z" fill="currentColor"/></svg>',
  play: '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 1.5 12 7l-8.5 5.5Z" fill="currentColor"/></svg>'
};
const videos = [...document.querySelectorAll('video')];
videos.forEach(v => {
  const b = v.id ? null : null;
  const boton = v.classList.contains('portada-video') ? document.querySelector('[data-pausa-de="portada-video"]') : v.parentElement.querySelector('.pausa');
  if (!boton) return;
  const pinta = () => { boton.innerHTML = v.paused ? ICONO.play : ICONO.pausa; boton.setAttribute('aria-label', v.paused ? 'Reproducir el video' : 'Pausar el video'); };
  v.addEventListener('play', pinta); v.addEventListener('pause', pinta); pinta();
  boton.addEventListener('click', () => {
    if (v.paused) { v.dataset.pausado = 'no'; v.play().catch(() => {}); }
    else { v.dataset.pausado = 'si'; v.pause(); }
  });
});
videos.forEach(v => v.addEventListener('play', () => videos.forEach(o => { if (o !== v && !o.paused) o.pause(); })));
const enVista = new Set();
const puedeCorrer = v => v.dataset.pausado === 'no' || (!reducir && v.dataset.pausado !== 'si');
const ojo = new IntersectionObserver(es => {
  let nuevo = null, mejor = -1;
  es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && e.intersectionRatio >= 0.4) {
      enVista.delete(v); enVista.add(v);
      const pts = e.intersectionRatio - e.boundingClientRect.top / 1e6;
      if (pts > mejor) { mejor = pts; nuevo = v; }
    } else { enVista.delete(v); if (!v.paused) v.pause(); }
  });
  const sigue = nuevo && puedeCorrer(nuevo) ? nuevo : videos.some(o => !o.paused) ? null : [...enVista].reverse().find(puedeCorrer);
  if (sigue && sigue.paused) { if (sigue.preload === 'none') sigue.preload = 'auto'; sigue.play().catch(() => {}); }
}, { threshold: 0.4 });
videos.filter(v => v.hasAttribute('data-auto')).forEach(v => ojo.observe(v));

// ── 02 · Galería de renders: abre con el clip de Casa Granada (Unreal); cuando el clip acaba, pasa sola a las fotos
(() => {
  const g = document.querySelector(".galeria");
  if (!g) return;
  const img = g.querySelector(".galeria-principal img"), vid = g.querySelector(".galeria-video");
  const pausa = g.querySelector(".galeria-principal .pausa"), pie = g.querySelector(".galeria-pie");
  const bs = [...g.querySelectorAll(".galeria-miniaturas button")];
  const FOTO_MS = 4500;
  let i = 0, reloj = null, visible = false;
  const programa = () => {
    clearTimeout(reloj);
    if (reducir || !visible || bs[i].dataset.tipo === "video") return;
    reloj = setTimeout(() => ir((i + 1) % bs.length), FOTO_MS);
  };
  const ir = n => {
    i = n; const b = bs[n];
    bs.forEach(o => o.setAttribute("aria-pressed", o === b));
    const esVideo = b.dataset.tipo === "video";
    const cambia = () => {
      if (esVideo) {
        img.hidden = true; vid.hidden = false; pausa.hidden = false;
        if (vid.getAttribute("src") !== b.dataset.video) { vid.poster = b.dataset.poster; vid.src = b.dataset.video; }
        vid.setAttribute("aria-label", b.dataset.alt);
        try { vid.currentTime = 0; } catch {}
        if (vid.dataset.pausado !== "si") { vid.preload = "auto"; vid.play().catch(() => {}); }
      } else {
        vid.pause(); vid.hidden = true; pausa.hidden = true; img.hidden = false;
        img.src = b.dataset.src; img.alt = b.dataset.alt;
      }
      pie.textContent = b.dataset.pie;
      img.style.opacity = 1; vid.style.opacity = 1;
      programa();
    };
    if (reducir) return cambia();
    img.style.opacity = 0; vid.style.opacity = 0;
    setTimeout(cambia, 260);
  };
  bs.forEach((b, n) => b.addEventListener("click", () => { if (n !== i) ir(n); }));
  vid.addEventListener("ended", () => { if (!reducir) ir((i + 1) % bs.length); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) programa(); else clearTimeout(reloj); }, { threshold: 0.3 }).observe(g);
})();

// ── En el cel, «Ver detalle» abre la bajada y los tres renglones
document.querySelectorAll('.ver-detalle').forEach(b => b.addEventListener('click', () => {
  const p = b.closest('.pieza'), abierta = p.classList.toggle('abierta');
  b.setAttribute('aria-expanded', abierta); b.textContent = abierta ? 'Ocultar detalle' : 'Ver detalle';
}));

// ── Portada: ir a una pieza o a un showroom demo
document.getElementById('ir').addEventListener('submit', e => {
  e.preventDefault();
  const v = document.getElementById('ir-a').value;
  if (!v) return;
  if (v.startsWith('#')) location.hash = v; else window.open(v, '_blank', 'noopener');
});

// ── «Cotizar esta pieza» la deja marcada en el formulario
document.querySelectorAll('[data-producto]').forEach(a => a.addEventListener('click', () => {
  document.querySelectorAll('#cotizar input[name="servicios"]').forEach(c => { if (c.value === a.dataset.producto) c.checked = true; });
}));

// ── Formulario: arma el mensaje y abre WhatsApp
document.getElementById('cotizar').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const val = k => (f.get(k) || '').toString().trim();
  const lista = k => f.getAll(k).join(', ');
  const lineas = ['Hola, conocí los servicios de PRAETORA para desarrolladoras e inmobiliarias. Me interesa cotizar la presentación de mi proyecto.'];
  [['Nombre', val('nombre')], ['Desarrollo', val('desarrollo')], ['Me interesa', lista('servicios')], ['Mensaje', val('mensaje')]]
    .forEach(([k, v]) => { if (v) lineas.push(k + ': ' + v); });
  window.open(WHATSAPP + '?text=' + encodeURIComponent(lineas.join('\n')), '_blank', 'noopener');
});
})();
