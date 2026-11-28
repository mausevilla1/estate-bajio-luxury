# PRAETORA Grupo Inmobiliario — sitio web

Sitio de PRAETORA: residencias en San Miguel de Allende (Club de Golf Malanquín), activos de inversión
y servicios para desarrolladores e inmobiliarias (Praetora Studio).

**Antes de tocar nada, lee [`PROJECT_STATUS.md`](PROJECT_STATUS.md)**: estado actual, estructura del sitio,
sistema de diseño, reglas de contenido y pendientes.

---

## Correr en local

Sitio estático (HTML, CSS y JavaScript sin dependencias):

```bash
npx http-server -p 8080 -c-1
```

Abre <http://localhost:8080>.

## Archivos

```
├── index.html          # Portada: hero con las tres puertas, vitrina, Casa Julieta, Praetora Studio, consignación
├── catalogo.html       # Propiedades: un bloque editorial por casa
├── propiedad.html      # Ficha de cada propiedad (?id=prop-1 … / activo-1)
├── styles.css          # Tokens, componentes y, al final, el SISTEMA TIPOGRÁFICO
├── app.js              # Catálogo, vitrina, ficha (fotos, planos, datos), formulario y asistente
├── data.js             # Propiedades (LUXURY_PROPERTIES) y activos de inversión (ACTIVOS_INVERSION)
├── assets/propiedades/ # Fotos y planos por propiedad
├── PROJECT_STATUS.md   # Fuente de verdad del proyecto
└── README.md
```

## Cómo colaborar

```bash
git fetch origin
git checkout -b <tu-nombre>/<tema> origin/praetora/branding
# … cambios …
git push origin <tu-nombre>/<tema>
```

Abre el Pull Request contra `praetora/branding` (o comenta en el PR #1). Nunca hagas `push` directo a
`master` ni `push --force` a ramas compartidas.
