function whenReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

let modalTrigger = null;
let previousBodyOverflow = '';

function getModalFocusableElements(modal) {
  return Array.from(
    modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
  ).filter((element) => !element.hidden && element.getClientRects().length > 0);
}

function openModal(modalId, trigger = document.activeElement) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (!document.querySelector('.modal-overlay.active')) {
    previousBodyOverflow = document.body.style.overflow;
  }
  modalTrigger = trigger;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('tabindex', '-1');
  const title = modal.querySelector('.modal-header-title');
  if (title) {
    title.id = title.id || `${modal.id}-title`;
    modal.setAttribute('aria-labelledby', title.id);
  }
  document.body.style.overflow = 'hidden';
  const closeButton = modal.querySelector('.modal-close-btn');
  (closeButton || modal).focus();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal?.classList.contains('active')) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  const stillOpen = document.querySelector('.modal-overlay.active');
  if (stillOpen) {
    stillOpen.querySelector('.modal-close-btn')?.focus();
    return;
  }

  document.body.style.overflow = previousBodyOverflow;
  previousBodyOverflow = '';
  const trigger = modalTrigger;
  modalTrigger = null;
  if (trigger?.isConnected) trigger.focus();
}

function initServicesAndModals() {
  const modals = document.querySelectorAll('.modal-overlay');

  document.querySelectorAll('[data-modal-target]').forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', trigger.dataset.modalTarget);
    trigger.addEventListener('click', () => openModal(trigger.dataset.modalTarget, trigger));
    trigger.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
        event.preventDefault();
        trigger.click();
      }
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach((trigger) => {
    trigger.type = 'button';
    trigger.addEventListener('click', () => closeModal(trigger.dataset.modalClose));
  });

  document.querySelectorAll('[data-navigation-target]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      window.location.href = trigger.dataset.navigationTarget;
    });
  });

  modals.forEach((modal) => {
    const title = modal.querySelector('.modal-header-title');
    if (title) {
      title.id = title.id || `${modal.id}-title`;
      modal.setAttribute('aria-labelledby', title.id);
    }
    modal.setAttribute('aria-modal', 'true');

    if (modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (!activeModal) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal(activeModal.id);
      return;
    }

    if (event.key !== 'Tab') return;
    const focusableElements = getModalFocusableElements(activeModal);
    if (focusableElements.length === 0) {
      event.preventDefault();
      activeModal.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && (document.activeElement === firstElement || !activeModal.contains(document.activeElement))) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && (document.activeElement === lastElement || !activeModal.contains(document.activeElement))) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

window.openModal = openModal;
window.closeModal = closeModal;
whenReady(initServicesAndModals);

(function () {
  function changeSolutionsFeatureImage(imageId) {
    document.querySelectorAll('.feature-image-container').forEach((container) => {
      container.classList.toggle('feature-image-visible', container.id === imageId);
      container.classList.toggle('feature-image-hidden', container.id !== imageId);
    });
  }

  function toggleSolutionsFeatureAccordion(clickedHeader) {
    const accordionItem = clickedHeader.parentElement;
    const accordionContent = clickedHeader.nextElementSibling;
    const imageId = accordionItem.dataset.image;
    const isOpening = !accordionItem.classList.contains('feature-accordion-open');

    document.querySelectorAll('.feature-accordion-item').forEach((item) => {
      const content = item.querySelector('.feature-accordion-content');
      const isCurrent = item === accordionItem;
      item.classList.toggle('feature-accordion-open', isCurrent && isOpening);
      if (content) {
        content.classList.toggle('hidden', !(isCurrent && isOpening));
        content.setAttribute('aria-hidden', String(!(isCurrent && isOpening)));
      }
      item.querySelector('.feature-accordion-header')?.setAttribute('aria-expanded', String(isCurrent && isOpening));
    });

    if (window.innerWidth > 1024 && isOpening) {
      changeSolutionsFeatureImage(imageId);
    }
  }

  function initSolutionsFeatureAccordion() {
    const headers = document.querySelectorAll('.feature-accordion-header');
    const featureItems = document.querySelectorAll('.feature-accordion-item');

    headers.forEach((header) => {
      header.addEventListener('click', () => toggleSolutionsFeatureAccordion(header));
    });

    let firstOpen = document.querySelector('.feature-accordion-item.feature-accordion-open');
    if (!firstOpen && featureItems.length) {
      firstOpen = featureItems[0];
      firstOpen.classList.add('feature-accordion-open');
      const firstContent = firstOpen.querySelector('.feature-accordion-content');
      if (firstContent) {
        firstContent.classList.remove('hidden');
      }
    }

    featureItems.forEach((item, index) => {
      const header = item.querySelector('.feature-accordion-header');
      const content = item.querySelector('.feature-accordion-content');
      if (!header || !content) return;
      content.id = content.id || `feature-accordion-panel-${index + 1}`;
      header.setAttribute('aria-controls', content.id);
      header.setAttribute('aria-expanded', String(item.classList.contains('feature-accordion-open')));
      content.setAttribute('aria-hidden', String(!item.classList.contains('feature-accordion-open')));
    });

    if (window.innerWidth > 1024 && firstOpen) {
      changeSolutionsFeatureImage(firstOpen.dataset.image);
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        const openAccordion = document.querySelector('.feature-accordion-item.feature-accordion-open');
        if (openAccordion) {
          changeSolutionsFeatureImage(openAccordion.dataset.image);
        }
      }
    });
  }

  whenReady(initSolutionsFeatureAccordion);
})();

// Industries section
(function () {
  function initIndustries() {
    const industryItems = document.querySelectorAll('.industry-item');

    if (!industryItems.length) return;

    // Add a click handler to each industry.
    industryItems.forEach((item) => {
      const industryId = item.dataset.industry;
      const description = document.getElementById(`desc-${industryId}`);
      item.type = 'button';
      item.setAttribute('aria-controls', description?.id || `desc-${industryId}`);
      item.setAttribute('aria-expanded', String(item.classList.contains('active')));

      item.addEventListener('click', () => {
        const descElement = document.getElementById(`desc-${industryId}`);
        const content = item.querySelector('.industry-content');
        const isCurrentlyActive = item.classList.contains('active');

        // Hide all descriptions.
        document.querySelectorAll('.industry-description').forEach((desc) => {
          desc.classList.add('hidden');
          desc.hidden = true;
        });

        // Remove the active class from all items.
        industryItems.forEach((i) => {
          i.classList.remove('active');
          i.setAttribute('aria-expanded', 'false');
        });

        // Activate the selected item, or close it if it is already active.
        if (!isCurrentlyActive) {
          item.classList.add('active');
          // Show the content below the selected option.
          if (descElement && content) {
            descElement.innerHTML = content.innerHTML;
            descElement.classList.remove('hidden');
            descElement.hidden = false;
            item.setAttribute('aria-expanded', 'true');
          }
        }
      });
    });
  }

  whenReady(initIndustries);
})();
