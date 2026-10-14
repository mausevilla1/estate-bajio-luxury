# PRAETORA Grupo Inmobiliario — Estado del proyecto

**Actualizado:** 11 de octubre de 2026 · **Rama de trabajo:** `praetora/branding` · **Pull Request:** #1

Este archivo es la fuente de verdad del sitio para todo colaborador y todo agente (Claude Code, Antigravity).
Reemplaza la versión de agosto ("Estate Bajío — Quiet Luxury"), que ya no aplica: el nombre, la
paleta dorada, las tipografías Cormorant/Outfit y los mercados de Querétaro quedaron fuera.

---

## 1. Cómo incorporarse (Mau, empezar aquí)

`master` sigue en `d75ae64` (21 de agosto). **Todo el trabajo nuevo está en `praetora/branding`** (PR #1).

```bash
git fetch origin
git checkout -b mau/<tema> origin/praetora/branding   # trabajar siempre desde esta rama
```

- **Si tienes trabajo local hecho sobre `master`** (por ejemplo, el showroom de preventas): súbelo tal cual
  a una rama propia (`git push origin mau/<tema>`), sin mezclarlo ni forzar nada. Lo integramos nosotros
  en la sección que le corresponde (ver §3).
- **Nunca** `push` directo a `master` ni `push --force` a `praetora/branding`.
- Archivos compartidos, siempre por rama y PR: `index.html`, `catalogo.html`, `propiedad.html`,
  `styles.css`, `app.js`, `data.js`.
- Servidor local: `npx http-server -p 8080 -c-1` → <http://localhost:8080>

---

## 2. Identidad

- **Nombre:** PRAETORA Grupo Inmobiliario.
- **Mercado actual:** San Miguel de Allende (Club de Golf Malanquín y Centro Histórico). Otras
  ciudades, incluida León, entran más adelante.
- **Trato:** el sitio habla de **usted** en todos los textos.
- **Idiomas:** el sitio está en español (`lang="es-MX"`). La traducción la ofrece el navegador
  (Chrome, Safari, Edge). Lo que no debe traducirse lleva `translate="no"`: el logotipo,
  "Praetora Studio" y los nombres de las casas.

---

## 3. Estructura: las tres puertas

Decisión de YOPE (2026-10-12): **Propiedades · Invertir · Praetora Studio**. El menú de la portada (sobre la
foto del hero) y el encabezado del catálogo y de Invertir nombran igual las tres entradas. Los **enganches** ya existen; las secciones marcadas ⬜ son donde entra el trabajo nuevo.

| Puerta | Para quién | Enlace hoy | Estado |
|---|---|---|---|
| **Propiedades** | Quien compra o vende casa | `catalogo.html` · vender: formulario `#consignacion` de la portada | ✅ catálogo y fichas; ⬜ el formulario de vender necesita revisión de textos |
| **Invertir** | Inversionistas | `invertir.html` | ✅ página propia: la introducción va sobre el cielo de la foto de Casa Julieta y abajo están las oportunidades (Casa Julieta → su ficha). La seguimos puliendo YOPE y Claude |
| **Praetora Studio** | Desarrolladores, inmobiliarias y dueños de terrenos o proyectos (servicios y búsqueda de capital) | `index.html#desarrolladores` (provisional) | ⬜ **landing de Mau: aquí entra su push** |

### Asignado a Mau: la landing de Praetora Studio

Decisión de YOPE (2026-10-12): **Praetora Studio es la landing de Mau, y ahí entra su push.** Reúne lo que antes
era "Desarrollar / buscar capital" (esa puerta salió del menú) y los servicios para desarrolladores e
inmobiliarias. Mau la hace con la estructura que ya tiene. Lo que hay hoy en la portada es provisional y se
reemplaza:

- `#capital` — "¿Tiene un terreno, un inmueble o un proyecto?" (qué recibimos, cómo funciona, "Presentar un proyecto").
- `#desarrolladores` — "Servicios para desarrolladores e inmobiliarias" (showroom digital, CRM).

Para hacerla:
- Mau decide con YOPE si va como **página propia** (por ejemplo `desarrollar.html`, con el encabezado de
  `invertir.html` y `catalogo.html`) o como sección de la portada. Después, "Praetora Studio" en los tres menús
  (portada, catálogo e Invertir) se apunta a ella.
- Su **showroom de preventas** cabe aquí, como demostración para desarrolladores.
- Sigue el sistema de diseño (§5) y las reglas de contenido (§7). **No repite a Invertir:** Invertir le habla a quien
  tiene el capital; esta landing, a quien tiene el proyecto o necesita comercializarlo.
- Cuando la landing exista, salen de `index.html` las secciones `#capital` y `#desarrolladores`, con sus estilos
  (`.capital-*`, `.b2b-*`).

---

## 4. Páginas

### `index.html` — portada (en este orden)
1. **Hero** — foto de San Miguel con efecto de profundidad; logotipo PRAETORA / GRUPO / INMOBILIARIO y
   las tres puertas. Posiciones medidas sobre el borrador de YOPE: **no se "limpian" ni se realinean**.
2. **Vitrina** (`#vitrina`) — las tres casas (sólo nombre) y el enlace "Catálogo completo".
3. **Casa Julieta** (`#activo-inversion`) — foto de la terraza a la izquierda y texto en vino `#3E101A` a la derecha,
   con posiciones medidas del borrador. Celular: pendiente de diseño.
4. **Buscar capital** (`#capital`) — provisional, sin entrada en el menú: lo reemplaza la landing de Mau (§3).
5. **Praetora Studio** (`#desarrolladores`) — provisional: lo reemplaza la landing de Mau (§3).
6. **Consignación / vender** (`#consignacion`) — formulario de 4 pasos.
7. Asistente flotante (chat).

Sin pie de página (se quitó por decisión de YOPE).

### `invertir.html` — Invertir
**La pulen YOPE y Claude** (no Mau). Foto de YOPE con mucho cielo (`assets/propiedades/hotel/invertir/cielo-*.webp`).
La introducción va sobre el cielo en composición **"Manifiesto"**: todo centrado y monumental.
- **Apertura:** título de 64 px.
- **Qué buscamos:** una sola frase de 40 px con los siete tipos.
- **El filtro:** línea de tiempo de lado a lado con siete puntos.
- **Cómo trabajamos con usted:** dos columnas con una línea entre ellas, "Solicitar información" y "Ver oportunidades".

Los 40 y 64 px son excepciones de display del cielo. La casona aparece al final con un difuminado a blanco y
sigue la tarjeta de Casa Julieta. El fondo es el azul liso de la foto (`#0859A9`): si el texto necesita más alto
(celular), el cielo crece hacia arriba sin costura.

**Movimiento** (`invertir.js`, sin bibliotecas, sólo en esta página):
- El título sube renglón por renglón.
- Los tipos aparecen uno tras otro.
- La frase del filtro se enciende palabra por palabra.
- La línea de tiempo se dibuja de corrido.
- La casona se mueve un 6 % más lenta que la página.

Los estados de partida van bajo `html.mov`, que pone un script en `<head>`. Si `invertir.js` no corre en 3 s,
se quita. Con "reducir movimiento" no se pone.

**Invertir y la landing de Praetora Studio son dos caras del mismo mercado, y no deben repetirse:** Invertir
le habla a quien tiene el capital; la landing, a quien tiene el proyecto (que se estructura y se presenta a
inversionistas compatibles) o necesita comercializarlo.

### `catalogo.html` — Propiedades
Encabezado con las tres puertas (Praetora Studio es el botón negro) y un bloque editorial por casa,
generado por `app.js` (`renderPropiedadBloque`). Casa Julieta **no** va aquí: pertenece a Invertir.

### `propiedad.html?id=…` — ficha
Recorrido horizontal en escritorio y vertical en celular. Las fotos (`flujo`) van **sin texto debajo**.
Los planos van escondidos y aparecen junto a las fotos con **"Ver planos"**. Después viene la
**ficha técnica**, en cinco paneles de texto (`app.js`, de `panelFicha` a `panelContacto`):

1. **Ficha:** nombre, precio (una sola vez), cifras clave a 24 px, tipología, estatus y "Ver planos".
2. **Distribución:** espacios de cada planta, sacados de los planos y ordenados como se recorre la casa.
3. **La casa:** texto descriptivo y características (`caracteristicas`).
4. **El entorno:** el club (`ENTORNOS`): cifras, amenidades y ubicación.
5. **Contacto:** botón y regreso.

Un panel sin datos no se dibuja. En escritorio cada panel cabe en 1366 × 768 sin scroll vertical:
si se agrega contenido, hay que repartirlo, no alargar el panel.

---

## 5. Sistema de diseño (reglas)

- **Paleta acromática** (tokens en `:root`):

  | Token | Valor | Uso |
  |---|---|---|
  | `--ink` / `--text-main` | `#111111` | Tinta principal |
  | `--text-muted` | `#222222` | Tinta secundaria |
  | `--text-light` | `#AAAAAA` | Texto apagado |
  | `--border-subtle` | `#E6E6E6` | Líneas |
  | `--bg-primary` | `#FFFFFF` | Fondo |

  Sin dorado. Ojo: los tokens `--gold-*` conservan su nombre viejo, pero hoy valen negro o gris.
  No se les devuelve el dorado.
- **Tipografía única: Acumin Pro** (Adobe Fonts, kit `eyy5hrp`, cargado con `<link>` en las tres páginas).
  Licencia web del Creative Cloud de YOPE. **Nunca subir archivos `.otf` al repo.**
- **Escala:** 32 / 24 / 20 / 18 / 16 / 14 / 12 px. **Pesos 400 y 500.** **Mayúsculas sólo a 12 px** (+0.12em).
  Antes de darle tamaño a un texto nuevo se le asigna una función de la escala; nada de tamaños sueltos.
- **Dos estilos de acción, y sólo dos:**
  - **Enlace** (lleva a otra página): 18 px, flecha larga y subrayado de 1 px. Clases `.portada-enlace`,
    `.ficha-volver`, `.julieta-cta`, `.ficha-ver-planos`.
  - **Botón** (hace algo): 12 px en mayúsculas sobre negro, invertido sobre fondo oscuro. Clase `.btn-gold`.
- **Espaciado:** margen lateral 24 px; 12 / 64 / 128 / 192 px (`--space-close`, `--space-block`,
  `--space-section`, `--space-footer`).
- **Fotografía:** esquinas rectas, sin sombra.
- El bloque **"SISTEMA TIPOGRÁFICO"** al final de `styles.css` manda sobre las reglas viejas: va al final a propósito.

---

## 6. Datos (`data.js`) y archivos

- `LUXURY_PROPERTIES` — Casa Córdoba (`prop-1`), Casa Granada (`prop-2`), Casa Olivos (`prop-3`).
- `ACTIVOS_INVERSION` — Casa Julieta (`activo-1`, slug `casa-julieta`).
- Campos de ficha:
  - `flujo: [{ src, prop, alto }]`, con `prop` en `2:3 · 3:4 · 4:3 · 3:2 · 16:9 · 9:16` y `alto` en `a · b · c`.
  - `planos: [{ nivel, base, proporcion, etiquetas }]`, donde `base` apunta a `…/planos/<planta>-h.svg`
    (escritorio) y `-v.svg` (celular).
  - `niveles`, `caracteristicas` (tomadas de `info.md`) y `entorno` (clave de `ENTORNOS`).
- `ENTORNOS` — el club o barrio de cada casa. `malanquin`: datos verificados del Club de Golf Malanquín.
  Diseñador del campo y año de fundación **no** se publican: las fuentes se contradicen.
- Fotos: `assets/propiedades/<casa>/fotos/`. **El orden por nombre de archivo es el orden de la ficha**
  (YOPE intercala con decimales: `9.8`, `9.9`, `26.9`).
- Planos: `assets/propiedades/<casa>/planos/`, dibujos de línea redibujados desde los as-built, sin
  ningún texto de la lámina.
- Las **cifras** (precios, m², rentas, rendimientos) las pasa la dirección. No se calculan ni se deducen.
- **Nunca entran al repo:** PDF de propiedades o de inversión, planos originales, fuentes `.otf`.

---

## 7. Reglas de contenido

- No prometer garantías ("blindaje", "verificado 100 %") ni inventar cifras de plusvalía o rendimiento.
- La IA del asistente **no** se presenta como asesor y no sustituye asesoría legal, financiera ni de valuación.
- Sin escasez falsa: "últimas unidades" sólo si es verdad.
- No pedir datos antes de tiempo: primero se explora y después se piden datos (al agendar, consultar o pedir información).
- El sitio **capta** prospectos y contactos. El seguimiento vive en el CRM, aparte del sitio.
- Las tres casas del Club de Golf se entregan **sin muebles** y **con cocina equipada**: ningún texto debe
  sugerir mobiliario incluido.

---

## 8. Pendientes

- [ ] **Mau:** landing de **Praetora Studio** (servicios para desarrolladores e inmobiliarias y búsqueda de capital, con su showroom de preventas). Ver §3.
- [x] **Fotos de Casa Granada:** YOPE depuró el álbum (2026-10-12): quedan 35 de 57.
- [ ] **Textos de Casa Granada:** la descripción menciona vigas de madera, cantera y jacuzzi, que no se ven en
  ninguna foto. Se revisa cuando lleguen las fotos nuevas. Mientras tanto quedan fuera de sus características.
- [ ] **Número real de WhatsApp.** "Consultar esta casa" usa `+52 442 000 0000` de ejemplo.
- [ ] **A dónde envían los formularios.** Hoy sólo muestran un aviso.
- [ ] Limpiar el texto heredado que choca con §7:
  - El chat ("asesor patrimonial", plusvalías y "Querétaro").
  - "Blindaje" en el formulario.
  - "Verificado 100 %" en el catálogo.
- [ ] Casa Julieta en celular (diseño de YOPE).
- [ ] Renta: ¿entra al sitio? (pregunta abierta).
- [ ] Aviso de privacidad: el sitio recaba datos y necesita un enlace visible.
