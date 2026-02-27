/**
 * Scroll - Handle scroll events and effects
 */

/**
 * Handle scroll position for header and other elements
 */
let lastScrollTop = 0;

function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const header = document.getElementById("header");

  if (header) {
    // Add/remove scroll class for styling
    if (scrollTop > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Hide/show header on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }
  }

  lastScrollTop = scrollTop;
}

/**
 * Initialize scroll handling
 */
function initScroll() {
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Handle initial scroll position
  handleScroll();

  console.log("Scroll handling initialized");
}

// Export functions
export { initScroll };
