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
  
  // Find the card that is closest to the vertical center of the screen
  const centerY = window.innerHeight / 2;
  let closestCard = null;
  let closestDistance = Infinity;
  
  cards.forEach(card => {
    // Reset all cards first
    card.classList.remove("selected");
    
    const rect = card.getBoundingClientRect();
    const cardCenterY = rect.top + (rect.height / 2);
    const distanceToCenter = Math.abs(centerY - cardCenterY);
    
    if (distanceToCenter < closestDistance) {
      closestDistance = distanceToCenter;
      closestCard = card;
    }
  });
  
  // Only activate the single closest card if it's somewhat in view
  if (closestCard) {
    const rect = closestCard.getBoundingClientRect();
    // 15% to 85% - broad zone to ensure at least one is active while scrolling through the section
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15) {
      closestCard.classList.add("selected");
    }
  }
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
