function normalizeAssetPaths() {
  document.querySelectorAll('img[src^="../../assets/"]').forEach((image) => {
    image.src = image.getAttribute('src').replace('../../assets/', './assets/');
  });
}

normalizeAssetPaths();

// Our story.
class AboutTabs {
  constructor() {
    this.init();
  }

  init() {
    this.initAboutTabs();
    this.initAccordions();
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
}

// Initialize on the About page.
if (document.querySelector('.overview-tabs-container')) {
  new AboutTabs();
}

// Recognition section.
// AboutCarousel manages the achievements carousel.
class AboutCarousel {
  constructor() {
    this.init();
  }

  init() {
    this.initAchievementsCarousel();
  }

  getCardsPerSlide() {
    return window.innerWidth <= 480 ? 1 : 2;
  }

  initAchievementsCarousel() {
    const carousel = document.querySelector('.achievements-container');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const cards = carousel ? carousel.querySelectorAll('.achievement-card') : [];
    const carouselTrack = document.querySelector('.achievements-carousel');

    if (!carousel || cards.length === 0) return;

    if (!carouselTrack.dataset.currentIndex) {
      carouselTrack.dataset.currentIndex = '0';
    }

    const calculateMaxIndex = () => {
      return Math.max(0, Math.ceil(cards.length / this.getCardsPerSlide()) - 1);
    };

    const getCardStep = () => {
      const gap = parseFloat(window.getComputedStyle(carousel).gap) || 0;
      return cards[0].offsetWidth + gap;
    };

    let maxIndex = calculateMaxIndex();
    const carouselController = this;

    const updateCarousel = () => {
      const currentIndex = parseInt(carouselTrack.dataset.currentIndex || '0', 10);
      carousel.style.transform = `translateX(-${currentIndex * this.getCardsPerSlide() * getCardStep()}px)`;

      updateButtonStates();
      carouselController.updateIndicators(currentIndex);

      if (currentIndex >= maxIndex) {
        carouselTrack.classList.add('at-end');
        if (nextBtn) {
          nextBtn.setAttribute('tabindex', '-1');
        }
      } else {
        carouselTrack.classList.remove('at-end');
        if (nextBtn) {
          nextBtn.setAttribute('tabindex', '0');
        }
      }
    };

    const updateButtonStates = () => {
      const currentIndex = parseInt(carouselTrack.dataset.currentIndex || '0', 10);
      if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
        prevBtn.setAttribute('aria-disabled', (currentIndex === 0).toString());
        prevBtn.classList.toggle('disabled', currentIndex === 0);
      }
      if (nextBtn) {
        nextBtn.disabled = currentIndex >= maxIndex;
        nextBtn.setAttribute('aria-disabled', (currentIndex >= maxIndex).toString());
        nextBtn.classList.toggle('disabled', currentIndex >= maxIndex);
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        let currentIndex = parseInt(carouselTrack.dataset.currentIndex || '0', 10);
        if (currentIndex < maxIndex) {
          currentIndex++;
          carouselTrack.dataset.currentIndex = currentIndex.toString();
          updateCarousel();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        let currentIndex = parseInt(carouselTrack.dataset.currentIndex || '0', 10);
        if (currentIndex > 0) {
          currentIndex--;
          carouselTrack.dataset.currentIndex = currentIndex.toString();
          updateCarousel();
        }
      });
    }

    window.addEventListener('resize', () => {
      maxIndex = calculateMaxIndex();
      let currentIndex = parseInt(carouselTrack.dataset.currentIndex || '0', 10);
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
        carouselTrack.dataset.currentIndex = currentIndex.toString();
      }
      this.createIndicators();
      updateCarousel();
    });

    this.createIndicators();
    updateCarousel();
  }

  createIndicators() {
    const carouselTrack = document.querySelector('.achievements-carousel');
    const carousel = carouselTrack ? carouselTrack.querySelector('.achievements-container') : null;
    const cards = carousel ? carousel.querySelectorAll('.achievement-card') : [];
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    if (!carouselTrack || !carousel || !indicatorsContainer || cards.length === 0) return;

    indicatorsContainer.innerHTML = '';

    const maxIndex = Math.max(0, Math.ceil(cards.length / this.getCardsPerSlide()) - 1);

    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);

      const currentCarouselIndex = parseInt(carouselTrack.dataset.currentIndex || '0', 10);
      if (i === currentCarouselIndex) dot.classList.add('active');

      dot.addEventListener('click', () => {
        this.goToSlide(i);
      });

      indicatorsContainer.appendChild(dot);
    }
  }

  goToSlide(index) {
    const carousel = document.querySelector('.achievements-container');
    const cards = carousel ? carousel.querySelectorAll('.achievement-card') : [];
    const carouselTrack = document.querySelector('.achievements-carousel');

    if (!carousel || cards.length === 0) return;

    const gap = parseFloat(window.getComputedStyle(carousel).gap) || 0;
    const cardStep = cards[0].offsetWidth + gap;
    carousel.style.transform = `translateX(-${index * this.getCardsPerSlide() * cardStep}px)`;

    this.updateIndicators(index);

    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    const maxIndex = Math.max(0, Math.ceil(cards.length / this.getCardsPerSlide()) - 1);

    if (prevBtn) {
      prevBtn.disabled = index === 0;
      prevBtn.setAttribute('aria-disabled', (index === 0).toString());
      prevBtn.classList.toggle('disabled', index === 0);
      prevBtn.setAttribute('tabindex', index === 0 ? '-1' : '0');
    }

    if (nextBtn) {
      nextBtn.disabled = index >= maxIndex;
      nextBtn.setAttribute('aria-disabled', (index >= maxIndex).toString());
      nextBtn.classList.toggle('disabled', index >= maxIndex);
      nextBtn.setAttribute('tabindex', index >= maxIndex ? '-1' : '0');
    }

    carouselTrack.dataset.currentIndex = index.toString();

    if (index >= maxIndex) {
      carouselTrack.classList.add('at-end');
    } else {
      carouselTrack.classList.remove('at-end');
    }
  }

  updateIndicators(activeIndex) {
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const dots = indicatorsContainer ? indicatorsContainer.querySelectorAll('.carousel-dot') : [];
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

// Initialize the carousel when it is present.
if (document.querySelector('.achievements-carousel')) {
  new AboutCarousel();
}
