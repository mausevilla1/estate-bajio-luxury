/* ==========================================================================
   INVERTIR — movimiento del cielo (sólo invertir.html, sin bibliotecas).
   --------------------------------------------------------------------------
   Cada "tiempo" de la introducción entra cuando llega a la pantalla:
     · apertura  — el título sube renglón por renglón; etiqueta y texto después.
     · tipos     — la frase de "Qué buscamos" se arma tipo por tipo.
     · filtro    — la frase se enciende palabra por palabra; luego la línea de
                   tiempo de los siete pasos se dibuja de corrido y cada punto
                   aparece cuando la línea llega a él.
     · cómo      — las dos columnas y los botones suben en secuencia.
   Composición del cielo: "Manifiesto" (todo centrado), elegida por YOPE.
   La casona se mueve un poco más lento que la página (profundidad).
   Los estados de partida viven en styles.css bajo html.mov. La clase la pone un
   script corto en <head>, que la quita a los 3 s si este archivo no corrió y
   nunca la pone si la persona tiene "reducir movimiento".
   ========================================================================== */
(function () {
  'use strict';
  var html = document.documentElement;

  if (!html.classList.contains('mov')) return;
  window.__movInvertir = true;

  var cielo = document.querySelector('.invertir-cielo');
  if (!cielo) return;

  // Índices para escalonar: cada elemento recibe --i (0, 1, 2…).
  function indexar(selector) {
    Array.prototype.forEach.call(cielo.querySelectorAll(selector), function (el, i) {
      el.style.setProperty('--i', i);
    });
  }
  indexar('.invertir-tipos li');
  indexar('.invertir-pasos li');
  indexar('.invertir-puntos > *');

  // La frase del filtro se parte en palabras para encenderlas una por una.
  // Para el lector de pantalla va completa en un texto oculto: un <p> no admite
  // aria-label, y con las palabras en aria-hidden la frase se perdía (C-18).
  var frase = cielo.querySelector('.invertir-frase');
  if (frase) {
    var texto = frase.textContent.trim();
    var palabras = texto.split(/\s+/);
    frase.innerHTML = palabras.map(function (p, i) {
      return '<span class="mov-palabra" aria-hidden="true" style="--i:' + i + '">' + p + '</span>';
    }).join(' ');
    var leida = document.createElement('span');
    leida.className = 'oculto-visual';
    leida.textContent = texto;
    frase.insertBefore(leida, frase.firstChild);
  }

  // Cada tiempo entra cuando un cuarto de él está en pantalla; la apertura, al abrir.
  var tiempos = cielo.querySelectorAll('.invertir-tiempo');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('en-vista');
        obs.unobserve(en.target);
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(tiempos, function (t) { obs.observe(t); });
  } else {
    Array.prototype.forEach.call(tiempos, function (t) { t.classList.add('en-vista'); });
  }

  // La apertura espera a la letra para que los renglones no salten al cargarla.
  var apertura = cielo.querySelector('.invertir-apertura');
  var listo = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  listo.then(function () {
    requestAnimationFrame(function () { if (apertura) apertura.classList.add('en-vista'); });
  });

  // Profundidad: al bajar, la casona va un 6 % más lenta que la página.
  var foto = cielo.querySelector('.invertir-cielo-foto');
  var pendiente = false;
  function mover() {
    pendiente = false;
    var r = cielo.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var recorrido = Math.max(0, Math.min(-r.top, r.height));
    foto.style.transform = 'translate3d(0,' + (recorrido * 0.06).toFixed(1) + 'px,0)';
  }
  if (foto) {
    window.addEventListener('scroll', function () {
      if (!pendiente) { pendiente = true; requestAnimationFrame(mover); }
    }, { passive: true });
    mover();
  }
})();
