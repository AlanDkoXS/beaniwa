/**
 * Scroll Animations Component - Animations triggered on scroll
 */

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0
  );
}

/**
 * Handle scroll animations
 */
function handleScrollAnimations() {
  const animatedElements = document.querySelectorAll("[data-animate]");

  animatedElements.forEach(element => {
    if (isInViewport(element)) {
      element.classList.add("animated");
    }
  });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  window.addEventListener("scroll", handleScrollAnimations, { passive: true });

  // Check initial state
  handleScrollAnimations();

  console.log("Scroll animations initialized");
}

// Export functions
export { initScrollAnimations, isInViewport };
