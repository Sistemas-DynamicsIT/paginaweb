(() => {
  function initializeSecondaryNavigation() {
    const navigation = document.querySelector('#secondary-nav');
    if (!navigation) return;

    const tabBar = navigation.querySelector('.tab-bar-nav');
    const links = [...navigation.querySelectorAll('a[href^="#"]')];
    const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

    if (!tabBar || !sections.length) return;

    let frameRequested = false;
    let activeLink = null;

    function revealActiveLink(link) {
      const tabBarBounds = tabBar.getBoundingClientRect();
      const linkBounds = link.getBoundingClientRect();
      const leftOverflow = linkBounds.left - tabBarBounds.left;
      const rightOverflow = linkBounds.right - tabBarBounds.right;

      if (leftOverflow < 0) {
        tabBar.scrollBy({ left: leftOverflow, behavior: 'smooth' });
      } else if (rightOverflow > 0) {
        tabBar.scrollBy({ left: rightOverflow, behavior: 'smooth' });
      }
    }

    function updateActiveLink() {
      frameRequested = false;
      const activationLine = navigation.getBoundingClientRect().bottom + 16;
      let activeSection = sections[0];

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= activationLine) {
          activeSection = section;
        }
      });

      links.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${activeSection.id}`;
        link.classList.toggle('active-tab', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }

        if (isActive && link !== activeLink) {
          activeLink = link;
          revealActiveLink(link);
        }
      });
    }

    function requestActiveLinkUpdate() {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(updateActiveLink);
    }

    window.addEventListener('scroll', requestActiveLinkUpdate, { passive: true });
    window.addEventListener('resize', requestActiveLinkUpdate);
    updateActiveLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSecondaryNavigation);
  } else {
    initializeSecondaryNavigation();
  }
})();
