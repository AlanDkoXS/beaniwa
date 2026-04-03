/**
 * Main Entry Point - Aniwa Digital Marketing
 * Initializes all modules and functionality
 */

// Import modules
import { initAmbientGlow } from "./components/ambient-glow.js";
import { initContactForm } from "./components/contact-form.js";
import { initCtaModal } from "./components/cta-modal.js";
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
import { initServiceScanner } from "./components/service-scanner.js";

// Mobile menu state
let mobileMenuInitialized = false;
let currentMenuType = null; // 'main' or 'secondary'

// Hero video state persistence
const HERO_VIDEO_KEY = 'bw_hero_video_seen_at';
const HERO_VIDEO_TTL = 60 * 60 * 1000; // 1 hour in ms

/**
 * Check if the hero video was seen within the last hour
 */
function heroVideoWasSeenRecently() {
  const seenAt = localStorage.getItem(HERO_VIDEO_KEY);
  if (!seenAt) return false;
  return (Date.now() - parseInt(seenAt, 10)) < HERO_VIDEO_TTL;
}

/**
 * Freeze hero video on last frame without playing
 */
function freezeHeroVideoNow(video) {
  video.pause();
  video.controls = false;

  const seekToEnd = () => {
    if (video.duration && isFinite(video.duration)) {
      video.currentTime = video.duration;
    }
  };

  if (video.readyState >= 1) {
    seekToEnd();
  } else {
    video.addEventListener('loadedmetadata', seekToEnd, { once: true });
  }
}

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
 * Freeze video on last frame when it ends.
 * If isBack is true and the video was seen recently, freeze immediately.
 */
function initHeroVideoFreeze(isBack = false) {
  const heroVideo = document.querySelector(".hero-video");

  if (!heroVideo) {
    return;
  }

  // Back navigation + seen within the last hour → congelar sin reproducir
  if (isBack && heroVideoWasSeenRecently()) {
    freezeHeroVideoNow(heroVideo);
    return;
  }

  heroVideo.addEventListener("ended", function () {
    this.pause();
    this.controls = false;
    localStorage.setItem(HERO_VIDEO_KEY, Date.now().toString());
  }, { once: true });
}

/**
 * Show hero middle container effect after 3 seconds (or immediately on back navigation)
 */
function initHeroMiddleEffect(isBack = false) {
  const heroMiddle = document.getElementById("hero-middle");

  if (!heroMiddle) {
    return;
  }

  const delay = isBack ? 0 : 3000;

  // Show the effect after delay
  setTimeout(() => {
    heroMiddle.classList.add("visible");
    // Initialize particle engine after container is visible
    initParticleEngine();
  }, delay);
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
  initCtaModal();
  // Initialize utils
  updateDateYear();
  // Detect back/forward navigation for video freeze
  const navEntry = performance.getEntriesByType('navigation')[0];
  const isInitialBack = navEntry ? navEntry.type === 'back_forward' : false;
  // Freeze video on last frame
  initHeroVideoFreeze(isInitialBack);
  // Initialize hero middle effect
  initHeroMiddleEffect(isInitialBack);
  // Initialize ambient glow
  initAmbientGlow(isInitialBack);
  // Initialize service scanner (index pages only)
  if (isIndexPage()) {
    initServiceScanner();
  }

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
  const isBack = event?.detail?.isBack || false;

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
  initCtaModal();
  initHeroVideoFreeze(isBack);
  // Re-init hero effects on index pages (with immediate display on back navigation)
  if (isIndexPage(destinationHref)) {
    initHeroMiddleEffect(isBack);
    initAmbientGlow(isBack);
    initServiceScanner();
  }
});

// Export for debugging
export { initApp };
