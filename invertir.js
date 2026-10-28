/* ==========================================================================
   PRAETORA · Invertir · Concepto A «El filtro» — la introducción
   --------------------------------------------------------------------------
   Todo lo que se ve es función del tiempo t (segundos): dibujar(t) pinta el
   lienzo y mueve rótulos, titular y luces. Nada depende del cuadro anterior.
     · ?t=4.5        congela la introducción en ese instante (capturas, juez, video).
     · ?video        oculta menú y botones (para renderizar el MP4).
     · ?video=reel   además deja el aire de un reel de 1080 × 1920.
     · ?video=og     el cuadro para compartir (1200 × 630).
     · prefers-reduced-motion: se muestra directo el cuadro final, quieto.
   Las oportunidades salen de un generador con semilla: el mismo t da siempre
   el mismo cuadro.

   Guion (7 s y se detiene)
     0.0–1.3 s   se enciende la luz; aparecen las ciudades y las siete compuertas.
     0.95–3 s    cada ciudad suelta sus oportunidades (puntos finos).
     1.4–5.3 s   cruzan las compuertas; en cada una se apagan las que no pasan y
                 se quedan como ceniza junto a la línea; la compuerta destella y
                 su nombre se enciende mientras trabaja. Un haz viaja con el frente.
     3.5 s       sube el titular; a los 4.3 s, la bajada y el botón.
     4.8–5.55 s  llegan cuatro a «Usted», una de cada ciudad; cada una deja el
                 hilo de su recorrido.
     7 s         FIN: se dibuja el último cuadro y el lienzo ya no se toca. Desde
                 ahí solo respira la luz de «Usted», con CSS (opacity).
   Si la persona hace scroll, toca o pulsa una tecla antes, el titular y el
   botón entran en ese momento.
   Solo cambian transform, opacity y el lienzo.
   ========================================================================== */
(function () {
  'use strict';

  var heroe = document.querySelector('.filtro');
  var lienzo = heroe && heroe.querySelector('.filtro-lienzo');
  if (!lienzo || !lienzo.getContext) return;
  window.__filtroIniciado = true;

  var raiz = document.documentElement;
  var ctx = lienzo.getContext('2d');
  var caja = heroe.querySelector('.filtro-diagrama');

  var qs;
  try { qs = new URLSearchParams(location.search); } catch (e) { qs = null; }
  var T_FIJO = qs && qs.has('t') ? parseFloat(qs.get('t')) : NaN;
  var CONGELADO = isFinite(T_FIJO);
  var VIDEO = !!(qs && qs.has('video'));
  var REEL = VIDEO && qs.get('video') === 'reel';
  var OG = VIDEO && qs.get('video') === 'og';
  var REDUCIDO = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (VIDEO) raiz.classList.add('modo-video');
  if (REEL) raiz.classList.add('modo-reel');
  if (OG) raiz.classList.add('modo-og');

  var FIN = 7;                                         // último cuadro: aquí se detiene
  var TAU = Math.PI * 2;
  var Q = [0.14, 0.26, 0.38, 0.5, 0.62, 0.74, 0.86];   // las compuertas, en «tiempo de viaje»
  var RITMO = 1 / 3.4;                                 // a velocidad 1, el viaje completo dura 3.4 s
  var LIMITE = 5.25;                                   // ninguna choca después de esto
  var LLEGADAS = [4.8, 5.05, 5.3, 5.55];               // las cuatro que pasan los siete, una de cada ciudad
  var ALFA_APAGADA = 0.28;                             // la ceniza que queda junto a cada compuerta
  var ALFA_HILO = 0.35;                                // el recorrido de las cuatro que pasan
  var TITULAR = 3.5, LADO = 4.3;                       // titular; bajada y botón
  var RESPIRO = 4.8;                                   // periodo de la luz de «Usted» después de FIN (el mismo del CSS)

  /* --- Utilidades ------------------------------------------------------- */
  function c01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function seg(t, a, d) { return c01((t - a) / d); }
  function mezcla(a, b, k) { return a + (b - a) * k; }
  function suave(x) { x = c01(x); return x * x * (3 - 2 * x); }
  function sale3(x) { x = c01(x); var y = 1 - x; return 1 - y * y * y; }
  // La curva de la V1: cubic-bezier(0.16, 1, 0.3, 1).
  function bezier(x1, y1, x2, y2) {
    function f(t, a, b) { var u = 1 - t; return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t; }
    function df(t, a, b) { var u = 1 - t; return 3 * u * u * a + 6 * u * t * (b - a) + 3 * t * t * (1 - b); }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var t = x, i;
      for (i = 0; i < 6; i++) {
        var d = df(t, x1, x2);
        if (Math.abs(d) < 1e-5) break;
        t -= (f(t, x1, x2) - x) / d;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
      }
      if (Math.abs(f(t, x1, x2) - x) > 1e-4) {
        var lo = 0, hi = 1;
        for (i = 0; i < 30; i++) { t = (lo + hi) / 2; if (f(t, x1, x2) < x) lo = t; else hi = t; }
      }
      return f(t, y1, y2);
    };
  }
  var curva = bezier(0.16, 1, 0.3, 1);
  function semilla(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function normal(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }
  function acotar(x, a, b) { return x < a ? a : x > b ? b : x; }
  // Tiempo local en que el avance «te» se cumple (arranque suave en 0.3 s).
  function tauDe(te) { return te <= 0.15 ? Math.sqrt(0.6 * te) : te + 0.15; }
  function avance(p, tau) { return p.kv * (tau < 0.3 ? tau * tau / 0.6 : tau - 0.15); }
  // Después de FIN la luz de «Usted» respira: 0 → 1 → 0 cada RESPIRO s (la misma curva del CSS).
  function respiro(t) { return t > FIN ? 0.5 - 0.5 * Math.cos(TAU * (t - FIN) / RESPIRO) : 0; }

  /* --- Elementos -------------------------------------------------------- */
  function todos(sel) { return Array.prototype.slice.call(heroe.querySelectorAll(sel)); }
  var E = {
    telon: heroe.querySelector('.ff-telon'),
    luzA: heroe.querySelector('.ff-luz-a'),
    luzB: heroe.querySelector('.ff-luz-b'),
    brumas: todos('.ff-bruma'),
    haz: heroe.querySelector('.ff-haz'),
    usted: heroe.querySelector('.ff-usted'),
    cab: heroe.querySelector('.fc-cab'),
    ciudades: todos('.fc-ciudad'),
    filtros: todos('.fc-filtro'),
    ustedTxt: heroe.querySelector('.fc-usted'),
    lineas: todos('.f-linea > span'),
    lado: heroe.querySelector('.filtro-lado')
  };
  // Escribe opacidad y transform solo cuando cambian.
  function estilo(nodo, op, tr) {
    if (!nodo) return;
    if (op !== null) {
      var o = op >= 0.999 ? '1' : op <= 0.001 ? '0' : op.toFixed(3);
      if (nodo.__o !== o) { nodo.style.opacity = o; nodo.__o = o; }
    }
    if (tr !== undefined && nodo.__t !== tr) { nodo.style.transform = tr; nodo.__t = tr; }
  }
  function poner(el, x, y) { el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px'; }

  /* --- Las oportunidades -------------------------------------------------- */
  var P = [];   // las de la introducción (las cuatro últimas son las que pasan)
  var N = 0;
  // Cinco cauces por ciudad (sin ondas): el abanico con que llegan al filtro.
  var CAUCES = [];
  (function () {
    for (var c = 0; c < 4; c++) {
      for (var j = 0; j < 5; j++) {
        CAUCES.push({ c: c, l: acotar((c - 1.5) / 1.5 * 0.6 + (j - 2) * 0.2, -1, 1), amp: 0, fr: 0, ph: 0, g: 0 });
      }
    }
  })();

  function lineaDe(c, r, abre) {
    return acotar((c - 1.5) / 1.5 * 0.6 + normal(r) * abre, -1, 1);
  }

  function crear(n) {
    N = n;
    var r = semilla(27102026 + n);
    var i, k, p;
    P = [];
    for (i = 0; i < n; i++) {
      var c = Math.floor(r() * 4);
      P.push({
        c: c,
        s: 0.95 + 0.07 * c + 1.95 * Math.pow(r(), 1.45),  // salida: más al principio
        kv: (0.8 + 0.42 * r()) * RITMO,
        l: lineaDe(c, r, 0.34),
        amp: r() * r(),
        fr: 0.006 + 0.011 * r(),
        ph: r() * TAU,
        d: 1.5 + 15 * Math.pow(r(), 2.2),                  // se apaga pegada a la compuerta
        rad: 0.7 + 0.75 * r(),
        b: 0.38 + 0.5 * r(),
        caida: 0.4 + 0.9 * r(),
        bm: 0.6 + 0.8 * r(),
        g: 0
      });
    }
    // Cuántas llegan a cada compuerta: cada una deja pasar una parte.
    var pasa = [0.5, 0.55, 0.56, 0.58, 0.55, 0.47];
    var llegan = [n];
    for (k = 0; k < 6; k++) llegan.push(Math.round(llegan[k] * pasa[k]));
    // Se reparten de la última compuerta a la primera, al azar entre las que
    // alcanzan a llegar antes del LIMITE; las demás se apagan en la primera.
    var orden = [];
    for (i = 0; i < n; i++) orden.push(i);
    for (i = n - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var x = orden[i]; orden[i] = orden[j]; orden[j] = x; }
    var tomada = new Uint8Array(n);
    for (k = 6; k >= 1; k--) {
      var cupo = llegan[k] - (k < 6 ? llegan[k + 1] : 0);
      for (i = 0; i < n && cupo > 0; i++) {
        var idx = orden[i];
        if (tomada[idx]) continue;
        p = P[idx];
        if (p.s + tauDe(Q[k] / p.kv) > LIMITE) continue;
        p.g = k; tomada[idx] = 1; cupo--;
      }
    }
    // Las cuatro que pasan los siete, una de cada ciudad (los cuatro mercados pesan igual):
    // de León, de San Miguel de Allende, de Guanajuato y de CDMX. «lugar» es su sitio en
    // «Usted» (en huecos), en el mismo orden que las ciudades, para que los hilos no se crucen.
    var deCiudad = [1, 3, 2, 0], salen = [1.1, 1.35, 1.6, 1.85], lugar = [-0.5, 1.5, 0.5, -1.5], carril = [-0.12, 0.36, 0.1, -0.42];
    for (i = 0; i < 4; i++) {
      P.push({
        c: deCiudad[i], s: salen[i], kv: RITMO, l: carril[i],
        amp: 0.35, fr: 0.008, ph: i * 2.1, d: 0,
        rad: 1.2, b: 0.72, caida: 0, bm: 1,
        g: 7, k: i, lugar: lugar[i], llega: LLEGADAS[i]
      });
    }
    // Frente de cada compuerta: cuándo la toca la primera.
    G.frente = [];
    for (k = 0; k < 7; k++) {
      var m = 99;
      for (i = 0; i < n; i++) { var tk = P[i].s + tauDe(Q[k] / P[i].kv); if (tk < m) m = tk; }
      G.frente.push(m);
    }
  }

  /* --- Geometría ---------------------------------------------------------
     u: a lo largo del flujo; w: de través. En horizontal (escritorio) el
     flujo va a la derecha; en vertical (celular) baja. */
  var G = { vertical: false, ug: [0, 0, 0, 0, 0, 0, 0], u0: [0, 0, 0, 0], w0: [0, 0, 0, 0], frente: [] };
  var W = 1, H = 1, DPR = 1;

  function sx(u, w) { return G.vertical ? G.ox + w : G.ox + u; }
  function sy(u, w) { return G.vertical ? G.oy + u : G.oy + w; }

  function uDeQ(c, q) {
    if (q <= Q[0]) return mezcla(G.u0[c], G.ug[0], q / Q[0]);
    if (q >= Q[6]) return G.ug[6] + (G.uFin - G.ug[6]) * (q - Q[6]) / (1 - Q[6]);
    var k = Math.floor((q - Q[0]) / 0.12);
    if (k > 5) k = 5;
    return G.ug[k] + (G.ug[k + 1] - G.ug[k]) * (q - Q[k]) / 0.12;
  }
  function qDeU(c, u) {
    if (u <= G.ug[0]) return Q[0] * (u - G.u0[c]) / (G.ug[0] - G.u0[c]);
    if (u >= G.ug[6]) return Q[6] + (1 - Q[6]) * (u - G.ug[6]) / (G.uFin - G.ug[6]);
    var k = 0;
    while (k < 5 && u > G.ug[k + 1]) k++;
    return Q[k] + 0.12 * (u - G.ug[k]) / (G.ug[k + 1] - G.ug[k]);
  }
  // Posición a lo largo: avanza y, al acercarse a su tope, frena sin pasarlo.
  function posU(p, tau, tope, freno) {
    var uf = uDeQ(p.c, avance(p, tau));
    if (uf > tope - freno) uf = tope - freno * Math.exp(-(uf - tope + freno) / freno);
    return uf;
  }
  // Posición de través: sale de su ciudad, toma su carril y la banda se angosta hacia «Usted».
  function cruz(p, u) {
    var a = suave((u - G.u0[p.c]) / Math.max(24, G.ug[0] - 10 - G.u0[p.c]));
    var k = c01((u - G.ug[0]) / (G.ug[6] - G.ug[0]));
    var banda = G.b0 + (G.b6 - G.b0) * k;
    var w = G.w0[p.c] + (p.l * banda - G.w0[p.c]) * a;
    w += p.amp * G.ondas * Math.sin(p.fr * u + p.ph) * a * (1 - 0.6 * k);
    if (p.g === 7) {
      var b = suave((u - G.ug[6]) / (G.uFin - G.ug[6] - 14));
      w += (p.lugar * G.hueco - w) * b;
    }
    return w;
  }

  function ancho(el) { return el.offsetWidth; }
  function alto(el) { return el.offsetHeight; }

  function medirHorizontal(bx, by, bw, bh) {
    var k, c;
    var anchoCiudades = 0;
    E.ciudades.forEach(function (e) { e.style.maxWidth = ''; anchoCiudades = Math.max(anchoCiudades, ancho(e)); });
    G.ox = bx + anchoCiudades + 30;
    G.uFin = (bx + bw) - G.ox - ancho(E.ustedTxt) - 14;
    var g0 = G.uFin * 0.12, g6 = G.uFin * 0.845, paso = (g6 - g0) / 6;
    for (k = 0; k < 7; k++) G.ug[k] = g0 + paso * k;
    var altoEtq = 0;
    E.filtros.forEach(function (e) { e.style.width = Math.round(paso - 22) + 'px'; altoEtq = Math.max(altoEtq, alto(e)); });
    G.ly0 = by + altoEtq + 16;
    G.ly1 = by + bh;
    var semi = (G.ly1 - G.ly0) / 2;
    G.oy = G.ly0 + semi + 6;
    semi -= 14;
    G.b0 = semi * 0.8;
    G.b6 = semi * 0.42;
    G.ondas = semi * 0.08;
    var cg = acotar(semi * 0.27, 30, 60);
    for (c = 0; c < 4; c++) { G.u0[c] = 0; G.w0[c] = (c - 1.5) * cg; }
    G.hueco = 18;
    G.freno = acotar((G.uFin - G.ug[6]) * 0.45, 40, 90);
    poner(E.cab, G.ox - 18 - ancho(E.cab), by);
    E.ciudades.forEach(function (e, i) { poner(e, G.ox - 18 - ancho(e), G.oy + G.w0[i] - alto(e) / 2); });
    E.filtros.forEach(function (e, i) { poner(e, G.ox + G.ug[i] + 10, by); });
    poner(E.ustedTxt, G.ox + G.uFin + 10, by);
  }

  // El encabezado de la V1 va encima del héroe (absoluto). Si su menú se parte en dos
  // renglones (menos de ~370 px de ancho), el diagrama baja lo necesario para no quedar debajo.
  var cabecera = document.querySelector('.site-header');
  function ajustarCabecera(corto) {
    if (!cabecera) return;
    heroe.style.removeProperty('--f-cab');
    var base = parseFloat(getComputedStyle(heroe).getPropertyValue('--f-cab')) || 0;
    var arriba = heroe.getBoundingClientRect().top, fondo = 0;
    Array.prototype.forEach.call(cabecera.querySelectorAll('a'), function (a) {
      var b = a.getBoundingClientRect();
      if (b.height) fondo = Math.max(fondo, b.bottom - arriba);
    });
    var necesita = Math.ceil(fondo + (corto ? 12 : 22));
    if (necesita > base) heroe.style.setProperty('--f-cab', necesita + 'px');
  }

  function medirVertical(bx, by, bw, bh, corto) {
    var k, c;
    // corto: celular de menos de 700 px de alto; se aprietan las filas para que asome el botón.
    var col = acotar(bw * 0.46, 128, 176);
    E.ciudades.forEach(function (e) { e.style.maxWidth = Math.round(col) + 'px'; });
    E.filtros.forEach(function (e) { e.style.width = ''; });
    var izq = bx + col + 14, der = bx + bw;
    var semi = (der - izq) / 2;
    G.ox = (izq + der) / 2;
    G.lx0 = bx;
    G.lx1 = der;
    var fila = corto ? 18 : 22;
    G.oy = by + alto(E.cab) + (corto ? 12 : 18);
    var w0 = [-0.62, -0.2, 0.22, 0.64];
    for (c = 0; c < 4; c++) { G.u0[c] = c * fila; G.w0[c] = w0[c] * semi; }
    var ug0 = 3 * fila + Math.max(corto ? 38 : 46, alto(E.ciudades[3]) + (corto ? 22 : 34));
    var altoEtq = alto(E.filtros[0]);
    var paso = acotar(((by + bh) - G.oy - ug0 - 8) / 7.2, corto ? 24 : 34, 58);
    for (k = 0; k < 7; k++) G.ug[k] = ug0 + paso * k;
    G.uFin = G.ug[6] + paso * 1.2;
    semi -= 4;
    G.b0 = semi * 0.9;
    G.b6 = semi * 0.5;
    G.ondas = semi * 0.1;
    G.hueco = 15;
    G.freno = acotar(paso * 0.9, 30, 60);
    poner(E.cab, bx, by);
    E.ciudades.forEach(function (e, i) { poner(e, bx, G.oy + G.u0[i] - 8); });
    E.filtros.forEach(function (e, i) { poner(e, bx, G.oy + G.ug[i] - altoEtq - (corto ? 4 : 5)); });
    poner(E.ustedTxt, bx, G.oy + G.uFin - alto(E.ustedTxt) - 5);
    G.lider = E.ciudades.map(function (e) { return bx + Math.min(ancho(e), col) + 10; });
  }

  // Lo que depende de la geometría: topes, tiempos de choque y llegada.
  function derivar() {
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      if (p.g === 7) {
        p.tope = G.uFin - 9;
        p.kv = qDeU(p.c, p.tope) / (p.llega - p.s - 0.15);
        p.tChoque = p.llega;
      } else {
        p.tope = G.ug[p.g] - p.d;
        p.tChoque = p.s + tauDe(qDeU(p.c, p.tope) / p.kv);
      }
      p.wTope = cruz(p, p.tope);
    }
  }

  function medir() {
    var corto = (!VIDEO && window.innerHeight < 700) || REEL;
    ajustarCabecera(corto);
    var rh = heroe.getBoundingClientRect();
    W = Math.max(1, Math.round(rh.width));
    H = Math.max(1, Math.round(rh.height));
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    G.vertical = W < 760 || H > W * 1.08;
    heroe.classList.add('listo');
    heroe.classList.toggle('es-vertical', G.vertical);
    lienzo.width = Math.round(W * DPR);
    lienzo.height = Math.round(H * DPR);
    var n = G.vertical ? 760 : (W >= 1200 ? 2000 : 1500);
    if (n !== N) { crear(n); reservar(n + 4 + 8); }
    var rc = caja.getBoundingClientRect();
    var bx = rc.left - rh.left, by = rc.top - rh.top;
    if (G.vertical) medirVertical(bx, by, rc.width, rc.height, corto);
    else medirHorizontal(bx, by, rc.width, rc.height);
    derivar();
    poner(E.usted, sx(G.uFin, 0), sy(G.uFin, 0));
  }

  /* --- Dibujo por lotes: un trazo por nivel de opacidad --------------------- */
  var NB = 24;
  var puntos = [], trazos = [], chispas = [];
  var nP = new Int32Array(NB), nT = new Int32Array(NB), nC = new Int32Array(NB);
  var act = new Float32Array(7);
  var llegadas = [{}, {}, {}, {}];

  function reservar(cap) {
    puntos = []; trazos = []; chispas = [];
    for (var i = 0; i < NB; i++) {
      puntos.push(new Float32Array(cap * 3));
      trazos.push(new Float32Array(cap * 4));
      chispas.push(new Float32Array(cap * 4));
    }
  }
  function nivel(a) { var i = (a * (NB - 1) + 0.5) | 0; return i >= NB ? NB - 1 : i; }
  function punto(x, y, r, a) {
    var i = nivel(a); if (i <= 0) return;
    var o = nP[i] * 3, d = puntos[i];
    d[o] = x; d[o + 1] = y; d[o + 2] = r; nP[i]++;
  }
  function trazo(x1, y1, x2, y2, a) {
    var i = nivel(a); if (i <= 0) return;
    var o = nT[i] * 4, d = trazos[i];
    d[o] = x1; d[o + 1] = y1; d[o + 2] = x2; d[o + 3] = y2; nT[i]++;
  }
  function chispa(u, w, largo, a) {
    var i = nivel(a); if (i <= 0) return;
    var o = nC[i] * 4, d = chispas[i];
    d[o] = sx(u, w - largo); d[o + 1] = sy(u, w - largo); d[o + 2] = sx(u, w + largo); d[o + 3] = sy(u, w + largo); nC[i]++;
  }

  function mancha(px, horizontal) {
    // Brillo suave pre-dibujado (punto o tira); se estira con drawImage.
    var c = document.createElement('canvas');
    if (horizontal === undefined) {
      c.width = c.height = px;
      var g = c.getContext('2d');
      var gr = g.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px / 2);
      gr.addColorStop(0, 'rgba(255,255,255,1)');
      gr.addColorStop(0.22, 'rgba(255,255,255,0.42)');
      gr.addColorStop(0.55, 'rgba(255,255,255,0.1)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, px, px);
      return c;
    }
    c.width = horizontal ? px : 2;
    c.height = horizontal ? 2 : px;
    var h = c.getContext('2d');
    var lin = horizontal ? h.createLinearGradient(0, 0, px, 0) : h.createLinearGradient(0, 0, 0, px);
    lin.addColorStop(0, 'rgba(255,255,255,0)');
    lin.addColorStop(0.5, 'rgba(255,255,255,1)');
    lin.addColorStop(1, 'rgba(255,255,255,0)');
    h.fillStyle = lin; h.fillRect(0, 0, c.width, c.height);
    return c;
  }
  var BRILLO = mancha(64);
  var TIRA_X = mancha(64, true);    // resplandor de una línea vertical (se abre en x)
  var TIRA_Y = mancha(64, false);   // resplandor de una línea horizontal (se abre en y)

  /* --- El cuadro ------------------------------------------------------------- */
  function particulas(t) {
    var i, p, tau, u, w, alfa, rad, viva, dt, e, x, y, k;
    for (i = 0; i < P.length; i++) {
      p = P[i];
      tau = t - p.s;
      if (tau <= 0) continue;
      var freno = p.g === 7 ? G.freno : 16;
      u = posU(p, tau, p.tope, freno);
      w = cruz(p, u);
      var pasadas = 0;
      for (k = 0; k < 7; k++) if (u > G.ug[k]) pasadas++;
      alfa = Math.min(1, p.b * (1 + 0.09 * pasadas));   // ganan luz con cada filtro que pasan
      rad = p.rad;
      viva = true;
      if (p.g < 7) {
        dt = t - p.tChoque;
        if (dt > 0) {
          viva = false;
          e = c01(dt / 0.7);
          // Se apaga y queda como ceniza pegada a su compuerta.
          alfa = mezcla(alfa, ALFA_APAGADA * p.bm, sale3(e)) + 0.45 * Math.pow(1 - c01(dt / 0.14), 2);
          rad *= 1 - 0.18 * e;
          if (!G.vertical) w += p.caida * 5 * sale3(c01(dt / 1.2));
          if (dt < 1.4) {
            chispa(G.ug[p.g], p.wTope, 7, 0.6 * Math.exp(-dt / 0.3));
            act[p.g] += Math.exp(-dt / 0.5);
          }
        }
      } else {
        var luz = c01((u - G.ug[3]) / (G.ug[6] - G.ug[3]));
        alfa = mezcla(alfa, 1, luz);
        rad = mezcla(rad, 2.1, luz);
      }
      alfa *= c01(tau / 0.25);
      x = sx(u, w); y = sy(u, w);
      if (p.g === 7) {
        var L = llegadas[p.k];
        L.x = x; L.y = y; L.a = alfa; L.r = rad; L.u = u; L.on = true; L.p = p;
      } else {
        punto(x, y, rad, alfa);
      }
      if (viva) {
        var u2 = posU(p, tau > 0.03 ? tau - 0.03 : 0, p.tope, freno);
        if (u - u2 > 0.8) { var w2 = cruz(p, u2); trazo(sx(u2, w2), sy(u2, w2), x, y, alfa * 0.32); }
      }
    }
  }

  function linea(u, pr) {
    ctx.beginPath();
    if (G.vertical) {
      var y = Math.round(G.oy + u) + 0.5;
      ctx.moveTo(G.lx0, y); ctx.lineTo(G.lx0 + (G.lx1 - G.lx0) * pr, y);
    } else {
      var x = Math.round(G.ox + u) + 0.5;
      ctx.moveTo(x, G.ly0); ctx.lineTo(x, G.ly0 + (G.ly1 - G.ly0) * pr);
    }
    ctx.stroke();
  }
  function resplandor(u, fuerza, abre) {
    if (fuerza <= 0.002) return;
    ctx.globalAlpha = fuerza;
    if (G.vertical) ctx.drawImage(TIRA_Y, G.lx0, G.oy + u - abre, G.lx1 - G.lx0, abre * 2);
    else ctx.drawImage(TIRA_X, G.ox + u - abre, G.ly0, abre * 2, G.ly1 - G.ly0);
  }

  function estructura(t) {
    var k, pr;
    ctx.strokeStyle = '#fff';
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 1;
    // Las siete compuertas: se trazan al abrir, destellan al pasar el frente y brillan mientras filtran.
    for (k = 0; k < 7; k++) {
      pr = curva(seg(t, 0.35 + 0.085 * k, 1.0));
      if (pr <= 0) continue;
      var dtf = t - G.frente[k];
      var pulso = dtf > 0 ? (1 - Math.exp(-dtf / 0.12)) * Math.exp(-dtf / 1.3) : 0;
      var trabajo = Math.min(1, act[k] / 6);
      resplandor(G.ug[k], 0.05 * pulso + 0.06 * trabajo, 26);
      ctx.globalAlpha = 0.15 + 0.3 * pulso + 0.16 * trabajo;
      linea(G.ug[k], pr);
    }
    // «Usted»: la línea final, más clara; se enciende con cada llegada.
    pr = curva(seg(t, 1.0, 1.0));
    if (pr > 0) {
      var enc = 0;
      for (k = 0; k < LLEGADAS.length; k++) { var dl = t - LLEGADAS[k]; if (dl > 0) enc += Math.exp(-dl / 0.7); }
      var quieta = suave(seg(t, 4.6, 1.5));
      resplandor(G.uFin, 0.05 * quieta + 0.08 * Math.min(1, enc), 34);
      ctx.globalAlpha = (0.3 + 0.18 * quieta + 0.35 * Math.min(1, enc)) * pr;
      linea(G.uFin, pr);
    }
    // Cauces: de cada ciudad a la primera compuerta, apenas visibles.
    var cauce = 0.07 * suave(seg(t, 1.1, 1.4));
    if (cauce > 0) {
      ctx.globalAlpha = cauce;
      ctx.beginPath();
      for (k = 0; k < CAUCES.length; k++) {
        var cp = CAUCES[k], fin = G.ug[0] - 3;
        for (var j = 0; j <= 28; j++) {
          var uu = G.u0[cp.c] + (fin - G.u0[cp.c]) * j / 28, ww = cruz(cp, uu);
          if (j) ctx.lineTo(sx(uu, ww), sy(uu, ww)); else ctx.moveTo(sx(uu, ww), sy(uu, ww));
        }
      }
      ctx.stroke();
    }
    // Celular: guía fina de cada ciudad a su punto de salida.
    if (G.vertical && G.lider) {
      for (k = 0; k < 4; k++) {
        var ap = curva(seg(t, 0.32 + 0.13 * k, 0.75));
        if (ap <= 0) continue;
        var yy = Math.round(G.oy + G.u0[k]) + 0.5, x1 = G.lider[k], x2 = G.ox + G.w0[k] - 9;
        if (x2 - x1 < 6) continue;
        ctx.globalAlpha = 0.2 * ap;
        ctx.beginPath(); ctx.moveTo(x1, yy); ctx.lineTo(x1 + (x2 - x1) * ap, yy); ctx.stroke();
      }
    }
  }

  function vaciar() {
    var b, j, d, n;
    ctx.lineCap = 'round';
    ctx.lineWidth = 1.4;
    for (b = 1; b < NB; b++) {
      n = nC[b]; if (!n) continue;
      d = chispas[b]; ctx.globalAlpha = b / (NB - 1);
      ctx.beginPath();
      for (j = 0; j < n * 4; j += 4) { ctx.moveTo(d[j], d[j + 1]); ctx.lineTo(d[j + 2], d[j + 3]); }
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    for (b = 1; b < NB; b++) {
      n = nT[b]; if (!n) continue;
      d = trazos[b]; ctx.globalAlpha = b / (NB - 1);
      ctx.beginPath();
      for (j = 0; j < n * 4; j += 4) { ctx.moveTo(d[j], d[j + 1]); ctx.lineTo(d[j + 2], d[j + 3]); }
      ctx.stroke();
    }
    for (b = 1; b < NB; b++) {
      n = nP[b]; if (!n) continue;
      d = puntos[b]; ctx.globalAlpha = b / (NB - 1);
      ctx.beginPath();
      for (j = 0; j < n * 3; j += 3) { ctx.moveTo(d[j] + d[j + 2], d[j + 1]); ctx.arc(d[j], d[j + 1], d[j + 2], 0, TAU); }
      ctx.fill();
    }
  }

  // El hilo: el camino completo de una que pasa. Aparece cuando ya cruzó la cuarta compuerta.
  function hilo(p, hasta, alfa) {
    if (alfa <= 0.003) return;
    var desde = G.u0[p.c], pasos = 96;
    ctx.globalAlpha = alfa;
    ctx.beginPath();
    for (var j = 0; j <= pasos; j++) {
      var u = desde + (hasta - desde) * j / pasos, w = cruz(p, u);
      if (j) ctx.lineTo(sx(u, w), sy(u, w)); else ctx.moveTo(sx(u, w), sy(u, w));
    }
    ctx.stroke();
  }

  function lasQuePasan(t) {
    var resp = 1 - 0.14 * respiro(t);
    var i, L;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    for (i = 0; i < llegadas.length; i++) {
      L = llegadas[i];
      if (L.on) hilo(L.p, L.u, ALFA_HILO * c01((L.u - G.ug[3]) / (G.ug[6] - G.ug[3])));
    }
    for (i = 0; i < llegadas.length; i++) {
      L = llegadas[i];
      if (!L.on) continue;
      var cerca = c01((L.u - G.ug[5]) / (G.uFin - G.ug[5]));
      var R = 9 + 9 * cerca;
      ctx.globalAlpha = L.a * (0.25 + 0.45 * cerca) * resp;
      ctx.drawImage(BRILLO, L.x - R, L.y - R, R * 2, R * 2);
      ctx.globalAlpha = L.a;
      ctx.beginPath(); ctx.arc(L.x, L.y, L.r, 0, TAU); ctx.fill();
    }
  }

  function nodos(t) {
    for (var c = 0; c < 4; c++) {
      var ap = curva(seg(t, 0.32 + 0.13 * c, 0.75));
      if (ap <= 0) continue;
      var x = sx(G.u0[c], G.w0[c]), y = sy(G.u0[c], G.w0[c]);
      var sale = suave(seg(t, 0.95, 0.4)) * (1 - suave(seg(t, 2.8, 1.0)));
      if (sale > 0) { ctx.globalAlpha = 0.5 * sale; ctx.drawImage(BRILLO, x - 14, y - 14, 28, 28); }
      ctx.globalAlpha = 0.32 * ap;
      ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.stroke();
      var e = seg(t, 0.55 + 0.13 * c, 1.0);
      if (e > 0 && e < 1) {
        ctx.globalAlpha = 0.4 * (1 - e);
        ctx.beginPath(); ctx.arc(x, y, 6 + 16 * sale3(e), 0, TAU); ctx.stroke();
      }
      ctx.globalAlpha = 0.95 * ap;
      ctx.beginPath(); ctx.arc(x, y, 2.4, 0, TAU); ctx.fill();
    }
  }

  function luces(t) {
    estilo(E.telon, 0.5 * (1 - curva(seg(t, 0.05, 1.3))));
    estilo(E.luzA, 0.55 + 0.45 * suave(seg(t, 0.1, 1.8)),
      'translate3d(' + (W * 0.018 * Math.sin(t * 0.13 + 0.4)).toFixed(1) + 'px,' + (H * 0.02 * Math.cos(t * 0.1)).toFixed(1) + 'px,0) scale(' + (1 + 0.035 * Math.sin(t * 0.09)).toFixed(4) + ')');
    estilo(E.luzB, 0.78 + 0.22 * Math.sin(t * 0.21 + 1),
      'translate3d(' + (W * 0.012 * Math.sin(t * 0.07)).toFixed(1) + 'px,0,0)');
    for (var i = 0; i < E.brumas.length; i++) {
      var f = 0.045 + 0.013 * i, amp = 26 + 9 * i;
      estilo(E.brumas[i], null, 'translate3d(' + (amp * Math.sin(t * f + i * 1.3)).toFixed(1) + 'px,' + (amp * 0.6 * Math.cos(t * f * 0.8 + i * 1.7)).toFixed(1) + 'px,0)');
    }
    // El haz viaja con el frente de las oportunidades.
    var qF = Math.max(0, (t - 1.1) * RITMO * 1.22);
    var uF = uDeQ(0, Math.min(qF, 1.2));
    var hz = 0.95 * suave(seg(t, 1.0, 0.8)) * (1 - suave(seg(qF, 0.8, 0.24)));
    estilo(E.haz, hz, G.vertical
      ? 'translate3d(0,' + (sy(uF, 0) - 330).toFixed(1) + 'px,0)'
      : 'translate3d(' + (sx(uF, 0) - 450).toFixed(1) + 'px,0,0)');
    // La luz de «Usted» crece con las llegadas; después de FIN respira (en vivo lo hace el CSS).
    estilo(E.usted, 0.12 + 0.76 * suave(seg(t, 4.5, 1.7)) - 0.2 * respiro(t));
  }

  function rotulos(t) {
    var o, k;
    o = curva(seg(t, 0.15, 0.8));
    estilo(E.cab, o, 'translate3d(0,' + ((1 - o) * 6).toFixed(2) + 'px,0)');
    for (k = 0; k < 4; k++) {
      o = curva(seg(t, 0.32 + 0.13 * k, 0.75));
      estilo(E.ciudades[k], o, 'translate3d(' + ((1 - o) * -10).toFixed(2) + 'px,0,0)');
    }
    // El nombre de cada filtro se enciende mientras trabaja; al final, todos claros
    // (opacidad 1: el número, en blanco al 64 %, queda arriba de 4.5:1 también junto a la luz).
    var base = mezcla(0.6, 1, seg(t, 5.4, 1.0));
    for (k = 0; k < 7; k++) {
      o = curva(seg(t, 0.5 + 0.085 * k, 0.8));
      var luz = Math.max(base, mezcla(0.6, 1, Math.min(1, act[k] / 3)));
      estilo(E.filtros[k], o * luz, 'translate3d(0,' + ((1 - o) * 8).toFixed(2) + 'px,0)');
    }
    o = curva(seg(t, 1.25, 0.8));
    estilo(E.ustedTxt, o, 'translate3d(0,' + ((1 - o) * 8).toFixed(2) + 'px,0)');
  }

  // Titular, bajada y botón. Si la persona se adelanta (scroll, toque, tecla),
  // adelantar() mueve sus tiempos a ese instante.
  var tTit = TITULAR, dTit = 1.15, tLado = LADO, dLado = 1.0;
  function titular(t) {
    for (var i = 0; i < E.lineas.length; i++) {
      var e = curva(seg(t, tTit + 0.16 * i, dTit));
      estilo(E.lineas[i], Math.min(1, e * 1.3), 'translate3d(0,' + ((1 - e) * 105).toFixed(2) + '%,0)');
    }
    var e2 = curva(seg(t, tLado, dLado));
    estilo(E.lado, e2, 'translate3d(0,' + ((1 - e2) * 14).toFixed(2) + 'px,0)');
  }

  function dibujar(t) {
    nP.fill(0); nT.fill(0); nC.fill(0); act.fill(0);
    for (var q = 0; q < llegadas.length; q++) llegadas[q].on = false;
    particulas(t);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    estructura(t);
    vaciar();
    lasQuePasan(t);
    nodos(t);
    ctx.globalAlpha = 1;
    luces(t);
    rotulos(t);
    titular(t);
  }

  /* --- Arranque, bucle y final ---------------------------------------------- */
  var t0 = 0, vivo = false, enPantalla = true, pedido = 0;
  var stats = { cuadros: 0, ms: 0, max: 0, despuesDeFin: 0, terminada: false };
  function cuadro(ahora) {
    pedido = 0;
    if (!vivo || !enPantalla) return;
    var t = (ahora - t0) / 1000;
    var a = performance.now();
    if (t >= FIN) {
      dibujar(FIN);            // el último cuadro, exacto; ya no se pide otro
      terminar();
    } else {
      dibujar(t);
      pedido = requestAnimationFrame(cuadro);
    }
    var ms = performance.now() - a;
    stats.cuadros++; stats.ms += ms; if (ms > stats.max) stats.max = ms;
  }
  function seguir() { if (vivo && enPantalla && !pedido) pedido = requestAnimationFrame(cuadro); }
  function terminar() {
    vivo = false;
    stats.terminada = true;
    heroe.classList.add('quieto');   // desde aquí solo respira la luz de «Usted» (CSS)
    quitarEscuchas();
  }
  function tiempoQuieto() { return CONGELADO ? T_FIJO : FIN; }

  // Quien hace scroll, toca o pulsa una tecla no espera: el titular y el botón entran ya.
  var EVENTOS = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'];
  function adelantar() {
    quitarEscuchas();
    if (!vivo) return;
    var te = (performance.now() - t0) / 1000;
    if (te < tTit) { tTit = te; dTit = 0.7; }
    if (te < tLado) { tLado = Math.max(te, tTit + 0.25); dLado = 0.6; }
  }
  function escuchar() { EVENTOS.forEach(function (n) { window.addEventListener(n, adelantar, { passive: true }); }); }
  function quitarEscuchas() { EVENTOS.forEach(function (n) { window.removeEventListener(n, adelantar, { passive: true }); }); }

  function fuentes() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var pedidos = ['300 66px acumin-pro', '400 14px acumin-pro', '500 12px acumin-pro'].map(function (f) {
      return document.fonts.load(f).catch(function () {});
    });
    return Promise.race([Promise.all(pedidos), new Promise(function (r) { setTimeout(r, 1500); })]);
  }

  function arrancar() {
    medir();
    if (CONGELADO || REDUCIDO) {
      dibujar(tiempoQuieto());
      raiz.classList.remove('mov');
      window.__filtroListo = true;
      return;
    }
    t0 = performance.now();
    vivo = true;
    dibujar(0);
    raiz.classList.remove('mov');
    window.__filtroListo = true;
    escuchar();
    seguir();
  }

  // Para el video, el juez y las pruebas: cualquier instante a pedido.
  window.__filtro = {
    dibujar: function (t) { if (!N) medir(); dibujar(t); },
    medir: medir,
    FIN: FIN,
    stats: stats
  };

  var espera = 0;
  window.addEventListener('resize', function () {
    clearTimeout(espera);
    espera = setTimeout(function () {
      medir();
      if (!vivo) dibujar(tiempoQuieto());
    }, 120);
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      enPantalla = es[es.length - 1].isIntersecting;
      seguir();
    }).observe(heroe);
  }

  fuentes().then(arrancar, arrancar);
})();
