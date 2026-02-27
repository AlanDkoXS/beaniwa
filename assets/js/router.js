/**
 * Router - SPA Routing System
 * Handles navigation between pages and sections
 */

/**
 * Get current route from URL
 */
function getRoute() {
  const hash = window.location.hash;
  if (hash && hash.startsWith("#")) {
    return hash.slice(1);
  }
  return "/";
}

/**
 * Navigate to a specific route
 */
function navigateTo(route) {
  if (route.startsWith("#")) {
    window.location.hash = route.slice(1);
  } else if (route.startsWith("/")) {
    window.location.hash = route;
  } else {
    window.location.href = route;
  }
}

/**
 * Handle hash change
 */
function onHashChange() {
  const route = getRoute();
  console.log("Navigating to:", route);

  // Handle different routes
  if (route === "/" || route === "") {
    // Home page
    window.location.href = "/";
  } else if (route.startsWith("#")) {
    // Section navigation - smooth scroll
    const sectionId = route.slice(1);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }
}

/**
 * Initialize router
 */
function initRouter() {
  window.addEventListener("hashchange", onHashChange);

  // Handle initial route
  if (window.location.hash) {
    onHashChange();
  }
}

// Export functions
export { getRoute, initRouter, navigateTo };
