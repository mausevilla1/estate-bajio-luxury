// ==========================================================================
// ESTATE BAJÍO - Application Engine & Interactive Physics
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initHeaderScroll();
  renderCatalog('all');
  initCatalogFilters();
  initPresaleShowcase();
  initSellerWizard();
  initAIConcierge();
});

/* --------------------------------------------------------------------------
   2. Dynamic Ambient Canvas (Subtle Champagne Glow)
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
   3. Header Sticky & Blur on Scroll
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   4. Catalog Rendering & 3D Tilt Cards
   -------------------------------------------------------------------------- */
function renderCatalog(filter) {
  const container = document.getElementById('properties-container');
  if (!container) return;

  const filtered = filter === 'all' 
    ? LUXURY_PROPERTIES 
    : LUXURY_PROPERTIES.filter(p => p.zone.toLowerCase().includes(filter.toLowerCase()) || p.subzone.toLowerCase().includes(filter.toLowerCase()));

  container.innerHTML = filtered.map(prop => `
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
            <span class="price-mxn">$${(prop.priceMXN / 1000000).toFixed(1)}M MXN</span>
            <span class="price-usd">$${(prop.priceUSD / 1000000).toFixed(2)}M USD</span>
          </div>
          <button class="btn-outline-gold view-property-btn" onclick="openPropertyModal('${prop.id}')">
            Explorar
          </button>
        </div>
      </div>
    </article>
  `).join('');

  attachCardTiltEffect();
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
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCatalog(btn.dataset.filter);
    });
  });
}

/* --------------------------------------------------------------------------
   5. Property Detail Modal
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
          <div style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 700; color: var(--gold-primary);">$${(prop.priceMXN / 1000000).toFixed(1)}M MXN</div>
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

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
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
  document.getElementById('property-modal').classList.remove('open');
};

/* --------------------------------------------------------------------------
   6. Interactive Pre-Sale Scrollytelling Showcase
   -------------------------------------------------------------------------- */
function initPresaleShowcase() {
  const tabs = document.querySelectorAll('.level-tab');
  const renderImg = document.getElementById('presale-render-img');
  const levelTitle = document.getElementById('presale-level-title');
  const levelUnits = document.getElementById('presale-level-units');
  const levelPrice = document.getElementById('presale-level-price');
  const levelM2 = document.getElementById('presale-level-m2');
  const levelFeatures = document.getElementById('presale-level-features');

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

      levelTitle.textContent = lvl.name;
      levelUnits.textContent = `${lvl.unitsAvailable} Unidades Disponibles`;
      levelPrice.textContent = lvl.priceFrom;
      levelM2.textContent = lvl.m2;
      levelFeatures.textContent = lvl.features;
    });
  });
}

/* --------------------------------------------------------------------------
   7. VIP Seller Acquisition Wizard (Consignación Privada)
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
  prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
  nextBtn.textContent = step === 4 ? 'Confirmar y Solicitar Inspección' : 'Continuar ➔';
}

function calculateValuation() {
  const m2 = parseFloat(document.getElementById('wiz-m2').value) || 800;
  const zone = document.getElementById('wiz-zone').value;
  
  let pricePerM2 = 45000;
  if (zone.includes('Campanario')) pricePerM2 = 62000;
  if (zone.includes('San Miguel')) pricePerM2 = 58000;
  if (zone.includes('Juriquilla')) pricePerM2 = 48000;

  const estimatedValue = m2 * pricePerM2;
  document.getElementById('wiz-valuation-display').textContent = `$${(estimatedValue / 1000000).toFixed(1)}M MXN`;
}

/* --------------------------------------------------------------------------
   8. AI Private Concierge & Investment Advisor
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
  closeBtn.addEventListener('click', () => modal.classList.remove('open'));

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

    // AI typing response simulation
    setTimeout(() => {
      const aiBubble = document.createElement('div');
      aiBubble.className = 'chat-bubble ai';
      aiBubble.innerHTML = generateAIResponse(text);
      chatBody.appendChild(aiBubble);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 600);
  };

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

function generateAIResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('campanario') || q.includes('querétaro') || q.includes('golf')) {
    return `En <strong>El Campanario, Querétaro</strong> contamos con la <em>Residencia Campestre Alabaster</em> ($72M MXN) frente al green del hoyo 14, con plusvalía promedio del 14.2% anual y blindaje de seguridad 24/7. ¿Desea agendar una visita privada con nuestro Concierge?`;
  }
  if (q.includes('san miguel') || q.includes('allende') || q.includes('hacienda')) {
    return `En <strong>San Miguel de Allende</strong> recomendamos <em>Villa Travertino & Olivos</em> ($58.5M MXN). Diseñada en cantera y travertino con cava climatizada y huerto centenario. Es ideal para renta de ultra-lujo con rendimientos del 11.8% anual.`;
  }
  if (q.includes('preventa') || q.includes('inversion') || q.includes('roi')) {
    return `Nuestra preventa insignia en el Bajío es <strong>The Alabaster Sanctuary</strong> en Juriquilla Reserve. Cuenta con un ROI proyectado del <strong>26.8% en Fase 1</strong> y entrega en Q4 2027. Actualmente se encuentra 65% vendido.`;
  }
  return `Con gusto. Como su <strong>Private Wealth Real Estate Advisor</strong> en el Bajío, puedo orientarle en blindaje patrimonial, fideicomisos para extranjeros y acceso a nuestro <em>Private Vault</em> off-market. ¿Qué zona o rango de inversión prefiere evaluar?`;
}
