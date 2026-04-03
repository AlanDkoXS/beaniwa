/**
 * View Transitions - Astro-style page transitions
 * Provides smooth transitions between pages in a multi-page site
 */

/**
 * Check if View Transitions API is supported
 */
function supportsViewTransitions() {
  return document.startViewTransition !== undefined;
}

/**
 * Handle click on internal links and apply view transition
 */
function handleClick(e) {
  const link = e.target.closest("a");
  if (!link) return;

  const href = link.href;

  // Check if it's an internal link (same origin, not anchor-only)
  if (!isInternalLink(href)) return;

  // Skip if it's just an anchor on the same page
  if (isAnchorLink(href)) return;

  // Skip if modifier keys are pressed (open in new tab)
  if (e.metaKey || e.ctrlKey || e.shiftKey) return;

  e.preventDefault();
  navigateWithTransition(href);
}

/**
 * Check if link is internal (same domain)
 */
function isInternalLink(href) {
  const currentOrigin = window.location.origin;
  return href.startsWith(currentOrigin) || href.startsWith("/");
}

/**
 * Check if link is just an anchor on current page
 */
function isAnchorLink(href) {
  // Check if it's an anchor link (starts with #)
  if (href.startsWith("#")) return true;

  // Check if it's a link to current page with hash
  const url = new URL(href, window.location.origin);
  return url.pathname === window.location.pathname && url.hash;
}

/**
 * Check if href is an index page (where scanner exists)
 */
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
 * Navigate to URL with view transition
 */
let activeTransition = null;

// Track the pathname of the last SPA navigation so popstate can detect hash-only changes
let lastNavigatedPathname = window.location.pathname;

async function navigateWithTransition(href) {
  if (!supportsViewTransitions()) {
    // Fallback: regular navigation
    window.location.href = href;
    return;
  }

  // Force hard navigation for index pages to avoid CSS cascade corruption
  if (isIndexPage(href)) {
    window.location.href = href;
    return;
  }

  // Abort if a transition is already in progress
  if (activeTransition) return;

  // Use View Transitions API
  activeTransition = document.startViewTransition(async () => {
    await loadPage(href);
    updateURL(href);
  });

  // Record the pathname so popstate can distinguish hash-only changes
  const targetPathname = new URL(href, window.location.origin).pathname;
  lastNavigatedPathname = targetPathname;

  // Handle navigation for back/forward buttons
  activeTransition.finished.then(() => {
    // Reset scroll position
    window.scrollTo(0, 0);
  }).catch(() => {
    // Transition was aborted — ignore
  }).finally(() => {
    activeTransition = null;
  });
}

/**
 * Sync <head> from new page: CSS links, inline styles, meta tags and lang attribute.
 * Scripts are intentionally left untouched to avoid re-execution.
 */
function syncHead(newDoc) {
  // Update <html lang> attribute so language detection keeps working
  const newLang = newDoc.documentElement.getAttribute("lang");
  if (newLang) document.documentElement.setAttribute("lang", newLang);

  // Update title
  document.title = newDoc.title;

  // --- CSS <link> elements ---
  // Rebuild stylesheet order to match the destination page exactly.
  // This preserves cascade order across SPA navigations so that stylesheets
  // added/removed per-page don't land at the wrong position in the cascade.
  const currentLinks = Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]'),
  );
  const newLinks = Array.from(
    newDoc.head.querySelectorAll('link[rel="stylesheet"]'),
  );

  const newHrefs = new Set(newLinks.map(l => l.getAttribute("href")));

  // Remove CSS no longer needed
  currentLinks.forEach(link => {
    if (!newHrefs.has(link.getAttribute("href"))) link.remove();
  });

  // Build a map of currently loaded links by href so we can reuse them
  const existingByHref = new Map(
    Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
      .map(l => [l.getAttribute("href"), l]),
  );

  // Find the first head element that is NOT a stylesheet link.
  // We will insert all stylesheets before this anchor so they stay grouped.
  // insertBefore(node, null) is equivalent to appendChild.
  const firstNonStylesheet = Array.from(document.head.children).find(
    el => !(el.tagName === "LINK" && el.getAttribute("rel") === "stylesheet"),
  ) || null;

  // Re-insert every new stylesheet in order, reusing existing elements or
  // cloning new ones.  insertBefore(node, null) is equivalent to appendChild.
  newLinks.forEach(link => {
    const href = link.getAttribute("href");
    const existing = existingByHref.get(href);
    if (existing) {
      // Move the existing element to the correct position
      document.head.insertBefore(existing, firstNonStylesheet);
    } else {
      // Clone and insert the new stylesheet
      document.head.insertBefore(link.cloneNode(true), firstNonStylesheet);
    }
  });

  // --- Inline <style> blocks ---
  document.head.querySelectorAll("style").forEach(s => s.remove());
  newDoc.head.querySelectorAll("style").forEach(s => {
    document.head.appendChild(s.cloneNode(true));
  });

  // --- <meta> tags (skip charset) ---
  document.head.querySelectorAll("meta:not([charset])").forEach(m => m.remove());
  const charset = document.head.querySelector("meta[charset]");
  Array.from(newDoc.head.querySelectorAll("meta:not([charset])")).forEach(m => {
    const clone = m.cloneNode(true);
    charset
      ? charset.insertAdjacentElement("afterend", clone)
      : document.head.appendChild(clone);
  });

  // --- Non-stylesheet <link> tags (canonical, hreflang, preload, etc.) ---
  document.head
    .querySelectorAll(
      'link:not([rel="stylesheet"]):not([rel="icon"]):not([rel="shortcut icon"])',
    )
    .forEach(l => l.remove());
  newDoc.head
    .querySelectorAll(
      'link:not([rel="stylesheet"]):not([rel="icon"]):not([rel="shortcut icon"])',
    )
    .forEach(l => {
      document.head.appendChild(l.cloneNode(true));
    });
}

/**
 * Replace all visible body content with the new page's body.
 * Existing <script> elements are kept in place to avoid re-execution.
 */
function replaceBodyContent(newBody) {
  // Reset overflow in case a menu panel was open during navigation
  document.body.style.overflow = "";

  // Remove all non-script children from current body
  Array.from(document.body.children).forEach(child => {
    if (child.tagName !== "SCRIPT") child.remove();
  });

  // Append new body children (skip scripts — already loaded as modules)
  Array.from(newBody.children).forEach(child => {
    if (child.tagName !== "SCRIPT") {
      document.body.appendChild(child.cloneNode(true));
    }
  });

  // Propagate body class (e.g. page-specific classes)
  document.body.className = newBody.className;

  // Mark sections for view-transition targeting
  document.body.querySelectorAll("section, main").forEach(section => {
    section.classList.add("vt-section");
  });
}

/**
 * Load new page content
 */
async function loadPage(href, isBack = false) {
  try {
    const response = await fetch(href);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Sync <head> first: CSS, meta, styles, lang
    syncHead(doc);

    // Replace body content (scripts are preserved automatically)
    replaceBodyContent(doc.body);

    // Re-initialize scripts for new content
    document.dispatchEvent(new CustomEvent("viewTransitionComplete", {
      detail: { href, isBack },
    }));
  } catch (error) {
    console.error("Navigation failed:", error);
    // Fallback to regular navigation
    window.location.href = href;
  }
}

/**
 * Update browser URL without page reload
 */
function updateURL(href) {
  const url = new URL(href, window.location.origin);
  window.history.pushState({ path: href }, "", url);
}

/**
 * Handle browser back/forward buttons
 */
function handlePopState() {
  const href = window.location.href;
  const currentPathname = window.location.pathname;

  if (supportsViewTransitions()) {
    // Force hard navigation for index pages to avoid CSS cascade corruption
    if (isIndexPage(href)) {
      window.location.href = href;
      return;
    }

    // Abort if a transition is already in progress
    if (activeTransition) return;

    // If only the hash changed (same pathname as last SPA navigation),
    // this is a hash-only popstate — no full page transition needed.
    if (currentPathname === lastNavigatedPathname && window.location.hash) {
      return;
    }

    try {
      activeTransition = document.startViewTransition(async () => {
        await loadPage(href, true); // isBack = true
      });

      activeTransition.finished.then(() => {
        if (window.location.hash) {
          const target = document.querySelector(window.location.hash);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          // Reset scroll position for non-hash navigation
          window.scrollTo(0, 0);
        }
      }).catch(() => {
        // Transition was aborted — ignore
      }).finally(() => {
        activeTransition = null;
      });
    } catch (err) {
      // InvalidStateError: startViewTransition called in an invalid state
      // (e.g. during hash navigation popstate). Fall back to a plain reload.
      activeTransition = null;
      window.location.reload();
    }
  } else {
    window.location.reload();
  }
}

/**
 * Initialize View Transitions
 */
function initViewTransitions() {
  // Check if browser supports View Transitions
  if (!supportsViewTransitions()) {
    console.log("View Transitions not supported, using regular navigation");
    return;
  }

  // When the browser restores a page from the Back-Forward Cache (BFCache),
  // the DOM may have a corrupted stylesheet order from a previous SPA navigation.
  // Force a clean reload to avoid stale CSS cascade state.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  // Add click handler to document
  document.addEventListener("click", handleClick);

  // Handle browser navigation
  window.addEventListener("popstate", handlePopState);

  console.log("View Transitions initialized");
}

// Export functions
export { initViewTransitions, supportsViewTransitions, navigateWithTransition };
