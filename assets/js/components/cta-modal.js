/**
 * CTA Card Modal Handler
 * Handles the "Your site here" CTA button modal
 */

export function initCtaModal() {
  const ctaCard = document.getElementById('cta-card');
  const ctaModal = document.getElementById('cta-modal');
  const closeCtaModal = document.getElementById('close-cta-modal');

  if (!ctaCard || !ctaModal) {
    return;
  }

  ctaCard.addEventListener('click', () => {
    ctaModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    ctaModal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (closeCtaModal) {
    closeCtaModal.addEventListener('click', closeModal);
  }

  window.addEventListener('click', (e) => {
    if (e.target === ctaModal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ctaModal.classList.contains('is-active')) {
      closeModal();
    }
  });
}
