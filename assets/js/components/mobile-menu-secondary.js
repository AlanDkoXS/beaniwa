/**
 * Secondary Mobile Menu Component - For non-index pages
 * Shows only Regresar and hamburger button
 */

// Detect current language based on URL path
function getCurrentLanguageSecondary() {
  const path = window.location.pathname;
  if (path.startsWith("/en/") || path === "/en" || path === "/en.html") {
    return "en";
  }
  return "es";
}

// Get the equivalent page in the other language
function getTranslatedPageHref() {
  const path = window.location.pathname;
  const currentLang = getCurrentLanguageSecondary();
  const targetLang = currentLang === "en" ? "es" : "en";

  // Page mapping: Spanish -> English
  const pageMapping = {
    "/": targetLang === "en" ? "/en/" : "/",
    "/index.html": targetLang === "en" ? "/en/index.html" : "/index.html",
    "/nosotros.html": targetLang === "en" ? "/en/about.html" : "/nosotros.html",
    "/servicios.html":
      targetLang === "en" ? "/en/services.html" : "/servicios.html",
    "/portafolio.html":
      targetLang === "en" ? "/en/portfolio.html" : "/portafolio.html",
    "/contacto.html":
      targetLang === "en" ? "/en/contact.html" : "/contacto.html",
    "/politica-privacidad.html":
      targetLang === "en"
        ? "/en/privacy-policy.html"
        : "/politica-privacidad.html",
  };

  // English pages
  const enPageMapping = {
    "/en/": "/es/",
    "/en": "/es/",
    "/en.html": "/index.html",
    "/en/index.html": "/index.html",
    "/en/about.html": "/es/nosotros.html",
    "/en/services.html": "/es/servicios.html",
    "/en/portfolio.html": "/es/portafolio.html",
    "/en/contact.html": "/es/contacto.html",
    "/en/privacy-policy.html": "/es/politica-privacidad.html",
  };

  const mapping = currentLang === "en" ? enPageMapping : pageMapping;

  // Check for exact match or remove trailing slash
  const normalizedPath =
    path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

  return (
    mapping[path] ||
    mapping[normalizedPath] ||
    (targetLang === "en" ? "/en/" : "/")
  );
}

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
  icon: `<path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"/>`,
};

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
  const currentLang = getCurrentLanguageSecondary();
  const currentLabels = labelsSecondary[currentLang];

  const itemLabel = currentLabels[item.id] || item.id;

  const button = document.createElement("button");
  button.className = `mobile-menu__item${isActive ? " active" : ""}`;
  button.setAttribute("data-index", index);
  button.setAttribute("data-id", item.id);
  button.setAttribute("aria-label", itemLabel);

  button.style.setProperty("--bgColorItem", "#ff8000");

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
      toggleHamburgerMenuSecondary(button);
    });
  } else {
    button.addEventListener("click", () => handleItemClickSecondary(item.href));
  }

  return button;
}

/**
 * Handle menu item click
 */
function handleItemClickSecondary(href) {
  // Close overlay if it's open (remove blur)
  const overlay = document.querySelector(".mobile-menu__overlay");
  if (overlay && overlay.classList.contains("open")) {
    overlay.classList.remove("open");
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 400);
  }

  if (href.includes("#")) {
    const [path, hash] = href.split("#");
    const targetId = hash || path;
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  } else {
    window.location.href = href;
  }
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
  const currentLang = getCurrentLanguageSecondary();

  // Toggle panel visibility
  if (panel && panel.classList.contains("open")) {
    panel.classList.remove("open");
    hamburgerButton.classList.remove("active");
    document
      .querySelector(".mobile-menu")
      ?.removeAttribute("data-hamburger-active");
    if (menuBorder) {
      menuBorder.style.opacity = "1";
    }
    animateHamburgerIconSecondary(hamburgerButton, false);
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

  // Create panel
  panel = document.createElement("div");
  panel.className = "mobile-menu__panel";

  const hrefLang = currentLang === "en" ? "/en" : "";

  // Modal content - same as main menu (icons defined inline)
  // For non-index pages, link directly to HTML pages
  const navItemsModal = [
    {
      id: "inicio",
      href: hrefLang + "/",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"/>}`,
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

  const socialNetworks = [
    { id: "facebook", href: "https://facebook.com/beaniwa" },
    { id: "instagram", href: "https://instagram.com/beaniwa" },
    { id: "tiktok", href: "https://tiktok.com/@beaniwa" },
    { id: "whatsapp", href: "https://wa.me/526141234567" },
  ];

  const iconBasePath = "/assets/icons";
  const langButtonText = currentLang === "en" ? "Español" : "English";
  const langButtonHref = getTranslatedPageHref();

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
        window.location.href = href;
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
  const langBtn = panel.querySelector(".mobile-menu__lang-btn");
  if (langBtn) {
    langBtn.addEventListener("click", e => {
      e.preventDefault();
      closeHamburgerPanelSecondary(panel, overlay, hamburgerButton);
    });
  }

  requestAnimationFrame(() => {
    overlay.classList.add("open");
    panel.classList.add("open");
    hamburgerButton.classList.add("active");
  });
}

/**
 * Close hamburger panel
 */
function closeHamburgerPanelSecondary(panel, overlay, hamburgerButton) {
  const menuBorder = document.querySelector(".mobile-menu__border");

  panel.classList.remove("open");
  hamburgerButton.classList.remove("active");
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

  const currentLang = getCurrentLanguageSecondary();
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

  // Show menu with animation
  setTimeout(() => {
    showSecondaryMobileMenu(mobileMenu, menuBorder);
  }, 2000);

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

  console.log("Secondary mobile menu initialized");
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

// Export functions
export { initSecondaryMobileMenu };
