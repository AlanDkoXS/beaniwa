/**
 * Contact Form Handler
 * Handles form submission and success modal
 */

export function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  const successModal = document.getElementById('success-modal');
  const closeButtons = document.querySelectorAll('.close-modal, .close-modal-btn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        showModal();
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Determine language for error message
      const isSpanish = document.documentElement.lang === 'es';
      const errorMessage = isSpanish 
        ? 'Hubo un error al enviar tu mensaje. Por favor intenta de nuevo o contáctanos directamente a hola@beaniwa.com'
        : 'There was an error sending your message. Please try again or contact us directly at hola@beaniwa.com';
      
      alert(errorMessage);
    }
  });

  function showModal() {
    if (successModal) {
      successModal.classList.add('is-active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  }

  function closeModal() {
    if (successModal) {
      successModal.classList.remove('is-active');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  // Close modal on outside click
  window.addEventListener('click', (e) => {
    if (e.target === successModal) {
      closeModal();
    }
  });
}
