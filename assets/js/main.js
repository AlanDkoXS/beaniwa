/**
 * Main Entry Point - Aniwa Digital Marketing
 * Initializes all modules and functionality
 */

// Import modules
import { initHeader } from "./components/header.js";
import { initSecondaryMobileMenu } from "./components/mobile-menu-secondary.js";
import { initMobileMenu } from "./components/mobile-menu.js";
import { initScrollAnimations } from "./components/scroll-animations.js";
import { initNavigation } from "./navigation.js";
import { initScroll } from "./scroll.js";
import updateDateYear from "./utils/date_updater.js";

// Check if current page is index
function isIndexPage() {
  const path = window.location.pathname;
  return (
    path === "/" ||
    path === "/index.html" ||
    path === "/es" ||
    path === "/es/" ||
    path === "/es/index.html" ||
    path === "/en" ||
    path === "/en/" ||
    path === "/en/index.html"
  );
}

/**
 * Freeze video on last frame when it ends
 */
function initHeroVideoFreeze() {
  const heroVideo = document.querySelector(".hero-video");

  if (!heroVideo) {
    return;
  }

  heroVideo.addEventListener("ended", function () {
    this.pause();
    this.controls = false;
  });
}

/**
 * Initialize all application modules
 */
function initApp() {
  console.log("Initializing Aniwa...");

  // Initialize all modules
  initNavigation();
  initScroll();
  initHeader();

  // Initialize appropriate mobile menu based on page
  if (isIndexPage()) {
    initMobileMenu();
  } else {
    initSecondaryMobileMenu();
  }

  initScrollAnimations();
  // Initialize utils
  updateDateYear();
  // Freeze video on last frame
  initHeroVideoFreeze();

  console.log("Aniwa initialized successfully");
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Export for debugging
export { initApp };
