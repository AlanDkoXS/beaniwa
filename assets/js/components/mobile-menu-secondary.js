/**
 * Secondary Mobile Menu Component - For non-index pages
 * Shows only Regresar and hamburger button
 */

import { getCurrentLanguage, getEquivalentUrl } from "../router.js";
import {
  navigateWithTransition,
  supportsViewTransitions,
} from "../view-transitions.js";

// Navigation labels by language
const labelsSecondary = {
  es: {
    regresar: "Regresar",
  },
  en: {
    regresar: "Return",
  },
};

// Single item for non-index pages
const regresarItem = {
  id: "regresar",
  href: "/",
  icon: `<polygon stroke-linecap="round" stroke-linejoin="round" points="12.1 23 15.5 11.1 8.6 9 9.3 23.1 7.4 23.2 0.1 0.2 0.1 0.1 23.9 3.6 14.2 23.3 12.1 23"/>`,
};

// Social networks configuration
const socialNetworks = [
  { id: "facebook", href: "https://facebook.com/beaniwa" },
  { id: "instagram", href: "https://instagram.com/beaniwa" },
  { id: "tiktok", href: "https://tiktok.com/@beaniwa" },
  { id: "whatsapp", href: "https://wa.me/526141234567" },
];

// Hamburger menu item
const hamburgerItemSecondary = {
  id: "hamburger",
  icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>`,
  iconActive: `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>`,
};

/**
 * Create the SVG icon element
 */
function createIconSecondary(iconPath) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.innerHTML = iconPath;
  return svg;
}

/**
 * Create a menu item button
 */
function createMenuItemSecondary(item, index, isActive) {
  const currentLang = getCurrentLanguage();
  const currentLabels = labelsSecondary[currentLang];

  const itemLabel = currentLabels[item.id] || item.id;

  const button = document.createElement("button");
  button.className = `mobile-menu__item${isActive ? " active" : ""}`;
  button.setAttribute("data-index", index);
  button.setAttribute("data-id", item.id);
  button.setAttribute("aria-label", itemLabel);

  button.style.setProperty("--bgColorItem", "#ec4700");

  // Add icon
  if (item.id === "hamburger" && item.iconActive) {
    button.appendChild(
      createIconSecondary(isActive ? item.iconActive : item.icon),
    );
  } else {
    button.appendChild(createIconSecondary(item.icon));
  }

  if (item.id === "hamburger") {
    button.setAttribute("data-hamburger", "true");
    button.addEventListener("click", e => {
      e.preventDefault();
      // Trigger wave effect on click
      triggerWaveEffectSecondary(button);
      toggleHamburgerMenuSecondary(button);
    });
  } else {
    button.addEventListener("click", e =>
      handleItemClickSecondary(item.href, button),
    );
  }

  return button;
}

/**
 * Handle menu item click
 */
function handleItemClickSecondary(href, clickedItem) {
  // Trigger wave effect on click
  if (clickedItem) {
    triggerWaveEffectSecondary(clickedItem);
  }

  // Delay navigation to allow wave effect to be visible
  setTimeout(() => {
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      const targetId = hash || path;
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      } else {
        if (supportsViewTransitions()) {
          navigateWithTransition(href);
        } else {
          window.location.href = href;
        }
      }
    } else {
      if (supportsViewTransitions()) {
        navigateWithTransition(href);
      } else {
        window.location.href = href;
      }
    }
  }, 300);
}

/**
 * Animate hamburger icon transition to X and vice versa
 */
function animateHamburgerIconSecondary(hamburgerButton, toActive) {
  const iconElement = hamburgerButton.querySelector(".icon");
  if (!iconElement) return;

  const newIcon = toActive
    ? hamburgerItemSecondary.iconActive
    : hamburgerItemSecondary.icon;
  iconElement.innerHTML = newIcon;
  iconElement.style.transition = "transform 0.4s ease";
  iconElement.style.transform = toActive ? "rotate(180deg)" : "rotate(0deg)";
}

/**
 * Toggle hamburger menu panel (modal)
 */
function toggleHamburgerMenuSecondary(hamburgerButton) {
  let panel = document.querySelector(".mobile-menu__panel");
  let overlay = document.querySelector(".mobile-menu__overlay");
  const menuBorder = document.querySelector(".mobile-menu__border");
  const currentLang = getCurrentLanguage();

  // Toggle panel visibility
  if (panel && panel.classList.contains("open")) {
    panel.classList.remove("open");
    hamburgerButton.classList.remove("active");
    // Remove hamburger-active attribute
    document
      .querySelector(".mobile-menu")
      ?.removeAttribute("data-hamburger-active");
    // Animate hamburger icon back to lines
    animateHamburgerIconSecondary(hamburgerButton, false);
    // Restore body scroll
    document.body.style.overflow = "";

    // Close overlay
    if (overlay) {
      overlay.classList.remove("open");
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 400);
    }
    setTimeout(() => {
      if (panel.parentNode) {
        panel.parentNode.removeChild(panel);
      }
    }, 400);
    return;
  }

  // Deactivate all other menu items
  const menuItems = document.querySelectorAll(".mobile-menu__item");
  menuItems.forEach(item => {
    if (item !== hamburgerButton) {
      item.classList.remove("active");
    }
  });

  document
    .querySelector(".mobile-menu")
    ?.setAttribute("data-hamburger-active", "true");

  // Lock body scroll
  document.body.style.overflow = "hidden";

  if (menuBorder) {
    requestAnimationFrame(() => {
      offsetMenuBorderSecondary(hamburgerButton, menuBorder);
    });
  }

  animateHamburgerIconSecondary(hamburgerButton, true);

  // Create overlay
  overlay = document.createElement("div");
  overlay.className = "mobile-menu__overlay";
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener("click", () => {
    closeHamburgerPanelSecondary(panel, overlay, hamburgerButton);
  });
  panel = document.createElement("div");
  panel.className = "mobile-menu__panel";

  const hrefLang = currentLang === "en" ? "/en" : "/es";
  const otherLang = currentLang === "en" ? "es" : "en";
  const langButtonHref = getEquivalentUrl(otherLang);
  const langButtonText = currentLang === "en" ? "Español" : "English";

  // Modal navigation items configuration

  const navItemsModal = [
    {
      id: "inicio",
      href: hrefLang + "/",
      icon: `<polygon stroke-linecap="round" stroke-linejoin="round" points="12.1 23 15.5 11.1 8.6 9 9.3 23.1 7.4 23.2 0.1 0.2 0.1 0.1 23.9 3.6 14.2 23.3 12.1 23"/>`,
      label: currentLang === "en" ? "Home" : "Inicio",
    },
    {
      id: "nosotros",
      href:
        hrefLang + (currentLang === "en" ? "/about.html" : "/nosotros.html"),
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>`,
      label: currentLang === "en" ? "About" : "Nosotros",
    },
    {
      id: "servicios",
      href:
        hrefLang +
        (currentLang === "en" ? "/services.html" : "/servicios.html"),
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"/>`,
      label: currentLang === "en" ? "Services" : "Servicios",
    },
    {
      id: "portafolio",
      href:
        hrefLang +
        (currentLang === "en" ? "/portfolio.html" : "/portafolio.html"),
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"/>`,
      label: currentLang === "en" ? "Portfolio" : "Portafolio",
    },
    {
      id: "contacto",
      href:
        hrefLang + (currentLang === "en" ? "/contact.html" : "/contacto.html"),
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>`,
      label: currentLang === "en" ? "Contact" : "Contacto",
    },
  ];

  const iconBasePath = "/assets/icons";

  const socialHtml = socialNetworks

    .map(
      social => `
      <a href="${social.href}" class="mobile-menu__social-item" target="_blank" rel="noopener noreferrer" aria-label="${social.id}">
        <img src="${iconBasePath}/social/${social.id}.svg" alt="${social.id}" class="social-icon" />
      </a>
    `,
    )
    .join("");

  panel.innerHTML = `
    <div class="mobile-menu__panel-content">
      <div class="mobile-menu__section mobile-menu__nav-grid">
        ${navItemsModal
          .map(
            item => `
          <a href="${item.href}" class="mobile-menu__nav-card">
            <div class="mobile-menu__nav-card-icon">
              <svg class="icon" viewBox="0 0 24 24">
                ${item.icon}
              </svg>
            </div>
            <span class="mobile-menu__nav-card-label">${item.label}</span>
          </a>
        `,
          )
          .join("")}
      </div>

      <div class="mobile-menu__section mobile-menu__social-section">
        <h3 class="mobile-menu__section-title">${currentLang === "en" ? "Follow us" : "Síguenos"}</h3>
        <div class="mobile-menu__social-grid">
          ${socialHtml}
        </div>
      </div>

      <div class="mobile-menu__section mobile-menu__lang-section">
        <h3 class="mobile-menu__section-title">${currentLang === "en" ? "Change language" : "Cambiar idioma"}</h3>
        <a href="${langButtonHref}" class="mobile-menu__lang-card">
          <img src="${iconBasePath}/translate.svg" alt="translate" class="lang-icon" />
          <span>${langButtonText}</span>
        </a>
      </div>
    </div>
  `;

  const mobileMenu = document.querySelector(".mobile-menu");
  mobileMenu.parentNode.insertBefore(panel, mobileMenu);

  panel.querySelectorAll(".mobile-menu__nav-card").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      const href = item.getAttribute("href");

      // Close hamburger panel first (this removes the blur)
      closeHamburgerPanelSecondary(panel, overlay, hamburgerButton);

      // Navigate after modal closes - full page navigation
      setTimeout(() => {
        if (supportsViewTransitions()) {
          navigateWithTransition(href);
        } else {
          window.location.href = href;
        }
      }, 450);
    });
  });

  // Add click handlers to social network items
  panel.querySelectorAll(".mobile-menu__social-item").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      closeHamburgerPanelSecondary(panel, overlay, hamburgerButton);
    });
  });

  // Add click handler to language switcher
  const langCard = panel.querySelector(".mobile-menu__lang-card");
  if (langCard) {
    langCard.addEventListener("click", e => {
      e.preventDefault();
      const href = langCard.getAttribute("href");
      closeHamburgerPanelSecondary(panel, overlay, hamburgerButton);
      // Navigate after modal closes
      setTimeout(() => {
        if (supportsViewTransitions()) {
          navigateWithTransition(href);
        } else {
          window.location.href = href;
        }
      }, 450);
    });
  }

  requestAnimationFrame(() => {
    if (overlay) overlay.classList.add("open");
    if (panel) panel.classList.add("open");
    if (hamburgerButton) hamburgerButton.classList.add("active");
  });
}

/**
 * Close hamburger panel
 */
function closeHamburgerPanelSecondary(panel, overlay, hamburgerButton) {
  const menuBorder = document.querySelector(".mobile-menu__border");

  panel.classList.remove("open");
  hamburgerButton.classList.remove("active");
  // Restore body scroll
  document.body.style.overflow = "";
  document
    .querySelector(".mobile-menu")
    ?.removeAttribute("data-hamburger-active");
  animateHamburgerIconSecondary(hamburgerButton, false);

  // Close overlay immediately to remove blur
  if (overlay) {
    overlay.classList.remove("open");
    // Remove overlay from DOM after animation completes
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 400);
  }

  setTimeout(() => {
    if (panel && panel.parentNode) {
      panel.parentNode.removeChild(panel);
    }
  }, 400);
}

/**
 * Calculate and set the border position
 */
function offsetMenuBorderSecondary(element, menuBorder) {
  if (!element || !menuBorder) return;

  const menu = document.querySelector(".mobile-menu");
  const offsetActiveItem = element.getBoundingClientRect();

  const left =
    Math.floor(
      offsetActiveItem.left -
        menu.getBoundingClientRect().left -
        (menuBorder.offsetWidth - offsetActiveItem.width) / 2,
    ) + "px";

  menuBorder.style.transform = `translate3d(${left}, 0, 0)`;
}

/**
 * Initialize the secondary mobile menu (for non-index pages)
 */
function initSecondaryMobileMenu() {
  // Check if mobile menu already exists
  if (document.querySelector(".mobile-menu")) {
    return;
  }

  const currentLang = getCurrentLanguage();
  const ariaLabel = currentLang === "en" ? "Navigation" : "Navegación";

  // Create mobile menu container
  const mobileMenu = document.createElement("nav");
  mobileMenu.className = "mobile-menu";
  mobileMenu.setAttribute("role", "navigation");
  mobileMenu.setAttribute("aria-label", ariaLabel);

  mobileMenu.style.opacity = "0";
  mobileMenu.style.transform = "translateY(100%)";
  mobileMenu.style.transition =
    "opacity 0.6s ease-out, transform 0.6s ease-out";

  // Create Regresar item
  const langPrefix = currentLang === "en" ? "/en/" : "/es/";
  regresarItem.href = langPrefix;
  const regresarBtn = createMenuItemSecondary(regresarItem, 0, true);
  mobileMenu.appendChild(regresarBtn);

  // Create hamburger button
  const hamburgerButton = createMenuItemSecondary(
    hamburgerItemSecondary,
    1,
    false,
  );
  hamburgerButton.setAttribute("data-hamburger", "true");
  mobileMenu.appendChild(hamburgerButton);

  // Create border element
  const menuBorder = document.createElement("div");
  menuBorder.className = "mobile-menu__border";
  mobileMenu.appendChild(menuBorder);

  // Create SVG container
  const svgContainer = document.createElement("div");
  svgContainer.className = "svg-container";
  svgContainer.innerHTML = `
    <svg viewBox="0 0 202.9 45.5">
      <clipPath id="mobile-menu-clip" clipPathUnits="objectBoundingBox" transform="scale(0.0049285362247413 0.021978021978022)">
        <path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5c9.2,3.6,17.6,4.2,23.3,4H6.7z"/>
      </clipPath>
    </svg>
  `;
  mobileMenu.appendChild(svgContainer);

  // Add to body
  document.body.appendChild(mobileMenu);

  // Show menu immediately
  showSecondaryMobileMenu(mobileMenu, menuBorder);

  // Setup scroll observer to select hamburger when reaching footer
  setupFooterScrollObserverSecondary(
    mobileMenu,
    hamburgerButton,
    menuBorder,
    1, // Regresar is index 0, hamburger is index 1
  );

  // Update active item on scroll
  window.addEventListener("scroll", () => {
    const activeItem = mobileMenu.querySelector(".mobile-menu__item.active");
    if (activeItem) {
      offsetMenuBorderSecondary(activeItem, menuBorder);
    }
  });

  // Handle resize
  window.addEventListener("resize", () => {
    const activeItem = mobileMenu.querySelector(".mobile-menu__item.active");
    if (activeItem) {
      offsetMenuBorderSecondary(activeItem, menuBorder);
    }
  });
}

/**
 * Show secondary mobile menu with animation
 */
function showSecondaryMobileMenu(mobileMenu, menuBorder) {
  mobileMenu.style.opacity = "1";
  mobileMenu.style.transform = "translateY(0)";

  setTimeout(() => {
    const activeItem = mobileMenu.querySelector(".mobile-menu__item.active");
    if (activeItem) {
      offsetMenuBorderSecondary(activeItem, menuBorder);
    }
  }, 100);
}

/**
 * Trigger wave ripple effect on a specific element within the secondary menu
 */
function triggerWaveEffectSecondary(targetElement) {
  if (!targetElement) return;

  // Create wave effect element
  const waveOverlay = document.createElement("div");
  waveOverlay.className = "mobile-menu__wave mobile-menu__wave--circular";
  targetElement.appendChild(waveOverlay);

  // Remove wave overlay after animation completes
  setTimeout(() => {
    if (waveOverlay.parentNode) {
      waveOverlay.parentNode.removeChild(waveOverlay);
    }
  }, 800);
}

/**
 * Setup scroll observer to select hamburger when reaching footer (secondary menu)
 */
function setupFooterScrollObserverSecondary(
  mobileMenu,
  hamburgerButton,
  menuBorder,
  hamburgerIndex,
) {
  const footer = document.querySelector("footer");

  if (!footer) {
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Footer is visible - select hamburger without wave effect
          setActiveMenuItemSecondary(
            mobileMenu,
            hamburgerButton,
            hamburgerIndex,
            menuBorder,
          );
        } else {
          // Footer not visible - select first item (Regresar)
          const firstItem = mobileMenu.querySelector(
            '.mobile-menu__item[data-index="0"]',
          );
          if (firstItem) {
            setActiveMenuItemSecondary(mobileMenu, firstItem, 0, menuBorder);
          }
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  observer.observe(footer);
}

/**
 * Set active menu item (secondary menu)
 * @param {HTMLElement} mobileMenu - The mobile menu container
 * @param {HTMLElement} item - The item to set as active
 * @param {number} index - The index of the item
 * @param {HTMLElement} menuBorder - The border element
 * @param {boolean} triggerWave - Whether to trigger the wave effect (default: false)
 */
function setActiveMenuItemSecondary(mobileMenu, item, index, menuBorder) {
  const items = mobileMenu.querySelectorAll(".mobile-menu__item");

  items.forEach((el, i) => {
    if (i === index) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });

  // Update border position
  if (menuBorder) {
    requestAnimationFrame(() => {
      offsetMenuBorderSecondary(item, menuBorder);
    });
  }
}

// Export functions
export { initSecondaryMobileMenu };
