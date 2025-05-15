(function () {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
      console.log('Menu toggle clicked, mobile menu visibility toggled');
    });
    console.log('Hamburger menu event listener attached successfully');
  } else {
    console.error('Hamburger menu elements not found in DOM');
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.removeEventListener('click', toggleMenu);

    menuToggle.addEventListener('click', toggleMenu);
    console.log('DOMContentLoaded: Menu eventlistener re-attached');
  }
});

function toggleMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');
    console.log('Menu toggled via named function');
  }
}