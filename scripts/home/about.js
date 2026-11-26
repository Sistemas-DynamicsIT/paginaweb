// Our story.
class AboutTabs {
  constructor() {
    this.init();
  }

  init() {
    this.initAboutTabs();
    this.initAccordions();
    this.initFAQ();
  }

  initAboutTabs() {
    const tabs = document.querySelectorAll('.overview-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabList = document.querySelector('.overview-tabs');

    if (tabList) tabList.setAttribute('role', 'tablist');

    const selectTab = (selectedTab, moveFocus = false) => {
      const selectedId = selectedTab.dataset.tab;
      tabs.forEach((tab) => {
        const isSelected = tab === selectedTab;
        tab.classList.toggle('active', isSelected);
        tab.setAttribute('aria-selected', String(isSelected));
        tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      });
      tabContents.forEach((content) => {
        const isSelected = content.id === selectedId;
        content.classList.toggle('active', isSelected);
        content.setAttribute('aria-hidden', String(!isSelected));
      });
      if (moveFocus) selectedTab.focus();
    };

    tabs.forEach((tab, index) => {
      const panel = document.getElementById(tab.dataset.tab);
      tab.type = 'button';
      tab.id = tab.id || `overview-tab-${tab.dataset.tab}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', tab.dataset.tab);
      if (panel) {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
      }
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const nextIndex =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? tabs.length - 1
              : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        selectTab(tabs[nextIndex], true);
      });
    });

    if (tabs.length > 0) {
      selectTab(document.querySelector('.overview-tab.active') || tabs[0]);
    }
  }

  initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach((header, index) => {
      const accordionBody = header.parentElement.querySelector('.accordion-body');
      if (accordionBody) {
        accordionBody.id = accordionBody.id || `about-accordion-panel-${index + 1}`;
        accordionBody.setAttribute('role', 'region');
        accordionBody.setAttribute('aria-labelledby', header.id || `about-accordion-header-${index + 1}`);
        header.id = header.id || `about-accordion-header-${index + 1}`;
        header.setAttribute('aria-controls', accordionBody.id);
        header.setAttribute('aria-expanded', String(header.parentElement.classList.contains('active')));
        accordionBody.setAttribute('aria-hidden', String(!header.parentElement.classList.contains('active')));
      }
      header.type = 'button';
      header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const isActive = accordionItem.classList.contains('active');

        const accordionGroup = accordionItem.closest('.accordion');
        if (accordionGroup) {
          accordionGroup.querySelectorAll('.accordion-item').forEach((item) => {
            item.classList.remove('active');
            const body = item.querySelector('.accordion-body');
            if (body) {
              body.style.maxHeight = null;
              body.setAttribute('aria-hidden', 'true');
            }
            item.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
          });
        }

        if (!isActive) {
          accordionItem.classList.add('active');
          if (accordionBody) {
            accordionBody.style.maxHeight = accordionBody.scrollHeight + 'px';
            accordionBody.setAttribute('aria-hidden', 'false');
          }
          header.setAttribute('aria-expanded', 'true');
        } else {
          accordionItem.classList.remove('active');
          if (accordionBody) {
            accordionBody.style.maxHeight = null;
            accordionBody.setAttribute('aria-hidden', 'true');
          }
          header.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.querySelectorAll('.accordion').forEach((accordion) => {
      const firstItem = accordion.querySelector('.accordion-item');
      if (firstItem && firstItem.classList.contains('active')) {
        const firstBody = firstItem.querySelector('.accordion-body');
        if (firstBody) {
          firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
        }
      }
    });
  }

  initFAQ() {
    const faqCards = document.querySelectorAll('.faq-card');

    faqCards.forEach((card, index) => {
      const button = card.querySelector('[data-faq-toggle]');
      const answer = card.querySelector('.faq-answer');

      if (button && answer) {
        answer.id = answer.id || `about-faq-answer-${index + 1}`;
        answer.setAttribute('role', 'region');
        answer.setAttribute('aria-labelledby', button.id || `about-faq-button-${index + 1}`);
        button.id = button.id || `about-faq-button-${index + 1}`;
        button.type = 'button';
        button.setAttribute('aria-controls', answer.id);
        button.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');

        button.addEventListener('click', () => {
          const isActive = card.classList.contains('active');

          faqCards.forEach((faqItem) => {
            faqItem.classList.remove('active');
            const faqButton = faqItem.querySelector('[data-faq-toggle]');
            const faqAnswer = faqItem.querySelector('.faq-answer');
            if (faqButton) {
              faqButton.setAttribute('aria-expanded', 'false');
            }
            if (faqAnswer) {
              faqAnswer.setAttribute('aria-hidden', 'true');
            }
          });

          if (!isActive) {
            card.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
            answer.setAttribute('aria-hidden', 'false');
          }
        });
      }
    });
  }
}

// Initialize on the About page.
if (document.querySelector('.overview-tabs-container') || document.querySelector('.faq-grid')) {
  new AboutTabs();
}

// Evolution carousel.
class AboutCarousel {
  constructor(carousel) {
    this.carousel = carousel;
    this.track = carousel.querySelector('.achievements-container');
    this.viewport = carousel.querySelector('.achievements-viewport');
    this.cards = this.track ? Array.from(this.track.querySelectorAll('.achievement-card')) : [];
    this.controls = carousel.querySelector('.carousel-controls');
    this.status = carousel.querySelector('.carousel-status');
    this.prevBtn = carousel.querySelector('.carousel-btn.prev');
    this.nextBtn = carousel.querySelector('.carousel-btn.next');
    this.currentIndex = 0;
    this.cardsPerSlide = this.getCardsPerSlide();

    this.init();
  }

  getCardsPerSlide() {
    return window.matchMedia('(max-width: 767px)').matches ? 1 : 2;
  }

  init() {
    if (
      !this.track || !this.viewport || !this.controls || !this.status ||
      !this.prevBtn || !this.nextBtn || this.cards.length === 0
    ) return;

    this.prevBtn.addEventListener('click', () => this.goToSlide(this.currentIndex - 1));
    this.nextBtn.addEventListener('click', () => this.goToSlide(this.currentIndex + 1));
    window.addEventListener('resize', () => this.update());

    this.carousel.classList.add('is-ready');
    this.viewport.removeAttribute('tabindex');
    this.controls.hidden = false;
    this.update();
  }

  getMaxIndex() {
    return Math.max(0, this.cards.length - this.cardsPerSlide);
  }

  goToSlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.getMaxIndex()));
    this.update();
  }

  update() {
    if (!this.track || this.cards.length === 0) return;

    this.cardsPerSlide = this.getCardsPerSlide();
    this.currentIndex = Math.min(this.currentIndex, this.getMaxIndex());

    const gap = parseFloat(window.getComputedStyle(this.track).gap) || 0;
    const cardStep = this.cards[0].getBoundingClientRect().width + gap;
    this.track.style.transform = `translate3d(-${this.currentIndex * cardStep}px, 0, 0)`;

    if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentIndex >= this.getMaxIndex();

    const lastVisible = Math.min(this.currentIndex + this.cardsPerSlide, this.cards.length);
    this.cards.forEach((card, index) => {
      card.setAttribute('aria-hidden', String(index < this.currentIndex || index >= lastVisible));
    });

    if (this.status) {
      const first = String(this.currentIndex + 1).padStart(2, '0');
      const last = String(lastVisible).padStart(2, '0');
      const total = String(this.cards.length).padStart(2, '0');
      this.status.textContent = this.cardsPerSlide === 1
        ? `Hito ${first} de ${total}`
        : `Hitos ${first}–${last} de ${total}`;
    }
  }
}

// Initialize the carousel when it is present.
document.querySelectorAll('#evolution .achievements-carousel').forEach((carousel) => new AboutCarousel(carousel));
