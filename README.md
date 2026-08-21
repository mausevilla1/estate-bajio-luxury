# ESTATE BAJÍO — Private Collection & Pre-Sale Vault

> Plataforma Inmobiliaria High-Ticket y Showroom Digital de Preventas 3D para el Bajío mexicano (Querétaro, San Miguel de Allende, Juriquilla, El Campanario, León).

---

## 🏛️ Filosofía de Diseño: Quiet Luxury

* **Paleta Cromática:** Travertino cálido (`#F8F6F1`), Blanco Alabastro (`#FFFFFF`), Oro Champagne cepillado (`#B8934A`) y Carbón Espresso (`#201D19`).
* **Tipografías:** *Cormorant Garamond* (titulares de autor), *Outfit* (cuerpo y UI), *Space Grotesk* (métricas de inversión).
* **Física y Efectos:** Canvas dinámico de iluminación ambiental que responde al mouse, tarjetas con física 3D Tilt y modales de vidrio esmerilado (*Frosted Glass*).

---

## 🚀 Inicio Rápido para Colaboradores

No requiere dependencias complejas ni configuración pesada:

### Opción 1: Con Python (Recomendado)
```bash
python -m http.server 8080
```
Abre en tu navegador: [http://localhost:8080](http://localhost:8080)

### Opción 2: Con Node / npx
```bash
npx serve .
```

### Opción 3: VS Code Live Server
Simplemente abre la carpeta en VS Code y haz clic en **"Go Live"** en `index.html`.

---

## 📂 Estructura de Archivos

```
├── index.html          # Estructura semántica, SEO Schema.org, buscador, catálogo, showroom 3D, wizard y chatbot
├── styles.css          # Sistema de diseño Quiet Luxury, glassmorphism, responsive y keyframes
├── app.js              # Lógica interactiva (filtros, 3D tilt, scrollytelling de preventas, wizard y AI Concierge)
├── data.js             # Dataset de propiedades de lujo y preventas con métricas de ROI y m²
├── PROJECT_STATUS.md   # Registro de progreso y checklist arquitectónico
└── README.md           # Guía de desarrollo
```

---

## 🛠️ Módulos Implementados

1. **Hero & Quick Search:** Buscador con vidrio esmerilado y badge dinámico de ticket promedio curado.
2. **The Private Collection (Catálogo 3D):** Filtros dinámicos por micro-mercados y modal de ficha técnica con contacto a Concierge VIP.
3. **Showroom de Preventas 3D (The Alabaster Sanctuary):** Selector interactivo por niveles (*Sky, Signature, Garden*) y desglose de ROI proyectado en tiempo real.
4. **Módulo B2B Desarrolladores:** Propuesta de showroom digital *"Lleva tus Preventas con Nosotros"*.
5. **Wizard de Captación VIP:** Formulario de 4 pasos con **Calculador de Valuación Algorítmica Express**.
6. **AI Private Concierge:** Asistente conversacional para perfilamiento de inversionistas.
7. **SEO Técnico:** Marcado JSON-LD Schema.org (`RealEstateAgent`, `SingleFamilyResidence`).

---

## 🤝 Flujo de Colaboración Git

```bash
# Clonar repositorio
git clone <URL_DEL_REPOSITORIO>
cd estate-bajio-luxury

# Crear rama para nuevas funciones o diseño
git checkout -b feature/nuevo-diseno

# Guardar y subir cambios
git add .
git commit -m "feat: actualización de diseño y estilos"
git push origin feature/nuevo-diseno
```
