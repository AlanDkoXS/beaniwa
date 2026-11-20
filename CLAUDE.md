# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Project rules (style, a11y requirements, i18n sync, commit format, color palette) live in AGENTS.md and apply here:

@AGENTS.md

## Commands

No build, lint or tests. Netlify publishes the repo root as-is (`publish = "."`).

```bash
npx serve .              # or: python3 -m http.server 8000
```

Serve from the repo root. Pages use root-absolute links (`/en/`, `/es/`), so opening the HTML files directly with `file://` breaks navigation. The contact form and the language redirect only work on Netlify: the form posts to `/` using `data-netlify="true"`, and `netlify.toml` routes `/` by `Accept-Language`.

## Architecture

**Multi-page site with SPA-style navigation.** Every page is a complete static HTML file, so SEO works per URL. `assets/js/view-transitions.js` intercepts internal link clicks, fetches the target page, rebuilds `<head>` in the target's order (stylesheets, inline `<style>`, meta tags, canonical/hreflang links, `lang`), swaps the body inside `document.startViewTransition`, then dispatches a `viewTransitionComplete` event (`detail: { href, isBack }`).

Consequences when editing:
- **Navigation to an index page is always a hard reload** (`isIndexPage`), on click and on popstate, to avoid CSS cascade corruption. The home pages hold the heavy effects: hero video, particle engine, ambient glow, service scanner.
- **Scripts don't run again after an SPA navigation.** `assets/js/main.js` is the only module entry point. Per-page initialisation runs twice: once in `initApp()` on first load, and again in the `viewTransitionComplete` listener. A new component that depends on page content must be wired into **both**, and it must tolerate being re-initialised (look up elements again, avoid binding the same listener twice). Components with animation loops need a destroy path on navigation away (see `destroyServiceScanner`).
- **Each page lists its own stylesheets** in its `<head>` (base → layout → components → sections → animations → utilities). No CSS bundle exists. A new CSS file must be linked in every page that needs it, in both languages, in cascade order.
- `isIndexPage()` is duplicated in `main.js` and `view-transitions.js`. Keep the two copies in sync.
- The mobile menu has two variants: `mobile-menu.js` for index pages and `mobile-menu-secondary.js` for inner pages. `main.js` only recreates the menu when the variant changes. Otherwise it just updates the links.

**i18n routing.** `assets/js/router.js` holds `PAGE_MAPPING` (the en↔es filename pairs) that the language switcher uses. When you add or rename a page, update `PAGE_MAPPING`, both language files, the `hreflang`/canonical tags in each, and `sitemap.xml`. The root `index.html` only redirects to a language (meta refresh plus JS fallback). Netlify redirects handle this in production.

**Hero video state.** `localStorage` key `bw_hero_video_seen_at` (1h TTL). On back/forward navigation within that window, the hero video freezes on its last frame and the delayed effects show at once.

## Repo notes

- `plans/architecture.md` is an early design doc and is **outdated**: it describes a `pages/` layout that doesn't exist. Trust the actual tree over that doc.
- `.examples/` holds standalone effect prototypes (gitignored). It is reference material only and nothing loads it.
- `en/b/papi.html`, `es/b/papi.html` and `papi/` are standalone pages outside the main navigation and `PAGE_MAPPING`.
- Google Tag Manager is injected on `window.load` at the bottom of each page.
