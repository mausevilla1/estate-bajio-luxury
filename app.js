// ==========================================================================
// PRAETORA - Application Engine & Interactive Physics
// ==========================================================================

let currentCurrency = 'MXN';
let currentViewMode = 'grid';
let activeZoneFilter = 'all';
let activeTypeFilter = 'all';
let activeAmenities = [];
let currentSort = 'price-desc'; // Orden inicial por defecto: mayor valor
let comparedProperties = [];

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Dato no publicado por el anuncio.
   Se muestra la raya, nunca "null" ni un cero inventado. */
function m2(v) {
  return (v === null || v === undefined || v === '') ? '—' : v + ' m²';
}

function formatCatalogPrice(prop, curr) {
  if (curr === 'USD') {
    return prop.priceUSD ? `$${(prop.priceUSD / 1000000).toFixed(2)}M USD` : 'USD en consulta';
  }
  return `$${(prop.priceMXN / 1000000).toFixed(1)}M MXN`;
}

function formatCatalogSubPrice(prop, curr) {
  if (curr === 'USD') {
    return `$${(prop.priceMXN / 1000000).toFixed(1)}M MXN`;
  }
  return prop.priceUSD ? `$${(prop.priceUSD / 1000000).toFixed(2)}M USD` : '';
}

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initHeaderScroll();
  initCatalogFilters();
  initPresaleShowcase();
  initSellerWizard();
  initAIConcierge();
  initDedicatedCatalogPage();
  pintarPropiedadDestacada();
  pintarVitrina();
});

/* --------------------------------------------------------------------------
   1. Canvas ambiental (DESACTIVADO — el halo dorado salió del sistema)
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let targetX = width * 0.7;
  let targetY = height * 0.3;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function draw() {
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    ctx.clearRect(0, 0, width, height);

    // Halo desactivado: el sistema es acromático
    const gradient = ctx.createRadialGradient(
      currentX, currentY, 10,
      currentX, currentY, 650
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); // halo dorado eliminado — sistema acromático
    gradient.addColorStop(0.5, 'rgba(247, 245, 240, 0.05)');
    gradient.addColorStop(1, 'rgba(247, 245, 240, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    requestAnimationFrame(draw);
  }
  draw();
}

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

/* --------------------------------------------------------------------------
   3. Catalog Rendering & 3D Tilt Cards (Landing & Dedicated)
   -------------------------------------------------------------------------- */
function renderCatalog(filter = 'all') {
  activeZoneFilter = filter;
  renderMasterCatalog();
}

function renderMasterCatalog() {
  const gridContainer = document.getElementById('properties-container');
  const lookbookContainer = document.getElementById('lookbook-container');
  const countDisplay = document.getElementById('catalog-count');

  if (!gridContainer && !lookbookContainer) return;

  let filtered = [...LUXURY_PROPERTIES];

  // 1. Zone filter
  if (activeZoneFilter !== 'all') {
    filtered = filtered.filter(p => 
      p.zone.toLowerCase().includes(activeZoneFilter.toLowerCase()) || 
      p.subzone.toLowerCase().includes(activeZoneFilter.toLowerCase())
    );
  }

  // 2. Type filter
  if (activeTypeFilter !== 'all') {
    filtered = filtered.filter(p => p.type === activeTypeFilter);
  }

  // 3. Amenities filter
  if (activeAmenities.length > 0) {
    filtered = filtered.filter(p => 
      activeAmenities.every(a => p.amenities && p.amenities.includes(a))
    );
  }

  // 4. Sorting
  if (currentSort === 'price-desc') {
    filtered.sort((a, b) => b.priceMXN - a.priceMXN);
  } else if (currentSort === 'price-asc') {
    filtered.sort((a, b) => a.priceMXN - b.priceMXN);
  } else if (currentSort === 'm2-desc') {
    filtered.sort((a, b) => b.m2Construccion - a.m2Construccion);
  }

  // Update counter
  if (countDisplay) {
    countDisplay.textContent = filtered.length;
  }

  // Render Grid View
  if (gridContainer) {
    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-card); border-radius: 20px; border: 1px dashed var(--border-subtle);">
          <h3 style="font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 0.5rem;">No se encontraron obras con los criterios seleccionados</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Intente ajustando los filtros o realice una consulta privada a nuestro AI Concierge.</p>
        </div>
      `;
    } else {
      gridContainer.innerHTML = filtered.map(prop => {
        const isCompared = comparedProperties.includes(prop.id);
        const formattedPrice = formatCatalogPrice(prop, currentCurrency);
        const subPrice = formatCatalogSubPrice(prop, currentCurrency);

        return `
          <article class="property-card" data-id="${prop.id}">
            <div class="property-thumb-wrap">
              <img src="${prop.heroImage}" alt="${prop.title} - Residencia de Lujo en ${prop.zone}" loading="lazy">
            </div>
            <div class="property-details">
              <span class="property-location">${prop.zone} • ${prop.subzone}</span>
              <h3 class="property-name">${prop.title}</h3>
              
              <div class="property-metrics">
                <div class="metric-item">
                  <div class="metric-val">${prop.m2Construccion} m²</div>
                  <div class="metric-lbl">Construcción</div>
                </div>
                <div class="metric-item">
                  <div class="metric-val">${prop.bedrooms} Recs</div>
                  <div class="metric-lbl">Habitaciones</div>
                </div>
                <div class="metric-item">
                  <div class="metric-val">${prop.bathrooms} Baños</div>
                  <div class="metric-lbl">Servicios</div>
                </div>
              </div>

              <div class="property-footer">
                <div class="property-price">
                  <span class="price-mxn">${formattedPrice}</span>
                  <span class="price-usd">${subPrice}</span>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <button class="btn-compare-card ${isCompared ? 'active' : ''}" onclick="toggleCompare('${prop.id}')" title="Comparar Obra">
                    ${isCompared ? '✓ Comparando' : '＋ Comparar'}
                  </button>
                  <a class="btn-outline-gold" href="propiedad.html?id=${prop.id}">
                    Ver →
                  </a>
                </div>
              </div>
            </div>
          </article>
        `;
      }).join('');
      attachCardTiltEffect();
    }
  }

  // Render Lookbook View
  if (lookbookContainer) {
    if (filtered.length === 0) {
      lookbookContainer.innerHTML = `<div style="text-align: center; padding: 4rem;">Sin resultados</div>`;
    } else {
      lookbookContainer.innerHTML = filtered.map(prop => {
        const isCompared = comparedProperties.includes(prop.id);
        const formattedPrice = formatCatalogPrice(prop, currentCurrency);

        return `
          <article class="lookbook-card" data-id="${prop.id}">
            <div class="lookbook-media-wrap">
              <img src="${prop.heroImage}" alt="${prop.title}" loading="lazy">
            </div>
            <div class="lookbook-content">
              <div class="lookbook-top">
                <span class="prop-zone">${prop.zone} — ${prop.subzone}</span>
                <h3 class="prop-title">${prop.title}</h3>
                <p class="prop-desc">${prop.description}</p>
                <div class="lookbook-architect-quote">“Firma de Autor: ${prop.architect}”</div>
              </div>

              <div>
                <div class="lookbook-specs-row">
                  <div class="lookbook-spec-item">
                    <div class="val">${m2(prop.m2Construccion)}</div>
                    <div class="lbl">Construcción</div>
                  </div>
                  <div class="lookbook-spec-item">
                    <div class="val">${m2(prop.m2Terreno)}</div>
                    <div class="lbl">Terreno</div>
                  </div>
                  <div class="lookbook-spec-item">
                    <div class="val">${prop.bedrooms} R / ${prop.bathrooms} B</div>
                    <div class="lbl">Espacios</div>
                  </div>
                  <div class="lookbook-spec-item">
                    <div class="val" style="color: var(--gold-primary);">${prop.projectedYield}</div>
                    <div class="lbl">Plusvalía</div>
                  </div>
                </div>

                <div class="lookbook-actions">
                  <div class="property-price">
                    <span class="price-mxn">${formattedPrice}</span>
                    <span class="price-usd">${prop.status}</span>
                  </div>
                  <div style="display: flex; gap: 0.6rem;">
                    <button class="btn-compare-card ${isCompared ? 'active' : ''}" onclick="toggleCompare('${prop.id}')">
                      ${isCompared ? '✓ Comparando' : '＋ Comparar'}
                    </button>
                    <a class="btn-gold" href="propiedad.html?id=${prop.id}">
                      Ver Ficha Completa
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }
  }
}

function attachCardTiltEffect() {
  const cards = document.querySelectorAll('.property-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateX(${-y * 0.03}deg) rotateY(${x * 0.03}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
    });
  });
}

function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn, .filter-pill');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeZoneFilter = btn.dataset.filter || 'all';
      renderMasterCatalog();
    });
  });
}

function buildDynamicFilters() {
  if (typeof LUXURY_PROPERTIES === 'undefined') return;

  // 1. Zonas: construir desde LUXURY_PROPERTIES. Si hay una sola zona, ocultar grupo Zona
  const zoneGroup = document.querySelector('.filter-accordion-group[data-filter-group="zona"]');
  const uniqueZones = [...new Set(LUXURY_PROPERTIES.map(p => p.zone).filter(Boolean))];
  if (zoneGroup) {
    if (uniqueZones.length <= 1) {
      zoneGroup.style.display = 'none';
    } else {
      zoneGroup.style.display = '';
      const pillsWrap = zoneGroup.querySelector('.filter-pills-group');
      if (pillsWrap) {
        let html = '<button class="filter-pill active" data-filter="all">Todas las obras</button>';
        uniqueZones.forEach(z => {
          html += `<button class="filter-pill" data-filter="${esc(z)}">${esc(z)}</button>`;
        });
        pillsWrap.innerHTML = html;
        pillsWrap.querySelectorAll('.filter-pill').forEach(btn => {
          btn.addEventListener('click', () => {
            pillsWrap.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeZoneFilter = btn.dataset.filter || 'all';
            const valZona = document.getElementById('filter-val-zona');
            if (valZona) valZona.textContent = activeZoneFilter === 'all' ? 'Todas' : btn.textContent.trim();
            renderMasterCatalog();
          });
        });
      }
    }
  }

  // 2. Amenidades: ocultar si hay menos de 6 propiedades
  const amenityGroup = document.querySelector('.filter-accordion-group[data-filter-group="amenidades"]');
  if (amenityGroup) {
    if (LUXURY_PROPERTIES.length < 6) {
      amenityGroup.style.display = 'none';
    } else {
      amenityGroup.style.display = '';
    }
  }

  // 3. Tipología: generado desde los datos
  const tipoGroup = document.querySelector('.filter-accordion-group[data-filter-group="tipologia"]');
  const uniqueTypes = [...new Set(LUXURY_PROPERTIES.map(p => p.type).filter(Boolean))];
  if (tipoGroup && uniqueTypes.length > 0) {
    const pillsWrap = tipoGroup.querySelector('.filter-pills-group');
    if (pillsWrap) {
      let html = '<button class="filter-pill active" data-type="all">Todas las tipologías</button>';
      uniqueTypes.forEach(t => {
        html += `<button class="filter-pill" data-type="${esc(t)}">${esc(t)}</button>`;
      });
      pillsWrap.innerHTML = html;
      pillsWrap.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          pillsWrap.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeTypeFilter = btn.dataset.type || 'all';
          const valTipo = document.getElementById('filter-val-tipologia');
          if (valTipo) valTipo.textContent = activeTypeFilter === 'all' ? 'Todas' : btn.textContent.trim();
          renderMasterCatalog();
        });
      });
    }
  }
}

/* --------------------------------------------------------------------------
   4. Dedicated Catalog Page Handlers (catalogo.html)
   -------------------------------------------------------------------------- */
function initDedicatedCatalogPage() {
  buildDynamicFilters();

  // Currency Switcher
  const currencyBtns = document.querySelectorAll('.currency-btn');
  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.dataset.currency;
      renderMasterCatalog();
    });
  });

  // View Mode Switcher
  const viewBtns = document.querySelectorAll('.view-btn');
  const gridWrap = document.getElementById('properties-container');
  const lookbookWrap = document.getElementById('lookbook-container');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentViewMode = btn.dataset.view;

      if (gridWrap && lookbookWrap) {
        if (currentViewMode === 'grid') {
          gridWrap.style.display = 'grid';
          lookbookWrap.style.display = 'none';
        } else {
          gridWrap.style.display = 'none';
          lookbookWrap.style.display = 'flex';
        }
      }
      renderMasterCatalog();
    });
  });

  // Amenity Tags
  const amenityTags = document.querySelectorAll('.amenity-tag');
  amenityTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const a = tag.dataset.amenity;
      if (activeAmenities.includes(a)) {
        activeAmenities = activeAmenities.filter(item => item !== a);
        tag.classList.remove('active');
      } else {
        activeAmenities.push(a);
        tag.classList.add('active');
      }
      renderMasterCatalog();
    });
  });

  // Sort Dropdown
  const sortSelect = document.getElementById('catalog-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderMasterCatalog();
    });
  }

  // Initial catalog render on page
  renderMasterCatalog();
}

/* --------------------------------------------------------------------------
   5. Comparison Dock & Modal (Side-by-Side)
   -------------------------------------------------------------------------- */
window.toggleCompare = function(id) {
  if (comparedProperties.includes(id)) {
    comparedProperties = comparedProperties.filter(pId => pId !== id);
  } else {
    if (comparedProperties.length >= 3) {
      alert("Puede comparar un máximo de 3 residencias simultáneamente.");
      return;
    }
    comparedProperties.push(id);
  }
  updateComparisonDock();
  renderMasterCatalog();
};

function updateComparisonDock() {
  const dock = document.getElementById('comparison-dock');
  const bubblesWrap = document.getElementById('dock-bubbles');
  const countLabel = document.getElementById('dock-count');

  if (!dock) return;

  if (comparedProperties.length > 0) {
    dock.classList.add('visible');
    countLabel.textContent = `${comparedProperties.length} ${comparedProperties.length === 1 ? 'obra seleccionada' : 'obras seleccionadas'}`;

    bubblesWrap.innerHTML = comparedProperties.map(id => {
      const p = LUXURY_PROPERTIES.find(item => item.id === id);
      return `<div class="dock-bubble" title="${p.title}"><img src="${p.heroImage}" alt="${p.title}"></div>`;
    }).join('');
  } else {
    dock.classList.remove('visible');
  }
}

window.openComparisonModal = function() {
  if (comparedProperties.length === 0) return;

  const modal = document.getElementById('comparison-modal');
  const body = document.getElementById('comparison-modal-body');

  const selected = comparedProperties.map(id => LUXURY_PROPERTIES.find(p => p.id === id));

  body.innerHTML = `
    <div class="comparison-modal-grid">
      <div class="comp-col labels">
        <div style="height: 120px;"></div>
        <div>Ubicación VIP</div>
        <div>Inversión MXN</div>
        <div>Inversión USD</div>
        <div>M² Construcción</div>
        <div>M² Terreno</div>
        <div>Habitaciones</div>
        <div>Plusvalía Estimada</div>
        <div>Firma Arquitectónica</div>
        <div>Acción</div>
      </div>
      ${selected.map(p => `
        <div class="comp-col">
          <div style="height: 120px;">
            <img src="${p.heroImage}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 10px; margin-bottom: 0.4rem;">
            <strong style="font-family: var(--font-serif); font-size: 1.1rem; display: block; line-height: 1.2;">${p.title}</strong>
          </div>
          <div>${p.zone}</div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: var(--gold-primary);">$${(p.priceMXN / 1000000).toFixed(1)}M MXN</div>
          <div style="font-family: var(--font-mono);">${p.priceUSD ? `$${(p.priceUSD / 1000000).toFixed(2)}M USD` : '—'}</div>
          <div>${m2(p.m2Construccion)}</div>
          <div>${m2(p.m2Terreno)}</div>
          <div>${p.bedrooms} Recs / ${p.bathrooms} Baños</div>
          <div style="color: #2E7D32; font-weight: 600;">${p.projectedYield}</div>
          <div style="font-size: 0.85rem;">${p.architect}</div>
          <div>
            <button class="btn-gold" style="padding: 0.5rem 1rem; font-size: 0.75rem; width: 100%; justify-content: center;" onclick="window.location.href='propiedad.html?id=${p.id}'">
              Ver Detalle
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  modal.classList.add('open');
};

window.closeComparisonModal = function() {
  const modal = document.getElementById('comparison-modal');
  if (modal) modal.classList.remove('open');
};

window.clearComparison = function() {
  comparedProperties = [];
  updateComparisonDock();
  renderMasterCatalog();
  closeComparisonModal();
};

/* --------------------------------------------------------------------------
   6. Property Detail Modal
   -------------------------------------------------------------------------- */
window.openPropertyModal = function(id) {
  const prop = LUXURY_PROPERTIES.find(p => p.id === id);
  if (!prop) return;

  const modal = document.getElementById('property-modal');
  const body = document.getElementById('modal-property-body');

  body.innerHTML = `
    <div style="position: relative;">
      <img src="${prop.heroImage}" alt="${prop.title}" style="width: 100%; height: 380px; object-fit: cover;">
      <div style="position: absolute; bottom: 1.5rem; left: 2rem; color: #FFFFFF; text-shadow: 0 2px 10px rgba(0,0,0,0.6);">
        <span style="font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-light);">${prop.zone}</span>
        <h2 style="font-family: var(--font-serif); font-size: 2.4rem;">${prop.title}</h2>
      </div>
    </div>
    <div style="padding: 2.5rem;">
      <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 2rem;">${prop.description}</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; background: var(--bg-secondary); padding: 1.5rem; border-radius: 16px;">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Precio de Inversión</span>
          <div style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 700; color: var(--gold-primary);">$${(prop.priceMXN / 1000000).toFixed(1)}M MXN / $${(prop.priceUSD / 1000000).toFixed(2)}M USD</div>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Terreno / Construcción</span>
          <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600;">${prop.m2Terreno} m² / ${prop.m2Construccion} m²</div>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Plusvalía Estimada</span>
          <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: #2E7D32;">${prop.projectedYield}</div>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Firma de Autor</span>
          <div style="font-size: 1rem; font-weight: 600;">${prop.architect}</div>
        </div>
      </div>

      <h4 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 1rem;">Especificaciones de Lujo</h4>
      <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 2.5rem; list-style: none;">
        ${prop.features.map(f => `<li style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-muted); font-size: 0.92rem;"><span style="color: var(--gold-primary);">✦</span> ${f}</li>`).join('')}
      </ul>

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 1rem;">
        <span style="font-size: 0.85rem; color: var(--text-muted);">Expediente Jurídico y Título de Propiedad Verificado 100%</span>
        <a href="https://wa.me/524420000000?text=Deseo%20información%20privada%20sobre%20${encodeURIComponent(prop.title)}" target="_blank" class="btn-gold">
          Contactar Concierge VIP
        </a>
      </div>
    </div>
  `;

  modal.classList.add('open');
};

window.closePropertyModal = function() {
  const modal = document.getElementById('property-modal');
  if (modal) modal.classList.remove('open');
};

/* --------------------------------------------------------------------------
   7. Interactive Pre-Sale Scrollytelling Showcase
   -------------------------------------------------------------------------- */
function initPresaleShowcase() {
  const tabs = document.querySelectorAll('.level-tab');
  const renderImg = document.getElementById('presale-render-img');
  const levelTitle = document.getElementById('presale-level-title');
  const levelUnits = document.getElementById('presale-level-units');
  const levelPrice = document.getElementById('presale-level-price');
  const levelM2 = document.getElementById('presale-level-m2');
  const levelFeatures = document.getElementById('presale-level-features');

  if (!tabs.length || !renderImg) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const lvl = PRESALE_SHOWCASE.levels.find(l => l.id === tab.dataset.level);
      if (!lvl) return;

      renderImg.style.opacity = '0.3';
      setTimeout(() => {
        renderImg.src = lvl.image;
        renderImg.style.opacity = '1';
      }, 200);

      if (levelTitle) levelTitle.textContent = lvl.name;
      if (levelUnits) levelUnits.textContent = `${lvl.unitsAvailable} Unidades Disponibles`;
      if (levelPrice) levelPrice.textContent = lvl.priceFrom;
      if (levelM2) levelM2.textContent = lvl.m2;
      if (levelFeatures) levelFeatures.textContent = lvl.features;
    });
  });
}

/* --------------------------------------------------------------------------
   8. VIP Seller Acquisition Wizard (Consignación Privada)
   -------------------------------------------------------------------------- */
let currentWizardStep = 1;
function initSellerWizard() {
  const nextBtn = document.getElementById('wizard-next-btn');
  const prevBtn = document.getElementById('wizard-prev-btn');

  if (!nextBtn || !prevBtn) return;

  nextBtn.addEventListener('click', () => {
    if (currentWizardStep === 3) {
      calculateValuation();
    }
    if (currentWizardStep < 4) {
      goToWizardStep(currentWizardStep + 1);
    } else {
      alert("Su solicitud de consignación VIP ha sido registrada. Un Concierge Patrimonial se pondrá en contacto bajo estricta confidencialidad.");
      goToWizardStep(1);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentWizardStep > 1) {
      goToWizardStep(currentWizardStep - 1);
    }
  });
}

function goToWizardStep(step) {
  currentWizardStep = step;
  document.querySelectorAll('.wizard-step-pane').forEach((p, idx) => {
    p.classList.toggle('active', idx + 1 === step);
  });
  document.querySelectorAll('.step-indicator-item').forEach((ind, idx) => {
    ind.classList.toggle('active', idx + 1 === step);
    ind.classList.toggle('completed', idx + 1 < step);
  });

  const prevBtn = document.getElementById('wizard-prev-btn');
  const nextBtn = document.getElementById('wizard-next-btn');
  if (prevBtn) prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
  if (nextBtn) nextBtn.textContent = step === 4 ? 'Confirmar y Solicitar Inspección' : 'Continuar ➔';
}

function calculateValuation() {
  const m2Input = document.getElementById('wiz-m2');
  const zoneSelect = document.getElementById('wiz-zone');
  const display = document.getElementById('wiz-valuation-display');

  if (!m2Input || !zoneSelect || !display) return;

  const m2 = parseFloat(m2Input.value) || 800;
  const zone = zoneSelect.value;
  
  let pricePerM2 = 45000;
  if (zone.includes('Campanario')) pricePerM2 = 62000;
  if (zone.includes('San Miguel')) pricePerM2 = 58000;
  if (zone.includes('Juriquilla')) pricePerM2 = 48000;

  const estimatedValue = m2 * pricePerM2;
  display.textContent = `$${(estimatedValue / 1000000).toFixed(1)}M MXN`;
}

/* --------------------------------------------------------------------------
   9. Advanced AI Private Concierge & Wealth Advisor
   -------------------------------------------------------------------------- */
function initAIConcierge() {
  const trigger = document.getElementById('ai-concierge-trigger');
  const modal = document.getElementById('ai-concierge-modal');
  const closeBtn = document.getElementById('ai-modal-close');
  const input = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-send-btn');
  const chatBody = document.getElementById('ai-chat-body');

  if (!trigger || !modal) return;

  trigger.addEventListener('click', () => modal.classList.toggle('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

  const handleSend = () => {
    const text = input.value.trim();
    if (!text) return;

    // User message
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = text;
    chatBody.appendChild(userBubble);
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Show Typing Indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble ai';
    typingBubble.id = 'ai-typing-indicator';
    typingBubble.innerHTML = `
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatBody.appendChild(typingBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate AI response with streaming delay
    setTimeout(() => {
      typingBubble.remove();
      const aiBubble = document.createElement('div');
      aiBubble.className = 'chat-bubble ai';
      aiBubble.innerHTML = generateAdvancedAIResponse(text);
      chatBody.appendChild(aiBubble);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 700);
  };

  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }
}

window.askAI = function(question) {
  const input = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-send-btn');
  const modal = document.getElementById('ai-concierge-modal');
  if (modal) modal.classList.add('open');
  if (input && sendBtn) {
    input.value = question;
    sendBtn.click();
  }
};

function generateAdvancedAIResponse(query) {
  const q = query.toLowerCase();

  // Query: El Campanario / Golf / Mansiones
  if (q.includes('campanario') || (q.includes('golf') && q.includes('querétaro'))) {
    const prop = LUXURY_PROPERTIES.find(p => p.id === 'prop-2');
    return `
      En <strong>El Campanario Club de Golf</strong> la plusvalía promedio es del <strong>14.2% anual</strong>, con el índice de seguridad y exclusividad más alto de Querétaro.
      <br><br>
      Le recomiendo examinar nuestra obra insignia en el Private Vault:
      <div class="chat-property-snippet">
        <img src="${prop.heroImage}" alt="${prop.title}">
        <div class="snippet-info">
          <div class="snippet-title">${prop.title}</div>
          <div class="snippet-price">$72.0M MXN • Frente al Green Hoyo 14</div>
          <button class="btn-gold" style="margin-top: 0.6rem; font-size: 0.72rem; padding: 0.4rem 0.8rem; width: 100%; justify-content: center;" onclick="window.location.href='propiedad.html?id=prop-2'">
            Ver la ficha
          </button>
        </div>
      </div>
      <div class="chat-quick-actions">
        <button class="quick-action-pill" onclick="askAI('¿Qué requisitos de compra hay en El Campanario?')">Requisitos de compra</button>
        <button class="quick-action-pill" onclick="askAI('Agendar visita privada')">Agendar visita privada</button>
      </div>
    `;
  }

  // Query: San Miguel de Allende / Haciendas / Viñedos
  if (q.includes('san miguel') || q.includes('allende') || q.includes('hacienda') || q.includes('viñedo')) {
    const prop = LUXURY_PROPERTIES.find(p => p.id === 'prop-1');
    return `
      En <strong>San Miguel de Allende</strong> disponemos de 2 haciendas de autor con alta demanda internacional de renta de ultra-lujo (rendimientos de hasta <strong>11.8% a 13.4% anual</strong>).
      <div class="chat-property-snippet">
        <img src="${prop.heroImage}" alt="${prop.title}">
        <div class="snippet-info">
          <div class="snippet-title">${prop.title}</div>
          <div class="snippet-price">$58.5M MXN • Cava Climatizada & Olivos</div>
          <button class="btn-gold" style="margin-top: 0.6rem; font-size: 0.72rem; padding: 0.4rem 0.8rem; width: 100%; justify-content: center;" onclick="window.location.href='propiedad.html?id=prop-1'">
            Ver la ficha
          </button>
        </div>
      </div>
    `;
  }

  // Query: Preventas / ROI / Inversión
  if (q.includes('preventa') || q.includes('inversion') || q.includes('roi') || q.includes('rendimiento')) {
    return `
      Para inversión patrimonial en preventa, el proyecto más acelerado del Bajío es <strong>The Alabaster Sanctuary</strong> en Juriquilla Reserve:
      <ul>
        <li><strong>ROI Proyectado:</strong> 26.8% en Fase 1</li>
        <li><strong>Entrega:</strong> Q4 2027</li>
        <li><strong>Fase Actual:</strong> 65% vendido</li>
        <li><strong>Precios:</strong> Desde $24.9M MXN</li>
      </ul>
      ¿Desea que le envíe el dossier financiero con la corrida de plusvalía y tablas de amortización?
      <div class="chat-quick-actions">
        <button class="quick-action-pill" onclick="askAI('Deseo el dossier financiero de Juriquilla')">Solicitar Dossier PDF</button>
      </div>
    `;
  }

  // Query: Fideicomisos / Extranjeros / Impuestos / Escrow
  if (q.includes('extranjero') || q.includes('fideicomiso') || q.includes('legal') || q.includes('escrow') || q.includes('impuesto')) {
    return `
      Contamos con un departamento legal especializado en <strong>Fideicomisos en Zona Restringida</strong>, blindaje de doble tributación (México-USA/Canadá) y cuentas de custodia <em>Escrow</em> en bancos suizos y norteamericanos.
      <br><br>
      Todas nuestras operaciones se cierran con notarios de máxima reputación en Querétaro y Guanajuato.
    `;
  }

  // Default Fallback
  return `
    Comprendo perfectamente su requerimiento. Como su <strong>Private Real Estate Advisor</strong> en el Bajío, puedo orientarle en:
    <div class="chat-quick-actions">
      <button class="quick-action-pill" onclick="askAI('Ver residencias en El Campanario')">El Campanario Querétaro</button>
      <button class="quick-action-pill" onclick="askAI('Ver haciendas en San Miguel')">San Miguel de Allende</button>
      <button class="quick-action-pill" onclick="askAI('Preventas de alta plusvalía')">Preventas High ROI</button>
      <button class="quick-action-pill" onclick="askAI('Fideicomisos y Blindaje')">Asesoría Legal Extranjeros</button>
    </div>
  `;
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
    '.property-card', '.b2b-feature-item', '.b2b-cta-box',
    '.hero-badge', '.hero-title', '.hero-desc', '.hero-search-glass',
    '.wizard-card', '.presale-level-switcher', '.footer-col'
  ];
  var SELECTORES_FOTO = [
    '.hero-main-card', '.property-thumb-wrap', '.presale-canvas-view',
    '.lookbook-media-wrap'
  ];

  function marcar(selectores, clase) {
    selectores.forEach(function (sel) {
      var nodos = document.querySelectorAll(sel);
      Array.prototype.forEach.call(nodos, function (el, i) {
        if (el.classList.contains('reveal') || el.classList.contains('reveal-media')) return;
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
    marcar(SELECTORES_FOTO, 'reveal-media');
    document.documentElement.setAttribute('data-anim', 'on');

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        observador.unobserve(e.target);   // una sola vez: no reaparece al subir
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal, .reveal-media').forEach(function (el) {
      observador.observe(el);
    });

    // Red de seguridad: lo que ya está en pantalla al cargar se muestra de
    // inmediato, y si algo quedara sin observar, a los 3 s se revela solo.
    setTimeout(function () {
      document.querySelectorAll('.reveal, .reveal-media').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-visible');
        }
      });
    }, 50);

    setTimeout(function () {
      document.querySelectorAll('.reveal, .reveal-media').forEach(function (el) {
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


/* Las tarjetas que el JS dibuja después (catálogo filtrado, comparador) no
   existen cuando corre lo de arriba. Esta función las engancha a mano; se
   llama desde donde se rendericen. */
function praetoraRevelarNuevos(contenedor) {
  var raiz = contenedor || document;
  raiz.querySelectorAll('.property-thumb-wrap').forEach(function (el) {
    el.classList.add('reveal-media', 'is-visible');
  });
}

/* ==========================================================================
   5. ACORDEÓN DE FILTROS COLAPSABLE (spacelab.co.uk editorial layout)
   ========================================================================== */
(function() {
  function initCatalogFilterAccordion() {
    const accordionGroups = document.querySelectorAll('.filter-accordion-group');
    if (!accordionGroups.length) return;

    function closeAllGroups() {
      accordionGroups.forEach(group => {
        group.classList.remove('is-open');
        const btn = group.querySelector('.filter-accordion-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }

    function toggleGroup(group) {
      const isOpen = group.classList.contains('is-open');
      closeAllGroups();
      if (!isOpen) {
        group.classList.add('is-open');
        const btn = group.querySelector('.filter-accordion-btn');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    }

    function updateAccordionValues() {
      // 1. Zona
      const activeZoneBtn = document.querySelector('.filter-pills-group .filter-pill.active');
      const valZona = document.getElementById('filter-val-zona');
      if (valZona && activeZoneBtn) {
        const filter = activeZoneBtn.dataset.filter;
        valZona.textContent = (filter === 'all' || !filter) ? 'Todas' : activeZoneBtn.textContent.trim().replace('QRO', '').replace('Reserve', '').replace('Polo', '').replace('León', '').trim();
      }

      // 2. Moneda
      const activeCurrencyBtn = document.querySelector('.currency-toggle-group .currency-btn.active');
      const valMoneda = document.getElementById('filter-val-moneda');
      if (valMoneda && activeCurrencyBtn) {
        valMoneda.textContent = activeCurrencyBtn.dataset.currency || 'MXN';
      }

      // 3. Amenidades
      const activeAmenities = document.querySelectorAll('.amenity-filters-wrap .amenity-tag.active');
      const valAmenidades = document.getElementById('filter-val-amenidades');
      if (valAmenidades) {
        if (activeAmenities.length === 0) {
          valAmenidades.textContent = 'Todas';
        } else if (activeAmenities.length === 1) {
          const raw = activeAmenities[0].textContent.trim();
          valAmenidades.textContent = raw.split(' ').slice(1).join(' ') || raw;
        } else {
          valAmenidades.textContent = `${activeAmenities.length} seleccionadas`;
        }
      }

      // 4. Tipología
      const activeTipoBtn = document.querySelector('[data-filter-group="tipologia"] .filter-pill.active');
      const valTipo = document.getElementById('filter-val-tipologia');
      if (valTipo && activeTipoBtn) {
        valTipo.textContent = (activeTipoBtn.dataset.type === 'all' || !activeTipoBtn.dataset.type) ? 'Todas' : activeTipoBtn.textContent.trim();
      }

      // 5. Orden
      const sortSelect = document.getElementById('catalog-sort-select');
      const valOrden = document.getElementById('filter-val-orden');
      if (valOrden && sortSelect) {
        const optText = sortSelect.options[sortSelect.selectedIndex]?.text || 'Mayor $';
        valOrden.textContent = optText.includes('Mayor Valor') ? 'Mayor $' : (optText.includes('Menor Valor') ? 'Menor $' : (optText.includes('Curada') ? 'Curada' : 'Superficie'));
      }
    }

    accordionGroups.forEach(group => {
      const btn = group.querySelector('.filter-accordion-btn');
      if (!btn) return;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleGroup(group);
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleGroup(group);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeAllGroups();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllGroups();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('.filter-pill') || e.target.closest('.currency-btn') || e.target.closest('.amenity-tag')) {
        setTimeout(updateAccordionValues, 30);
      }
    });

    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', updateAccordionValues);
    }

    updateAccordionValues();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCatalogFilterAccordion);
  } else {
    initCatalogFilterAccordion();
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
      if (target && target.closest && target.closest('a, button, input, select, textarea, .property-card, .filter-accordion-btn, .view-btn, .filter-pill, .currency-btn, .amenity-tag')) {
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

  function millones(n) {
    return '$' + (n / 1000000).toFixed(1).replace('.0', '') + ' M';
  }

  /* Si la casa no trae `flujo`, se arma solo con lo que haya. Así una
     propiedad nueva nunca deja la ficha en blanco. */
  function construirFlujo(p) {
    if (p.flujo && p.flujo.length) return p.flujo;
    var fotos = [];
    if (p.heroImage) fotos.push({ src: p.heroImage, prop: '16:9', pie: '' });
    (p.gallery || []).forEach(function (g) {
      if (g !== p.heroImage) fotos.push({ src: g, prop: '16:9', pie: '' });
    });
    return fotos;
  }

  /* Fila de dato: si el anuncio no lo publica, la fila NO se dibuja.
     No se rellena con cero ni con raya. */
  function fila(etiqueta, valor) {
    if (valor === null || valor === undefined || valor === '') return '';
    return '<div class="ficha-dato">' +
      '<span class="ficha-dato-etiqueta">' + esc(etiqueta) + '</span>' +
      '<span class="ficha-dato-valor">' + esc(valor) + '</span>' +
      '</div>';
  }

  function panelDatos(p) {
    var esActivo = !!p.llaves || p.id === 'activo-1';
    var precioHtml = '';
    if (p.priceMXN != null) {
      precioHtml = '<div class="ficha-precio">' + millones(p.priceMXN) + ' MXN</div>' +
        (p.priceUSD ? '<div class="ficha-precio-alt">' + millones(p.priceUSD) + ' USD</div>' : '');
    } else if (p.precioEstado) {
      precioHtml = '<div class="ficha-precio">' + esc(p.precioEstado) + '</div>';
    }

    var datosHtml = '';
    if (esActivo) {
      datosHtml = fila('Ubicación', p.subzone) +
        fila('Tipología', p.type) +
        fila('Construcción', p.m2Construccion ? p.m2Construccion.toLocaleString('es-MX') + ' m²' : null) +
        fila('Terreno', p.m2Terreno ? p.m2Terreno.toLocaleString('es-MX') + ' m²' : null) +
        fila('Suites', p.llaves ? p.llaves + (p.llavesDetalle ? ' (' + p.llavesDetalle + ')' : '') : null) +
        fila('Inquilino PB', p.inquilino) +
        fila('Renta mensual', p.rentaMensualMXN ? '$' + p.rentaMensualMXN.toLocaleString('es-MX') + ' MXN' : null) +
        fila('Reseñas', p.booking) +
        fila('Precio', p.precioEstado || (p.priceMXN ? '$' + Number(p.priceMXN).toLocaleString('es-MX') + ' MXN' : null));
    } else {
      datosHtml = fila('Ubicación', p.subzone) +
        fila('Tipología', p.type) +
        fila('Construcción', p.m2Construccion ? p.m2Construccion.toLocaleString('es-MX') + ' m²' : null) +
        fila('Terreno', p.m2Terreno ? p.m2Terreno.toLocaleString('es-MX') + ' m²' : null) +
        fila('Recámaras', p.bedrooms) +
        fila('Baños', p.bathrooms) +
        fila('Estacionamiento', p.garage ? p.garage + ' autos' : null) +
        fila('Inversión', p.priceMXN ? '$' + Number(p.priceMXN).toLocaleString('es-MX') + ' MXN' : null) +
        fila('Estatus', p.status);
    }

    return '<section class="ficha-panel ficha-panel-texto" id="ficha-info">' +
      '<span class="ficha-etiqueta">' + esc(p.zone) + ' · ' + esc(p.subzone) + '</span>' +
      '<h1 class="ficha-titulo">' + esc(p.title) + '</h1>' +
      precioHtml +
      '<div class="ficha-datos ficha-datos-sep">' +
        datosHtml +
      '</div>' +
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
      '<figcaption class="ficha-pie">' + esc(f.pie || '') + '</figcaption>' +
      '</figure>';
  }

  function panelCierre(p) {
    var esActivo = !!p.llaves || p.id === 'activo-1';
    var msg = encodeURIComponent(esActivo
      ? 'Deseo solicitar el expediente de inversión de ' + p.title + ' (' + p.subzone + ').'
      : 'Me interesa ' + p.title + ' (' + p.subzone + ').');
    var btnTexto = esActivo ? 'Solicitar expediente' : 'Consultar esta casa';
    var extraNotas = '';
    if (esActivo) {
      if (p.roofNota) {
        extraNotas += '<p class="ficha-parrafo" style="font-size: 0.9rem; color: var(--text-light); margin-top: 1.5rem; line-height: 1.6;">' + esc(p.roofNota) + '</p>';
      }
      extraNotas += '<p class="ficha-parrafo" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.8rem; line-height: 1.6;">Superficies informadas por el propietario. Expediente y proyecciones bajo solicitud.</p>';
    }
    return '<section class="ficha-panel ficha-panel-texto">' +
      '<p class="ficha-parrafo ficha-parrafo-alto">' + esc(p.description) + '</p>' +
      extraNotas +
      '<div class="ficha-acciones">' +
        '<a class="btn-gold" href="https://wa.me/524420000000?text=' + msg + '" target="_blank" rel="noopener">' + btnTexto + '</a>' +
        '<a class="ficha-volver" href="catalogo.html">Volver al catálogo</a>' +
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

    var clave = new URLSearchParams(window.location.search).get('id');
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
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', p.description);

    var html = '';
    construirFlujo(p).forEach(function (f, i) { html += panelFoto(f, i); });
    html += panelDatos(p);
    html += panelCierre(p);
    cont.innerHTML = html;

    paneles = cont.querySelectorAll('.ficha-panel');
    blindarFotos();
    observarPaneles();

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

    document.addEventListener('keydown', onTecla);
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
function pintarVitrina() {
  var grid = document.getElementById('portada-vitrina-grid');
  if (!grid) return;
  if (typeof LUXURY_PROPERTIES === 'undefined' || !Array.isArray(LUXURY_PROPERTIES)) return;

  var propiedades = LUXURY_PROPERTIES.slice().sort(function (a, b) {
    var pA = a.priceMXN != null ? a.priceMXN : -Infinity;
    var pB = b.priceMXN != null ? b.priceMXN : -Infinity;
    return pB - pA;
  });

  function formatearPrecio(p) {
    if (p.priceMXN != null && !isNaN(Number(p.priceMXN))) {
      return '$' + (Number(p.priceMXN) / 1000000).toFixed(1).replace('.0', '') + ' M MXN';
    }
    return p.precioEstado || '';
  }

  grid.innerHTML = propiedades.map(function (p) {
    var foto = p.fotoTarjeta || p.heroImage || '';
    var estiloPos = p.fotoTarjetaPos ? ' style="object-position: ' + esc(p.fotoTarjetaPos) + ';"' : '';
    var precio = formatearPrecio(p);

    return '<a class="portada-vitrina-tarjeta" href="propiedad.html?id=' + esc(p.id) + '">' +
      '<div class="portada-vitrina-foto">' +
        '<img src="' + esc(foto) + '" alt="' + esc(p.title) + '" loading="lazy"' + estiloPos + '>' +
      '</div>' +
      '<h3 class="portada-vitrina-nombre">' + esc(p.title) + '</h3>' +
      '<div class="portada-vitrina-ubicacion">' + esc(p.subzone || '') + '</div>' +
      (precio ? '<div class="portada-vitrina-precio">' + esc(precio) + '</div>' : '') +
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
        return '<a href="propiedad.html?id=' + esc(prop.id) + '" class="propiedad-bloque-miniatura" aria-label="Ver foto ' + (idx + 1) + ' de ' + esc(prop.title) + '">' +
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
          '<h2 class="propiedad-bloque-titulo">' + esc(prop.title) + '</h2>' +
          '<div class="propiedad-bloque-ubicacion">' +
            pinSvg +
            '<span>' + esc(ubicacionTexto) + '</span>' +
          '</div>' +
          (prop.resumen ? '<p class="propiedad-bloque-parrafo">' + esc(prop.resumen) + '</p>' : '') +
          (datosHtml ? '<div class="propiedad-bloque-datos">' + datosHtml + '</div>' : '') +
          '<div class="propiedad-bloque-accion">' +
            '<a href="propiedad.html?id=' + esc(prop.id) + '" class="portada-enlace">Ver propiedad</a>' +
          '</div>' +
        '</div>' +
        '<div class="propiedad-bloque-visual">' +
          '<a href="propiedad.html?id=' + esc(prop.id) + '" class="propiedad-bloque-foto-principal" aria-label="Ver ' + esc(prop.title) + '">' +
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

function pintarPropiedadDestacada() {
  var contenedor = document.getElementById('portada-destacada-grid');
  if (!contenedor) return;
  if (typeof LUXURY_PROPERTIES === 'undefined' || !Array.isArray(LUXURY_PROPERTIES)) return;
  for (var i = 0; i < LUXURY_PROPERTIES.length; i++) {
    if (LUXURY_PROPERTIES[i].destacada === true) {
      pintarPropiedadBloque(LUXURY_PROPERTIES[i], contenedor);
      break;
    }
  }
}

