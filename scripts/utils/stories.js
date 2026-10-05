const CASE_DATA = {
  modal1: {
    title: 'Mario Hernández',
    category: 'Comercio minorista · Automatización',
    image: './assets/images/products/image1.jpg',
    logo: './assets/images/products/modal1.jpg',
    characteristics:
      'Organización de comercio minorista con equipos de ventas y administración que necesitan información conectada para respaldar las operaciones diarias.',
    challenge:
      'Conectar la información de ventas y las tareas repetitivas para que los equipos puedan responder con mayor rapidez.',
    solution: 'Automatización de flujos de trabajo y análisis conectados con las herramientas que el equipo utiliza a diario.',
    scope: 'Industria: comercio minorista. Alcance: operaciones locales con equipos de ventas y administración.',
    products: ['Excel Online', 'Power BI', 'Power Automate'],
    results: [
      'Procesos de ventas más conectados.',
      'Mayor visibilidad de la información relevante.',
      'Menos esfuerzo dedicado a tareas manuales repetitivas.',
    ],
  },
  modal2: {
    title: 'AngloGold Ashanti',
    category: 'Minería · Análisis de datos',
    image: './assets/images/products/image2.jpg',
    logo: './assets/images/products/modal2.jpg',
    characteristics:
      'Operación minera regional con fuentes de información distribuidas y equipos que necesitan métricas operativas confiables.',
    challenge:
      'Consolidar las fuentes de información operativa para facilitar el análisis de métricas en una operación compleja.',
    solution:
      'Una plataforma de datos y análisis que organiza la información y ofrece visualizaciones coherentes a los equipos de negocio.',
    scope: 'Industria: minería. Alcance: regional, con información de múltiples áreas operativas.',
    products: ['Microsoft Fabric', 'Power BI'],
    results: [
      'Información consolidada para analizar métricas.',
      'Mayor disponibilidad de datos para los equipos.',
      'Decisiones operativas con mejor contexto.',
    ],
  },
  modal3: {
    title: 'Scania',
    category: 'Manufactura · Automatización',
    image: './assets/images/products/image3.jpg',
    logo: './assets/images/products/modal3.jpg',
    characteristics:
      'Empresa de manufactura con procesos de campo y equipos operativos que necesitan registrar y consultar información de manera coherente.',
    challenge: 'Digitalizar los flujos de trabajo operativos y simplificar el seguimiento de actividades para los equipos involucrados.',
    solution: 'Aplicaciones empresariales e informes conectados para estandarizar el registro y la consulta de información.',
    scope: 'Industria: manufactura. Alcance: operaciones locales y equipos de campo.',
    products: ['Power Apps', 'Excel Online'],
    results: [
      'Flujos de trabajo operativos digitalizados.',
      'Seguimiento más claro del trabajo de campo.',
      'Información accesible mediante una experiencia unificada.',
    ],
  },
  modal4: {
    title: 'Construcciones Cyes',
    category: 'Construcción · Análisis de datos',
    image: './assets/images/products/image4.jpg',
    logo: './assets/images/products/modal1.jpg',
    characteristics:
      'Empresa de construcción con proyectos simultáneos y equipos multidisciplinarios que coordinan datos, actividades y entregables.',
    challenge:
      'Coordinar la información y los procesos de los proyectos, con visibilidad más oportuna para los responsables de proyecto.',
    solution: 'Automatización y análisis para centralizar la información de los proyectos y facilitar su seguimiento.',
    scope: 'Industria: construcción. Alcance: proyectos locales con equipos multidisciplinarios.',
    products: ['Power Automate', 'Microsoft Fabric'],
    results: [
      'Mayor control de la información de los proyectos.',
      'Procesos de seguimiento más coherentes.',
      'Mejor coordinación entre equipos.',
    ],
  },
  modal5: {
    title: 'Real Madrid',
    category: 'Servicios · Análisis de datos',
    image: './assets/images/products/image5.jpg',
    logo: './assets/images/products/modal2.jpg',
    characteristics:
      'Organización de servicios con equipos de negocio que necesitan métricas claras para orientar conversaciones y decisiones de gestión.',
    challenge: 'Poner métricas de negocio a disposición para orientar conversaciones y decisiones.',
    solution:
      'Informes y modelos analíticos que convierten los datos disponibles en información más fácil de interpretar.',
    scope: 'Industria: servicios. Alcance: equipos de negocio y gestión.',
    products: ['Power BI', 'Excel Online'],
    results: ['Métricas más accesibles.', 'Comprensión más rápida del desempeño.', 'Mejores fundamentos para priorizar acciones.'],
  },
  modal6: {
    title: 'CineBank',
    category: 'Servicios · Infraestructura',
    image: './assets/images/products/image6.jpg',
    logo: './assets/images/products/modal3.jpg',
    characteristics:
      'Empresa de servicios en crecimiento que busca una base tecnológica conectada para estructurar y ampliar sus operaciones.',
    challenge: 'Estandarizar la gestión de la información y conectar las herramientas que respaldan las operaciones.',
    solution: 'Aplicaciones y servicios de datos para centralizar procesos y habilitar operaciones conectadas.',
    scope: 'Industria: servicios. Alcance: implementación local diseñada para crecer.',
    products: ['Power Apps', 'Microsoft Fabric', 'Azure'],
    results: [
      'Herramientas operativas conectadas.',
      'Información mejor estructurada.',
      'Una base tecnológica preparada para evolucionar.',
    ],
  },
};

const PRODUCT_ICONS = {
  'Excel Online': './assets/icons/ui/microsoft365/Excel.svg',
  'Power BI': './assets/icons/ui/powerplataform/PowerBI.svg',
  'Power Automate': './assets/icons/ui/powerplataform/PowerAutomate.svg',
  'Power Apps': './assets/icons/ui/powerplataform/PowerApps.svg',
  'Microsoft Fabric': './assets/icons/ui/microsoft365/fabric.svg',
  Azure: './assets/icons/ui/microsoft365/Microsoft.png',
  'Dynamics 365': './assets/icons/ui/dynamics365/Dynamics365.svg',
};

function productMarkup(product, className) {
  const icon = PRODUCT_ICONS[product];
  const iconMarkup = icon ? `<img src="${icon}" alt="" aria-hidden="true" />` : '';
  return `<span class="${className}">${iconMarkup}<span>${product}</span></span>`;
}

function normalizeAssetPaths() {
  document.querySelectorAll('img[src^="../../assets/"]').forEach((image) => {
    image.src = image.getAttribute('src').replace('../../assets/', './assets/');
  });
}

function renderCardProducts() {
  document.querySelectorAll('.card-products').forEach((container) => {
    const products = Array.from(container.querySelectorAll('span')).map((product) => product.textContent.trim());
    container.innerHTML = products.map((product) => productMarkup(product, 'product-item')).join('');
  });
}

let modalTrigger = null;
let previousBodyOverflow = '';

function getModalFocusableElements(modal) {
  return Array.from(
    modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
  ).filter((element) => !element.hidden && element.getClientRects().length > 0);
}

function initCaseExplorer() {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.card'));
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const searchSubmit = document.getElementById('searchSubmit');
  const industryFilter = document.getElementById('industryFilter');
  const technologyFilter = document.getElementById('technologyFilter');
  const solutionFilter = document.getElementById('solutionFilter');
  const sortFilter = document.getElementById('filterSelect');
  const summary = document.getElementById('resultsSummary');
  const emptyResults = document.getElementById('emptyResults');

  const includesFilter = (value, values) => value === 'all' || values.split(',').includes(value);

  const applyFilters = () => {
    const query = searchInput.value.trim().toLowerCase();
    const industry = industryFilter.value;
    const technology = technologyFilter.value;
    const solution = solutionFilter.value;
    const sort = sortFilter.value;

    const orderedCards =
      sort === 'recent'
        ? [...cards]
        : [...cards].sort((firstCard, secondCard) => {
            const firstName = firstCard.querySelector('.card-title').textContent;
            const secondName = secondCard.querySelector('.card-title').textContent;
            return sort === 'nameZA' ? secondName.localeCompare(firstName) : firstName.localeCompare(secondName);
          });

    orderedCards.forEach((card) => grid.appendChild(card));

    let visibleCases = 0;
    orderedCards.forEach((card) => {
      const isVisible =
        (!query || card.dataset.search.includes(query)) &&
        includesFilter(industry, card.dataset.industry) &&
        includesFilter(technology, card.dataset.technology) &&
        includesFilter(solution, card.dataset.solution);
      card.hidden = !isVisible;
      if (isVisible) visibleCases += 1;
    });

    clearSearch.hidden = !query;
    summary.textContent = `${visibleCases} ${visibleCases === 1 ? 'caso encontrado' : 'casos encontrados'}`;
    emptyResults.hidden = visibleCases !== 0;
  };

  [searchInput, industryFilter, technologyFilter, solutionFilter, sortFilter].forEach((control) => {
    control.addEventListener('input', applyFilters);
    control.addEventListener('change', applyFilters);
  });

  searchSubmit.addEventListener('click', applyFilters);
  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    applyFilters();
    searchInput.focus();
  });

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('.card-link');
    if (button) openModal(button.closest('.card').dataset.modalId, button);
  });

  applyFilters();
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function openModal(modalId, trigger = document.activeElement) {
  const modal = document.getElementById('caseModal');
  const data = CASE_DATA[modalId];
  if (!modal || !data) return;

  if (!modal.classList.contains('active')) {
    previousBodyOverflow = document.body.style.overflow;
  }
  modalTrigger = trigger;
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('aria-modal', 'true');
  const logo = document.getElementById('modalLogo');
  const image = document.getElementById('modalImage');
  if (logo) logo.src = data.logo;
  if (image) {
    image.src = data.image;
    image.alt = `${data.title} - Caso de éxito`;
  }

  setText('modalCategory', data.category);
  setText('modalTitle', data.title);
  setText('modalCharacteristics', data.characteristics);
  setText('modalChallenge', data.challenge);
  setText('modalSolution', data.solution);
  setText('modalScope', data.scope);

  const products = document.getElementById('modalProductsList');
  if (products) {
    products.innerHTML = data.products.map((product) => `<li>${productMarkup(product, 'modal-product')}</li>`).join('');
  }

  const results = document.getElementById('modalResultsList');
  if (results) results.innerHTML = data.results.map((result) => `<li>${result}</li>`).join('');

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  (document.getElementById('modalClose') || modal).focus();
}

function closeModal() {
  const modal = document.getElementById('caseModal');
  if (!modal?.classList.contains('active')) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = previousBodyOverflow;
  previousBodyOverflow = '';
  const trigger = modalTrigger;
  modalTrigger = null;
  if (trigger?.isConnected) trigger.focus();
}

function initModal() {
  const modal = document.getElementById('caseModal');
  document.querySelectorAll('[data-modal-id]').forEach((button) => {
    if (!button.closest('.card')) button.addEventListener('click', () => openModal(button.dataset.modalId, button));
  });
  const closeButton = document.getElementById('modalClose');
  if (closeButton) {
    closeButton.type = 'button';
    closeButton.addEventListener('click', closeModal);
  }
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (!modal?.classList.contains('active')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusableElements = getModalFocusableElements(modal);
    if (focusableElements.length === 0) {
      event.preventDefault();
      modal.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && (document.activeElement === firstElement || !modal.contains(document.activeElement))) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && (document.activeElement === lastElement || !modal.contains(document.activeElement))) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

function initStories() {
  normalizeAssetPaths();
  renderCardProducts();
  initCaseExplorer();
  initModal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStories);
} else {
  initStories();
}

window.openModal = openModal;
window.closeModal = closeModal;
