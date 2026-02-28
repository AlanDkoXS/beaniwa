/**
 * Mobile Menu Component - Animated Tab Bar
 * Creates a bottom navigation bar with animated icons
 */

// Navigation items configuration
const navItems = [
  {
    id: "inicio",
    label: "Inicio",
    href: "/#inicio",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"/>`,
  },
  {
    id: "servicios",
    label: "Servicios",
    href: "/#servicios",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"/>`,
  },
  {
    id: "portafolio",
    label: "Portafolio",
    href: "/#portafolio",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"/>`,
  },
  {
    id: "nosotros",
    label: "Nosotros",
    href: "/#nosotros",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>`,
  },
  {
    id: "contacto",
    label: "Contacto",
    href: "/#contacto",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>`,
  },
];

// Hamburger menu item
const hamburgerItem = {
  id: "hamburger",
  label: "Más",
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
  const button = document.createElement("button");
  button.className = `mobile-menu__item${isActive ? " active" : ""}`;
  button.setAttribute("data-index", index);
  button.setAttribute("data-id", item.id);
  button.setAttribute("aria-label", item.label);

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
    // Remove panel after animation completes (don't wait for navigation)
    setTimeout(() => {
      if (hamburgerPanel.parentNode) {
        hamburgerPanel.parentNode.removeChild(hamburgerPanel);
      }
    }, 700);
  }

  // Remove active from current item
  menuItems.forEach(item => item.classList.remove("active"));

  // Add active to clicked item
  clickedItem.classList.add("active");

  // Update border position
  offsetMenuBorder(clickedItem, menuBorder);

  // Navigate to the link immediately (simultaneously with panel closing)
  window.location.href = href;
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

/**
 * Toggle hamburger menu panel
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
  const menuBorder = document.querySelector(".mobile-menu__border");

  // Toggle panel visibility
  if (panel) {
    if (panel.classList.contains("open")) {
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
      setTimeout(() => {
        if (panel.parentNode) {
          panel.parentNode.removeChild(panel);
        }
      }, 700);
    }
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

  // Create new panel
  panel = document.createElement("div");
  panel.className = "mobile-menu__panel";

  // Add panel content
  panel.innerHTML = `
    <div class="mobile-menu__panel-content">
      <a href="/" class="mobile-menu__panel-item">Inicio</a>
      <a href="/pages/nosotros.html" class="mobile-menu__panel-item">Nosotros</a>
      <a href="/pages/servicios.html" class="mobile-menu__panel-item">Servicios</a>
      <a href="/pages/portafolio.html" class="mobile-menu__panel-item">Portafolio</a>
      <a href="/pages/contacto.html" class="mobile-menu__panel-item">Contacto</a>
    </div>
  `;

  // Insert panel before the mobile menu
  const mobileMenu = document.querySelector(".mobile-menu");
  mobileMenu.parentNode.insertBefore(panel, mobileMenu);

  // Add click handlers to panel items
  panel.querySelectorAll(".mobile-menu__panel-item").forEach(item => {
    item.addEventListener("click", () => {
      panel.classList.remove("open");
      hamburgerButton.classList.remove("active");
      // Animate hamburger icon back to lines
      animateHamburgerIcon(hamburgerButton, false);
      // Remove hamburger-active attribute
      document
        .querySelector(".mobile-menu")
        ?.removeAttribute("data-hamburger-active");
      setTimeout(() => {
        if (panel.parentNode) {
          panel.parentNode.removeChild(panel);
        }
      }, 700);
    });
  });

  // Animate panel opening with wave effect
  requestAnimationFrame(() => {
    panel.classList.add("open");
    hamburgerButton.classList.add("active");
  });
}

/**
 * Initialize the mobile menu with delay and wave effect
 */
function initMobileMenu() {
  // Check if mobile menu already exists
  if (document.querySelector(".mobile-menu")) {
    return;
  }

  // Create mobile menu container
  const mobileMenu = document.createElement("nav");
  mobileMenu.className = "mobile-menu";
  mobileMenu.setAttribute("role", "navigation");
  mobileMenu.setAttribute("aria-label", "Navegación principal");

  // Initially hide the menu with opacity 0 and translateY
  mobileMenu.style.opacity = "0";
  mobileMenu.style.transform = "translateY(100%)";
  mobileMenu.style.transition =
    "opacity 0.6s ease-out, transform 0.6s ease-out";

  // Get current active item
  const currentItem = getCurrentItem();
  const currentIndex = navItems.findIndex(item => item.id === currentItem);

  // Create menu items
  navItems.forEach((item, index) => {
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
