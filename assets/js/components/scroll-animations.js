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
 * Handle scroll animations for general elements
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
 * Handle value-cards electric border activation on mobile
 */
function handleValueCardsMobile() {
  // Only apply on mobile devices (e.g. max-width: 768px)
  if (window.innerWidth > 768) {
    // Remove selected class if we resize to desktop
    document.querySelectorAll(".value-card").forEach(card => {
      card.classList.remove("selected");
    });
    return;
  }

  const cards = document.querySelectorAll(".value-card");
  // 30% from the top of the viewport
  const triggerPoint = window.innerHeight * 0.30; 
  
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    
    // Check if the card is intersecting the 30% threshold
    // meaning its top is above or at the 30% mark, and its bottom hasn't passed it
    if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  window.addEventListener("scroll", () => {
    handleScrollAnimations();
    handleValueCardsMobile();
  }, { passive: true });

  // Handle resize to clean up or recalculate
  window.addEventListener("resize", () => {
    handleValueCardsMobile();
  }, { passive: true });

  // Check initial state
  handleScrollAnimations();
  handleValueCardsMobile();

  console.log("Scroll animations initialized");
}

// Export functions
export { initScrollAnimations, isInViewport };
