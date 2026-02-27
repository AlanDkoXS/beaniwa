/**
 * Main Entry Point - Aniwa Digital Marketing
 * Initializes all modules and functionality
 */

// Import modules
import { initHeader } from "./components/header.js";
import { initMobileMenu } from "./components/mobile-menu.js";
import { initScrollAnimations } from "./components/scroll-animations.js";
import { initNavigation } from "./navigation.js";
import { initScroll } from "./scroll.js";
import updateDateYear from "./utils/date_updater.js";
import { initViewTransitions } from "./view-transitions.js";

/**
 * Initialize all application modules
 */
function initApp() {
  console.log("Initializing Aniwa...");

  // Initialize all modules
  initNavigation();
  initViewTransitions();
  initScroll();
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  // Initialize utils
  updateDateYear();

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
