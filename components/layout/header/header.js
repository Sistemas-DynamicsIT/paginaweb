// ==================== HEADER BEHAVIOR ==================== //
// Runs immediately when the script loads, without waiting for DOMContentLoaded.

(function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const dropdownItems = document.querySelectorAll('.dropdown');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  // Exit if the header has not been loaded yet.
  if (!menuToggle || !navMenu) return;

  menuToggle.setAttribute('aria-expanded', 'false');

  // ==================== MOBILE MENU TOGGLE ==================== //
  menuToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // ==================== DESKTOP DROPDOWN MENUS ==================== //
  dropdownItems.forEach((item) => {
    item.addEventListener('mouseenter', function () {
      if (window.innerWidth > 768) {
        this.classList.add('active');
      }
    });

    item.addEventListener('mouseleave', function () {
      if (window.innerWidth > 768) {
        this.classList.remove('active');
      }
    });
  });

  // ==================== MOBILE DROPDOWN MENUS - CLICK ==================== //
  dropdownToggles.forEach((toggle) => {
    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parentDropdown = this.closest('.dropdown');
        dropdownItems.forEach((item) => {
          if (item !== parentDropdown) {
            item.classList.remove('active');
            const innerToggle = item.querySelector('.dropdown-toggle');
            if (innerToggle) innerToggle.setAttribute('aria-expanded', 'false');
          }
        });

        parentDropdown.classList.toggle('active');
        this.setAttribute('aria-expanded', String(parentDropdown.classList.contains('active')));
      }
    });
  });

  // ==================== CLOSE MENUS WHEN CLICKING OUTSIDE ==================== //
  document.addEventListener('click', function (event) {
    const isClickInsideMenu = event.target.closest('.nav-menu');
    const isClickOnToggle = event.target.closest('.menu-toggle');
    if (!isClickInsideMenu && !isClickOnToggle && window.innerWidth <= 768) {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      dropdownItems.forEach((item) => {
        item.classList.remove('active');
        const innerToggle = item.querySelector('.dropdown-toggle');
        if (innerToggle) innerToggle.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ==================== CLOSE MENUS ON RESIZE ==================== //
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      dropdownItems.forEach((item) => {
        item.classList.remove('active');
        const innerToggle = item.querySelector('.dropdown-toggle');
        if (innerToggle) innerToggle.setAttribute('aria-expanded', 'false');
      });
    }
  });
})();
