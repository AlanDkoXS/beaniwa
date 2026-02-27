/**
 * Mobile Menu Component - Hamburger menu functionality
 */

/**
 * Toggle mobile menu
 */
function toggleMenu() {
  const header = document.getElementById("header");
  const navMenu = document.querySelector(".nav-menu");

  if (!header || !navMenu) {
    return;
  }

  header.classList.toggle("menu-open");
  navMenu.classList.toggle("active");
}

/**
 * Close mobile menu
 */
function closeMenu() {
  const header = document.getElementById("header");
  const navMenu = document.querySelector(".nav-menu");

  if (!header || !navMenu) {
    return;
  }

  header.classList.remove("menu-open");
  navMenu.classList.remove("active");
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
  // Add hamburger button if not exists
  const header = document.getElementById("header");
  const nav = document.querySelector(".nav");

  if (!header || !nav) {
    console.warn("Header or nav element not found");
    return;
  }

  // Create hamburger button
  const hamburger = document.createElement("button");
  hamburger.className = "menu-toggle";
  hamburger.setAttribute("aria-label", "Toggle menu");
  hamburger.innerHTML = "<span></span><span></span><span></span>";

  hamburger.addEventListener("click", toggleMenu);

  nav.appendChild(hamburger);

  // Close menu when clicking on links
  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  console.log("Mobile menu initialized");
}

// Export functions
export { closeMenu, initMobileMenu, toggleMenu };
