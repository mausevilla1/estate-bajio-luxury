/* ==========================================================================
   PRAETORA · San Miguel · «El filtro» en vivo (mini sección de inversionistas)
   --------------------------------------------------------------------------
   Luis (27-oct): la ilustración como un rectángulo a todo lo ancho, separada
   del texto y «en realidad»: que las líneas vayan avanzando y los puntos se
   vean, más como diseño de interfaz, real y profesional.
     · Flujo continuo: cada ciudad suelta oportunidades; en cada filtro se queda
       una parte (se apaga junto a la línea y desaparece) y el nombre del filtro
       se enciende mientras trabaja.
     · Cada CADA segundos una pasa los siete y su hilo avanza hasta «Usted»:
       una por ciudad, por turnos; el hilo anterior de esa ciudad se apaga.
     · Rótulos en HTML (nítidos); puntos y líneas en el lienzo, a la densidad
       de la pantalla. Horizontal en compu y tableta; vertical en cel.
     · Corre solo cuando se ve. Con «reducir movimiento», un cuadro quieto.
   Es el mismo concepto de la intro de Invertir (invertir.js), hecho para correr
   sin fin dentro de un panel.
   ========================================================================== */
(function () {
  'use strict';

  var panel = document.querySelector('.sf');
  var lienzo = panel && panel.querySelector('.sf-lienzo');
  if (!lienzo || !lienzo.getContext) return;
  var ctx = lienzo.getContext('2d');
  var QUIETO = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var TAU = Math.PI * 2;
  var PASA = [0.52, 0.56, 0.58, 0.6, 0.56, 0.5];   // de las que llegan a cada filtro, cuántas lo pasan (en el 7.º se quedan todas)
  var TASA = 34;                                   // oportunidades por segundo, entre las cuatro ciudades
  var VIAJE = [3.4, 4.8];                          // segundos de la ciudad a «Usted» (las que se quedan)
  var VIAJE_ELEGIDA = 4.2;                         // las que pasan los siete
  var CADA = 2.4;                                  // cada cuánto sale una que pasa los siete
  var TURNO = [1, 3, 2, 0];                        // León, San Miguel de Allende, Guanajuato, CDMX
  var CARRIL = [-0.42, -0.12, 0.1, 0.36];          // carril de la elegida, por ciudad (0 CDMX … 3 SMA)
  var LUGAR = [-1.5, -0.5, 0.5, 1.5];              // su lugar en «Usted», en el orden de las ciudades
  var CENIZA = 2.4;                                // vida media de la que se queda junto a un filtro (s)
  var CALENTAR = 14;                               // segundos simulados al armar: arranca ya lleno

  var ciudades = Array.prototype.slice.call(panel.querySelectorAll('.sf-ciudad'));
  var filtros = Array.prototype.slice.call(panel.querySelectorAll('.sf-filtro'));
  var cab = panel.querySelector('.sf-cab');
  var usted = panel.querySelector('.sf-usted');
  var leyenda = panel.querySelector('.sf-leyenda');

  /* --- Utilidades ------------------------------------------------------- */
  var semilla = 27102026;
  function azar() {                                // mulberry32: el mismo arranque siempre
    semilla = (semilla + 0x6D2B79F5) | 0;
    var t = Math.imul(semilla ^ semilla >>> 15, 1 | semilla);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  function c01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function suave(x) { x = c01(x); return x * x * (3 - 2 * x); }
  function acotar(x, a, b) { return x < a ? a : x > b ? b : x; }

  /* --- Geometría ---------------------------------------------------------
     u: a lo largo del flujo; w: de través. En horizontal el flujo va a la
     derecha; en vertical baja. */
  var G = { vertical: false, ox: 0, oy: 0, ug: [0, 0, 0, 0, 0, 0, 0], u0: [0, 0, 0, 0], w0: [0, 0, 0, 0],
            uFin: 1, b0: 1, b6: 1, hueco: 14, linea: [0, 0], freno: 20, conector: [] };
  var W = 0, H = 0, DPR = 1;
  function X(u, w) { return G.vertical ? G.ox + w : G.ox + u; }
  function Y(u, w) { return G.vertical ? G.oy + u : G.oy + w; }
  function poner(el, x, y) { el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)'; }

  function medirHorizontal() {
    var pad = W >= 1100 ? 40 : 28, k, c;
    var anchoC = 0;
    ciudades.forEach(function (e) { e.style.maxWidth = ''; anchoC = Math.max(anchoC, e.offsetWidth); });
    G.ox = pad + anchoC + 24;                                   // los nodos de las ciudades
    G.oy = 0;
    G.uFin = W - pad - usted.offsetWidth - 24 - G.ox;           // la línea de «Usted»
    var g0 = G.uFin * 0.13, g6 = G.uFin * 0.86, paso = (g6 - g0) / 6;
    for (k = 0; k < 7; k++) G.ug[k] = g0 + paso * k;
    var altoEtq = 0;
    filtros.forEach(function (e) { e.style.width = Math.max(64, Math.round(paso - 18)) + 'px'; altoEtq = Math.max(altoEtq, e.offsetHeight); });
    var arriba = pad + altoEtq + 24;
    var abajo = H - pad - (leyenda && leyenda.offsetHeight ? leyenda.offsetHeight + 20 : 0);
    var semi = (abajo - arriba) / 2;
    G.oy = arriba + semi;
    G.linea = [-semi - 6, semi + 6];
    G.b0 = semi * 0.78;
    G.b6 = semi * 0.34;
    var cg = acotar(semi * 0.3, 22, 46);
    for (c = 0; c < 4; c++) { G.u0[c] = 0; G.w0[c] = (c - 1.5) * cg; }
    G.hueco = acotar(semi * 0.11, 9, 15);
    G.freno = acotar(paso * 0.32, 12, 34);
    G.conector = [];
    poner(cab, G.ox - 16 - cab.offsetWidth, pad);
    ciudades.forEach(function (e, i) { poner(e, G.ox - 16 - e.offsetWidth, Y(0, G.w0[i]) - e.offsetHeight / 2); });
    filtros.forEach(function (e, i) { poner(e, X(G.ug[i], 0) + 10, pad); });
    poner(usted, X(G.uFin, 0) + 14, pad);
    if (leyenda) poner(leyenda, pad, H - pad - leyenda.offsetHeight);
  }

  function medirVertical() {
    var pad = 20, k, c;
    var col = acotar(W * 0.44, 118, 168);                       // columna de los rótulos
    ciudades.forEach(function (e) { e.style.maxWidth = col + 'px'; });
    filtros.forEach(function (e) { e.style.width = ''; });
    var izq = pad + col + 14, der = W - pad;
    var semi = (der - izq) / 2;
    G.ox = (izq + der) / 2;
    G.oy = 0;
    poner(cab, pad, pad);
    var y = pad + cab.offsetHeight + 10;
    var wN = [-0.72, -0.25, 0.22, 0.7];
    G.conector = [];
    ciudades.forEach(function (e, i) {
      poner(e, pad, y);
      G.u0[i] = y + Math.min(e.offsetHeight, 16) / 2;
      G.w0[i] = wN[i] * semi;
      G.conector.push(pad + Math.min(e.offsetWidth, col) + 8);
      y += e.offsetHeight + 6;
    });
    var ug0 = y + 28;
    var fin = H - pad - usted.offsetHeight - 10;               // la línea de «Usted»
    var paso = (fin - ug0) / 6.8;
    for (k = 0; k < 7; k++) G.ug[k] = ug0 + paso * k;
    G.uFin = fin;
    G.linea = [pad - G.ox, der - G.ox];                         // las líneas cruzan el panel
    G.b0 = semi * 0.92;
    G.b6 = semi * 0.46;
    G.hueco = acotar(semi * 0.1, 8, 12);
    G.freno = acotar(paso * 0.28, 7, 16);
    filtros.forEach(function (e, i) { poner(e, pad, G.ug[i] - e.offsetHeight - 4); });
    poner(usted, pad, fin + 8);
  }

  function medir() {
    var r = panel.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    DPR = Math.min(2, window.devicePixelRatio || 1);
    lienzo.width = Math.round(W * DPR);
    lienzo.height = Math.round(H * DPR);
    lienzo.style.width = W + 'px';
    lienzo.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    G.vertical = W < 600;
    panel.classList.toggle('sf--vertical', G.vertical);
    if (G.vertical) medirVertical(); else medirHorizontal();
    panel.classList.add('sf--listo');
  }

  /* --- Las oportunidades -------------------------------------------------- */
  var P = [];                                   // en camino y las que se quedaron (ceniza)
  var S = [];                                   // las que pasan los siete, con su hilo
  var actividad = [0, 0, 0, 0, 0, 0, 0];
  var encendido = [false, false, false, false, false, false, false];
  var reloj = 0, porSoltar = 0, proxima = 0.6, turno = 0;

  function reiniciar() {
    semilla = 27102026;
    P = []; S = [];
    actividad = [0, 0, 0, 0, 0, 0, 0];
    reloj = 0; porSoltar = 0; proxima = 0.6; turno = 0;
  }

  function soltar() {
    var c = Math.floor(azar() * 4);
    var k = 0;
    while (k < 6 && azar() < PASA[k]) k++;
    var u0 = G.u0[c];
    P.push({
      c: c, k: k, lin: u0, u: u0,
      v: (G.uFin - u0) / (VIAJE[0] + (VIAJE[1] - VIAJE[0]) * azar()),
      l: acotar((c - 1.5) / 1.5 * 0.55 + (azar() - 0.5) * 0.95, -1, 1),
      amp: azar() * 0.6, fr: 0.01 + 0.02 * azar(), ph: azar() * TAU,
      tope: G.ug[k] - (2 + 12 * azar() * azar()),
      r: 1.1 + 0.8 * azar(),
      paro: -1
    });
  }

  function lanzarElegida() {
    var c = TURNO[turno % 4];
    turno++;
    S.forEach(function (s) { if (s.c === c && s.apaga < 0) s.apaga = reloj; });
    var u0 = G.u0[c];
    S.push({ c: c, lin: u0, u: u0, v: (G.uFin - u0) / VIAJE_ELEGIDA, l: CARRIL[c], amp: 0.3, fr: 0.008, ph: c * 2.1,
             puntos: [], llego: -1, apaga: -1 });
  }

  // De través: sale de su ciudad, toma su carril y la banda se angosta hacia «Usted».
  function cruz(p, u, elegida) {
    var a = suave((u - G.u0[p.c]) / Math.max(20, G.ug[0] - 8 - G.u0[p.c]));
    var k = c01((u - G.ug[0]) / (G.ug[6] - G.ug[0]));
    var banda = G.b0 + (G.b6 - G.b0) * k;
    var w = G.w0[p.c] + (p.l * banda - G.w0[p.c]) * a;
    w += p.amp * banda * 0.08 * Math.sin(p.fr * u + p.ph) * a * (1 - 0.6 * k);
    if (elegida) {
      var b = suave((u - G.ug[6]) / Math.max(10, G.uFin - G.ug[6] - 6));
      w += (LUGAR[p.c] * G.hueco - w) * b;
    }
    return w;
  }

  function paso(dt) {
    var i, k, p, s;
    reloj += dt;
    porSoltar += TASA * dt;
    while (porSoltar >= 1) { soltar(); porSoltar -= 1; }
    proxima -= dt;
    if (proxima <= 0) { lanzarElegida(); proxima += CADA; }
    var baja = Math.exp(-dt / 0.9);
    for (k = 0; k < 7; k++) actividad[k] *= baja;

    for (i = P.length - 1; i >= 0; i--) {
      p = P[i];
      if (p.paro < 0) {
        p.lin += p.v * dt;
        p.u = p.lin > p.tope - G.freno ? p.tope - G.freno * Math.exp(-(p.lin - p.tope + G.freno) / G.freno) : p.lin;
        if (p.lin > p.tope + 2 * G.freno) {
          p.paro = reloj;
          actividad[p.k] = Math.min(1, actividad[p.k] + 0.2);
        }
      } else if (reloj - p.paro > CENIZA * 3) {
        P.splice(i, 1);
      }
    }

    for (i = S.length - 1; i >= 0; i--) {
      s = S[i];
      if (s.llego < 0) {
        s.lin += s.v * dt;
        s.u = Math.min(s.lin, G.uFin);
        var w = cruz(s, s.u, true);
        var x = X(s.u, w), y = Y(s.u, w), ult = s.puntos[s.puntos.length - 1];
        if (!ult || Math.abs(x - ult[0]) + Math.abs(y - ult[1]) > 2.5) s.puntos.push([x, y]);
        for (k = 0; k < 7; k++) if (s.u >= G.ug[k] && !s['f' + k]) { s['f' + k] = 1; actividad[k] = Math.min(1, actividad[k] + 0.5); }
        if (s.lin >= G.uFin) { s.llego = reloj; s.puntos.push([x, y]); }
      }
      if (s.apaga >= 0 && reloj - s.apaga > 2.5) S.splice(i, 1);
    }
  }

  /* --- Dibujo ------------------------------------------------------------- */
  function linea(u, wa, wb, alfa, grueso) {
    ctx.strokeStyle = 'rgba(255,255,255,' + alfa.toFixed(3) + ')';
    ctx.lineWidth = grueso;
    ctx.beginPath();
    ctx.moveTo(X(u, wa), Y(u, wa));
    ctx.lineTo(X(u, wb), Y(u, wb));
    ctx.stroke();
  }

  function dibujar() {
    var i, k, p, s, a;
    ctx.clearRect(0, 0, W, H);

    // Las siete compuertas y la de «Usted» (con su luz).
    for (k = 0; k < 7; k++) linea(G.ug[k], G.linea[0], G.linea[1], 0.14 + 0.34 * actividad[k], 1);
    linea(G.uFin, G.linea[0], G.linea[1], 0.05, 12);
    linea(G.uFin, G.linea[0], G.linea[1], 0.1, 4);
    linea(G.uFin, G.linea[0], G.linea[1], 0.75, 1);

    // Las ciudades: nodo con anillo (y, en vertical, el hilo hasta su rótulo).
    for (i = 0; i < 4; i++) {
      var cx = X(G.u0[i], G.w0[i]), cy = Y(G.u0[i], G.w0[i]);
      if (G.vertical && G.conector[i]) {
        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(G.conector[i], cy); ctx.lineTo(cx - 8, cy); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 4.5, 0, TAU); ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(cx, cy, 1.8, 0, TAU); ctx.fill();
    }

    // Las que se quedan en un filtro (ceniza) y las que van en camino.
    for (i = 0; i < P.length; i++) {
      p = P[i];
      var w = cruz(p, p.u, false);
      if (p.paro >= 0) {
        a = 0.56 * Math.exp(-(reloj - p.paro) / CENIZA);
        if (a < 0.02) continue;
        ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(X(p.u, w), Y(p.u, w), p.r * 0.85, 0, TAU); ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.86)';
        ctx.beginPath(); ctx.arc(X(p.u, w), Y(p.u, w), p.r, 0, TAU); ctx.fill();
      }
    }

    // Las que pasan los siete: su hilo avanza y se queda; al llegar, su luz en «Usted».
    for (i = 0; i < S.length; i++) {
      s = S[i];
      var fade = s.apaga >= 0 ? Math.exp(-(reloj - s.apaga) / 0.7) : 1;
      if (s.puntos.length > 1) {
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.42 * fade).toFixed(3) + ')';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(s.puntos[0][0], s.puntos[0][1]);
        for (k = 1; k < s.puntos.length; k++) ctx.lineTo(s.puntos[k][0], s.puntos[k][1]);
        ctx.stroke();
      }
      var ult = s.puntos[s.puntos.length - 1];
      if (!ult) continue;
      var brillo = s.llego >= 0 ? Math.exp(-(reloj - s.llego) / 1.4) : 0.5;
      var halo = ctx.createRadialGradient(ult[0], ult[1], 0, ult[0], ult[1], 16);
      halo.addColorStop(0, 'rgba(255,255,255,' + ((0.28 + 0.5 * brillo) * fade).toFixed(3) + ')');
      halo.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(ult[0], ult[1], 16, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,' + fade.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(ult[0], ult[1], 2.4, 0, TAU); ctx.fill();
    }

    // El nombre del filtro se enciende mientras trabaja.
    for (k = 0; k < 7; k++) {
      var on = actividad[k] > 0.3;
      if (on !== encendido[k]) { encendido[k] = on; filtros[k].classList.toggle('is-activo', on); }
    }
  }

  /* --- Arranque ------------------------------------------------------------ */
  function armar() {
    medir();
    reiniciar();
    for (var t = 0; t < CALENTAR; t += 1 / 30) paso(1 / 30);
    dibujar();
  }

  var corriendo = false, visible = false, ultimo = 0, raf = 0;
  function cuadro(ahora) {
    if (!corriendo) return;
    var dt = ultimo ? Math.min(0.05, (ahora - ultimo) / 1000) : 1 / 60;
    ultimo = ahora;
    paso(dt);
    dibujar();
    raf = requestAnimationFrame(cuadro);
  }
  function arrancar() {
    if (corriendo || QUIETO || !visible || document.hidden) return;
    corriendo = true;
    ultimo = 0;
    raf = requestAnimationFrame(cuadro);
  }
  function parar() { corriendo = false; cancelAnimationFrame(raf); }

  armar();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      if (visible) arrancar(); else parar();
    }, { rootMargin: '80px 0px' }).observe(panel);
  } else {
    visible = true;
    arrancar();
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) parar(); else arrancar(); });
  var espera = 0, anchoAntes = W;
  window.addEventListener('resize', function () {
    clearTimeout(espera);
    espera = setTimeout(function () {
      var r = panel.getBoundingClientRect();
      if (Math.round(r.width) === anchoAntes && Math.round(r.height) === H) return;
      anchoAntes = Math.round(r.width);
      parar();
      armar();
      arrancar();
    }, 160);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { parar(); armar(); arrancar(); });
  window.__filtroPanel = { paso: paso, dibujar: dibujar };
})();
