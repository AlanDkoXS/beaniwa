/**
 * Mobile Menu Component - Animated Tab Bar
 * Creates a bottom navigation bar with animated icons
 */

// Detect current language based on URL path
function getCurrentLanguage() {
  const path = window.location.pathname;
  if (path.startsWith("/en/") || path === "/en" || path === "/en.html") {
    return "en";
  }
  return "es";
}

// Get the equivalent page in the other language
function getTranslatedPageHref() {
  const path = window.location.pathname;
  const currentLang = getCurrentLanguage();
  const targetLang = currentLang === "en" ? "es" : "en";

  // Page mapping for main menu (index pages)
  const pageMapping = {
    "/": targetLang === "en" ? "/en/" : "/",
    "/index.html": targetLang === "en" ? "/en/index.html" : "/index.html",
    "/es/": targetLang === "en" ? "/en/" : "/es/",
    "/es": targetLang === "en" ? "/en/" : "/es/",
    "/es.html": targetLang === "en" ? "/en/" : "/es/",
    "/es/index.html": targetLang === "en" ? "/en/index.html" : "/es/index.html",
    "/en/": "/es/",
    "/en": "/es/",
    "/en.html": "/index.html",
    "/en/index.html": "/index.html",
  };

  // Check for exact match or remove trailing slash
  const normalizedPath =
    path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

  return (
    pageMapping[path] ||
    pageMapping[normalizedPath] ||
    (targetLang === "en" ? "/en/" : "/")
  );
}

// Navigation labels by language
const labels = {
  es: {
    regresar: "Regresar",
    inicio: "Inicio",
    servicios: "Servicios",
    portafolio: "Portafolio",
    nosotros: "Nosotros",
    contacto: "Contacto",
    mas: "Más",
  },
  en: {
    regresar: "Return",
    inicio: "Home",
    servicios: "Services",
    portafolio: "Portfolio",
    nosotros: "About",
    contacto: "Contact",
    mas: "More",
  },
};

// Navigation items configuration (bottom menu - stays the same)
const navItems = [
  {
    id: "inicio",
    href: "/#inicio",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"/>`,
  },
  {
    id: "servicios",
    href: "/#servicios",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"/>`,
  },
  {
    id: "portafolio",
    href: "/#portafolio",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"/>`,
  },
  {
    id: "nosotros",
    href: "/#nosotros",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>`,
  },
  {
    id: "contacto",
    href: "/#contacto",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>`,
  },
];

// Hamburger menu item
const hamburgerItem = {
  id: "hamburger",
  icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>`,
  iconActive: `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>`,
};

/**
 * Get current active item based on URL hash or scroll position
 */
function getCurrentItem() {
  const sections = [
    "inicio",
    "servicios",
    "portafolio",
    "nosotros",
    "contacto",
  ];
  const scrollPosition = window.scrollY + window.innerHeight / 3;

  // Check which section is currently visible
  for (const sectionId of sections) {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop;
      const offsetHeight = section.offsetHeight;
      if (
        scrollPosition >= offsetTop - 100 &&
        scrollPosition < offsetTop + offsetHeight
      ) {
        return sectionId;
      }
    }
  }

  // Fallback to hash or default to last section (contacto)
  // This prevents returning to "inicio" when scrolling past the last section
  const hash = window.location.hash.slice(1);
  if (hash && sections.includes(hash)) {
    return hash;
  }
  // Return the last section instead of "inicio" when scroll is past all sections
  return sections[sections.length - 1];
}

/**
 * Create the SVG icon element
 */
function createIcon(iconPath) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.innerHTML = iconPath;
  return svg;
}

/**
 * Create a menu item button
 */
function createMenuItem(item, index, isActive) {
  const currentLang = getCurrentLanguage();
  const currentLabels = labels[currentLang];

  // Get label from item or from language labels
  const itemLabel = currentLabels[item.id] || item.id;

  const button = document.createElement("button");
  button.className = `mobile-menu__item${isActive ? " active" : ""}`;
  button.setAttribute("data-index", index);
  button.setAttribute("data-id", item.id);
  button.setAttribute("aria-label", itemLabel);

  // Set the button color
  button.style.setProperty("--bgColorItem", "#ff8000");

  // Add icon - use active icon for hamburger when active
  if (item.id === "hamburger" && item.iconActive) {
    button.appendChild(createIcon(isActive ? item.iconActive : item.icon));
  } else {
    button.appendChild(createIcon(item.icon));
  }

  // Check if this is the hamburger button
  if (item.id === "hamburger") {
    button.setAttribute("data-hamburger", "true");
    button.addEventListener("click", e => {
      e.preventDefault();
      toggleHamburgerMenu(button);
    });
  } else {
    // Add click handler
    button.addEventListener("click", () => handleItemClick(button, item.href));
  }

  return button;
}

/**
 * Handle menu item click
 */
function handleItemClick(clickedItem, href) {
  const menuItems = document.querySelectorAll(".mobile-menu__item");
  const menuBorder = document.querySelector(".mobile-menu__border");
  const hamburgerPanel = document.querySelector(".mobile-menu__panel");
  const hamburgerButton = document.querySelector(
    '.mobile-menu__item[data-hamburger="true"]',
  );
  const overlay = document.querySelector(".mobile-menu__overlay");

  // Close hamburger panel if open (animate but don't wait)
  if (hamburgerPanel && hamburgerPanel.classList.contains("open")) {
    hamburgerPanel.classList.remove("open");
    if (hamburgerButton) {
      hamburgerButton.classList.remove("active");
      // Animate hamburger icon back to lines
      animateHamburgerIcon(hamburgerButton, false);
    }
    // Remove hamburger-active attribute
    document
      .querySelector(".mobile-menu")
      ?.removeAttribute("data-hamburger-active");
    // Show menu border
    if (menuBorder) {
      menuBorder.style.opacity = "1";
    }
    // Close overlay to remove blur
    if (overlay) {
      overlay.classList.remove("open");
      // Remove overlay from DOM after animation completes
      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 400);
    }
    // Remove panel after animation completes (don't wait for navigation)
    setTimeout(() => {
      if (hamburgerPanel.parentNode) {
        hamburgerPanel.parentNode.removeChild(hamburgerPanel);
      }
    }, 400);
  } else if (overlay && overlay.classList.contains("open")) {
    // Also close overlay if it's open but panel was already removed
    overlay.classList.remove("open");
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 400);
  }

  // Remove active from current item
  menuItems.forEach(item => item.classList.remove("active"));

  // Add active to clicked item
  clickedItem.classList.add("active");

  // Update border position
  offsetMenuBorder(clickedItem, menuBorder);

  // Handle navigation - scroll to section if href has hash, otherwise navigate
  if (href.includes("#")) {
    const [path, hash] = href.split("#");
    const targetId = hash || path;
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      // Scroll to section smoothly
      targetSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // Section not found on current page, navigate to it
      window.location.href = href;
    }
  } else {
    // No hash, navigate to the page
    window.location.href = href;
  }
}

/**
 * Calculate and set the border position
 */
function offsetMenuBorder(element, menuBorder) {
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

// Social networks configuration - using actual SVG icons from assets
const socialNetworks = [
  {
    id: "facebook",
    href: "https://facebook.com/beaniwa",
  },
  {
    id: "instagram",
    href: "https://instagram.com/beaniwa",
  },
  {
    id: "tiktok",
    href: "https://tiktok.com/@beaniwa",
  },
  {
    id: "whatsapp",
    href: "https://wa.me/526141234567",
  },
];

// Language switcher labels
const languageLabels = {
  es: {
    otros: "Otros",
    cambioIdioma: "Cambiar idioma",
  },
  en: {
    otros: "Other",
    cambioIdioma: "Change language",
  },
};

/**
 * Toggle hamburger menu panel - Centered modal with blur
 */

/**
 * Animate hamburger icon transition to X and vice versa
 */
function animateHamburgerIcon(hamburgerButton, toActive) {
  const iconElement = hamburgerButton.querySelector(".icon");
  if (!iconElement) return;

  // Directly swap the icon and apply rotation animation
  const newIcon = toActive ? hamburgerItem.iconActive : hamburgerItem.icon;
  iconElement.innerHTML = newIcon;

  // Apply rotation with transition
  iconElement.style.transition = "transform 0.4s ease";
  iconElement.style.transform = toActive ? "rotate(180deg)" : "rotate(0deg)";
}

function toggleHamburgerMenu(hamburgerButton) {
  let panel = document.querySelector(".mobile-menu__panel");
  let overlay = document.querySelector(".mobile-menu__overlay");
  const menuBorder = document.querySelector(".mobile-menu__border");
  const currentLang = getCurrentLanguage();
  const currentLabels = labels[currentLang];
  const langLabels = languageLabels[currentLang];

  // Toggle panel visibility
  if (panel && panel.classList.contains("open")) {
    panel.classList.remove("open");
    hamburgerButton.classList.remove("active");
    // Remove hamburger-active attribute
    document
      .querySelector(".mobile-menu")
      ?.removeAttribute("data-hamburger-active");
    // Show menu border again
    if (menuBorder) {
      menuBorder.style.opacity = "1";
    }
    // Animate hamburger icon back to lines
    animateHamburgerIcon(hamburgerButton, false);
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

  // Deactivate all other menu items when hamburger is active
  const menuItems = document.querySelectorAll(".mobile-menu__item");
  menuItems.forEach(item => {
    if (item !== hamburgerButton) {
      item.classList.remove("active");
    }
  });

  // Add hamburger-active attribute to show border
  document
    .querySelector(".mobile-menu")
    ?.setAttribute("data-hamburger-active", "true");

  // Position the border under hamburger button
  if (menuBorder) {
    requestAnimationFrame(() => {
      offsetMenuBorder(hamburgerButton, menuBorder);
    });
  }

  // Animate hamburger icon to X
  animateHamburgerIcon(hamburgerButton, true);

  // Create overlay with blur
  overlay = document.createElement("div");
  overlay.className = "mobile-menu__overlay";
  document.body.appendChild(overlay);

  // Close modal when clicking on overlay
  overlay.addEventListener("click", () => {
    closeHamburgerPanel(panel, overlay, hamburgerButton);
  });

  // Create new panel - centered modal
  panel = document.createElement("div");
  panel.className = "mobile-menu__panel";

  // Determine href paths based on language
  const hrefLang = currentLang === "en" ? "/en" : "";
  const otherLang = currentLang === "en" ? "es" : "en";
  const otherLangHref = otherLang === "en" ? "/en" : "";

  // Section IDs by language
  const sectionIds =
    currentLang === "en"
      ? {
          inicio: "home",
          servicios: "services",
          portafolio: "portfolio",
          nosotros: "about",
          contacto: "contact",
        }
      : {
          inicio: "inicio",
          servicios: "servicios",
          portafolio: "portafolio",
          nosotros: "nosotros",
          contacto: "contacto",
        };

  // Navigation items with icons for modal
  // navItems indices: 0=inicio, 1=servicios, 2=portafolio, 3=nosotros, 4=contacto
  const navItemsWithIcons = [
    {
      id: "regresar",
      href: hrefLang + "/",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"/>`,
      label: currentLabels.regresar,
    },
    {
      id: "inicio",
      href: hrefLang + "/#" + sectionIds.inicio,
      icon: navItems[0].icon,
      label: currentLabels.inicio,
    },
    {
      id: "nosotros",
      href: hrefLang + "/#" + sectionIds.nosotros,
      icon: navItems[3].icon,
      label: currentLabels.nosotros,
    },
    {
      id: "servicios",
      href: hrefLang + "/#" + sectionIds.servicios,
      icon: navItems[1].icon,
      label: currentLabels.servicios,
    },
    {
      id: "portafolio",
      href: hrefLang + "/#" + sectionIds.portafolio,
      icon: navItems[2].icon,
      label: currentLabels.portafolio,
    },
    {
      id: "contacto",
      href: hrefLang + "/#" + sectionIds.contacto,
      icon: navItems[4].icon,
      label: currentLabels.contacto,
    },
  ];

  // Use absolute paths for icons to work from any directory
  const iconBasePath = "/assets/icons";

  // Check if current page is not the index page
  function isNotIndexPage() {
    const path = window.location.pathname;
    // Check if it's index page (root, /index.html, /es/, /es/index.html, /en/, /en/index.html)
    const isIndex =
      path === "/" ||
      path === "/index.html" ||
      path === "/es" ||
      path === "/es/" ||
      path === "/es/index.html" ||
      path === "/en" ||
      path === "/en/" ||
      path === "/en/index.html";
    return !isIndex;
  }

  const isNotIndex = isNotIndexPage();

  // Build social networks HTML
  const socialHtml = socialNetworks
    .map(
      social => `
      <a href="${social.href}" class="mobile-menu__social-item" target="_blank" rel="noopener noreferrer" aria-label="${social.id}">
        <img src="${iconBasePath}/social/${social.id}.svg" alt="${social.id}" class="social-icon" />
      </a>
    `,
    )
    .join("");

  // Build language switcher HTML
  const langButtonText = currentLang === "en" ? "Español" : "English";
  const langButtonHref = getTranslatedPageHref();

  // Build navigation HTML - always show all nav items in modal
  const navHtml = navItemsWithIcons
    .slice(1)
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
    .join("");

  // Add panel content with language-specific labels - Modal format
  panel.innerHTML = `
    <div class="mobile-menu__panel-content">
      <!-- Navigation Grid Section -->
      <div class="mobile-menu__section mobile-menu__nav-grid">
        ${navHtml}
      </div>

      <!-- Social Networks Section -->
      <div class="mobile-menu__section mobile-menu__social-section">
        <h3 class="mobile-menu__section-title">${currentLang === "en" ? "Follow us" : "Síguenos"}</h3>
        <div class="mobile-menu__social-grid">
          ${socialHtml}
        </div>
      </div>

      <!-- Language Switcher Section -->
      <div class="mobile-menu__section mobile-menu__lang-section">
        <h3 class="mobile-menu__section-title">${currentLang === "en" ? "Change language" : "Cambiar idioma"}</h3>
        <a href="${langButtonHref}" class="mobile-menu__lang-card">
          <img src="${iconBasePath}/translate.svg" alt="translate" class="lang-icon" />
          <span>${langButtonText}</span>
        </a>
      </div>
    </div>
  `;

  // Insert panel before the mobile menu
  const mobileMenu = document.querySelector(".mobile-menu");
  mobileMenu.parentNode.insertBefore(panel, mobileMenu);

  // Add click handlers to navigation cards
  panel.querySelectorAll(".mobile-menu__nav-card").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      const href = item.getAttribute("href");

      // Close hamburger panel first (this removes the blur)
      closeHamburgerPanel(panel, overlay, hamburgerButton);

      // Navigate after modal closes - use SPA navigation
      setTimeout(() => {
        // Check if it's a hash navigation (SPA) or page navigation
        if (href.includes("#")) {
          const hash = href.split("#")[1];
          const targetSection = document.getElementById(hash);
          if (targetSection) {
            // Scroll to section on current page
            targetSection.scrollIntoView({ behavior: "smooth" });
          } else {
            // Section not found, navigate to page with hash
            window.location.hash = hash;
          }
        } else {
          // Full page navigation
          window.location.href = href;
        }
      }, 450);
    });
  });

  // Add click handlers to social network items
  panel.querySelectorAll(".mobile-menu__social-item").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      closeHamburgerPanel(panel, overlay, hamburgerButton);
    });
  });

  // Add click handler to language switcher
  const langCard = panel.querySelector(".mobile-menu__lang-card");
  if (langCard) {
    langCard.addEventListener("click", e => {
      e.preventDefault();
      const href = langCard.getAttribute("href");
      closeHamburgerPanel(panel, overlay, hamburgerButton);
      // Navigate after modal closes
      setTimeout(() => {
        window.location.href = href;
      }, 450);
    });
  }

  // Add click handler for Menu button in modal (non-index pages)
  const menuBtn = panel.querySelector("#modal-menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      closeHamburgerPanel(panel, overlay, hamburgerButton);
      // Re-open hamburger after a short delay
      setTimeout(() => {
        if (hamburgerButton) {
          toggleHamburgerMenu(hamburgerButton);
        }
      }, 300);
    });
  }

  // Animate panel and overlay opening
  requestAnimationFrame(() => {
    overlay.classList.add("open");
    panel.classList.add("open");
    hamburgerButton.classList.add("active");
  });
}

/**
 * Close hamburger panel with animation
 */
function closeHamburgerPanel(panel, overlay, hamburgerButton) {
  const menuBorder = document.querySelector(".mobile-menu__border");

  panel.classList.remove("open");
  hamburgerButton.classList.remove("active");
  // Remove hamburger-active attribute
  document
    .querySelector(".mobile-menu")
    ?.removeAttribute("data-hamburger-active");
  // Animate hamburger icon back to lines
  animateHamburgerIcon(hamburgerButton, false);
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
 * Initialize the mobile menu with delay and wave effect
 */
function initMobileMenu() {
  // Check if mobile menu already exists
  if (document.querySelector(".mobile-menu")) {
    return;
  }

  const currentLang = getCurrentLanguage();
  const ariaLabel =
    currentLang === "en" ? "Main navigation" : "Navegación principal";

  // Create mobile menu container
  const mobileMenu = document.createElement("nav");
  mobileMenu.className = "mobile-menu";
  mobileMenu.setAttribute("role", "navigation");
  mobileMenu.setAttribute("aria-label", ariaLabel);

  // Initially hide the menu with opacity 0 and translateY
  mobileMenu.style.opacity = "0";
  mobileMenu.style.transform = "translateY(100%)";
  mobileMenu.style.transition =
    "opacity 0.6s ease-out, transform 0.6s ease-out";

  // Get current active item
  const currentItem = getCurrentItem();
  const currentIndex = navItems.findIndex(item => item.id === currentItem);

  // Check if current page is not index
  const path = window.location.pathname;
  const isIndex =
    path === "/" ||
    path === "/index.html" ||
    path === "/es" ||
    path === "/es/" ||
    path === "/es/index.html" ||
    path === "/en" ||
    path === "/en/" ||
    path === "/en/index.html";
  const isNotIndex = !isIndex;

  // Add "Regresar" item at the beginning for non-index pages
  const bottomNavItems = [];
  if (isNotIndex) {
    // On non-index pages, only show Regresar and hamburger
    const regresarItem = {
      id: "regresar",
      href: "/",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"/>`,
    };
    bottomNavItems.push(regresarItem);
  } else {
    // On index page, show all nav items
    bottomNavItems.push(...navItems);
  }

  // Create menu items
  bottomNavItems.forEach((item, index) => {
    const isActive =
      index === currentIndex || (currentIndex === -1 && index === 0);
    const menuItem = createMenuItem(item, index, isActive);
    mobileMenu.appendChild(menuItem);
  });

  // Create hamburger button at the end
  const hamburgerButton = createMenuItem(hamburgerItem, navItems.length, false);
  hamburgerButton.setAttribute("data-hamburger", "true");
  mobileMenu.appendChild(hamburgerButton);

  // Create border element
  const menuBorder = document.createElement("div");
  menuBorder.className = "mobile-menu__border";
  mobileMenu.appendChild(menuBorder);

  // Create SVG container (hidden, used for clip-path)
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

  // Wait for page load complete, then show menu after 2 seconds with wave effect
  if (document.readyState === "complete") {
    setTimeout(() => {
      showMobileMenuWithWave(mobileMenu, menuBorder);
    }, 2000);
  } else {
    window.addEventListener("load", () => {
      setTimeout(() => {
        showMobileMenuWithWave(mobileMenu, menuBorder);
      }, 2000);
    });
  }

  // Update active item on scroll
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    // Throttle scroll events for performance
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
      const currentItem = getCurrentItem();
      const menuItems = mobileMenu.querySelectorAll(".mobile-menu__item");

      menuItems.forEach(item => {
        const itemId = item.dataset.id;
        if (itemId === currentItem) {
          if (!item.classList.contains("active")) {
            item.classList.add("active");
            offsetMenuBorder(item, menuBorder);
          }
        } else {
          item.classList.remove("active");
        }
      });
    }, 50);
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    const activeItem = mobileMenu.querySelector(".mobile-menu__item.active");
    if (activeItem) {
      offsetMenuBorder(activeItem, menuBorder);
    }
  });

  console.log("Mobile menu initialized");
}

/**
 * Show mobile menu with wave ripple effect
 */
function showMobileMenuWithWave(mobileMenu, menuBorder) {
  // Create wave effect element
  const waveOverlay = document.createElement("div");
  waveOverlay.className = "mobile-menu__wave";
  mobileMenu.appendChild(waveOverlay);

  // Force reflow to enable animation
  mobileMenu.offsetHeight;

  // Show the menu with animation
  mobileMenu.style.opacity = "1";
  mobileMenu.style.transform = "translateY(0)";

  // Remove wave overlay after animation completes
  setTimeout(() => {
    if (waveOverlay.parentNode) {
      waveOverlay.parentNode.removeChild(waveOverlay);
    }
  }, 800);

  // Set initial border position after render
  setTimeout(() => {
    const activeItem = mobileMenu.querySelector(".mobile-menu__item.active");
    if (activeItem) {
      offsetMenuBorder(activeItem, menuBorder);
    }
  }, 100);
}

/**
 * Close mobile menu (for compatibility)
 */
function closeMenu() {
  // No-op for this implementation
}

/**
 * Toggle mobile menu (for compatibility)
 */
function toggleMenu() {
  // No-op for this implementation
}

// Export functions
export { closeMenu, initMobileMenu, toggleMenu };
