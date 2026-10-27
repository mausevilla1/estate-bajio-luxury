// ==========================================================================
// PRAETORA - Application Engine & Interactive Physics
// ==========================================================================

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Recorridos 3D por casa (clave = slug de data.js). Mientras la URL esté vacía,
   el botón no aparece: nunca se muestra un botón que no lleve a ningún lado.
   Casa Córdoba: va la versión más reciente del recorrido en cuanto tenga URL pública. */
const RECORRIDOS_3D = {
  'casa-cordoba': 'https://recorridos.praetora.mx/?mode=appearance'
};
function urlRecorrido3D(p) {
  return (p && p.slug && RECORRIDOS_3D[p.slug]) || '';
}

/* La ficha de cada casa tiene su propia página (<slug>.html, la escribe
   herramientas/paginas-compartir.mjs), con su título, su texto y su imagen para
   compartir: WhatsApp y Google no ejecutan JavaScript, así que propiedad.html?id=
   se vería igual para todas. Sin slug, la ficha genérica. */
function urlFicha(p) {
  return p && p.slug ? p.slug + '.html' : 'propiedad.html?id=' + encodeURIComponent(p ? p.id : '');
}

/* Dato no publicado por el anuncio.
   Se muestra la raya, nunca "null" ni un cero inventado. */
function m2(v) {
  return (v === null || v === undefined || v === '') ? '—' : v + ' m²';
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  pintarVitrina();
  pintarCatalogoBloques();
});

/* --------------------------------------------------------------------------
   2. Header Sticky on Scroll
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   APARICIÓN AL HACER SCROLL
   Marca los bloques y los va revelando conforme entran a pantalla.
   Se activa solo si el navegador soporta IntersectionObserver: si no, el
   atributo data-anim nunca se pone y el CSS deja todo visible.
   ========================================================================== */
(function () {
  if (!('IntersectionObserver' in window)) return;

  var SELECTORES_BLOQUE = [
    '.section-header', '.section-tag', '.section-title', '.section-desc',
    '.b2b-feature-item', '.b2b-cta-box'
  ];

  function marcar(selectores, clase) {
    selectores.forEach(function (sel) {
      var nodos = document.querySelectorAll(sel);
      Array.prototype.forEach.call(nodos, function (el, i) {
        if (el.classList.contains('reveal')) return;
        el.classList.add(clase);
        // Escalonado suave entre hermanos: 60ms, con tope de 240ms para que
        // una cuadrícula larga no tarde una eternidad en aparecer completa.
        var retraso = Math.min(i, 4) * 60;
        if (retraso) el.style.setProperty('--reveal-delay', retraso + 'ms');
      });
    });
  }

  function iniciar() {
    marcar(SELECTORES_BLOQUE, 'reveal');
    document.documentElement.setAttribute('data-anim', 'on');

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        observador.unobserve(e.target);   // una sola vez: no reaparece al subir
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observador.observe(el);
    });

    // Red de seguridad: lo que ya está en pantalla al cargar se muestra de
    // inmediato, y si algo quedara sin observar, a los 3 s se revela solo.
    setTimeout(function () {
      document.querySelectorAll('.reveal').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-visible');
        }
      });
    }, 50);

    setTimeout(function () {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();


/* ==========================================================================
   INTERACTIVIDAD EDITORIAL SPACELAB: CURSOR DISCRETO Y MARCADORES "+" SCROLL
   ========================================================================== */
(function() {
  // 1. CURSOR DE FLECHA CON ARO (SPACELAB)
  function initDiscreteCursor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return;

    const cursorEl = document.createElement('div');
    cursorEl.className = 'custom-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');

    const arrowImg = document.createElement('img');
    arrowImg.src = 'cursor.svg';
    arrowImg.className = 'cursor-arrow';
    arrowImg.alt = '';

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';

    cursorEl.appendChild(arrowImg);
    cursorEl.appendChild(ring);
    document.body.appendChild(cursorEl);

    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let targetAngle = 0;
    let renderAngle = 0;
    let isNativeActive = false;
    let hasMoved = false;

    document.documentElement.classList.add('cursor-custom');

    function onMouseMove(e) {
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        cursorEl.style.display = 'block';
        prevMouseX = clientX;
        prevMouseY = clientY;
      } else {
        const dx = clientX - prevMouseX;
        const dy = clientY - prevMouseY;
        const dist = Math.hypot(dx, dy);

        if (dist >= 2) {
          targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;
          prevMouseX = clientX;
          prevMouseY = clientY;
        }
      }

      mouseX = clientX;
      mouseY = clientY;

      if (isNativeActive) {
        isNativeActive = false;
        document.documentElement.classList.add('cursor-custom');
        cursorEl.style.display = 'block';
      }

      const target = e.target;
      if (target && target.closest && target.closest('a, button, input, select, textarea')) {
        cursorEl.classList.add('is-hovering');
      } else {
        cursorEl.classList.remove('is-hovering');
      }
    }

    function renderCursor() {
      if (!isNativeActive && hasMoved) {
        let diff = targetAngle - renderAngle;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        renderAngle += diff * 0.15;

        cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        arrowImg.style.transform = `translate(-50%, -50%) rotate(${renderAngle}deg)`;
      }
      requestAnimationFrame(renderCursor);
    }

    // Salida de emergencia: Tecla Tab devuelve el cursor nativo y oculta el cursor personalizado
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        isNativeActive = true;
        document.documentElement.classList.remove('cursor-custom');
        cursorEl.style.display = 'none';
      }
    });

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    requestAnimationFrame(renderCursor);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDiscreteCursor();
    });
  } else {
    initDiscreteCursor();
  }
})();



/* ==========================================================================
   FICHA INDIVIDUAL — MOTOR DEL FLUJO (propiedad.html)
   --------------------------------------------------------------------------
   Escritorio: se lee en horizontal. Celular: en vertical. El DOM es el mismo;
   el cambio lo hace el CSS. Aquí sólo va lo que el CSS no puede: traducir la
   rueda del mouse, el progreso, el teclado y el deep link.
   ========================================================================== */
(function () {
  var cont, paneles;

  function esVertical() {
    return !window.matchMedia('(min-width: 1024px)').matches;
  }

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Si la casa no trae `flujo`, se arma solo con lo que haya. Así una
     propiedad nueva nunca deja la ficha en blanco. */
  function construirFlujo(p) {
    if (p.flujo && p.flujo.length) return p.flujo;
    var fotos = [];
    if (p.heroImage) fotos.push({ src: p.heroImage, prop: '16:9' });
    (p.gallery || []).forEach(function (g) {
      if (g !== p.heroImage) fotos.push({ src: g, prop: '16:9' });
    });
    return fotos;
  }

  /* Fila de dato: si el anuncio no lo publica, la fila NO se dibuja.
     No se rellena con cero ni con raya. Un valor largo va debajo de su
     etiqueta en vez de partirse alineado a la derecha. */
  function fila(etiqueta, valor) {
    if (valor === null || valor === undefined || valor === '') return '';
    var largo = String(valor).length > 40;
    return '<div class="ficha-dato' + (largo ? ' ficha-dato-largo' : '') + '">' +
      '<span class="ficha-dato-etiqueta">' + esc(etiqueta) + '</span>' +
      '<span class="ficha-dato-valor">' + esc(valor) + '</span>' +
      '</div>';
  }

  /* Cifra clave: el número a 24 px y su nombre debajo. Sin dato, no se dibuja. */
  function cifra(valor, etiqueta) {
    if (valor === null || valor === undefined || valor === '') return '';
    return '<div class="ficha-cifra">' +
      '<span class="ficha-cifra-valor">' + esc(valor) + '</span>' +
      '<span class="ficha-cifra-etiqueta">' + esc(etiqueta) + '</span>' +
      '</div>';
  }

  function m2(n) { return n ? n.toLocaleString('es-MX') + ' m²' : null; }
  function pesos(n) { return '$' + Number(n).toLocaleString('es-MX') + ' MXN'; }
  function lista(items) {
    return '<ul class="ficha-lista">' + items.map(function (t) {
      return '<li>' + esc(t) + '</li>';
    }).join('') + '</ul>';
  }

  function esActivoDeInversion(p) { return !!p.llaves || p.id === 'activo-1'; }

  /* FICHA TÉCNICA — lo que sigue a las fotos, en cinco paneles:
     1 ficha (nombre, precio y cifras) · 2 distribución · 3 la casa ·
     4 el entorno · 5 contacto. Un panel sin datos no se dibuja. */

  /* 1 · Ficha: nombre, un solo precio y las cifras clave. Aquí vive "Ver planos". */
  function panelFicha(p) {
    var esActivo = esActivoDeInversion(p);
    var precio = p.priceMXN != null ? pesos(p.priceMXN)
      : (p.precioEstado ? 'Precio ' + p.precioEstado.toLowerCase() : '');

    var cifras, filas, columnas;
    if (esActivo) {
      var siglo = /siglo\s+(\S+)/i.exec(p.anoConstruccion || '');
      cifras = cifra(m2(p.m2Construccion), 'Construcción') +
        cifra(m2(p.m2Terreno), 'Terreno') +
        cifra(p.llaves, 'Suites') +
        cifra(siglo ? siglo[1] : null, 'Siglo');
      columnas = 2;
      filas = fila('Tipología', p.type) +
        fila('Ubicación', p.subzone) +
        fila('Inquilino en planta baja', p.inquilino);
    } else {
      cifras = cifra(m2(p.m2Construccion), 'Construcción') +
        cifra(m2(p.m2Terreno), 'Terreno') +
        cifra(p.niveles, 'Niveles') +
        cifra(p.bedrooms, 'Recámaras') +
        cifra(p.bathrooms, 'Baños') +
        cifra(p.garage ? p.garage + ' autos' : null, 'Cochera');
      columnas = 3;
      filas = fila('Tipología', p.type) + fila('Estatus', p.status);
    }

    // Los planos van escondidos: este enlace los muestra junto a las fotos.
    var planosHtml = (p.planos && p.planos.length)
      ? '<button type="button" class="portada-enlace ficha-ver-planos" aria-expanded="false">Ver planos</button>'
      : '';

    // En la etiqueta sólo el barrio; la dirección completa va en su fila.
    var barrio = String(p.subzone || '').split(',')[0];
    return '<section class="ficha-panel ficha-panel-texto" id="ficha-info">' +
      '<span class="ficha-etiqueta">' + esc(p.zone) + ' · ' + esc(barrio) + '</span>' +
      '<h1 class="ficha-titulo" translate="no">' + esc(p.title) + '</h1>' +
      (precio ? '<div class="ficha-precio">' + esc(precio) + '</div>' : '') +
      '<div class="ficha-cifras" style="--cifras-col:' + columnas + '">' + cifras + '</div>' +
      '<div class="ficha-datos">' + filas + '</div>' +
      planosHtml +
      '</section>';
  }

  var PROPS = ['2:3', '3:4', '4:3', '3:2', '16:9', '9:16'];
  var ALTOS = ['a', 'b', 'c'];

  function panelFoto(f, i) {
    // Tres alturas y cinco proporciones, como la referencia. Si el dato no
    // trae forma, se le asigna una rotada para que no salgan todas iguales.
    var prop = PROPS.indexOf(f.prop) >= 0 ? f.prop : PROPS[i % PROPS.length];
    var alto = ALTOS.indexOf(f.alto) >= 0 ? f.alto : ALTOS[i % ALTOS.length];
    var medioHtml = '';
    if (f.tipo === 'video') {
      medioHtml = '<video src="' + esc(f.src) + '"' +
        (f.poster ? ' poster="' + esc(f.poster) + '"' : '') +
        ' controls preload="metadata" playsinline></video>';
    } else {
      medioHtml = '<img src="' + esc(f.src) + '" alt="" loading="lazy">';
    }
    return '<figure class="ficha-panel" data-prop="' + prop + '" data-alto="' + alto + '">' +
      '<div class="ficha-marco">' + medioHtml + '</div>' +
      '</figure>';
  }

  /* Plano minimal de una planta: dibujo de línea (SVG) y los nombres de los
     espacios encima, en la letra del sitio. Dos versiones del dibujo: acostado
     en escritorio (la fachada a la izquierda, se recorre como las fotos) y
     parado en celular. Cada etiqueta trae su posición en % para las dos. */
  function panelPlano(pl, p) {
    var locales = (pl.etiquetas || []).map(function (e) {
      // --w es el ancho libre del local: si el nombre no cabe, se parte en renglones.
      // oculta: "h" en escritorio, "m" en celular (el local es muy chico a ese tamaño).
      return '<span class="ficha-plano-local"' + (e.oculta ? ' data-oculta="' + esc(e.oculta) + '"' : '') +
        ' style="--x:' + e.x + '%;--y:' + e.y + '%;--w:' + e.w +
        '%;--xm:' + e.xm + '%;--ym:' + e.ym + '%;--wm:' + e.wm + '%">' + esc(e.t) + '</span>';
    }).join('');
    return '<figure class="ficha-panel ficha-plano" hidden style="--plano-prop:' + pl.proporcion + '">' +
      '<div class="ficha-plano-marco">' +
        '<picture>' +
          '<source media="(max-width: 1023px)" srcset="' + esc(pl.base) + '-v.svg">' +
          '<img src="' + esc(pl.base) + '-h.svg" alt="Plano de ' + esc(pl.nivel.toLowerCase()) + ' de ' + esc(p.title) + '" loading="lazy">' +
        '</picture>' +
        locales +
      '</div>' +
      '<figcaption class="ficha-plano-nivel">' + esc(pl.nivel) + '</figcaption>' +
      '</figure>';
  }

  /* 2 · Distribución: los espacios de cada planta, tomados de los planos.
     Se ordenan como se recorre una casa: acceso, áreas sociales, recámaras y
     baños, exteriores y servicio. Un nombre repetido (dos jardines) va una vez. */
  var GRUPOS_ESPACIO = [
    { re: /servicio|lavander|lavado|bodega|cochera|garage/i, orden: 4 },   // se revisa primero
    { re: /^(acceso|recibidor|vest[ií]bulo)/i, orden: 0 },
    { re: /^(estancia|sala|comedor|cocina|estudio)/i, orden: 1 },
    { re: /^(rec[aá]mara|ba[ñn]o|toilet)/i, orden: 2 },
    { re: /^(terraza|patio|jard[ií]n|azotea)/i, orden: 3 }
  ];

  // Orden dentro de cada grupo. Entrada: acceso, recibidor, vestíbulo. Social:
  // sala o estancia, comedor, cocina y al final el estudio. Privado: recámaras y
  // luego baños, la principal primero. Exteriores y servicio: como en el plano.
  function subOrden(t, grupo) {
    if (grupo === 0) return /^acceso/i.test(t) ? 0 : (/^recibidor/i.test(t) ? 1 : 2);
    if (grupo === 1) {
      if (/estudio|t\.?v\b/i.test(t)) return 3;
      return /^(estancia|sala)/i.test(t) ? 0 : (/^comedor/i.test(t) ? 1 : 2);
    }
    if (grupo === 2) {
      var tipo = /rec[aá]mara/i.test(t) ? 0 : (/ba[ñn]o/i.test(t) ? 1 : 2);
      var n = /principal/i.test(t) ? 0 : parseInt((t.match(/\d+/) || ['99'])[0], 10);
      return tipo * 1000 + n;
    }
    return 0;
  }

  function espaciosDe(pl) {
    var vistos = {};
    return (pl.etiquetas || []).map(function (e, i) {
      var t = e.t.replace(/\b0(\d)\b/, '$1');               // "Recámara 01" → "Recámara 1"
      var orden = 2.5;
      for (var k = 0; k < GRUPOS_ESPACIO.length; k++) {
        if (GRUPOS_ESPACIO[k].re.test(t)) { orden = GRUPOS_ESPACIO[k].orden; break; }
      }
      return { t: t, orden: orden, i: i };
    }).filter(function (e) {
      var clave = e.t.toLowerCase();
      if (vistos[clave]) return false;
      vistos[clave] = true;
      return true;
    }).sort(function (a, b) {
      return (a.orden - b.orden) ||
        (subOrden(a.t, a.orden) - subOrden(b.t, b.orden)) ||
        (a.i - b.i);
    }).map(function (e) { return e.t; });
  }

  function panelDistribucion(p) {
    if (!p.planos || !p.planos.length) return '';
    if (p.maqueta) return panelDistribucionMaqueta(p);
    return '<section class="ficha-panel ficha-panel-texto">' +
      '<span class="ficha-etiqueta">Distribución</span>' +
      p.planos.map(function (pl) {
        return '<div class="ficha-nivel">' +
          '<h2 class="ficha-subtitulo">' + esc(pl.nivel) + '</h2>' +
          lista(espaciosDe(pl)).replace('class="ficha-lista"', 'class="ficha-lista ficha-lista-doble"') +
          '</div>';
      }).join('') +
      '</section>';
  }

  /* 2 · Distribución con maqueta 3D, en lámina (p.maqueta: la carpeta de sus imágenes).
     Como la lámina de un arquitecto: a la izquierda la leyenda, el número y el
     nombre de cada espacio, una columna por planta; a la derecha la maqueta de una
     planta con el número de cada espacio encima, sin muebles o amueblada, y abajo
     la cartela con la casa y la planta. El cursor sobre un espacio (en la leyenda,
     en su número o en la maqueta) enciende ese cuarto.
     Imágenes: <carpeta>/<planta>-<vista>-<ancho>.webp. Máscaras, rejilla y centros
     de los cuartos: <carpeta>/cuartos.js. */
  var VISTAS_MAQUETA = [
    { clave: 'sin-muebles', nombre: 'Sin muebles' },
    { clave: 'amueblada', nombre: 'Amueblada' }
  ];

  function plantaDe(pl) { return String(pl.base || '').split('/').pop(); }

  // El nombre como lo escribe cuartos.js: minúsculas, sin acentos, "01" → "1".
  function claveEspacio(t) {
    return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\b0(\d)\b/g, '$1').replace(/\s+/g, ' ').trim();
  }

  function dosCifras(n) { return (n < 10 ? '0' : '') + n; }

  function panelDistribucionMaqueta(p) {
    // El número corre por todas las plantas, como en la leyenda de una lámina.
    var n = 0;
    var niveles = p.planos.map(function (pl, i) {
      var planta = esc(plantaDe(pl));
      return '<div class="ficha-nivel' + (i === 0 ? ' is-planta' : '') + '" data-planta="' + planta + '">' +
        '<h2 class="ficha-subtitulo">' + esc(pl.nivel) + '</h2>' +
        '<ol class="ficha-lista ficha-leyenda">' + espaciosDe(pl).map(function (t) {
          var num = dosCifras(++n);
          return '<li tabindex="0" data-planta="' + planta + '" data-clave="' + esc(claveEspacio(t)) + '" data-num="' + num + '">' +
            '<span class="ficha-leyenda-num" aria-hidden="true">' + num + '</span>' +
            '<span class="ficha-leyenda-nombre">' + esc(t) + '</span></li>';
        }).join('') + '</ol>' +
        '</div>';
    }).join('');

    var capas = p.planos.map(function (pl, i) {
      var raiz = p.maqueta + '/' + plantaDe(pl) + '-';
      return '<div class="ficha-maqueta-planta" data-planta="' + esc(plantaDe(pl)) + '"' + (i === 0 ? ' data-activa' : '') + '>' +
        VISTAS_MAQUETA.map(function (v, j) {
          return '<img class="ficha-maqueta-base" data-vista="' + v.clave + '"' + (j === 0 ? ' data-activa' : '') +
            ' src="' + esc(raiz + v.clave) + '-1600.webp" srcset="' + esc(raiz + v.clave) + '-1600.webp 1600w, ' +
            esc(raiz + v.clave) + '-2400.webp 2400w" sizes="(min-width: 1024px) 62vw, 100vw"' +
            ' alt="Maqueta de ' + esc(pl.nivel.toLowerCase()) + ' de ' + esc(p.title) + ', ' + v.nombre.toLowerCase() + '"' +
            ' loading="lazy" decoding="async">';
        }).join('') +
        '<img class="ficha-maqueta-foco" alt="" aria-hidden="true">' +
        '<img class="ficha-maqueta-foco" alt="" aria-hidden="true">' +
        '<div class="ficha-maqueta-marcas" aria-hidden="true"></div>' +
        '</div>';
    }).join('');

    function boton(dato, valor, texto, activo) {
      return '<button type="button" class="ficha-maqueta-boton" data-' + dato + '="' + esc(valor) + '" aria-pressed="' + activo + '">' + esc(texto) + '</button>';
    }
    var botonesPlanta = p.planos.length > 1
      ? '<div class="ficha-maqueta-grupo" role="group" aria-label="Planta">' +
          p.planos.map(function (pl, i) { return boton('planta', plantaDe(pl), pl.nivel, i === 0); }).join('') +
        '</div>'
      : '<div></div>';

    return '<section class="ficha-panel ficha-distribucion">' +
      '<div class="ficha-distribucion-texto">' +
        '<span class="ficha-etiqueta">Distribución</span>' +
        '<div class="ficha-distribucion-leyenda">' + niveles + '</div>' +
      '</div>' +
      '<figure class="ficha-maqueta">' +
        '<div class="ficha-maqueta-cabeza">' + botonesPlanta +
          '<div class="ficha-maqueta-grupo" role="group" aria-label="Mobiliario">' +
            VISTAS_MAQUETA.map(function (v, j) { return boton('vista', v.clave, v.nombre, j === 0); }).join('') +
          '</div>' +
        '</div>' +
        '<div class="ficha-maqueta-lienzo">' + capas +
          '<span class="ficha-maqueta-rotulo" aria-hidden="true"></span>' +
        '</div>' +
        '<figcaption class="ficha-maqueta-cartela">' +
          '<span><b translate="no">' + esc(p.title) + '</b> · <span class="ficha-maqueta-nivel">' + esc(p.planos[0].nivel) + '</span></span>' +
          '<span>Maqueta a partir de los planos · muebles ilustrativos</span>' +
        '</figcaption>' +
      '</figure>' +
      '</section>';
  }

  /* La lámina en marcha: planta y vista con fundido, el cuarto encendido y sus números.
     Encender = desvanecer la maqueta hacia el blanco y poner encima la misma imagen
     recortada con la máscara del cuarto. Dos capas de foco se turnan para que pasar de
     un cuarto a otro también sea un fundido. Las máscaras llegan en un <script> (y no
     por fetch) para que la ficha funcione abierta con doble clic. */
  function iniciarMaqueta(p) {
    var fig = cont.querySelector('.ficha-maqueta');
    if (!fig) return;
    var panel = fig.parentNode;
    var lienzo = fig.querySelector('.ficha-maqueta-lienzo');
    var rotulo = fig.querySelector('.ficha-maqueta-rotulo');
    var renglones = panel.querySelectorAll('li[data-clave]');
    var datos = null, rejillas = {};
    var planta = plantaDe(p.planos[0]), vista = VISTAS_MAQUETA[0].clave, encendido = null;

    window.MAQUETAS = window.MAQUETAS || {};
    var s = document.createElement('script');
    s.src = p.maqueta + '/cuartos.js';
    s.onload = function () { datos = window.MAQUETAS[p.maqueta] || null; ponerMarcas(); };
    document.head.appendChild(s);

    function capa(k) { return lienzo.querySelector('.ficha-maqueta-planta[data-planta="' + k + '"]'); }
    function cuartosDe(k) {
      var pl = datos && datos[k || planta];
      return (pl && pl[vista] && pl[vista].cuartos) || [];
    }
    function cuarto(clave) {
      var lista = cuartosDe();
      for (var i = 0; i < lista.length; i++) if (lista[i].clave === clave) return lista[i];
      return null;
    }

    // Rejilla corrida: "a12.30b5" = 12 celdas del cuarto 1, 30 vacías, 5 del 2…
    function rejilla() {
      var clave = planta + '|' + vista;
      if (rejillas[clave]) return rejillas[clave];
      var pl = datos && datos[planta], r = pl && pl[vista] && pl[vista].rejilla;
      if (!r) return null;
      var celdas = new Uint8Array(r.columnas * r.filas), i = 0;
      r.datos.split(',').forEach(function (fila) {
        fila.replace(/([.a-z])(\d*)/g, function (_, c, n) {
          var v = c === '.' ? 0 : c.charCodeAt(0) - 96;
          for (var k = n ? +n : 1; k > 0; k--) celdas[i++] = v;
          return '';
        });
      });
      return (rejillas[clave] = { columnas: r.columnas, filas: r.filas, celdas: celdas });
    }
    function cuartoEn(fx, fy) {
      var r = rejilla();
      if (!r || fx < 0 || fy < 0 || fx >= 1 || fy >= 1) return null;
      var v = r.celdas[Math.floor(fy * r.filas) * r.columnas + Math.floor(fx * r.columnas)];
      return v ? cuartosDe()[v - 1] : null;
    }

    // El renglón de la leyenda de un cuarto en una planta (sólo los de la lista se encienden).
    function renglon(clave, k) {
      for (var i = 0; i < renglones.length; i++) {
        if (renglones[i].getAttribute('data-clave') === clave && renglones[i].getAttribute('data-planta') === (k || planta)) return renglones[i];
      }
      return null;
    }

    /* Los números sobre la maqueta: uno por pieza visible de cada cuarto, en su centro.
       Si dos quedan encimados (baños chicos juntos), se separan lo justo. */
    function ponerMarcas() {
      if (!datos) return;
      var ancho = lienzo.clientWidth, alto = lienzo.clientHeight;
      if (!ancho || !alto) return;
      var d = window.matchMedia('(min-width: 1024px)').matches ? 18 : 16;   // diámetro + aire
      p.planos.forEach(function (pl) {
        var k = plantaDe(pl), caja = capa(k).querySelector('.ficha-maqueta-marcas'), marcas = [];
        cuartosDe(k).forEach(function (c) {
          var li = renglon(c.clave, k);
          if (!li) return;
          (c.centros || []).forEach(function (q) {
            marcas.push({ clave: c.clave, num: li.getAttribute('data-num'), x: q[0] / 100 * ancho, y: q[1] / 100 * alto });
          });
        });
        for (var vuelta = 0; vuelta < 40; vuelta++) {
          var movio = false;
          for (var i = 0; i < marcas.length; i++) {
            for (var j = i + 1; j < marcas.length; j++) {
              var a = marcas[i], b = marcas[j], dx = b.x - a.x, dy = b.y - a.y, dist = Math.sqrt(dx * dx + dy * dy);
              if (dist >= d) continue;
              if (dist < 0.01) { dx = 1; dy = 0; dist = 1; }
              var empuje = (d - dist) / 2;
              a.x -= dx / dist * empuje; a.y -= dy / dist * empuje;
              b.x += dx / dist * empuje; b.y += dy / dist * empuje;
              movio = true;
            }
          }
          if (!movio) break;
        }
        caja.innerHTML = marcas.map(function (m) {
          var x = Math.min(ancho - d / 2, Math.max(d / 2, m.x)), y = Math.min(alto - d / 2, Math.max(d / 2, m.y));
          return '<span class="ficha-maqueta-marca' + (encendido === m.clave && k === planta ? ' is-activo' : '') +
            '" data-clave="' + esc(m.clave) + '" style="left:' + (x / ancho * 100).toFixed(2) + '%;top:' +
            (y / alto * 100).toFixed(2) + '%">' + m.num + '</span>';
        }).join('');
      });
    }
    var esperaMarcas = null;
    window.addEventListener('resize', function () {
      clearTimeout(esperaMarcas);
      esperaMarcas = setTimeout(ponerMarcas, 150);
    });

    function encender(clave) {
      var c = clave ? cuarto(clave) : null;
      if (c && !renglon(clave)) c = null;             // sólo los espacios de la lista
      var nueva = c ? clave : null;
      if (nueva === encendido) return;
      encendido = nueva;
      var actual = capa(planta);
      var focos = actual.querySelectorAll('.ficha-maqueta-foco');
      var turno = actual.getAttribute('data-turno') === '1' ? 0 : 1;
      if (c) {
        var base = actual.querySelector('.ficha-maqueta-base[data-vista="' + vista + '"]');
        var foco = focos[turno];
        if (foco.getAttribute('srcset') !== base.getAttribute('srcset')) {
          foco.setAttribute('sizes', base.getAttribute('sizes'));
          foco.setAttribute('srcset', base.getAttribute('srcset'));
          foco.src = base.getAttribute('src');
        }
        foco.style.webkitMaskImage = foco.style.maskImage = 'url(' + c.mascara + ')';
        foco.setAttribute('data-activa', '');
        focos[1 - turno].removeAttribute('data-activa');
        actual.setAttribute('data-turno', String(turno));
      } else {
        Array.prototype.forEach.call(focos, function (f) { f.removeAttribute('data-activa'); });
      }
      fig.classList.toggle('is-foco', !!c);
      panel.classList.toggle('is-foco', !!c);
      Array.prototype.forEach.call(renglones, function (li) {
        li.classList.toggle('is-activo', !!nueva && li.getAttribute('data-clave') === nueva &&
          li.getAttribute('data-planta') === planta);
      });
      Array.prototype.forEach.call(lienzo.querySelectorAll('.ficha-maqueta-marca'), function (m) {
        m.classList.toggle('is-activo', !!nueva && m.getAttribute('data-clave') === nueva &&
          m.parentNode.parentNode.getAttribute('data-planta') === planta);
      });
    }

    function marcar(dato, valor) {
      Array.prototype.forEach.call(fig.querySelectorAll('.ficha-maqueta-boton[data-' + dato + ']'), function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-' + dato) === valor ? 'true' : 'false');
      });
    }

    function verPlanta(k) {
      if (k === planta || !capa(k)) return;
      encender(null);
      capa(planta).removeAttribute('data-activa');
      planta = k;
      capa(planta).setAttribute('data-activa', '');
      marcar('planta', k);
      Array.prototype.forEach.call(panel.querySelectorAll('.ficha-nivel'), function (n) {
        n.classList.toggle('is-planta', n.getAttribute('data-planta') === k);
      });
      var nivel = p.planos.filter(function (pl) { return plantaDe(pl) === k; })[0];
      fig.querySelector('.ficha-maqueta-nivel').textContent = nivel ? nivel.nivel : '';
    }

    function verVista(v) {
      if (v === vista) return;
      var antes = encendido;
      encender(null);
      vista = v;
      Array.prototype.forEach.call(lienzo.querySelectorAll('.ficha-maqueta-base'), function (img) {
        if (img.getAttribute('data-vista') === v) img.setAttribute('data-activa', '');
        else img.removeAttribute('data-activa');
      });
      marcar('vista', v);
      ponerMarcas();                                   // con muebles, el centro visible cambia un poco
      if (antes) encender(antes);
    }

    fig.querySelector('.ficha-maqueta-cabeza').addEventListener('click', function (e) {
      var b = e.target.closest('.ficha-maqueta-boton');
      if (!b) return;
      if (b.hasAttribute('data-planta')) verPlanta(b.getAttribute('data-planta'));
      else verVista(b.getAttribute('data-vista'));
    });

    // La leyenda: el cursor o el foco (teclado) enciende; con el dedo, un toque
    // enciende y otro apaga. Sólo el mouse cuenta para "pasar por encima": el
    // celular simula un mouseenter al tocar y apagaría lo que el toque prende.
    var puntero = 'mouse';
    panel.addEventListener('pointerdown', function (e) { puntero = e.pointerType; });
    Array.prototype.forEach.call(renglones, function (li) {
      // Al tocar, el foco llega antes que el clic y ya lo prende: el clic decide con
      // lo que había antes del toque.
      var estaba = false;
      function prender() { verPlanta(li.getAttribute('data-planta')); encender(li.getAttribute('data-clave')); }
      li.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') prender(); });
      li.addEventListener('pointerdown', function () { estaba = li.classList.contains('is-activo'); });
      li.addEventListener('focus', prender);
      li.addEventListener('blur', function () { encender(null); });
      li.addEventListener('click', function () {
        if (puntero !== 'mouse' && estaba) encender(null);
        else prender();
      });
    });
    Array.prototype.forEach.call(panel.querySelectorAll('.ficha-nivel'), function (n) {
      n.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') verPlanta(n.getAttribute('data-planta')); });
    });
    panel.querySelector('.ficha-distribucion-leyenda').addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse') encender(null);
    });
    // Si falta una imagen, el lienzo se queda en blanco (nunca el ícono roto).
    Array.prototype.forEach.call(lienzo.querySelectorAll('.ficha-maqueta-base'), function (img) {
      img.addEventListener('error', function () { img.style.visibility = 'hidden'; });
    });
    // Cuando cargan las imágenes, el lienzo ya tiene su tamaño: ahí van los números.
    var base0 = capa(planta).querySelector('.ficha-maqueta-base');
    if (base0.complete) ponerMarcas(); else base0.addEventListener('load', ponerMarcas);

    // La maqueta: el cuarto bajo el cursor (o el de su número), con número y nombre al lado.
    function apuntar(e) {
      var r = lienzo.getBoundingClientRect();
      var fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      var marca = e.target.closest && e.target.closest('.ficha-maqueta-marca');
      var clave = marca ? marca.getAttribute('data-clave') : null;
      if (!clave) { var c = cuartoEn(fx, fy); clave = c ? c.clave : null; }
      if (e.type === 'click' && puntero !== 'mouse' && clave && clave === encendido) clave = null;   // otro toque apaga
      encender(clave);
      var li = encendido && renglon(encendido);
      if (li) {
        rotulo.innerHTML = '<b>' + li.getAttribute('data-num') + '</b>' + esc(li.querySelector('.ficha-leyenda-nombre').textContent);
        rotulo.style.left = (fx * 100) + '%';
        rotulo.style.top = (Math.min(0.95, Math.max(0.05, fy)) * 100) + '%';
        rotulo.setAttribute('data-activa', '');
        rotulo.classList.toggle('a-la-izquierda', fx > 0.72);
      } else {
        rotulo.removeAttribute('data-activa');
      }
    }
    lienzo.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') apuntar(e); });
    lienzo.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse') return;
      encender(null);
      rotulo.removeAttribute('data-activa');
    });
    lienzo.addEventListener('click', apuntar);

    /* Escritorio: si el recorrido se detiene con la lámina un poco corrida, la página se
       acomoda sola, con suavidad, a la orilla (como se presenta). Sólo cuando quedó
       cerca: si la persona se va hacia otro panel, no se la regresa. */
    var esperaAcomodo = null, acomodando = false, reposo = null;   // reposo: dónde se detuvo la última vez
    function acomodar() {
      if (esVertical() || acomodando) return;
      var orilla = parseFloat(getComputedStyle(cont).paddingLeft) || 0;
      var delta = panel.getBoundingClientRect().left - orilla;
      var seAleja = reposo !== null && Math.abs(delta) > Math.abs(reposo);
      var limite = window.innerWidth * (seAleja ? 0.05 : 0.22);
      if (Math.abs(delta) < 2 || Math.abs(delta) > limite) { reposo = delta; return; }
      reposo = 0;
      acomodando = true;
      cont.scrollTo({
        left: cont.scrollLeft + delta,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
      setTimeout(function () { acomodando = false; }, 800);
    }
    cont.addEventListener('scroll', function () {
      if (acomodando) return;
      clearTimeout(esperaAcomodo);
      esperaAcomodo = setTimeout(acomodar, 300);
    }, { passive: true });
  }

  /* 3 · La casa: el texto y sus características. En un activo de inversión, las
     suites, la distancia a pie y las notas del propietario. */
  function panelCasa(p) {
    var esActivo = esActivoDeInversion(p);
    var caracteristicas = p.caracteristicas || [];
    var notas = '';
    if (esActivo) {
      caracteristicas = String(p.llavesDetalle || '').split(/\.\s*/).filter(Boolean);
      if (p.caminando) caracteristicas.push(p.caminando);
      if (p.roofNota) notas += '<p class="ficha-nota">' + esc(p.roofNota) + '</p>';
      notas += '<p class="ficha-nota">Superficies informadas por el propietario. Expediente y proyecciones bajo solicitud.</p>';
    }
    return '<section class="ficha-panel ficha-panel-texto">' +
      '<span class="ficha-etiqueta">' + (esActivo ? 'El inmueble' : 'La casa') + '</span>' +
      '<p class="ficha-parrafo">' + esc(p.description) + '</p>' +
      (caracteristicas.length
        ? '<h2 class="ficha-subtitulo">' + (esActivo ? 'Suites y ubicación' : 'Características') + '</h2>' +
          lista(caracteristicas)
        : '') +
      notas +
      '</section>';
  }

  /* 4 · El entorno: el club o barrio de la casa (ENTORNOS en data.js). */
  function panelEntorno(p) {
    var en = (p.entorno && typeof ENTORNOS !== 'undefined') ? ENTORNOS[p.entorno] : null;
    if (!en) return '';
    // Con video (Luis, 27-oct): la información del club va encima de su video vertical.
    // El video se carga y corre solo cuando está a la vista (iniciarVideoEntorno).
    if (en.video) {
      return '<section class="ficha-panel ficha-panel-texto ficha-entorno">' +
        '<span class="ficha-etiqueta">El entorno</span>' +
        '<figure class="ficha-entorno-video">' +
          '<video data-src="' + esc(en.video) + '"' + (en.poster ? ' poster="' + esc(en.poster) + '"' : '') +
            ' muted loop playsinline preload="none" aria-label="Video del ' + esc(en.nombre) + '"></video>' +
          '<figcaption class="ficha-entorno-texto">' +
            '<h2 class="ficha-nombre">' + esc(en.nombre) + '</h2>' +
            '<div class="ficha-cifras" style="--cifras-col:' + en.cifras.length + '">' +
              en.cifras.map(function (c) { return cifra(c.valor, c.etiqueta); }).join('') +
            '</div>' +
            lista(en.amenidades) +
            '<p class="ficha-nota">' + esc(en.ubicacion) + '</p>' +
          '</figcaption>' +
        '</figure>' +
        '</section>';
    }
    return '<section class="ficha-panel ficha-panel-texto">' +
      '<span class="ficha-etiqueta">El entorno</span>' +
      '<h2 class="ficha-nombre">' + esc(en.nombre) + '</h2>' +
      '<div class="ficha-cifras" style="--cifras-col:' + en.cifras.length + '">' +
        en.cifras.map(function (c) { return cifra(c.valor, c.etiqueta); }).join('') +
      '</div>' +
      lista(en.amenidades) +
      '<p class="ficha-nota">' + esc(en.ubicacion) + '</p>' +
      '</section>';
  }

  /* 5 · Contacto: la acción y el regreso. */
  function panelContacto(p) {
    var esActivo = esActivoDeInversion(p);
    var msg = encodeURIComponent(esActivo
      ? 'Deseo solicitar el expediente de inversión de ' + p.title + ' (' + p.subzone + ').'
      : 'Me interesa ' + p.title + ' (' + p.subzone + ').');
    var btnTexto = esActivo ? 'Solicitar expediente' : 'Consultar esta casa';
    // Casa Julieta ya no está en el catálogo: regresa a la página de Invertir.
    var volver = esActivo
      ? '<a class="ficha-volver" href="invertir.html">Volver a Invertir</a>'
      : '<a class="ficha-volver" href="catalogo.html">Volver al catálogo</a>';
    return '<section class="ficha-panel ficha-panel-texto ficha-panel-contacto">' +
      '<div class="ficha-acciones">' +
        '<a class="btn-gold" href="https://wa.me/524420000000?text=' + msg + '" target="_blank" rel="noopener">' + btnTexto + '</a>' +
        (urlRecorrido3D(p) ? '<a class="btn-gold" href="' + esc(urlRecorrido3D(p)) + '" target="_blank" rel="noopener">Recorrido 3D</a>' : '') +
        volver +
      '</div>' +
      '</section>';
  }

  function noEncontrada() {
    return '<section class="ficha-panel ficha-panel-texto">' +
      '<h1 class="ficha-titulo">No encontramos esa propiedad</h1>' +
      '<p class="ficha-parrafo">Puede que ya no esté disponible.</p>' +
      '<div class="ficha-acciones"><a class="btn-gold" href="catalogo.html">Ver el catálogo</a></div>' +
      '</section>';
  }

  /* Una URL rota cae al hueco a propósito, nunca al ícono de imagen rota. */
  function blindarFotos() {
    Array.prototype.forEach.call(cont.querySelectorAll('.ficha-marco img'), function (img) {
      img.addEventListener('error', function () {
        var marco = img.parentNode;
        if (marco) marco.classList.add('media-slot');
        img.remove();
      });
    });
  }

  /* Rueda vertical -> desplazamiento horizontal.
     COMPROBADO: Chrome NO hace esta traducción solo en un contenedor
     overflow-x. Sin este puente, con mouse de rueda el flujo no avanza.
     Se suelta en los bordes a propósito: un listener de rueda que nunca
     devuelve el control es lo que traba una página (lección de MaxiPanel). */
  function onRueda(e) {
    if (esVertical()) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;   // trackpad: ya es nativo
    var paso = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    var max = cont.scrollWidth - cont.clientWidth;
    var enBorde = (paso < 0 && cont.scrollLeft <= 0) ||
                  (paso > 0 && cont.scrollLeft >= max - 1);
    if (enBorde) return;
    e.preventDefault();
    cont.scrollLeft += paso;
  }

  function onTecla(e) {
    if (e.key === 'Escape') { window.location.href = 'catalogo.html'; return; }
    if (esVertical()) return;
    if (e.key === 'Home') { e.preventDefault(); cont.scrollLeft = 0; }
    if (e.key === 'End')  { e.preventDefault(); cont.scrollLeft = cont.scrollWidth; }
  }

  function observarPaneles() {
    if (!('IntersectionObserver' in window)) return;   // sin soporte: todo visible
    document.documentElement.setAttribute('data-anim-ficha', 'on');
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        obs.unobserve(en.target);
      });
    }, { root: esVertical() ? null : cont, threshold: 0.15 });

    Array.prototype.forEach.call(paneles, function (el) { obs.observe(el); });

    // Dos redes: lo que ya está en pantalla se revela de inmediato, y a los
    // 3 s se revela todo pase lo que pase.
    setTimeout(function () {
      Array.prototype.forEach.call(paneles, function (el) {
        var r = el.getBoundingClientRect();
        var enPantalla = esVertical()
          ? r.top < window.innerHeight
          : r.left < window.innerWidth;
        if (enPantalla) el.classList.add('is-visible');
      });
    }, 50);
    setTimeout(function () {
      Array.prototype.forEach.call(paneles, function (el) { el.classList.add('is-visible'); });
    }, 3000);
  }

  function iniciar() {
    cont = document.getElementById('ficha-flujo');
    if (!cont) return;                       // no es propiedad.html

    // La casa: la de ?id= o, en su página propia (<slug>.html), la de data-propiedad.
    var clave = new URLSearchParams(window.location.search).get('id') ||
      document.body.getAttribute('data-propiedad');
    var p = null;
    if (typeof LUXURY_PROPERTIES !== 'undefined') {
      p = LUXURY_PROPERTIES.find(function (x) { return x.id === clave || x.slug === clave; });
    }
    if (!p && typeof ACTIVOS_INVERSION !== 'undefined') {
      p = ACTIVOS_INVERSION.find(function (x) { return x.id === clave || x.slug === clave; });
    }

    // Sin `?id=` se muestra la primera casa, para que abrir propiedad.html
    // con doble clic sirva para revisar la ficha. Con `?id=` equivocado sí
    // se avisa: ahí hay un error de verdad.
    // (Provisional: cuando exista build.js cada casa tendrá su propia URL.)
    if (!clave && typeof LUXURY_PROPERTIES !== 'undefined') p = LUXURY_PROPERTIES[0];
    if (!p) { cont.innerHTML = noEncontrada(); return; }

    document.title = p.title + ' — ' + p.subzone + ' | PRAETORA';
    // Abierta como propiedad.html?id=, la barra pasa a la dirección propia de la casa:
    // así, si alguien copia el enlace, se comparte con su foto y su nombre.
    if (/^https?:$/.test(location.protocol) && p.slug && /\/propiedad(\.html)?$/.test(location.pathname)) {
      try {
        history.replaceState(null, '', p.slug + (/\.html$/.test(location.pathname) ? '.html' : '') + location.hash);
      } catch (e) { /* sin replaceState, se queda la dirección de siempre */ }
    }
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', p.description);

    var html = '';
    construirFlujo(p).forEach(function (f, i) { html += panelFoto(f, i); });
    (p.planos || []).forEach(function (pl) { html += panelPlano(pl, p); });
    html += panelFicha(p) + panelDistribucion(p) + panelCasa(p) + panelEntorno(p) + panelContacto(p);
    cont.innerHTML = html;

    paneles = cont.querySelectorAll('.ficha-panel');
    blindarFotos();
    observarPaneles();
    iniciarMaqueta(p);

    cont.addEventListener('wheel', onRueda, { passive: false });
    var aInfo = document.querySelector('.ficha-barra-info');
    if (aInfo) {
      aInfo.addEventListener('click', function (e) {
        var destino = document.getElementById('ficha-info');
        if (!destino) return;                       // sin destino, que siga el enlace
        e.preventDefault();
        var suave = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto' : 'smooth';
        if (esVertical()) {
          destino.scrollIntoView({ behavior: suave, block: 'start' });
        } else {
          cont.scrollTo({ left: cont.scrollWidth, behavior: suave });
        }
      });
    }

    // "Ver planos": muestra los planos (van entre las fotos y los datos) y lleva el
    // recorrido al primero. Otro clic los vuelve a esconder.
    var btnPlanos = cont.querySelector('.ficha-ver-planos');
    if (btnPlanos) {
      btnPlanos.addEventListener('click', function () {
        var planos = cont.querySelectorAll('.ficha-plano');
        var mostrar = btnPlanos.getAttribute('aria-expanded') !== 'true';
        Array.prototype.forEach.call(planos, function (el) { el.hidden = !mostrar; });
        btnPlanos.setAttribute('aria-expanded', mostrar ? 'true' : 'false');
        btnPlanos.textContent = mostrar ? 'Ocultar planos' : 'Ver planos';
        var suave = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto' : 'smooth';
        var destino = mostrar ? planos[0] : document.getElementById('ficha-info');
        if (esVertical()) {
          destino.scrollIntoView({ behavior: suave, block: 'start' });
        } else {
          cont.scrollTo({ left: destino.offsetLeft - parseFloat(getComputedStyle(cont).paddingLeft), behavior: suave });
        }
      });
    }

    document.addEventListener('keydown', onTecla);

    if (esVertical()) armarFichaVertical();
    iniciarVideoEntorno();

    // La pista «Ficha técnica →» de la barra se apaga cuando la ficha ya está a la vista.
    var marcar = function () { marcarEnInfo(); };
    cont.addEventListener('scroll', marcar, { passive: true });
    window.addEventListener('scroll', marcar, { passive: true });
    window.addEventListener('resize', marcar);
    marcarEnInfo();

    // Cruzar de compu a cel (o al revés) cambia el acomodo entero: se vuelve a armar.
    // Se espera medio segundo y se compara: un cambio de un instante (girar el cel,
    // una captura) no recarga la página.
    var mq = window.matchMedia('(min-width: 1024px)');
    var armadoVertical = esVertical();
    var espera = null;
    var cambio = function () {
      clearTimeout(espera);
      espera = setTimeout(function () {
        if (esVertical() !== armadoVertical) location.reload();
      }, 500);
    };
    if (mq.addEventListener) mq.addEventListener('change', cambio);
    else if (mq.addListener) mq.addListener(cambio);
  }

  /* El video del entorno baja y corre solo cuando se ve, y se pausa al salir.
     Con «reducir movimiento» queda quieto en su póster, con controles. */
  function iniciarVideoEntorno() {
    var v = cont.querySelector('.ficha-entorno-video video');
    if (!v) return;
    var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function cargar() {
      if (!v.getAttribute('src')) { v.src = v.getAttribute('data-src'); v.load(); }
    }
    if (quieto) { v.controls = true; v.preload = 'none'; cargar(); return; }
    if (!('IntersectionObserver' in window)) { cargar(); v.play().catch(function () {}); return; }
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { cargar(); v.play().catch(function () {}); }
        else if (v.getAttribute('src')) v.pause();
      });
    }, { threshold: 0.25 }).observe(v);
  }

  function marcarEnInfo() {
    var destino = document.getElementById('ficha-info');
    if (!destino) return;
    var r = destino.getBoundingClientRect();
    var enInfo = esVertical()
      ? r.top < window.innerHeight * 0.75 && r.bottom > 0
      : r.left < window.innerWidth * 0.7;
    document.body.classList.toggle('ficha-en-info', enInfo);
  }

  /* --------------------------------------------------------------------------
     Ficha en cel y tableta (Luis, 27-oct): las fotos arriba, en un carril que
     se desliza; abajo, la ficha técnica a la vista, y lo demás en tarjetas que
     también se deslizan hacia el lado (Ficha técnica · Planos · La casa ·
     El entorno · Contacto), con pestañas que siguen al dedo.
     -------------------------------------------------------------------------- */
  function armarFichaVertical() {
    var suave = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    var hijos = Array.prototype.slice.call(cont.children);
    var fotos = hijos.filter(function (e) { return e.matches('figure.ficha-panel:not(.ficha-plano)'); });
    var planos = hijos.filter(function (e) { return e.classList.contains('ficha-plano'); });
    var info = document.getElementById('ficha-info');
    var textos = hijos.filter(function (e) { return e.classList.contains('ficha-panel-texto') && e !== info; });
    if (!fotos.length || !info) return;

    function nuevo(tag, clase, attrs) {
      var el = document.createElement(tag);
      if (clase) el.className = clase;
      Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
      return el;
    }
    function nombreDe(panel) {
      if (panel.classList.contains('ficha-panel-contacto')) return 'Contacto';
      var etq = panel.querySelector('.ficha-etiqueta');
      var t = etq ? etq.textContent.trim() : '';
      return t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : 'Más';
    }

    document.body.classList.add('ficha-cel');

    // 1 · Las fotos: un carril a todo lo ancho, con su contador.
    var zonaFotos = nuevo('div', 'ficha-cel-fotos');
    var carril = nuevo('div', 'ficha-cel-carril', { 'aria-label': 'Fotos de la casa' });
    var cuenta = nuevo('div', 'ficha-cel-cuenta', { 'aria-hidden': 'true' });
    fotos.forEach(function (f) { carril.appendChild(f); });
    zonaFotos.appendChild(carril);
    zonaFotos.appendChild(cuenta);
    var dos = function (n) { return (n < 10 ? '0' : '') + n; };
    var pintarCuenta = function () {
      var n = Math.min(fotos.length, Math.round(carril.scrollLeft / Math.max(1, carril.clientWidth)) + 1);
      cuenta.textContent = dos(n) + ' / ' + dos(fotos.length);
    };
    carril.addEventListener('scroll', pintarCuenta, { passive: true });

    // 2 · Las tarjetas: la ficha técnica primero; los planos van con la distribución.
    var grupos = [{ nombre: 'Ficha técnica', paneles: [info] }];
    textos.forEach(function (t) {
      var g = { nombre: nombreDe(t), paneles: [t] };
      if (/distribuci/i.test(g.nombre)) {
        g.nombre = 'Planos';
        planos.forEach(function (pl) { pl.hidden = false; g.paneles.push(pl); });
        planos = [];
      }
      grupos.push(g);
    });
    if (planos.length) {
      planos.forEach(function (pl) { pl.hidden = false; });
      grupos.splice(1, 0, { nombre: 'Planos', paneles: planos });
    }

    var pestanas = nuevo('div', 'ficha-cel-pestanas', { role: 'tablist', 'aria-label': 'Información de la casa' });
    var pista = nuevo('p', 'ficha-cel-pista');
    pista.innerHTML = 'Deslice para ver más <span aria-hidden="true"></span>';
    var carrilInfo = nuevo('div', 'ficha-cel-info');
    var tarjetas = grupos.map(function (g, i) {
      var id = 'ficha-cel-tarjeta-' + i;
      var tarjeta = nuevo('section', 'ficha-cel-tarjeta', { id: id, role: 'tabpanel', 'aria-label': g.nombre });
      g.paneles.forEach(function (pn) { tarjeta.appendChild(pn); });
      var boton = nuevo('button', 'ficha-cel-pestana', { type: 'button', role: 'tab', 'aria-controls': id, 'aria-selected': i === 0 ? 'true' : 'false' });
      boton.textContent = g.nombre;
      boton.addEventListener('click', function () { irA(i); });
      pestanas.appendChild(boton);
      carrilInfo.appendChild(tarjeta);
      return tarjeta;
    });

    // Todo lo movido queda a la vista (el revelado por scroll no aplica en los carriles).
    Array.prototype.forEach.call(cont.querySelectorAll('.ficha-panel'), function (el) { el.classList.add('is-visible'); });

    cont.innerHTML = '';
    cont.appendChild(zonaFotos);
    cont.appendChild(pestanas);
    cont.appendChild(pista);
    cont.appendChild(carrilInfo);
    pintarCuenta();

    // El carril de tarjetas toma el alto de la tarjeta que se ve: sin huecos debajo.
    var activa = 0;
    function ajustarAlto() {
      var t = tarjetas[activa];
      if (t) carrilInfo.style.height = t.scrollHeight + 'px';
    }
    function marcarPestana(i) {
      if (i === activa) return;
      activa = i;
      Array.prototype.forEach.call(pestanas.children, function (b, j) {
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
      });
      var b = pestanas.children[i];
      if (b && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: suave });
      if (i > 0) pista.classList.add('is-vista');
      ajustarAlto();
    }
    function irA(i) {
      carrilInfo.scrollTo({ left: tarjetas[i].offsetLeft, behavior: suave });
      marcarPestana(i);
    }
    carrilInfo.addEventListener('scroll', function () {
      var i = Math.round(carrilInfo.scrollLeft / Math.max(1, carrilInfo.clientWidth));
      marcarPestana(Math.max(0, Math.min(tarjetas.length - 1, i)));
    }, { passive: true });
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(ajustarAlto);
      tarjetas.forEach(function (t) { ro.observe(t); });
    }
    window.addEventListener('load', ajustarAlto);
    ajustarAlto();

    // «Ver planos» lleva a su tarjeta (aquí los planos ya están a la vista).
    var verPlanos = info.querySelector('.ficha-ver-planos');
    if (verPlanos) {
      var otro = verPlanos.cloneNode(true);
      otro.textContent = 'Ver planos';
      otro.removeAttribute('aria-expanded');
      verPlanos.parentNode.replaceChild(otro, verPlanos);
      var iPlanos = grupos.map(function (g) { return g.nombre; }).indexOf('Planos');
      if (iPlanos > 0) otro.addEventListener('click', function () { irA(iPlanos); });
      else otro.remove();
    }

    // INFO, en el cel, baja a la ficha técnica.
    var aInfo = document.querySelector('.ficha-barra-info');
    if (aInfo) {
      aInfo.addEventListener('click', function () { irA(0); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();


/* ==========================================================================
   PORTADA — VITRINA DE PROPIEDADES DESTACADAS (index.html)
   --------------------------------------------------------------------------
   3 tarjetas verticales (4:5) ordenadas por priceMXN descendente.
   ========================================================================== */
// Precio completo en pesos, como en la ficha: $24,400,000 MXN.
function precioMXN(n) { return '$' + Number(n).toLocaleString('es-MX') + ' MXN'; }

function pintarVitrina() {
  var grid = document.getElementById('portada-vitrina-grid');
  if (!grid) return;
  if (typeof LUXURY_PROPERTIES === 'undefined' || !Array.isArray(LUXURY_PROPERTIES)) return;

  var propiedades = LUXURY_PROPERTIES.slice().sort(function (a, b) {
    var pA = a.priceMXN != null ? a.priceMXN : -Infinity;
    var pB = b.priceMXN != null ? b.priceMXN : -Infinity;
    return pB - pA;
  });

  // La tarjeta lleva nombre, precio y cifras (Luis, 27-oct: «las casas sí con su precio»).
  grid.innerHTML = propiedades.map(function (p) {
    var foto = p.fotoTarjeta || p.heroImage || '';
    var estiloPos = p.fotoTarjetaPos ? ' style="object-position: ' + esc(p.fotoTarjetaPos) + ';"' : '';

    return '<a class="portada-vitrina-tarjeta" href="' + esc(urlFicha(p)) + '">' +
      '<div class="portada-vitrina-foto">' +
        '<img src="' + esc(foto) + '" alt="' + esc(p.title) + '" loading="lazy"' + estiloPos + '>' +
      '</div>' +
      '<h3 class="portada-vitrina-nombre" translate="no">' + esc(p.title) + '</h3>' +
      (p.priceMXN != null ? '<p class="v1-precio">' + precioMXN(p.priceMXN) + '</p>' : '') +
      '<p class="v1-cifras">' + [p.bedrooms != null ? p.bedrooms + ' rec.' : '', p.bathrooms != null ? p.bathrooms + ' baños' : '', p.m2Construccion ? p.m2Construccion + ' m²' : ''].filter(Boolean).join(' · ') + '</p>' +
    '</a>';
  }).join('');
}

/* ==========================================================================
   BLOQUE DE PROPIEDAD GENERALIZADO (Reutilizable en Catálogo y Portada)
   --------------------------------------------------------------------------
   Renderiza un bloque editorial asimétrico (1fr 2fr) para una propiedad.
   Columna izquierda: Tipo, Título, Ubicación con SVG pin, Resumen, Métricas y CTA.
   Columna derecha: Foto 16:9 y cuadrícula de miniaturas 3:2 (hasta 4).
   ========================================================================== */
function renderPropiedadBloque(prop) {
  if (!prop) return '';

  function datoItem(rotulo, valor) {
    if (valor === null || valor === undefined || valor === '') return '';
    return '<div class="propiedad-bloque-dato">' +
      '<div class="propiedad-bloque-numero">' + esc(valor) + '</div>' +
      '<div class="propiedad-bloque-rotulo">' + esc(rotulo) + '</div>' +
      '</div>';
  }

  function formatoM2(val) {
    if (val === null || val === undefined || val === '') return null;
    var num = Number(val);
    if (isNaN(num)) return val + ' m²';
    return (num >= 1000 ? num.toLocaleString('es-MX') : num) + ' m²';
  }

  var datosHtml = '';
  datosHtml += datoItem('Recámaras', prop.bedrooms != null && prop.bedrooms !== '' ? String(prop.bedrooms) : null);
  datosHtml += datoItem('Baños', prop.bathrooms != null && prop.bathrooms !== '' ? String(prop.bathrooms) : null);
  datosHtml += datoItem('Construcción', formatoM2(prop.m2Construccion));
  datosHtml += datoItem('Terreno', formatoM2(prop.m2Terreno));

  var miniaturas = [];
  if (Array.isArray(prop.gallery)) {
    for (var j = 0; j < prop.gallery.length; j++) {
      var foto = prop.gallery[j];
      if (foto && foto !== prop.heroImage) {
        miniaturas.push(foto);
        if (miniaturas.length === 4) break;
      }
    }
  }

  var miniaturasHtml = '';
  if (miniaturas.length > 0) {
    miniaturasHtml = '<div class="propiedad-bloque-miniaturas">' +
      miniaturas.map(function (m, idx) {
        return '<a href="' + esc(urlFicha(prop)) + '" class="propiedad-bloque-miniatura" aria-label="Ver foto ' + (idx + 1) + ' de ' + esc(prop.title) + '">' +
          '<img src="' + esc(m) + '" alt="' + esc(prop.title) + ' - Vista ' + (idx + 1) + '" loading="lazy">' +
        '</a>';
      }).join('') +
    '</div>';
  }

  var pinSvg = '<svg class="propiedad-bloque-pin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';

  var ubicacionTexto = (prop.subzone ? prop.subzone + ', ' : '') + (prop.zone || '');
  var etiqueta = prop.type || 'Residencia';

  return '<article class="propiedad-bloque" id="propiedad-' + esc(prop.id) + '">' +
    '<div class="propiedad-bloque-interior">' +
      '<div class="propiedad-bloque-grid">' +
        '<div class="propiedad-bloque-info">' +
          '<span class="propiedad-bloque-tag">' + esc(etiqueta) + '</span>' +
          '<h2 class="propiedad-bloque-titulo" translate="no">' + esc(prop.title) + '</h2>' +
          (prop.priceMXN != null ? '<p class="v1-precio v1-precio-bloque">' + precioMXN(prop.priceMXN) + '</p>' : '') +
          '<div class="propiedad-bloque-ubicacion">' +
            pinSvg +
            '<span>' + esc(ubicacionTexto) + '</span>' +
          '</div>' +
          (prop.resumen ? '<p class="propiedad-bloque-parrafo">' + esc(prop.resumen) + '</p>' : '') +
          (datosHtml ? '<div class="propiedad-bloque-datos">' + datosHtml + '</div>' : '') +
          '<div class="propiedad-bloque-accion">' +
            '<a href="' + esc(urlFicha(prop)) + '" class="portada-enlace">Ver propiedad</a>' +
            (urlRecorrido3D(prop) ? '<a href="' + esc(urlRecorrido3D(prop)) + '" class="portada-enlace" target="_blank" rel="noopener">Recorrido 3D</a>' : '') +
          '</div>' +
        '</div>' +
        '<div class="propiedad-bloque-visual">' +
          '<a href="' + esc(urlFicha(prop)) + '" class="propiedad-bloque-foto-principal" aria-label="Ver ' + esc(prop.title) + '">' +
            '<img src="' + esc(prop.heroImage) + '" alt="' + esc(prop.title) + '" loading="lazy">' +
          '</a>' +
          miniaturasHtml +
        '</div>' +
      '</div>' +
    '</div>' +
  '</article>';
}

function pintarPropiedadBloque(prop, contenedor) {
  var target = typeof contenedor === 'string' ? document.getElementById(contenedor) : contenedor;
  if (!target) return;
  target.innerHTML = renderPropiedadBloque(prop);
}

/* ==========================================================================
   CATÁLOGO — RECORRIDO DE PROPIEDADES POR BLOQUES (catalogo.html)
   --------------------------------------------------------------------------
   Dibuja cada residencia de LUXURY_PROPERTIES ordenada por priceMXN descendente
   usando el bloque editorial generalizado renderPropiedadBloque().
   ========================================================================== */
function pintarCatalogoBloques() {
  var contenedor = document.getElementById('catalogo-casas-grid');
  if (!contenedor) return;
  if (typeof LUXURY_PROPERTIES === 'undefined' || !Array.isArray(LUXURY_PROPERTIES)) return;

  var propiedades = LUXURY_PROPERTIES.slice().sort(function (a, b) {
    var pA = a.priceMXN != null ? a.priceMXN : -Infinity;
    var pB = b.priceMXN != null ? b.priceMXN : -Infinity;
    return pB - pA;
  });

  contenedor.innerHTML = propiedades.map(renderPropiedadBloque).join('');
}

