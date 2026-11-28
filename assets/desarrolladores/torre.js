// La torre de PRAETORA: una torre residencial de lujo en isométrico, dibujada con medidas (metros) y proyectada a 30°.
// La misma torre sirve de portada (oscura), de tablero (blanca) y de plano de ubicación en el cel (mini).
// Emblema genérico: no es ningún desarrollo real. Cada zona es un enlace a su pieza.
(() => {
  const C = Math.cos(Math.PI / 6), S = 0.5;
  const P = (x, y, z = 0) => [(x - y) * C, (x + y) * S - z];
  const r = n => Math.round(n * 100) / 100;
  const pt = p => { const [a, b] = P(...p); return r(a) + ' ' + r(b); };

  // ── Medidas
  const W = 24, D = 18;                                   // torre
  const PX0 = -10, PX1 = 34, PY0 = -8, PY1 = 30, PH = 7.2; // podio con lobby a doble altura
  const H = 3.4, Z0 = PH, NB = 12, ZB = Z0 + NB * H;      // 12 niveles tipo
  const UX = 17, UY = 12, ZT = ZB + 2 * H, ZP = ZT + 3;    // 2 niveles remetidos (penthouse) y roof
  const VB = { portada: [-67, -63, 130, 104], cel: [-58, -63, 115, 104], tablero: [-31, -63, 68, 104], mini: [-28, -63, 62, 104] };

  // Cámara del tablero: centro x, acercamiento y un ligero desplazamiento vertical (de la calle al roof)
  const CAMARA = { '01': [-4, 1.06, 5], '02': [2, 1.0, 2], '03': [3, 1.05, 0], '04': [-3, 1.08, -3] };
  const vista = z => {
    const [x0, y0, w0, h0] = VB.tablero;
    const [cx, k, dy] = CAMARA[z] || [x0 + w0 / 2, 1, 0];
    const w = w0 / k, h = h0 / k, cy = y0 + h0 / 2 + dy;
    return [cx - w / 2, cy - h / 2, w, h].map(r).join(' ');
  };

  // ── Primitivas. d = retraso del trazo en la portada: se dibuja de la calle al roof.
  const dz = z => r(0.15 + Math.max(0, z) / ZP * 1.9);
  const L = (pts, cls, z) => `<path class="${cls}" d="M${pts.map(pt).join(' L')}" pathLength="1" style="--d:${dz(z ?? Math.min(...pts.map(p => p[2] || 0)))}s"/>`;
  const F = (pts, cls, extra = '') => `<path class="${cls}" d="M${pts.map(pt).join(' L')}Z" ${extra}/>`;
  const caras = (x0, x1, y0, y1, z0, z1, extra = '') =>
    F([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], 'c-der' + extra) +
    F([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], 'c-izq' + extra) +
    F([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], 'c-sup' + extra);
  const contorno = (x0, x1, y0, y1, z0, z1, cls = 'contorno') =>
    L([[x0, y1, z0], [x1, y1, z0], [x1, y0, z0]], cls, z0) +
    L([[x0, y1, z0], [x0, y1, z1]], cls, z0) + L([[x1, y1, z0], [x1, y1, z1]], cls, z0) + L([[x1, y0, z0], [x1, y0, z1]], cls, z0) +
    L([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [x0, y0, z1]], cls, z1);
  const cajaFina = (x0, x1, y0, y1, z0, z1) => caras(x0, x1, y0, y1, z0, z1) + contorno(x0, x1, y0, y1, z0, z1, 'medio');
  // Una cara con piel de muros y cristal: bahías [desde, hasta, 'v'|'m'], parteluces cada «paso» en el cristal
  const piel = (cara, fijo, bahias, z0, z1, paso, finZ = z1) => {
    let s = '';
    const Q = (u, z) => cara === 'izq' ? [u, fijo, z] : [fijo, u, z];
    bahias.forEach(([a, b, t]) => {
      if (t !== 'v') return;
      s += F([Q(a, z0), Q(b, z0), Q(b, finZ), Q(a, finZ)], 'g-' + cara);
      const n = Math.max(1, Math.round((b - a) / paso));
      for (let k = 1; k < n; k++) { const u = a + (b - a) * k / n; s += L([Q(u, z0), Q(u, finZ)], 'parteluz', z0); }
      s += L([Q(a, z0), Q(a, finZ)], 'jamba', z0) + L([Q(b, z0), Q(b, finZ)], 'jamba', z0);
    });
    return s;
  };
  // Árbol en isométrico: tronco y copa (una esfera se ve como círculo)
  const arbol = (x, y, z, alto = 3.6, radio = 1.7) => {
    const [a, b] = P(x, y, z + alto);
    return L([[x, y, z], [x, y, z + alto - radio * .6]], 'fino', z) + `<circle class="copa" cx="${r(a)}" cy="${r(b)}" r="${radio}" pathLength="1" style="--d:${dz(z)}s"/>`;
  };
  // Barandal de vidrio sobre un borde (de p a q), a la altura z
  const barandal = (p, q, z, alto = 1.05) =>
    F([[...p, z], [...q, z], [...q, z + alto], [...p, z + alto]], 'vidrio') + L([[...p, z + alto], [...q, z + alto]], 'baranda', z);
  // Losa de balcón: planta (contorno) y sus bordes que dan al frente
  const balcon = (planta, frentes, z, esp = .32) => {
    let s = F(planta.map(([x, y]) => [x, y, z + esp]), 'c-sup');
    frentes.forEach(([p, q, cara]) => { s += F([[...p, z], [...q, z], [...q, z + esp], [...p, z + esp]], 'c-' + cara); });
    frentes.forEach(([p, q]) => { s += L([[...p, z], [...q, z]], 'medio', z); });
    frentes.forEach(([p, q]) => { s += barandal(p, q, z + esp); });
    return s;
  };
  const estatus = (i, u) => { const h = (i * 7 + u * 5 + (i > 7 ? 3 : 0)) % 10; return h < 4 ? 'vendida' : h < 6 ? 'apartada' : 'disponible'; };

  const dibujar = (svg, modo) => {
    const id = 'tz-' + modo;
    let s = `<defs>
      <radialGradient id="${id}-g" cx="${r(P(12, 22, 0)[0])}" cy="${r(P(12, 22, 0)[1])}" r="50" gradientUnits="userSpaceOnUse">
        <stop offset=".3" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <mask id="${id}-m" maskUnits="userSpaceOnUse" x="-90" y="-90" width="200" height="200"><rect x="-90" y="-90" width="200" height="200" fill="url(#${id}-g)"/></mask>
      <pattern id="${id}-raya" width=".9" height=".9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1=".2" y1="0" x2=".2" y2=".9" stroke="currentColor" stroke-width=".16"/></pattern>
    </defs>`;

    // ── Suelo: retícula, calle, bahía de acceso y plaza de llegada
    let suelo = '';
    for (let y = -12; y <= 56; y += 4) suelo += L([[-28, y, 0], [60, y, 0]], 'reticula', 0);
    for (let x = -24; x <= 60; x += 4) suelo += L([[x, -14, 0], [x, 56, 0]], 'reticula', 0);
    let calle = '';
    calle += F([[-34, 42, 0], [64, 42, 0], [64, 52, 0], [-34, 52, 0]], 'asfalto');
    calle += L([[-34, 52, 0], [64, 52, 0]], 'medio', 0) + L([[-34, 42, 0], [-4, 42, 0]], 'medio', 0) + L([[30, 42, 0], [64, 42, 0]], 'medio', 0);
    calle += L([[-34, 47, 0], [64, 47, 0]], 'eje', 0);
    for (let k = 0; k < 7; k++) calle += L([[40 + k * 1.1, 42.8, 0], [40 + k * 1.1, 51.2, 0]], 'cebra', 0);
    const bahia = [[-4, 42, 0], [3, 37.6, 0], [23, 37.6, 0], [30, 42, 0]];
    calle += F(bahia, 'bahia') + L([...bahia], 'medio', 0);
    for (let y = 32; y < 37.6; y += 1.8) calle += L([[-8, y, 0], [32, y, 0]], 'reticula fuerte', 0);
    let arbolesCalle = '';
    [[-14, 39.5], [-8, 39.5], [32, 39.5], [38, 39.5], [40, 30], [40, 22], [40, 14]].forEach(([x, y]) => { arbolesCalle += arbol(x, y, 0, 4.2, 1.9); });

    // ── Zona 01: la calle y la llegada (película de lanzamiento)
    const ruta = [[-30, 47.6, .8], [-12, 47.6, .8], [-2, 44.5, .8], [4, 40.8, .8], [13, 38.8, .8]].map(p => P(...p));
    const dRuta = `M${r(ruta[0][0])} ${r(ruta[0][1])} C${r(ruta[1][0])} ${r(ruta[1][1])} ${r(ruta[2][0])} ${r(ruta[2][1])} ${r(ruta[3][0])} ${r(ruta[3][1])} S${r(ruta[4][0])} ${r(ruta[4][1])} ${r(ruta[4][0])} ${r(ruta[4][1])}`;
    const z05 = `<g class="ov ov-01">${F(bahia, 'pulso')}${F([[-8, PY1, 0], [32, PY1, 0], [32, 37.6, 0], [-8, 37.6, 0]], 'relleno')}
      <path class="ruta" d="${dRuta}" id="${id}-ruta"/>
      <circle class="punto-movil" r="1"><animateMotion dur="7s" repeatCount="indefinite"><mpath href="#${id}-ruta"/></animateMotion></circle></g>`;

    // ── Podio: lobby a doble altura acristalado, marquesina y cubierta de amenidades
    let podio = caras(PX0, PX1, PY0, PY1, 0, PH);
    podio += piel('izq', PY1, [[PX0, -6, 'm'], [-6, PX1 - 1.5, 'v']], 0, PH, 3, PH - .8);
    podio += piel('der', PX1, [[PY0, -4, 'm'], [-4, PY1 - 1.5, 'v']], 0, PH, 3, PH - .8);
    podio += L([[PX0, PY1, PH - .8], [PX1, PY1, PH - .8], [PX1, PY0, PH - .8]], 'medio', PH);
    podio += contorno(PX0, PX1, PY0, PY1, 0, PH);
    // marquesina de acceso
    podio += caras(5, 21, PY1, PY1 + 6, 4.4, 4.8) + contorno(5, 21, PY1, PY1 + 6, 4.4, 4.8, 'medio');
    podio += L([[6.5, PY1 + 5.4, 0], [6.5, PY1 + 5.4, 4.4]], 'medio', 0) + L([[19.5, PY1 + 5.4, 0], [19.5, PY1 + 5.4, 4.4]], 'medio', 0);
    // cubierta: alberca, pérgola, árboles y barandal (va delante de la torre, se dibuja después)
    let cubierta = '';
    cubierta += F([[2, 22.5, PH], [16, 22.5, PH], [16, 27.5, PH], [2, 27.5, PH]], 'agua') + L([[2, 22.5, PH], [16, 22.5, PH], [16, 27.5, PH], [2, 27.5, PH], [2, 22.5, PH]], 'medio', PH);
    cubierta += L([[2.8, 23.3, PH], [15.2, 23.3, PH], [15.2, 26.7, PH], [2.8, 26.7, PH], [2.8, 23.3, PH]], 'fino', PH);
    const PG = PH + 3;
    cubierta += L([[32, 2, PH], [32, 2, PG]], 'medio', PH) + L([[32, 13, PH], [32, 13, PG]], 'medio', PH) + L([[26.5, 13, PH], [26.5, 13, PG]], 'medio', PH);
    for (let y = 2; y <= 13.01; y += 1.375) cubierta += L([[26.5, y, PG], [32, y, PG]], 'fino', PG);
    cubierta += L([[26.5, 2, PG], [32, 2, PG], [32, 13, PG], [26.5, 13, PG], [26.5, 2, PG]], 'medio', PG);
    [[20, 25], [24, 27], [29.5, 18], [30, 24.5], [-6, 25], [-6, 4]].forEach(([x, y]) => { cubierta += arbol(x, y, PH, 3.4, 1.6); });
    cubierta += barandal([PX0, PY1], [PX1, PY1], PH) + barandal([PX1, PY1], [PX1, PY0], PH);

    // ── Torre: doce niveles tipo con losas marcadas, piel de muros y cristal, balcones con barandal de vidrio
    const bahIzq = [[0, 1.5, 'm'], [1.5, 10, 'v'], [10, 12, 'm'], [12, 24, 'v']];
    const bahDer = [[0, 1.5, 'm'], [1.5, 8.5, 'v'], [8.5, 10, 'm'], [10, 18, 'v']];
    let torre = caras(0, W, 0, D, Z0, ZB);
    torre += piel('izq', D, bahIzq, Z0, ZB, 3);
    torre += piel('der', W, bahDer, Z0, ZB, 2.7);
    // losas por nivel: una banda clara con su canto
    for (let i = 1; i <= NB; i++) {
      const z = Z0 + i * H;
      torre += F([[0, D, z - .42], [W, D, z - .42], [W, D, z], [0, D, z]], 'c-banda') + F([[W, 0, z - .42], [W, D, z - .42], [W, D, z], [W, 0, z]], 'c-banda');
      torre += L([[0, D, z], [W, D, z], [W, 0, z]], 'losa', z) + L([[0, D, z - .42], [W, D, z - .42], [W, 0, z - .42]], 'fino', z);
    }
    torre += contorno(0, W, 0, D, Z0, ZB);
    // balcones: uno en esquina que da la vuelta en todos los niveles y otro chico que alterna (ritmo)
    let balcones = '';
    for (let i = NB - 1; i >= 1; i--) {
      const z = Z0 + i * H;
      balcones += balcon([[12, D], [12, D + 2.2], [W + 2.2, D + 2.2], [W + 2.2, 10], [W, 10], [W, D]],
        [[[12, D + 2.2], [W + 2.2, D + 2.2], 'izq'], [[W + 2.2, D + 2.2], [W + 2.2, 10], 'der']], z);
      if (i % 2 === 0) balcones += balcon([[2.5, D], [2.5, D + 1.5], [9, D + 1.5], [9, D]], [[[2.5, D + 1.5], [9, D + 1.5], 'izq']], z);
      else balcones += balcon([[W, 2.5], [W + 1.5, 2.5], [W + 1.5, 7.5], [W, 7.5]], [[[W + 1.5, 7.5], [W + 1.5, 2.5], 'der']], z);
    }
    // penthouse remetido con terraza en esquina, y roof con pabellón, jardín y pérgola
    let remate = caras(0, UX, 0, UY, ZB, ZT);
    remate += piel('izq', UY, [[0, 1.5, 'm'], [1.5, 8, 'v'], [8, 9.5, 'm'], [9.5, UX, 'v']], ZB, ZT, 2.6, ZB + H - .42);
    remate += piel('der', UX, [[0, 1.5, 'm'], [1.5, 5, 'v'], [5, 6.5, 'm'], [6.5, UY, 'v']], ZB, ZT, 2.6, ZB + H - .42);
    remate += piel('izq', UY, [[1.5, 8, 'v'], [9.5, UX, 'v']], ZB + H, ZT, 2.6, ZT - .42);
    remate += piel('der', UX, [[1.5, 5, 'v'], [6.5, UY, 'v']], ZB + H, ZT, 2.6, ZT - .42);
    remate += F([[0, UY, ZB + H - .42], [UX, UY, ZB + H - .42], [UX, UY, ZB + H], [0, UY, ZB + H]], 'c-banda') + F([[UX, 0, ZB + H - .42], [UX, UY, ZB + H - .42], [UX, UY, ZB + H], [UX, 0, ZB + H]], 'c-banda');
    remate += L([[0, UY, ZB + H], [UX, UY, ZB + H], [UX, 0, ZB + H]], 'losa', ZB + H);
    remate += contorno(0, UX, 0, UY, ZB, ZT);
    let terraza = '';
    terraza += cajaFina(19, 23, 13.5, 16.5, ZB, ZB + .7) + arbol(21, 15, ZB + .7, 2.8, 1.4);
    terraza += cajaFina(2, 7, 14.5, 16.5, ZB, ZB + .7) + arbol(4.5, 15.5, ZB + .7, 2.6, 1.3);
    terraza += barandal([0, D], [W, D], ZB) + barandal([W, D], [W, 0], ZB);
    let roof = '';
    roof += cajaFina(1.5, 7, 1.5, 6, ZT, ZT + 2.8);
    roof += cajaFina(1.5, 7, 7.2, 10.5, ZT, ZT + .6) + arbol(3, 8.8, ZT + .6, 2.4, 1.2) + arbol(5.6, 9, ZT + .6, 2.2, 1.1);
    roof += L([[15.5, 1.5, ZT], [15.5, 1.5, ZP]], 'medio', ZT) + L([[15.5, 10, ZT], [15.5, 10, ZP]], 'medio', ZT) + L([[8.5, 10, ZT], [8.5, 10, ZP]], 'medio', ZT);
    for (let x = 8.5; x <= 15.51; x += 1.4) roof += L([[x, 1.5, ZP], [x, 10, ZP]], 'fino', ZP);
    roof += L([[8.5, 1.5, ZP], [15.5, 1.5, ZP], [15.5, 10, ZP], [8.5, 10, ZP], [8.5, 1.5, ZP]], 'medio', ZP);
    roof += barandal([0, UY], [UX, UY], ZT) + barandal([UX, UY], [UX, 0], ZT);

    // ── Zona 02: la fachada, encuadrada por la cámara del render
    const CAM = [40, 40, 1.6], [cx, cy] = P(...CAM);
    const z04 = `<g class="ov ov-02">${F([[W, 0, Z0], [W, D, Z0], [W, D, ZB], [W, 0, ZB]], 'pulso')}${F([[0, D, Z0], [W, D, Z0], [W, D, ZB], [0, D, ZB]], 'pulso')}
      ${F([[UX, 0, ZB], [UX, UY, ZB], [UX, UY, ZT], [UX, 0, ZT]], 'pulso')}${F([[0, UY, ZB], [UX, UY, ZB], [UX, UY, ZT], [0, UY, ZT]], 'pulso')}
      ${[[0, D, ZB], [W, 0, ZB], [0, UY, ZT], [PX0, PY1, 0], [PX1, PY0, 0]].map(p => `<path class="rayo" d="M${r(cx)} ${r(cy)} L${pt(p)}"/>`).join('')}
      <g class="camara" transform="translate(${r(cx)} ${r(cy)})"><rect x="-2.4" y="-1.5" width="3.6" height="3" rx=".3"/><path d="M1.2 -.8 L3 -1.7 L3 1.7 L1.2 .8Z"/></g></g>`;

    // ── Zona 03: los pisos con su estatus y un nivel elegido
    let celdas = '';
    const unidades = [[[1.6, D], [9.9, D]], [[12.1, D], [23.9, D]], [[W, 10.1], [W, 17.9]], [[W, 1.6], [W, 8.4]]];
    for (let i = 0; i < NB; i++) {
      const z0 = Z0 + i * H + .1, z1 = Z0 + (i + 1) * H - .5;
      unidades.forEach(([[ax, ay], [bx, by]], k) => {
        const e = estatus(i, k === 2 ? 1 : k);
        if (e === 'disponible') return;
        celdas += F([[ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1]], 'e-' + e, e === 'apartada' ? `fill="url(#${id}-raya)"` : '');
      });
    }
    const NIV = 6, zn0 = Z0 + NIV * H, zn1 = zn0 + H;
    const z03 = `<g class="ov ov-03">${celdas}<path class="nivel" d="M${pt([0, D, zn0])} L${pt([W, D, zn0])} L${pt([W, 0, zn0])} L${pt([W, 0, zn1])} L${pt([W, D, zn1])} L${pt([0, D, zn1])}Z"/></g>`;

    // ── Zona 04: la unidad sale de la torre y se camina por dentro
    const uz = Z0 + 8 * H, ux0 = 1, ux1 = 10, uy0 = 22, uy1 = 31;
    const [m0, m1] = P(2.4, uy1 - 1.3, uz), [m2, m3] = P(8.6, uy1 - 1.6, uz), [m4, m5] = P(8.8, uy0 + 2.2, uz), [m6, m7] = P(3, uy0 + 1.8, uz);
    const hueco = [[1.6, D, uz + .1], [9.9, D, uz + .1], [9.9, D, uz + H - .5], [1.6, D, uz + H - .5]];
    const z01 = `<g class="ov ov-04">
      ${F(hueco, 'hueco')}
      ${hueco.map(p => `<path class="guia" d="M${pt(p)} L${pt([p[0] < 5 ? ux0 : ux1, uy0, p[2] - .1])}"/>`).join('')}
      ${F([[ux0, uy0, uz], [ux1, uy0, uz], [ux1, uy1, uz], [ux0, uy1, uz]], 'piso')}
      ${F([[ux0, uy0, uz], [ux1, uy0, uz], [ux1, uy1, uz], [ux0, uy1, uz]], 'pulso')}
      ${F([[ux1, uy0, uz], [ux1, uy1, uz], [ux1, uy1, uz + 1], [ux1, uy0, uz + 1]], 'muro-d')}
      ${F([[ux0, uy1, uz], [ux1, uy1, uz], [ux1, uy1, uz + 1], [ux0, uy1, uz + 1]], 'muro-i')}
      <path class="tabique" d="M${pt([5.5, uy0, uz])} L${pt([5.5, uy0 + 4.2, uz])} M${pt([ux0, uy0 + 5.2, uz])} L${pt([3.6, uy0 + 5.2, uz])} M${pt([6, uy0 + 5.2, uz])} L${pt([ux1, uy0 + 5.2, uz])}"/>
      <path class="guia" d="M${pt([ux0, uy0, uz + H])} L${pt([ux1, uy0, uz + H])} L${pt([ux1, uy1, uz + H])} L${pt([ux0, uy1, uz + H])}Z M${pt([ux1, uy1, uz])} L${pt([ux1, uy1, uz + H])} M${pt([ux0, uy1, uz])} L${pt([ux0, uy1, uz + H])} M${pt([ux1, uy0, uz])} L${pt([ux1, uy0, uz + H])}"/>
      <path class="paseo" id="${id}-paseo" d="M${r(m0)} ${r(m1)} C${r(m2)} ${r(m3)} ${r(m2)} ${r(m3)} ${r(m4)} ${r(m5)} S${r(m6)} ${r(m7)} ${r(m6)} ${r(m7)}"/>
      <circle class="punto-movil" r=".85"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#${id}-paseo"/></animateMotion></circle></g>`;

    // ── Zonas tocables (transparentes, encima de todo): cuatro piezas, de la calle a la unidad
    const zona = (z, nombre, formas) => `<a class="zona" href="#pieza-${z}" data-z="${z}" aria-label="${nombre}">${formas.map(f => F(f, 'toque')).join('')}</a>`;
    const toques = [
      zona('01', 'Película de lanzamiento: la llegada', [[[-30, 30, 0], [60, 30, 0], [60, 52, 0], [-30, 52, 0]]]),
      zona('02', 'Renders: la fachada', [[[PX0, PY1, 0], [PX1, PY1, 0], [PX1, PY1, PH], [PX0, PY1, PH]], [[PX1, PY0, 0], [PX1, PY1, 0], [PX1, PY1, PH], [PX1, PY0, PH]], [[0, D, Z0], [W, D, Z0], [W, D, ZB], [0, D, ZB]], [[0, UY, ZB], [UX, UY, ZB], [UX, UY, ZT], [0, UY, ZT]]]),
      zona('03', 'Maqueta 3D: los pisos', [[[W, 0, Z0], [W, D, Z0], [W, D, ZB], [W, 0, ZB]]]),
      zona('04', 'Recorrido caminable: una unidad', [[[1.6, D, uz], [9.9, D, uz], [9.9, D, uz + H], [1.6, D, uz + H]], [[ux0, uy0, uz], [ux1, uy0, uz], [ux1, uy1, uz + H], [ux0, uy1, uz + H]]])
    ].join('');

    // ── Llamadas: un punto en la torre, una línea limpia y el círculo con su número (y su nombre en la portada)
    const NOM = { '01': 'Película de lanzamiento', '02': 'Renders', '03': 'Maqueta 3D', '04': 'Recorrido caminable' };
    const ANCLA = { '01': [12, 39.6, 0], '02': [5, D, Z0 + 4.4 * H], '03': [W, 6, Z0 + 3.5 * H], '04': modo === 'portada' ? [5.75, D, uz + 1.5] : [ux0, uy1, uz + 1.4] };
    const llamada = (z, x, y, conNombre) => {
      const [a, b] = P(...ANCLA[z]), izq = x < a;
      const codo = izq ? x + 5 : x - 5;
      return `<g class="etq" data-z="${z}"><path class="etq-linea" d="M${r(a)} ${r(b)} L${r(codo)} ${r(y)} L${r(x)} ${r(y)}"/><circle class="etq-punto" cx="${r(a)}" cy="${r(b)}" r=".7"/>
        <circle class="etq-anillo" cx="${r(x)}" cy="${r(y)}" r="3"/><circle class="etq-circ" cx="${r(x)}" cy="${r(y)}" r="2.7"/><text class="etq-n" x="${r(x)}" y="${r(y + .95)}" text-anchor="middle">${z}</text>
        ${conNombre ? `<text class="etq-t" x="${r(x)}" y="${r(y + 6.4)}" text-anchor="middle">${NOM[z]}</text>` : ''}</g>`;
    };
    let llamadas = '';
    if (modo === 'portada') llamadas = llamada('04', -50, -30, true) + llamada('02', -50, -10, true) + llamada('01', -50, 13, true) + llamada('03', 45, -14, true);
    else if (modo === 'tablero') llamadas = llamada('01', -24, 33, false) + llamada('02', -25, -16, false) + llamada('03', 19, 7, false) + llamada('04', -25, -30, false);

    const vb = VB[modo] || VB.tablero;
    svg.setAttribute('viewBox', (modo === 'tablero' ? vista('') : vb.join(' ')));
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.innerHTML = s
      + `<g class="suelo" mask="url(#${id}-m)">${suelo}</g><g class="calle" mask="url(#${id}-m)">${calle}</g>` + z05
      + `<g class="edificio">${arbolesCalle}${podio}${torre}${balcones}${remate}${terraza}${roof}${cubierta}</g>`
      + z04 + z03 + z01 + llamadas + (modo === 'mini' ? '' : toques);
  };

  window.Torre = { dibujar, vista, VB };
})();
