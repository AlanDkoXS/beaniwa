export const translations = {
    es: {
        title: "Aniwa Creative Design - Marketing Digital y Diseño Web",
        heroTitle: "Impulsa tu Negocio con Marketing Digital",
        heroDescription:
            "En Aniwa Creative Design creamos estrategias digitales efectivas y diseños web impactantes que convierten visitantes en clientes.",
        ctaButton: "Comienza tu Proyecto",
        navHome: "Inicio",
        navServices: "Servicios",
        navPortfolio: "Portfolio",
        navContact: "Contacto",
        servicesTitle: "Nuestros Servicios",
        services: {
            digitalMarketing: {
                title: "Marketing Digital",
                description:
                    "Estrategias completas de marketing online: SEO, SEM, redes sociales, email marketing y analítica web.",
            },
            webDesign: {
                title: "Diseño Web",
                description:
                    "Sitios web responsive, modernos y optimizados para conversiones. Desde landing pages hasta e-commerce.",
            },
            branding: {
                title: "Branding",
                description: "Identidad visual completa: logos, paletas de colores, tipografías y manuales de marca.",
            },
            consulting: {
                title: "Consultoría Digital",
                description:
                    "Asesoramiento estratégico para optimizar tu presencia digital y aumentar tus ventas online.",
            },
        },
        portfolioTitle: "Nuestro Portfolio",
        portfolioItems: {
            item1: {
                title: "E-commerce para Tienda Online",
                description:
                    "Desarrollo completo de plataforma de ventas con integración de pagos y gestión de inventario.",
            },
            item2: {
                title: "Campaña de Marketing Digital",
                description: "Estrategia completa que aumentó las conversiones en un 300% en 6 meses.",
            },
            item3: {
                title: "Rediseño de Marca",
                description: "Rebranding completo que modernizó la imagen y aumentó el reconocimiento de marca.",
            },
        },
        contactTitle: "Contáctanos",
        contactFormTitle: "Envíanos un Mensaje",
        contactName: "Nombre",
        contactEmail: "Email",
        contactMessage: "Mensaje",
        contactSubmit: "Enviar Mensaje",
        contactInfoTitle: "Información de Contacto",
        contactPhone: "Teléfono: +52 614 684 9441",
        contactLocation: "Alcance Global",
        contactHours: "Horarios: Lunes a Viernes, 9:00 - 18:00",
        footerText: "&Aniwa Creative Design. Todos los derechos reservados.",
    },
    en: {
        title: "Aniwa Creative Design - Digital Marketing and Web Design",
        heroTitle: "Boost Your Business with Digital Marketing",
        heroDescription:
            "At Aniwa Creative Design we create effective digital strategies and impactful web designs that convert visitors into customers.",
        ctaButton: "Start Your Project",
        navHome: "Home",
        navServices: "Services",
        navPortfolio: "Portfolio",
        navContact: "Contact",
        servicesTitle: "Our Services",
        services: {
            digitalMarketing: {
                title: "Digital Marketing",
                description:
                    "Complete online marketing strategies: SEO, SEM, social media, email marketing and web analytics.",
            },
            webDesign: {
                title: "Web Design",
                description: "Responsive, modern websites optimized for conversions. From landing pages to e-commerce.",
            },
            branding: {
                title: "Branding",
                description: "Complete visual identity: logos, color palettes, typography and brand manuals.",
            },
            consulting: {
                title: "Digital Consulting",
                description: "Strategic advice to optimize your digital presence and increase online sales.",
            },
        },
        portfolioTitle: "Our Portfolio",
        portfolioItems: {
            item1: {
                title: "E-commerce for Online Store",
                description:
                    "Complete development of sales platform with payment integration and inventory management.",
            },
            item2: {
                title: "Digital Marketing Campaign",
                description: "Complete strategy that increased conversions by 300% in 6 months.",
            },
            item3: {
                title: "Brand Redesign",
                description: "Complete rebranding that modernized the image and increased brand recognition.",
            },
        },
        contactTitle: "Contact Us",
        contactFormTitle: "Send us a Message",
        contactName: "Name",
        contactEmail: "Email",
        contactMessage: "Message",
        contactSubmit: "Send Message",
        contactInfoTitle: "Contact Information",
        contactPhone: "Phone: +52 614 684 9441",
        contactLocation: "Global Reach",
        contactHours: "Hours: Monday to Friday, 9:00 - 18:00",
        footerText: "Aniwa Creative Design. All rights reserved.",
    },
};

export function getLanguage() {
    if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get("lang");
        if (lang && ["es", "en"].includes(lang)) {
            return lang;
        }
        const browserLang = navigator.language.split("-")[0];
        if (["es", "en"].includes(browserLang)) {
            return browserLang;
        }
    }
    // For server-side rendering, check if Astro.request exists
    if (typeof Astro !== "undefined" && Astro.request) {
        const url = new URL(Astro.request.url);
        const lang = url.searchParams.get("lang");
        if (lang && ["es", "en"].includes(lang)) {
            return lang;
        }
    }
    return "es";
}

export function t(key, lang = null) {
    const currentLang = lang || getLanguage();
    const keys = key.split(".");
    let value = translations[currentLang];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}

export function getLanguage() {
    if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get("lang");
        if (lang && ["es", "en"].includes(lang)) {
            return lang;
        }
        const browserLang = navigator.language.split("-")[0];
        if (["es", "en"].includes(browserLang)) {
            return browserLang;
        }
    }
    // For server-side rendering, check if Astro.request exists
    if (typeof Astro !== "undefined" && Astro.request) {
        const url = new URL(Astro.request.url);
        const lang = url.searchParams.get("lang");
        if (lang && ["es", "en"].includes(lang)) {
            return lang;
        }
    }
    return "es";
}

export function t(key, lang = null) {
    const currentLang = lang || getLanguage();
    const keys = key.split(".");
    let value = translations[currentLang];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}
