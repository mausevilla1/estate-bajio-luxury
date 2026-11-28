/* ==========================================================================
   PRAETORA · Invertir · I1 «El filtro, en grande»
   --------------------------------------------------------------------------
   Un solo escenario para toda la idea:
     · PORTADA (por tiempo): las oportunidades salen de CDMX y de San Miguel,
       cruzan siete compuertas; en cada una se apagan las que no pasan y se
       quedan como ceniza junto a la línea. Llegan cuatro a «Usted». El
       titular entra a los 1.7 s.
     · CAPÍTULOS (por scroll): la ilustración avanza compuerta por compuerta.
       Entre una y otra se ve la nube de las que siguen, cada vez más chica.
       Sin números. En compu con movimiento (.viva) el escenario entero se
       queda fijo y los capítulos aparecen encima; en cel, tableta y con
       «reducir movimiento», la lámina se queda fija arriba y los capítulos
       corren debajo.
   Todo el cuadro es función de un solo valor f (el «frente», en compuertas:
   0 = las ciudades, 1–7 = las compuertas, 8 = «Usted»), así que el mismo f da
   siempre el mismo cuadro.
   Cel: vertical y más simple; lienzo a 2x como máximo, sticky de CSS y sin
   pins de GSAP. «Reducir movimiento»: sin animación; la ilustración salta
   quieta al estado de cada capítulo.
   ========================================================================== */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var REDUCIDO = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (gsap && ST) gsap.registerPlugin(ST);
  var MOV = !REDUCIDO && !!gsap;
  window.__filtro = true;
  if (MOV) raiz.classList.add('mov');

  var seccion = document.querySelector('.filtro');
  var escenario = seccion.querySelector('.escenario');
  var lienzo = seccion.querySelector('.lienzo');
  var banda = seccion.querySelector('.banda');
  var ctx = lienzo.getContext && lienzo.getContext('2d');

  function todos(sel, base) { return Array.prototype.slice.call((base || document).querySelectorAll(sel)); }
  var E = {
    cab: banda.querySelector('.rot-cab'),
    ciudades: todos('.rot-ciudad', banda),
    filtros: todos('.rot-filtro', banda),
    usted: banda.querySelector('.rot-usted'),
    lamina: seccion.querySelector('.lamina'),
    pasos: todos('.paso', seccion),
    portada: seccion.querySelector('.portada-texto'),
    caps: seccion.querySelector('.capitulos'),
    capitulos: todos('.capitulo', seccion),
    marcas: todos('.cap-pasos i', seccion)
  };

  /* --- Constantes ---------------------------------------------------------- */
  var TAU = Math.PI * 2;
  var PASA = [0.5, 0.55, 0.56, 0.52, 0.46, 0.32];  // de las que llegan a las compuertas 1–6, las que pasan
  var LLEGAN = 4;                                   // las que pasan las siete: dos de cada ciudad
  var L_PORTADA = 2.4;                              // largo del río en la portada (en compuertas)
  var L_CAP = 0.45;                                 // largo de la nube en los capítulos
  var F_FIN = 10.5;                                 // frente final de la portada
  var T_INI = 0.35, T_DUR = 5.0;                    // la portada corre de 0.35 a 5.35 s
  var T_FIN = T_INI + T_DUR + 0.6;
  var T_TIT = 1.7;                                  // entra el titular
  var CENIZA = 0.3;
  var LECTURA = 0.5;                                // flujo: la línea de lectura, a media altura de lo que queda bajo la lámina
  var SEG_A = 0.6, SEG_7 = 1.4, SEG_TOTAL = 8.2;    // reparto del scroll de .viva: entrada, 6 capítulos, el 7.º y un respiro

  /* --- Utilidades -------------------------------------------------------- */
  function c01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function seg(t, a, d) { return c01((t - a) / d); }
  function mezcla(a, b, k) { return a + (b - a) * k; }
  function suave(x) { x = c01(x); return x * x * (3 - 2 * x); }
  function sale3(x) { x = c01(x); var y = 1 - x; return 1 - y * y * y; }
  function sale5(x) { x = c01(x); var y = 1 - x; return 1 - y * y * y * y * y; }
  function acotar(x, a, b) { return x < a ? a : x > b ? b : x; }
  function semilla(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function normal(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }
  function estilo(nodo, op, tr) {
    if (!nodo) return;
    if (op !== null) {
      var o = op >= 0.999 ? '1' : op <= 0.001 ? '0' : op.toFixed(3);
      if (nodo.__o !== o) { nodo.style.opacity = o; nodo.__o = o; }
    }
    if (tr !== undefined && nodo.__t !== tr) { nodo.style.transform = tr; nodo.__t = tr; }
  }
  function poner(el, x, y) { el.style.left = Math.round(x - G.bx) + 'px'; el.style.top = Math.round(y - G.by) + 'px'; }

  /* --- Las oportunidades ------------------------------------------------------ */
  var P = [], N = 0;
  function crear(n) {
    N = n;
    var r = semilla(61026 + n), i, k;
    // Cuántas se quedan en cada compuerta.
    var llegan = [n];
    for (k = 0; k < PASA.length; k++) llegan.push(Math.round(llegan[k] * PASA[k]));
    llegan.push(LLEGAN);                     // llegan[k]: las que llegan a la compuerta k+1; llegan[7]: las que pasan
    var paradas = [];
    for (k = 1; k <= 7; k++) for (i = 0; i < llegan[k - 1] - llegan[k]; i++) paradas.push(k);
    for (i = paradas.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var x = paradas[i]; paradas[i] = paradas[j]; paradas[j] = x; }
    P = [];
    for (i = 0; i < paradas.length; i++) {
      var c = r() < 0.5 ? 0 : 1;
      P.push({
        c: c, s: paradas[i],
        l: acotar((c ? 0.16 : -0.16) + normal(r) * 0.48, -1, 1),
        lagP: Math.pow(r(), 0.9) * L_PORTADA,
        lagC: r(),
        v: 0.92 + 0.16 * r(),
        d: 1.5 + 21 * Math.pow(r(), 2.2),
        rad: 0.8 + 0.8 * r(),
        b: 0.42 + 0.5 * r(),
        bm: 0.6 + 0.8 * r(),
        caida: r() * 2 - 1,
        amp: r() * r(), fr: 0.006 + 0.01 * r(), ph: r() * TAU
      });
    }
    // Las que pasan las siete: dos de cada ciudad, al frente del río.
    var lugar = [-1.5, -0.5, 0.5, 1.5];
    for (i = 0; i < LLEGAN; i++) {
      var ci = i < 2 ? 0 : 1;
      P.push({
        c: ci, s: 8, l: lugar[i] * 0.16, lugar: lugar[i],
        lagP: 0.25 + 0.16 * [1, 3, 0, 2][i], lagC: 0.1 + 0.15 * i, v: 1,
        d: 0, rad: 1.2, b: 0.75, bm: 1, caida: 0,
        amp: 0.3, fr: 0.008, ph: i * 2.1, k: i
      });
    }
  }

  /* --- Geometría --------------------------------------------------------------
     u: a lo largo del flujo; w: de través. En compu el flujo va a la derecha;
     en cel baja. */
  var G = { vertical: false, ug: [0, 0, 0, 0, 0, 0, 0, 0], u0: [0, 0], w0: [0, 0], uFin: 1, paso: 1 };
  var W = 1, H = 1, DPR = 1;
  function X(u, w) { return G.vertical ? G.ox + w : G.ox + u; }
  function Y(u, w) { return G.vertical ? G.oy + u : G.oy + w; }

  // De compuertas (q) a posición (u). Entre la ciudad y la 1.ª, cada ciudad parte de su u0.
  function U(c, q) {
    if (q <= 0) return G.u0[c];
    if (q < 1) return mezcla(G.u0[c], G.ug[1], q);
    if (q >= 8) return G.uFin + (q - 8) * G.paso;
    if (q >= 7) return mezcla(G.ug[7], G.uFin, q - 7);
    var k = Math.floor(q);
    return mezcla(G.ug[k], G.ug[k + 1], q - k);
  }
  function cruz(p, u) {
    var a = suave((u - G.u0[p.c]) / Math.max(24, G.ug[1] - 8 - G.u0[p.c]));
    var k = c01((u - G.ug[1]) / (G.ug[7] - G.ug[1]));
    var ancho = G.b0 + (G.b7 - G.b0) * k;
    var w = G.w0[p.c] + (p.l * ancho - G.w0[p.c]) * a;
    w += p.amp * G.ondas * Math.sin(p.fr * u + p.ph) * a * (1 - 0.7 * k);
    if (p.s === 8) {
      var b = suave((u - G.ug[7]) / (G.uFin - G.ug[7] - 8));
      w += (p.lugar * G.hueco - w) * b;
    }
    return w;
  }

  function medirHorizontal(bx, by, bw, bh) {
    var k, anchoC = 0;
    E.ciudades.forEach(function (e) { e.style.maxWidth = ''; anchoC = Math.max(anchoC, e.offsetWidth); });
    G.ox = bx + anchoC + 26;
    G.uFin = (bx + bw) - G.ox - E.usted.offsetWidth - 20;
    for (k = 1; k <= 7; k++) G.ug[k] = G.uFin * (0.13 + 0.72 * (k - 1) / 6);
    G.paso = G.ug[2] - G.ug[1];
    var altoEtq = 0;
    E.filtros.forEach(function (e) { e.style.width = Math.round(G.paso - 20) + 'px'; altoEtq = Math.max(altoEtq, e.offsetHeight); });
    G.ly0 = by + altoEtq + 18;
    G.ly1 = by + bh;
    var semi = (G.ly1 - G.ly0) / 2;
    G.oy = G.ly0 + semi + 4;
    semi -= 10;
    G.b0 = semi * 0.86;
    G.b7 = semi * 0.36;
    G.ondas = semi * 0.07;
    var cg = acotar(semi * 0.3, 34, 72);
    G.u0 = [0, 0]; G.w0 = [-cg, cg];
    G.hueco = 15;
    G.freno = acotar((G.uFin - G.ug[7]) * 0.4, 30, 80);
    poner(E.cab, G.ox - 20 - E.cab.offsetWidth, by);
    E.ciudades.forEach(function (e, i) { poner(e, G.ox - 20 - e.offsetWidth, G.oy + G.w0[i] - e.offsetHeight / 2); });
    E.filtros.forEach(function (e, i) { poner(e, G.ox + G.ug[i + 1] + 10, by); });
    poner(E.usted, G.ox + G.uFin + 14, G.oy - E.usted.offsetHeight / 2);
  }

  function medirVertical(bx, by, bw, bh) {
    var k;
    var col = acotar(bw * 0.46, 146, 176);
    E.filtros.forEach(function (e) { e.style.width = ''; });
    E.ciudades.forEach(function (e) { e.style.maxWidth = col + 'px'; });
    var izq = bx + col + 8, der = bx + bw;
    G.lx0 = izq; G.lx1 = der;
    var semi = (der - izq) / 2;
    G.ox = (izq + der) / 2;
    var altoCab = E.cab.offsetHeight;
    var corto = bh < 330;
    G.oy = by + altoCab + (corto ? 12 : 18);
    var fila = corto ? 18 : 22;
    G.u0 = [0, fila];
    G.w0 = [-semi * 0.42, semi * 0.42];
    G.ug[1] = fila + (corto ? 32 : 44);
    var paso = (bh - (G.oy - by) - G.ug[1] - 14) / 7.3;
    G.paso = paso;
    for (k = 2; k <= 7; k++) G.ug[k] = G.ug[1] + paso * (k - 1);
    G.uFin = G.ug[7] + paso * 1.3;
    semi -= 6;
    G.b0 = semi * 0.9;
    G.b7 = semi * 0.46;
    G.ondas = semi * 0.08;
    G.hueco = 13;
    G.freno = acotar(paso * 0.8, 20, 50);
    poner(E.cab, bx, by);
    E.ciudades.forEach(function (e, i) { poner(e, bx, G.oy + G.u0[i] - e.offsetHeight / 2); });
    E.filtros.forEach(function (e, i) { poner(e, bx, G.oy + G.ug[i + 1] - e.offsetHeight / 2); });
    poner(E.usted, bx, G.oy + G.uFin - E.usted.offsetHeight / 2);
    G.lider = E.ciudades.map(function (e) {
      return bx + e.offsetWidth + 10;
    });
    G.liderF = E.filtros.map(function (e) { return bx + e.offsetWidth + 10; });
    G.liderU = bx + E.usted.offsetWidth + 10;
  }

  function medir() {
    if (!ctx) return;
    var re = lienzo.getBoundingClientRect();   // la lámina en flujo; el escenario entero en .viva
    W = Math.max(1, Math.round(re.width));
    H = Math.max(1, Math.round(re.height));
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    lienzo.width = Math.round(W * DPR);
    lienzo.height = Math.round(H * DPR);
    G.vertical = W < 900;
    banda.classList.toggle('vertical', G.vertical);
    var n = G.vertical ? 760 : (W >= 1280 ? 1900 : 1500);
    if (n !== N) { crear(n); reservar(n + 8); }
    var rb = banda.getBoundingClientRect();
    var bx = rb.left - re.left, by = rb.top - re.top;
    G.bx = bx; G.by = by;
    if (G.vertical) medirVertical(bx, by, rb.width, rb.height);
    else medirHorizontal(bx, by, rb.width, rb.height);
  }

  /* --- Dibujo por lotes: un trazo por nivel de opacidad --------------------- */
  var NB = 22;
  var puntos = [], trazos = [], chispas = [];
  var nP = new Int32Array(NB), nT = new Int32Array(NB), nC = new Int32Array(NB);
  var act = new Float32Array(9);
  var llegadas = [{}, {}, {}, {}];
  function reservar(cap) {
    puntos = []; trazos = []; chispas = [];
    for (var i = 0; i < NB; i++) { puntos.push(new Float32Array(cap * 3)); trazos.push(new Float32Array(cap * 4)); chispas.push(new Float32Array(cap * 4)); }
  }
  function nivel(a) { var i = (a * (NB - 1) + 0.5) | 0; return i >= NB ? NB - 1 : i; }
  function punto(x, y, r, a) { var i = nivel(a); if (i <= 0) return; var o = nP[i] * 3, d = puntos[i]; d[o] = x; d[o + 1] = y; d[o + 2] = r; nP[i]++; }
  function trazo(x1, y1, x2, y2, a) { var i = nivel(a); if (i <= 0) return; var o = nT[i] * 4, d = trazos[i]; d[o] = x1; d[o + 1] = y1; d[o + 2] = x2; d[o + 3] = y2; nT[i]++; }
  function chispa(u, w, largo, a) {
    var i = nivel(a); if (i <= 0) return; var o = nC[i] * 4, d = chispas[i];
    d[o] = X(u, w - largo); d[o + 1] = Y(u, w - largo); d[o + 2] = X(u, w + largo); d[o + 3] = Y(u, w + largo); nC[i]++;
  }
  function mancha(px) {
    var c = document.createElement('canvas'); c.width = c.height = px;
    var g = c.getContext('2d'), gr = g.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,255,255,0.4)');
    gr.addColorStop(0.55, 'rgba(255,255,255,0.08)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, px, px); return c;
  }
  var BRILLO = mancha(64);

  /* --- Una oportunidad en el avance q (en compuertas) ------------------------ */
  var S = { u: 0, w: 0, e: 0, dq: 0, tope: false };
  function ubicar(p, q) {
    var libre = U(p.c, q);
    S.e = 0; S.dq = -1; S.tope = false;
    var u = libre;
    if (p.s <= 7) {
      var tope = G.ug[p.s] - p.d;
      if (libre >= tope) { u = tope; S.tope = true; S.dq = (libre - tope) / G.paso; S.e = c01(S.dq / 0.05); }
    } else {
      var fin = G.uFin - 2, fr = G.freno;
      if (libre > fin - fr) { u = fin - fr * Math.exp(-(libre - fin + fr) / fr); S.dq = (libre - fin) / G.paso; }
    }
    S.u = u;
    S.w = cruz(p, u);
    if (S.e > 0 && !G.vertical) S.w += p.caida * 5 * sale3(c01(S.dq / 0.6));
    return S;
  }

  function particulas(f, cap, alfaP, estela) {
    var i, p, q, a, rad, x, y, pasadas;
    for (i = 0; i < 9; i++) act[i] = 0;
    for (i = 0; i < llegadas.length; i++) llegadas[i].on = false;
    if (alfaP <= 0.002) return;
    for (i = 0; i < P.length; i++) {
      p = P[i];
      q = cap ? f - p.lagC * L_CAP : f * p.v - p.lagP;
      if (q <= 0) continue;
      ubicar(p, q);
      pasadas = Math.min(7, Math.max(0, Math.floor(Math.min(q, p.s))));
      a = Math.min(1, p.b * (1 + 0.08 * pasadas));
      rad = p.rad;
      if (p.s === 8) {
        var luz = c01((S.u - G.ug[4]) / (G.ug[7] - G.ug[4]));
        a = mezcla(a, 1, luz); rad = mezcla(rad, 2.2, luz);
      } else if (S.e > 0) {
        a = mezcla(a, CENIZA * p.bm, sale3(S.e)) + 0.5 * Math.pow(1 - c01(S.dq / 0.06), 2);
        rad *= 1 - 0.2 * S.e;
        if (S.dq < 0.5) {
          act[p.s] += Math.exp(-S.dq / 0.15);
          if (!cap) chispa(G.ug[p.s], S.w, 6, 0.55 * Math.exp(-S.dq / 0.09) * alfaP);
        }
      }
      a *= c01(q / 0.15) * alfaP;
      x = X(S.u, S.w); y = Y(S.u, S.w);
      if (p.s === 8) {
        var L = llegadas[p.k];
        L.x = x; L.y = y; L.a = a; L.r = rad; L.u = S.u; L.on = true; L.p = p; L.dq = S.dq;
        continue;
      }
      punto(x, y, rad, a);
      if (estela && !S.tope) {
        var u1 = S.u, w1 = S.w;
        ubicar(p, q - 0.07);
        if (u1 - S.u > 0.8) trazo(X(S.u, S.w), Y(S.u, S.w), x, y, a * 0.34);
      }
    }
  }

  function vaciar() {
    var b, j, d, n;
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round';
    ctx.lineWidth = 1.3;
    for (b = 1; b < NB; b++) {
      n = nC[b]; if (!n) continue; d = chispas[b]; ctx.globalAlpha = b / (NB - 1); ctx.beginPath();
      for (j = 0; j < n * 4; j += 4) { ctx.moveTo(d[j], d[j + 1]); ctx.lineTo(d[j + 2], d[j + 3]); }
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    for (b = 1; b < NB; b++) {
      n = nT[b]; if (!n) continue; d = trazos[b]; ctx.globalAlpha = b / (NB - 1); ctx.beginPath();
      for (j = 0; j < n * 4; j += 4) { ctx.moveTo(d[j], d[j + 1]); ctx.lineTo(d[j + 2], d[j + 3]); }
      ctx.stroke();
    }
    for (b = 1; b < NB; b++) {
      n = nP[b]; if (!n) continue; d = puntos[b]; ctx.globalAlpha = b / (NB - 1); ctx.beginPath();
      for (j = 0; j < n * 3; j += 3) { ctx.moveTo(d[j] + d[j + 2], d[j + 1]); ctx.arc(d[j], d[j + 1], d[j + 2], 0, TAU); }
      ctx.fill();
    }
    nP.fill(0); nT.fill(0); nC.fill(0);
  }

  // La línea de una compuerta (o de «Usted») a lo largo de la banda.
  function linea(u, pr, desde) {
    ctx.beginPath();
    if (G.vertical) {
      var y = Math.round(G.oy + u) + 0.5, x0 = desde || G.lx0;
      ctx.moveTo(x0, y); ctx.lineTo(x0 + (G.lx1 - x0) * pr, y);
    } else {
      var x = Math.round(G.ox + u) + 0.5;
      ctx.moveTo(x, G.ly0); ctx.lineTo(x, G.ly0 + (G.ly1 - G.ly0) * pr);
    }
    ctx.stroke();
  }

  function estructura(t, cap, f, kAct) {
    var k, pr;
    ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 1;
    for (k = 1; k <= 7; k++) {
      pr = cap ? 1 : sale5(seg(t, 0.1 + 0.07 * k, 1.1));
      if (pr <= 0) continue;
      var trabajo = Math.min(1, act[k] / (G.vertical ? 4 : 7));
      var foco = cap ? (k === kAct ? 1 : 0) : 0;
      ctx.globalAlpha = 0.17 + 0.3 * trabajo + 0.28 * foco;
      linea(G.ug[k], pr, G.vertical ? G.liderF[k - 1] : 0);
    }
    // «Usted»
    pr = cap ? 1 : sale5(seg(t, 0.75, 1.1));
    if (pr > 0) {
      var enc = 0;
      for (k = 0; k < llegadas.length; k++) { var L = llegadas[k]; if (L.on && L.dq > -0.2) enc += 0.25; }
      ctx.globalAlpha = (0.3 + 0.4 * Math.min(1, enc)) * pr;
      linea(G.uFin, pr, G.vertical ? G.liderU : 0);
    }
    // Las ciudades: aro, punto y, en la portada, el pulso al soltar.
    for (var c = 0; c < 2; c++) {
      var ap = cap ? 1 : sale3(seg(t, 0.15 + 0.12 * c, 0.7));
      if (ap <= 0) continue;
      var x = X(G.u0[c], G.w0[c]), y = Y(G.u0[c], G.w0[c]);
      if (G.vertical && G.lider) {
        ctx.globalAlpha = 0.22 * ap; ctx.beginPath();
        var yy = Math.round(y) + 0.5; ctx.moveTo(G.lider[c], yy); ctx.lineTo(x - 10, yy); ctx.stroke();
      }
      var sale = cap ? 0.35 : suave(seg(t, 0.4, 0.4)) * (1 - suave(seg(t, 3.2, 1.2)));
      if (sale > 0) { ctx.globalAlpha = 0.5 * sale; ctx.drawImage(BRILLO, x - 16, y - 16, 32, 32); }
      ctx.globalAlpha = 0.36 * ap; ctx.beginPath(); ctx.arc(x, y, 6.5, 0, TAU); ctx.stroke();
      if (!cap) {
        var e = seg(t, 0.35 + 0.12 * c, 1.1);
        if (e > 0 && e < 1) { ctx.globalAlpha = 0.4 * (1 - e); ctx.beginPath(); ctx.arc(x, y, 6.5 + 18 * sale3(e), 0, TAU); ctx.stroke(); }
      }
      ctx.globalAlpha = 0.95 * ap; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, TAU); ctx.fill();
    }
  }

  // Las cuatro que pasan: su hilo (el recorrido completo) y su luz.
  function lasQuePasan() {
    var i, L;
    ctx.lineWidth = 1; ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff';
    for (i = 0; i < llegadas.length; i++) {
      L = llegadas[i]; if (!L.on) continue;
      var ah = 0.22 * c01((L.u - G.ug[3]) / (G.ug[6] - G.ug[3])) * (L.a > 0 ? Math.min(1, L.a * 1.2) : 0);
      if (ah <= 0.004) continue;
      ctx.globalAlpha = ah; ctx.beginPath();
      var desde = G.u0[L.p.c], pasos = 90;
      for (var j = 0; j <= pasos; j++) {
        var u = desde + (L.u - desde) * j / pasos, w = cruz(L.p, u);
        if (j) ctx.lineTo(X(u, w), Y(u, w)); else ctx.moveTo(X(u, w), Y(u, w));
      }
      ctx.stroke();
    }
    for (i = 0; i < llegadas.length; i++) {
      L = llegadas[i]; if (!L.on) continue;
      var cerca = c01((L.u - G.ug[6]) / (G.uFin - G.ug[6]));
      var R = 8 + 10 * cerca;
      ctx.globalAlpha = L.a * (0.25 + 0.5 * cerca); ctx.drawImage(BRILLO, L.x - R, L.y - R, R * 2, R * 2);
      ctx.globalAlpha = L.a; ctx.beginPath(); ctx.arc(L.x, L.y, L.r, 0, TAU); ctx.fill();
    }
  }

  /* --- Rótulos y textos ------------------------------------------------------- */
  function rotulos(t, cap, kAct, f) {
    var o, k;
    o = cap ? 1 : sale3(seg(t, 0.1, 0.8));
    estilo(E.cab, o, 'translate3d(0,' + ((1 - o) * 6).toFixed(1) + 'px,0)');
    for (k = 0; k < 2; k++) {
      o = cap ? 1 : sale3(seg(t, 0.15 + 0.12 * k, 0.8));
      estilo(E.ciudades[k], o, 'translate3d(' + ((1 - o) * -10).toFixed(1) + 'px,0,0)');
    }
    for (k = 0; k < 7; k++) {
      o = cap ? (k + 1 === kAct ? 1 : 0.75) : sale3(seg(t, 0.25 + 0.07 * k, 0.8));
      estilo(E.filtros[k], o, 'translate3d(0,' + ((1 - o) * (cap ? 0 : 8)).toFixed(1) + 'px,0)');
      var activo = cap && k + 1 === kAct;
      if (E.filtros[k].__a !== activo) { E.filtros[k].classList.toggle('activo', activo); E.filtros[k].__a = activo; }
    }
    o = cap ? 1 : sale3(seg(t, 0.9, 0.8));
    estilo(E.usted, o, 'translate3d(0,' + ((1 - o) * 8).toFixed(1) + 'px,0)');
    var ustedOn = cap ? f > 7.9 : t > T_INI + T_DUR * 0.78;
    if (E.usted.__a !== ustedOn) { E.usted.classList.toggle('activo', ustedOn); E.usted.__a = ustedOn; }
  }

  var capPrevio = -1;
  function textos(x, kAct) {
    // x: avance de la entrada a los capítulos (0 = portada, 1 = capítulo 1 en pantalla)
    var op = 1 - c01(x / 0.45);
    estilo(E.portada, op, 'translate3d(0,' + (-28 * c01(x / 0.6)).toFixed(1) + 'px,0)');
    var oculto = op < 0.02;
    if (E.portada.__h !== oculto) { E.portada.style.visibility = oculto ? 'hidden' : ''; E.portada.__h = oculto; }
    if (E.caps) estilo(E.caps, c01((x - 0.55) / 0.4));
    if (kAct !== capPrevio) {
      capPrevio = kAct;
      E.capitulos.forEach(function (el, i) { el.classList.toggle('activo', i + 1 === kAct); });
      E.marcas.forEach(function (el, i) { el.classList.toggle('hecho', i < kAct); });
    }
  }

  /* --- El cuadro ----------------------------------------------------------------
     s: avance de los capítulos. 0 = portada; de 0 a SEG_A, la entrada; luego un
     tramo por compuerta (el 7.º, más largo, termina en «Usted»).
       · .viva: s sale del scroll de toda la sección (ScrollTrigger, sin pin).
       · flujo: s sale de dónde va cada capítulo respecto a una línea de lectura
         bajo la lámina fija; se suaviza cuadro a cuadro.
       · «reducir movimiento»: la ilustración salta quieta al estado de cada
         capítulo, sin animación. */
  var viva = false;
  var estado = { p: 0 };
  var sFlujo = 0;
  var t0 = 0;
  function reloj() { return REDUCIDO || !MOV ? T_FIN : (performance.now() - t0) / 1000; }
  function fPortada(t) { var x = seg(t, T_INI, T_DUR); return F_FIN * (0.5 - 0.5 * Math.cos(Math.PI * x)); }

  // Tramo r (después de la entrada) → compuerta activa y frente.
  function enCapitulo(r, flujo) {
    var a = flujo ? 0.02 : 0.12, b = flujo ? 0.55 : 0.62;
    if (r < 6) {
      var k = Math.floor(r) + 1;
      return { k: k, f: k - 0.5 + suave((r - (k - 1) - a) / b) };
    }
    return { k: 7, f: 6.5 + 2.2 * suave(((r - 6) / SEG_7 - 0.08) / 0.72) };
  }

  function escena() {
    var t = reloj();
    var s = viva ? estado.p * SEG_TOTAL : sFlujo;
    var e = { t: t, cap: false, alfaP: 1, f: fPortada(t), kAct: 0, x: 0 };
    if (s <= 0) return e;
    if (REDUCIDO) {
      if (s < SEG_A * 0.5) return e;
      var kq = s < SEG_A ? 1 : Math.min(7, Math.floor(s - SEG_A) + 1);
      e.cap = true; e.kAct = kq; e.x = 1; e.f = kq < 7 ? kq + 0.5 : 8.7;
      return e;
    }
    if (s < SEG_A) {
      e.x = s / SEG_A;
      if (e.x < 0.5) e.alfaP = 1 - suave(e.x / 0.5);
      else { e.cap = true; e.f = 0.5; e.alfaP = suave((e.x - 0.5) / 0.5); e.kAct = e.x > 0.55 ? 1 : 0; }
    } else {
      var m = enCapitulo(s - SEG_A, !viva);
      e.cap = true; e.x = 1; e.f = m.f; e.kAct = m.k;
    }
    return e;
  }

  // Flujo: la línea de lectura va un poco abajo de la lámina fija.
  function sDeFlujo() {
    var n = E.pasos.length;
    if (!n || !E.lamina) return 0;
    var lb = E.lamina.getBoundingClientRect().bottom, vh = innerHeight;
    var libre = Math.max(80, vh - lb);
    var yL = lb + LECTURA * libre;
    var tops = E.pasos.map(function (el) { return el.getBoundingClientRect().top; });
    // El 7.º termina justo cuando la lámina se suelta (el fondo del escenario llega a su borde),
    // así el final de la animación no pide aire muerto debajo del último filtro.
    var fin = finFlujo(lb, yL);
    if (yL < tops[0]) return SEG_A * c01(1 - (tops[0] - yL) / (0.25 * libre));
    for (var k = 0; k < n; k++) {
      var b = k < n - 1 ? tops[k + 1] : fin;
      if (yL < b) {
        var fr = c01((yL - tops[k]) / Math.max(1, b - tops[k]));
        return SEG_A + (k < 6 ? k + fr : 6 + fr * SEG_7);
      }
    }
    return SEG_A + 6 + SEG_7;
  }

  function finFlujo(lb, yL) {
    // La lámina fija se suelta cuando el borde de CONTENIDO del escenario (sin su margen de abajo) le llega.
    var p = E.lamina.parentElement;
    var esc = p.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(p).paddingBottom) || 0);
    return Math.max(E.pasos[E.pasos.length - 1].getBoundingClientRect().bottom, esc + (yL - lb));
  }

  var pasoPrevio = -1;
  function dibujar() {
    if (!ctx) return;
    var e = escena();
    var estela = !e.cap && MOV && e.t < T_FIN;
    particulas(e.f, e.cap, e.alfaP, estela);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    estructura(e.t, e.cap, e.f, e.kAct);
    vaciar();
    lasQuePasan();
    ctx.globalAlpha = 1;
    rotulos(e.t, e.cap, e.kAct, e.f);
    if (viva) textos(e.x, e.kAct);
    else if (e.kAct !== pasoPrevio) {
      pasoPrevio = e.kAct;
      E.pasos.forEach(function (el, i) { el.classList.toggle('activo', i + 1 === e.kAct); });
    }
    return e;
  }

  /* --- Bucle: corre mientras dura la portada, mientras se suaviza el scroll
         del flujo o cuando ScrollTrigger avisa. ---------------------------------- */
  var pedido = 0, enPantalla = true;
  function cuadro() {
    pedido = 0;
    if (!enPantalla) return;
    var mas = false;
    if (!viva) {
      var obj = sDeFlujo();
      if (REDUCIDO || !MOV) sFlujo = obj;
      else {
        sFlujo += (obj - sFlujo) * 0.16;
        if (Math.abs(obj - sFlujo) < 0.002) sFlujo = obj; else mas = true;
      }
    }
    var e = dibujar();
    if (mas || (MOV && e && e.t < T_FIN)) pedido = requestAnimationFrame(cuadro);
  }
  function pedir() { if (!pedido) pedido = requestAnimationFrame(cuadro); }

  /* --- Titular --------------------------------------------------------------- */
  function titular() {
    if (!MOV) { raiz.classList.remove('intro'); return; }
    var lineas = todos('.h-linea > span', E.portada), entra = todos('.ent', seccion);
    gsap.set(lineas, { y: 0, yPercent: 110 });
    gsap.set(entra, { opacity: 0, y: 12 });
    raiz.classList.remove('intro');
    var tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    tl.to(lineas, { yPercent: 0, duration: 1.25, stagger: 0.12 })
      .to(entra, { opacity: 1, y: 0, duration: 1.0, stagger: 0.12, ease: 'power3.out' }, '<0.3');
    var espera = gsap.delayedCall(T_TIT, function () { tl.play(); });
    // Quien se adelanta (scroll, toque, tecla) no espera.
    var EV = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    function adelantar() { EV.forEach(function (n) { removeEventListener(n, adelantar); }); espera.kill(); tl.play(); }
    EV.forEach(function (n) { addEventListener(n, adelantar, { passive: true }); });
  }

  /* --- Entradas de las secciones ---------------------------------------------- */
  function entradas() {
    if (!MOV || !ST) { todos('.aparece').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; }); return; }
    ST.batch('.aparece', {
      start: 'top 88%', once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: 'power3.out', overwrite: true }); }
    });
  }

  /* --- El escenario fijo (compu con movimiento) ----------------------------------
     Sticky de CSS; ScrollTrigger solo lee el avance (sin pin). */
  function capitulos() {
    if (!MOV || !ST) { raiz.classList.remove('viva'); return; }
    gsap.matchMedia().add('(min-width: 900px) and (min-height: 600px)', function () {
      viva = true;
      raiz.classList.add('viva');
      medir();
      var tw = gsap.to(estado, {
        p: 1, ease: 'none', onUpdate: pedir,
        scrollTrigger: { trigger: seccion, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true }
      });
      pedir();
      return function () {
        tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill();
        viva = false; estado.p = 0; capPrevio = -1; pasoPrevio = -1;
        raiz.classList.remove('viva');
        E.portada.style.opacity = ''; E.portada.style.transform = ''; E.portada.style.visibility = '';
        E.portada.__o = E.portada.__t = E.portada.__h = undefined;
        medir(); sFlujo = sDeFlujo(); pedir();
      };
    });
  }

  /* --- Arranque ---------------------------------------------------------------- */
  function fuentes() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var f = ['400 13px acumin-pro', '500 14px acumin-pro', '300 60px acumin-pro', '400 11px "IBM Plex Mono"'].map(function (x) {
      return document.fonts.load(x).catch(function () {});
    });
    return Promise.race([Promise.all(f), new Promise(function (r) { setTimeout(r, 1400); })]);
  }

  function arrancar() {
    entradas();
    capitulos();
    medir();
    sFlujo = viva ? 0 : sDeFlujo();       // si la página abre a media altura, sin animar desde cero
    t0 = performance.now();
    titular();
    if (ST) ST.refresh();
    pedir();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { enPantalla = es[es.length - 1].isIntersecting; if (enPantalla) pedir(); }).observe(seccion);
  }
  addEventListener('scroll', function () { if (!viva) pedir(); }, { passive: true });
  var espera = 0, anchoPrevio = innerWidth;
  addEventListener('resize', function () {
    clearTimeout(espera);
    espera = setTimeout(function () {
      // En cel la barra del navegador cambia el alto al bajar: solo se vuelve a medir si cambia el ancho.
      if (innerWidth === anchoPrevio && innerWidth < 900) return;
      anchoPrevio = innerWidth;
      medir(); pedir();
    }, 140);
  });

  // Para revisar un instante: window.__verFiltro(p) pone el escenario fijo de compu en p (0–1).
  window.__verFiltro = function (p) { estado.p = p; dibujar(); };

  // Para revisar: el estado actual y la altura de scroll que pone el capítulo k a la altura fr de la línea de lectura.
  window.__filtroEstado = function () { var e = escena(); return { viva: viva, s: viva ? estado.p * SEG_TOTAL : sFlujo, k: e.kAct, f: +e.f.toFixed(2), cap: e.cap }; };
  window.__yCapitulo = function (k, fr) {
    var el = E.pasos[k - 1]; if (!el || viva) return -1;
    var lb = E.lamina.getBoundingClientRect().bottom, yL = lb + LECTURA * Math.max(80, innerHeight - lb);
    var r = el.getBoundingClientRect(), alto = k < 7 ? E.pasos[k].getBoundingClientRect().top - r.top : finFlujo(lb, yL) - r.top;
    return Math.round(scrollY + r.top + fr * alto - yL);
  };

  fuentes().then(arrancar, arrancar);
})();
