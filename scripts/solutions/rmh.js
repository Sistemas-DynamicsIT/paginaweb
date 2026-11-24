/**
 * Initializes the methodology section.
 * - Accordion toggling
 * - Desktop side-image switching
 * - Random background images
 */
function initializeMethodology() {
  // Populate random images when product images are available.
  populateRandomProductImages();

  const accordionHeaders = document.querySelectorAll('.methodology-accordion-header');

  accordionHeaders.forEach((header, index) => {
    const content = header.nextElementSibling;
    if (content) {
      content.id = content.id || `methodology-panel-${index + 1}`;
      content.setAttribute('aria-hidden', String(!header.parentElement.classList.contains('accordion-open')));
      header.setAttribute('aria-controls', content.id);
      header.setAttribute('aria-expanded', String(header.parentElement.classList.contains('accordion-open')));
    }
    header.type = 'button';
    header.addEventListener('click', function () {
      toggleMethodologyAccordion(this);
    });
  });

  // Show the first image on desktop.
  if (window.innerWidth >= 768) {
    changeMethodologyImage('image1');
  }

  // Recalculate the selected image after resizing.
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
      const openAccordion = document.querySelector('.methodology-accordion-item.accordion-open');
      if (openAccordion) {
        const imageId = openAccordion.getAttribute('data-image');
        changeMethodologyImage(imageId);
      }
    }
  });
}

/**
 * Toggles an accordion item and closes the others.
 * @param {HTMLElement} clickedHeader - The clicked accordion button.
 */
function toggleMethodologyAccordion(clickedHeader) {
  const accordionItem = clickedHeader.parentElement;
  const accordionContent = clickedHeader.nextElementSibling;
  const imageId = accordionItem.getAttribute('data-image');

  // Close all other accordion items.
  document.querySelectorAll('.methodology-accordion-item').forEach((item) => {
    if (item !== accordionItem) {
      item.classList.remove('accordion-open');
      const content = item.querySelector('.methodology-accordion-content');
      content.classList.add('hidden');
      content.setAttribute('aria-hidden', 'true');
      item.querySelector('.methodology-accordion-header').setAttribute('aria-expanded', 'false');
      const icon = item.querySelector('.methodology-accordion-icon');
      if (icon) icon.classList.remove('rotate-180');
    }
  });

  // Toggle the selected item.
  accordionContent.classList.toggle('hidden');
  accordionItem.classList.toggle('accordion-open');
  const isOpen = accordionItem.classList.contains('accordion-open');
  accordionContent.setAttribute('aria-hidden', String(!isOpen));
  clickedHeader.setAttribute('aria-expanded', String(isOpen));

  const indicator = clickedHeader.querySelector('.methodology-accordion-icon');
  if (indicator) indicator.classList.toggle('rotate-180');

  // Update the desktop image when the accordion item opens.
  if (window.innerWidth >= 768 && accordionItem.classList.contains('accordion-open')) {
    changeMethodologyImage(imageId);
  }
}

/**
 * Shows the corresponding image in the desktop side panel.
 * @param {string} imageId - The image container ID (for example, 'image1').
 */
function changeMethodologyImage(imageId) {
  document.querySelectorAll('.methodology-image-container').forEach((container) => {
    container.classList.remove('image-visible');
    container.classList.add('image-hidden');
  });

  const targetImage = document.getElementById(imageId);
  if (targetImage) {
    targetImage.classList.remove('image-hidden');
    targetImage.classList.add('image-visible');
  }
}

/**
 * Assigns random background images to desktop and mobile image containers.
 */
function populateRandomProductImages() {
  const basePath = './assets/images/products/';
  const productImages = Array.from({ length: 12 }, (_, i) => basePath + `image${i + 1}.jpg`);

  // Desktop image containers.
  const desktopBoxes = document.querySelectorAll('.methodology-image-placeholder');
  desktopBoxes.forEach((box, idx) => {
    const img = productImages[idx % productImages.length];
    box.style.backgroundImage = `url('${img}')`;
    box.style.backgroundSize = 'cover';
    box.style.backgroundPosition = 'center';
  });

  // Mobile images inside the accordion.
  const mobileBoxes = document.querySelectorAll('.methodology-accordion-image-placeholder');
  mobileBoxes.forEach((box, idx) => {
    const img = productImages[(desktopBoxes.length + idx) % productImages.length];
    box.style.backgroundImage = `url('${img}')`;
    box.style.backgroundSize = 'cover';
    box.style.backgroundPosition = 'center';
  });
}

function normalizeAssetPaths() {
  document.querySelectorAll('img[src^="../../assets/"]').forEach((image) => {
    image.src = image.getAttribute('src').replace('../../assets/', './assets/');
  });
}

function initializeFaq() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((question, index) => {
    const answer = question.parentElement.querySelector('.faq-answer');
    if (answer) {
      answer.id = answer.id || `faq-answer-${index + 1}`;
      answer.setAttribute('aria-hidden', String(!question.parentElement.classList.contains('active')));
      question.setAttribute('aria-controls', answer.id);
      question.setAttribute('aria-expanded', String(question.parentElement.classList.contains('active')));
    }
    question.type = 'button';
    question.addEventListener('click', function () {
      const card = this.parentElement; // .faq-card
      const isActive = card.classList.contains('active');

      // Close all other cards.
      document.querySelectorAll('.faq-card').forEach((item) => {
        if (item !== card) {
          item.classList.remove('active');
          item.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          item.querySelector('.faq-answer')?.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle the current card.
      if (isActive) {
        card.classList.remove('active');
      } else {
        card.classList.add('active');
      }
      this.setAttribute('aria-expanded', String(!isActive));
      answer?.setAttribute('aria-hidden', String(isActive));
    });
  });
}

function initLicenseFilters() {
  const categoryButtons = document.querySelectorAll('.license-category-button');
  const licenseCards = document.querySelectorAll('.license-card[data-license-category]');

  categoryButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const selectedCategory = this.dataset.licenseCategory;

      categoryButtons.forEach((categoryButton) => {
        const isActive = categoryButton === this;
        categoryButton.classList.toggle('is-active', isActive);
        categoryButton.setAttribute('aria-pressed', String(isActive));
      });

      licenseCards.forEach((card) => {
        card.hidden = card.dataset.licenseCategory !== selectedCategory;
      });
    });
  });

  const defaultButton = document.querySelector('.license-category-button.is-active');
  if (defaultButton) defaultButton.click();
}

function initProductsPage() {
  normalizeAssetPaths();

  if (document.querySelector('.methodology-accordion-header')) {
    initializeMethodology();
  }

  if (document.querySelector('.faq-question')) {
    initializeFaq();
  }

  if (document.querySelector('.license-category-button')) {
    initLicenseFilters();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductsPage);
} else {
  initProductsPage();
}
