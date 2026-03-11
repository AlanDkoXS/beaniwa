/**
 * Main Entry Point - Aniwa Digital Marketing
 * Initializes all modules and functionality
 */

// Import modules
import { initAmbientGlow } from "./components/ambient-glow.js";
import { initContactForm } from "./components/contact-form.js";
import { initHeader } from "./components/header.js";
import { initSecondaryMobileMenu, updateSecondaryMenuLinks } from "./components/mobile-menu-secondary.js";
import { initMobileMenu, updateMainMenuLinks } from "./components/mobile-menu.js";
import { initParticleEngine } from "./components/particle-engine.js";
import { initScrollAnimations } from "./components/scroll-animations.js";
import { initNavigation } from "./navigation.js";
import { initRouter } from "./router.js";
import { initScroll } from "./scroll.js";
import updateDateYear from "./utils/date_updater.js";
import { initViewTransitions } from "./view-transitions.js";

// Mobile menu state
let mobileMenuInitialized = false;
let currentMenuType = null; // 'main' or 'secondary'

// Check if current page is index
function isIndexPage(href = null) {
  const path = href ? new URL(href, window.location.origin).pathname : window.location.pathname;
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
 * Show hero middle container effect after 3 seconds
 */
function initHeroMiddleEffect() {
  const heroMiddle = document.getElementById("hero-middle");

  if (!heroMiddle) {
    return;
  }

  // Show the effect after 3 seconds
  setTimeout(() => {
    heroMiddle.classList.add("visible");
    // Initialize particle engine after container is visible
    initParticleEngine();
  }, 3000);
}

/**
 * Initialize all application modules
 */
function initApp() {
  console.log("Initializing Aniwa...");

  // Initialize all modules
  initRouter();
  initViewTransitions();
  initNavigation();
  initScroll();
  initHeader();

  // Initialize appropriate mobile menu based on page
  if (isIndexPage()) {
    initMobileMenu(false);
    currentMenuType = 'main';
  } else {
    initSecondaryMobileMenu(false);
    currentMenuType = 'secondary';
  }
  mobileMenuInitialized = true;

  initScrollAnimations();
  initContactForm();
  // Initialize utils
  updateDateYear();
  // Freeze video on last frame
  initHeroVideoFreeze();
  // Initialize hero middle effect
  initHeroMiddleEffect();
  // Initialize ambient glow
  initAmbientGlow();

  console.log("Aniwa initialized successfully");
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Support for View Transitions - Re-run UI init on navigation
document.addEventListener("viewTransitionComplete", (event) => {
  // Get the destination URL from the event if available (View Transitions), otherwise use current URL
  const destinationHref = event?.detail?.href || null;

  // Determine new menu type
  const newMenuType = isIndexPage(destinationHref) ? 'main' : 'secondary';

  // Remove panel and overlay (they should be closed during navigation)
  const existingPanel = document.querySelector(".mobile-menu__panel");
  if (existingPanel) existingPanel.remove();
  const existingOverlay = document.querySelector(".mobile-menu__overlay");
  if (existingOverlay) existingOverlay.remove();

  // Only recreate menu if type changed, otherwise update links
  if (mobileMenuInitialized && currentMenuType === newMenuType) {
    // Same menu type - just update links without recreating
    if (newMenuType === 'main') {
      updateMainMenuLinks();
    } else {
      updateSecondaryMenuLinks();
    }
  } else {
    // Different menu type - recreate menu without delay
    const existingMenu = document.querySelector(".mobile-menu");
    if (existingMenu) existingMenu.remove();

    if (newMenuType === 'main') {
      initMobileMenu(true, destinationHref);
    } else {
      initSecondaryMobileMenu(true, destinationHref);
    }
    currentMenuType = newMenuType;
  }

  mobileMenuInitialized = true;

  // Re-init header
  initHeader();

  // Re-init page-specific components
  initScrollAnimations();
  initContactForm();
  initHeroVideoFreeze();
});

// Export for debugging
export { initApp };
