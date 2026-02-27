/**
 * Navigation - Handle navigation links and smooth scrolling
 */

/**
 * Handle internal navigation (hash links)
 */
function handleInternalLinks() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener("click", e => {
      const targetId = link.getAttribute("href");

      // Skip if it's just "#"
      if (targetId === "#") {
        e.preventDefault();
        return;
      }

      // Check if target exists on current page
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });

        // Update URL without page reload
        history.pushState(null, "", targetId);
      }
    });
  });
}

/**
 * Initialize navigation
 */
function initNavigation() {
  handleInternalLinks();
  console.log("Navigation initialized");
}

// Export functions
export { initNavigation };
