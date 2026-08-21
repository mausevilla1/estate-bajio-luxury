// ==========================================================================
// ESTATE BAJÍO - Application Engine & Interactive Physics
// ==========================================================================

let currentCurrency = 'MXN';
let currentViewMode = 'grid';
let activeZoneFilter = 'all';
let activeAmenities = [];
let searchQuery = '';
let currentSort = 'default';
let comparedProperties = [];

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initHeaderScroll();
  initCatalogFilters();
  initPresaleShowcase();
  initSellerWizard();
  initAIConcierge();
  initDedicatedCatalogPage();
});

/* --------------------------------------------------------------------------
   1. Dynamic Ambient Canvas (Subtle Champagne Glow)
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

    // Warm champagne radial glow
    const gradient = ctx.createRadialGradient(
      currentX, currentY, 10,
      currentX, currentY, 650
    );
    gradient.addColorStop(0, 'rgba(216, 189, 128, 0.14)');
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

  // 2. Search query
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.zone.toLowerCase().includes(q) ||
      p.subzone.toLowerCase().includes(q) ||
      p.architect.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
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
        const formattedPrice = currentCurrency === 'MXN'
          ? `$${(prop.priceMXN / 1000000).toFixed(1)}M MXN`
          : `$${(prop.priceUSD / 1000000).toFixed(2)}M USD`;
        const subPrice = currentCurrency === 'MXN'
          ? `$${(prop.priceUSD / 1000000).toFixed(2)}M USD`
          : `$${(prop.priceMXN / 1000000).toFixed(1)}M MXN`;

        return `
          <article class="property-card" data-id="${prop.id}">
            <div class="property-thumb-wrap">
              <img src="${prop.heroImage}" alt="${prop.title} - Residencia de Lujo en ${prop.zone}" loading="lazy">
              <div class="property-badges">
                ${prop.isExclusive ? '<span class="badge-tag exclusive">PRIVATE VAULT</span>' : ''}
                <span class="badge-tag">${prop.status}</span>
              </div>
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
                  <button class="btn-outline-gold" onclick="openPropertyModal('${prop.id}')">
                    Explorar
                  </button>
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
        const formattedPrice = currentCurrency === 'MXN'
          ? `$${(prop.priceMXN / 1000000).toFixed(1)}M MXN`
          : `$${(prop.priceUSD / 1000000).toFixed(2)}M USD`;

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
                    <div class="val">${prop.m2Construccion} m²</div>
                    <div class="lbl">Construcción</div>
                  </div>
                  <div class="lookbook-spec-item">
                    <div class="val">${prop.m2Terreno} m²</div>
                    <div class="lbl">Terreno</div>
                  </div>
                  <div class="lookbook-spec-item">
                    <div class="val">${prop.bedrooms} R / ${prop.bathrooms} B</div>
                    <div class="lbl">Espacios</div>
                  </div>
                  <div class="lookbook-spec-item">
                    <div class="val" style="color: var(--gold-primary);">${prop.projectedYield.split(' ')[0]}</div>
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
                    <button class="btn-gold" onclick="openPropertyModal('${prop.id}')">
                      Ver Ficha Completa
                    </button>
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

/* --------------------------------------------------------------------------
   4. Dedicated Catalog Page Handlers (catalogo.html)
   -------------------------------------------------------------------------- */
function initDedicatedCatalogPage() {
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderMasterCatalog();
    });
  }

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
          <div style="font-family: var(--font-mono);">$${(p.priceUSD / 1000000).toFixed(2)}M USD</div>
          <div>${p.m2Construccion} m²</div>
          <div>${p.m2Terreno} m²</div>
          <div>${p.bedrooms} Recs / ${p.bathrooms} Baños</div>
          <div style="color: #2E7D32; font-weight: 600;">${p.projectedYield}</div>
          <div style="font-size: 0.85rem;">${p.architect}</div>
          <div>
            <button class="btn-gold" style="padding: 0.5rem 1rem; font-size: 0.75rem; width: 100%; justify-content: center;" onclick="closeComparisonModal(); openPropertyModal('${p.id}')">
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
          <button class="btn-gold" style="margin-top: 0.6rem; font-size: 0.72rem; padding: 0.4rem 0.8rem; width: 100%; justify-content: center;" onclick="openPropertyModal('prop-2')">
            Explorar Ficha 8K
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
          <button class="btn-gold" style="margin-top: 0.6rem; font-size: 0.72rem; padding: 0.4rem 0.8rem; width: 100%; justify-content: center;" onclick="openPropertyModal('prop-1')">
            Ver Detalles y Cava
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
