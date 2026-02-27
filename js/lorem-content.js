/**
 * Lorem Ipsum Content - Aniwa Digital Marketing
 * This file contains all text content for the website
 */

const loremContent = {
  // Navigation
  nav: {
    inicio: "Inicio",
    servicios: "Servicios",
    portafolio: "Portafolio",
    nosotros: "Nosotros",
    contacto: "Contacto",
  },

  // Hero Section
  hero: {
    title: "Lorem ipsum dolor sit amet",
    subtitle:
      "Consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    cta: "Lorem ipsum",
  },

  // Services Section
  servicios: {
    title: "Lorem ipsum",
    subtitle: "Dolor sit amet, consectetur adipiscing elit",
    items: [
      {
        title: "Lorem ipsum",
        description:
          "Dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation.",
      },
      {
        title: "Lorem ipsum",
        description:
          "Dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation.",
      },
      {
        title: "Lorem ipsum",
        description:
          "Dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation.",
      },
      {
        title: "Lorem ipsum",
        description:
          "Dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation.",
      },
    ],
  },

  // Portfolio Section
  portafolio: {
    title: "Lorem ipsum",
    subtitle: "Dolor sit amet, consectetur adipiscing elit",
    items: [
      {
        title: "Lorem ipsum",
        description: "Dolor sit amet, consectetur adipiscing elit",
      },
      {
        title: "Lorem ipsum",
        description: "Dolor sit amet, consectetur adipiscing elit",
      },
      {
        title: "Lorem ipsum",
        description: "Dolor sit amet, consectetur adipiscing elit",
      },
    ],
  },

  // About Us Section
  nosotros: {
    title: "Lorem ipsum",
    subtitle: "Dolor sit amet, consectetur adipiscing elit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    values: [
      {
        title: "Lorem ipsum",
        description: "Dolor sit amet, consectetur adipiscing elit",
      },
      {
        title: "Lorem ipsum",
        description: "Dolor sit amet, consectetur adipiscing elit",
      },
      {
        title: "Lorem ipsum",
        description: "Dolor sit amet, consectetur adipiscing elit",
      },
    ],
  },

  // Contact Section
  contacto: {
    title: "Lorem ipsum",
    subtitle: "Dolor sit amet, consectetur adipiscing elit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    form: {
      name: "Lorem ipsum",
      email: "Lorem ipsum",
      message: "Lorem ipsum",
      submit: "Lorem ipsum",
    },
    info: {
      email: "lorem@ipsum.com",
      phone: "+1 234 567 890",
      address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
  },

  // Footer
  footer: {
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    links: {
      servicios: "Lorem ipsum",
      portafolio: "Lorem ipsum",
      nosotros: "Lorem ipsum",
      contacto: "Lorem ipsum",
    },
    copyright: "Lorem ipsum dolor sit amet",
  },

  // SEO Titles
  seo: {
    home: {
      title: "Aniwa | Lorem ipsum - Lorem ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
    },
    servicios: {
      title: "Lorem ipsum | Aniwa",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
    },
    portafolio: {
      title: "Lorem ipsum | Aniwa",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
    },
    nosotros: {
      title: "Lorem ipsum | Aniwa",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
    },
    contacto: {
      title: "Lorem ipsum | Aniwa",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
    },
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = loremContent;
}
