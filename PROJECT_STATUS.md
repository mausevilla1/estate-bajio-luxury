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

## 3. Estructura: las cuatro puertas

El menú de la portada (sobre la foto del hero) y el encabezado del catálogo nombran igual las cuatro
entradas. Los **enganches** ya existen; las secciones marcadas ⬜ son donde entra el trabajo nuevo.

| Puerta | Para quién | Enlace hoy | Estado |
|---|---|---|---|
| **Propiedades** | Quien compra o vende casa | `catalogo.html` · vender: formulario `#consignacion` de la portada | ✅ catálogo y fichas; ⬜ el formulario de vender necesita revisión de textos |
| **Invertir** | Inversionistas | `propiedad.html?id=activo-1` (ficha de Casa Julieta) | ⬜ falta la sección: introducción y, debajo, Casa Julieta con diseño de YOPE (pendiente) |
| **Desarrollar / buscar capital** | Quien trae un terreno o proyecto y busca capital | `index.html#desarrolladores` (provisional) | ⬜ falta la sección propia |
| **Praetora Studio** | Desarrolladores e inmobiliarias (servicios de media, tecnología y comercialización) | `index.html#desarrolladores` | 🟡 la sección existe; adentro se titula "Servicios para desarrolladores e inmobiliarias". Contenido por rediseñar |

**El showroom de preventas** (módulo de Mau, retirado de la portada en el rediseño) tiene su lugar
natural en **Praetora Studio**, como demostración de lo que se ofrece a desarrolladores. Se confirma con YOPE
al integrarlo.

---

## 4. Páginas

### `index.html` — portada (en este orden)
1. **Hero** — foto de San Miguel con efecto de profundidad; logotipo PRAETORA / GRUPO / INMOBILIARIO y
   las cuatro puertas. Posiciones medidas sobre el borrador de YOPE: **no se "limpian" ni se realinean**.
2. **Vitrina** (`#vitrina`) — las tres casas (sólo nombre) y el enlace "Catálogo completo".
3. **Casa Julieta** (`#activo-inversion`) — foto de la terraza a la izquierda y texto en vino `#3E101A` a la derecha,
   con posiciones medidas del borrador. Celular: pendiente de diseño.
4. **Praetora Studio** (`#desarrolladores`).
5. **Consignación / vender** (`#consignacion`) — formulario de 4 pasos.
6. Asistente flotante (chat).

Sin pie de página (se quitó por decisión de YOPE).

### `catalogo.html` — Propiedades
Encabezado con las cuatro puertas (Praetora Studio es el botón negro) y un bloque editorial por casa,
generado por `app.js` (`renderPropiedadBloque`). Casa Julieta **no** va aquí: pertenece a Invertir.

### `propiedad.html?id=…` — ficha
Recorrido horizontal en escritorio y vertical en celular: fotos (`flujo`), planos escondidos detrás de
**"Ver planos"**, panel de datos y cierre con contacto. Las fotos van **sin texto debajo**.

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

---

## 8. Pendientes

- [ ] Sección **Invertir** (introducción y Casa Julieta con diseño de YOPE).
- [ ] Sección **Desarrollar / buscar capital**.
- [ ] Rediseño del contenido de **Praetora Studio** (y lugar del showroom de preventas).
- [ ] **Número real de WhatsApp.** "Consultar esta casa" usa `+52 442 000 0000` de ejemplo.
- [ ] **A dónde envían los formularios.** Hoy sólo muestran un aviso.
- [ ] Limpiar el texto heredado que choca con §7:
  - El chat ("asesor patrimonial", plusvalías y "Querétaro").
  - "Blindaje" en el formulario.
  - "Verificado 100 %" en el catálogo.
- [ ] Casa Julieta en celular (diseño de YOPE).
- [ ] Renta: ¿entra al sitio? (pregunta abierta).
- [ ] Aviso de privacidad: el sitio recaba datos y necesita un enlace visible.
