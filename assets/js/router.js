/**
 * Router - Multi-language Routing System
 * Handles page mapping and hash synchronization between languages
 */

/**
 * Page mapping between English and Spanish
 */
const PAGE_MAPPING = {
  en: {
    "index.html": "index.html",
    "about.html": "nosotros.html",
    "contact.html": "contacto.html",
    "portfolio.html": "portafolio.html",
    "services.html": "servicios.html",
    "privacy-policy.html": "politica-privacidad.html",
  },
  es: {
    "index.html": "index.html",
    "nosotros.html": "about.html",
    "contacto.html": "contact.html",
    "portafolio.html": "portfolio.html",
    "servicios.html": "services.html",
    "politica-privacidad.html": "privacy-policy.html",
  },
};

/**
 * Get the current language (en or es) from the path
 */
function getCurrentLanguage() {
  const path = window.location.pathname;
  if (path.includes("/es/")) return "es";
  if (path.includes("/en/")) return "en";
  return "en"; // Default
}

/**
 * Get the current page name from the path
 */
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.endsWith("/") || path === "") {
    return "index.html";
  }
  const parts = path.split("/");
  return parts[parts.length - 1];
}

/**
 * Get the equivalent URL in the target language
 */
function getEquivalentUrl(targetLang) {
  const currentLang = getCurrentLanguage();
  if (currentLang === targetLang) return window.location.href;

  const currentPage = getCurrentPage();
  console.log("ROUTER: currentLang:", currentLang, "targetLang:", targetLang, "currentPage:", currentPage);

  const mapping = PAGE_MAPPING[currentLang];
  let targetPage = "index.html";

  if (mapping && mapping[currentPage]) {
    targetPage = mapping[currentPage];
  } else {
    // Intenta buscar sin .html por si acaso
    const pageWithoutExt = currentPage.replace(".html", "");
    if (mapping && mapping[pageWithoutExt + ".html"]) {
      targetPage = mapping[pageWithoutExt + ".html"];
    }
  }

  const hash = window.location.hash;
  const result = `/${targetLang}/${targetPage}${hash}`;
  console.log("ROUTER: generated URL:", result);
  return result;
}

/**
 * Updates language switcher links to be dynamic
 */
function updateLanguageLinks() {
  const langLinks = document.querySelectorAll('a[hreflang]');
  
  langLinks.forEach(link => {
    const targetLang = link.getAttribute('hreflang');
    if (targetLang === 'en' || targetLang === 'es') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetUrl = getEquivalentUrl(targetLang);
        window.location.href = targetUrl;
      });
    }
  });
}

/**
 * Initialize router
 */
function initRouter() {
  updateLanguageLinks();
  
  // Also handle hash changes if needed for SPA-like feel
  window.addEventListener("hashchange", () => {
    console.log("Hash changed to:", window.location.hash);
  });
}

// Export functions
export { initRouter, getEquivalentUrl, getCurrentLanguage };
