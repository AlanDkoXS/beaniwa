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
  const url = new URL(href, window.location.origin);
  return url.pathname === window.location.pathname && url.hash;
}

/**
 * Navigate to URL with view transition
 */
async function navigateWithTransition(href) {
  if (!supportsViewTransitions()) {
    // Fallback: regular navigation
    window.location.href = href;
    return;
  }

  // Use View Transitions API
  const transition = document.startViewTransition(async () => {
    await loadPage(href);
    updateURL(href);
  });

  // Handle navigation for back/forward buttons
  transition.finished.then(() => {
    // Reset scroll position
    window.scrollTo(0, 0);
  });
}

/**
 * Load new page content
 */
async function loadPage(href) {
  try {
    const response = await fetch(href);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Update body content (everything except header and footer)
    const currentBody = document.body;
    const newBody = doc.body;

    // Get header and footer from current page to preserve them
    const currentHeader = currentBody.querySelector("header");
    const currentFooter = currentBody.querySelector("footer");

    // Get new content sections
    const newSections = Array.from(newBody.querySelectorAll("section, main"));
    const currentSections = Array.from(
      currentBody.querySelectorAll("section, main"),
    );

    // Replace content sections
    currentSections.forEach((section, index) => {
      if (newSections[index]) {
        section.innerHTML = newSections[index].innerHTML;
        // Copy classes but keep view-transition-name
        const newClasses = newSections[index].className
          .split(" ")
          .filter(c => !c.includes("view-transition"));
        section.className = newClasses.join(" ") + " vt-section";
      }
    });

    // Update title
    document.title = doc.title;

    // Re-initialize scripts for new content
    document.dispatchEvent(new CustomEvent("viewTransitionComplete"));
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

  if (supportsViewTransitions()) {
    document.startViewTransition(async () => {
      await loadPage(href);
    });
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

  // Add click handler to document
  document.addEventListener("click", handleClick);

  // Handle browser navigation
  window.addEventListener("popstate", handlePopState);

  console.log("View Transitions initialized");
}

// Export functions
export { initViewTransitions, supportsViewTransitions };
