// @ts-check
import { i18n } from "astro-i18n-aut/integration";
import { defineConfig } from "astro/config";

const defaultLocale = "es";
const locales = {
    es: "es-ES",
    en: "en-US",
};

// https://astro.build/config
export default defineConfig({
    site: "https://beaniwa.com/",
    trailingSlash: "always",
    build: {
        format: "directory",
    },
    image: {
        // Configuración para optimización de imágenes
        service: {
            entrypoint: "astro/assets/services/sharp",
        },
    },
    integrations: [
        i18n({
            locales,
            defaultLocale,
        }),
    ],
});
