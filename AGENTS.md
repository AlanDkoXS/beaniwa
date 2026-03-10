# AGENTS.md - Agentic Coding Guidelines for beaniwa.com

This document provides guidelines for agentic coding agents operating in this repository.

## Project Overview

- **Type**: Static website (vanilla HTML/CSS/JS)
- **Framework**: None - vanilla JavaScript with ES modules
- **Deployment**: Netlify
- **Languages**: English (en/) and Spanish (es/)

## Build, Lint, and Test Commands

This project is a static site with **no build system**, **no tests**, and **no linters configured**.

### Development
- No dev server required - edit files directly
- Open HTML files in browser or use a simple HTTP server:
  ```bash
  npx serve .
  # or
  python3 -m http.server 8000
  ```

### Deployment
- Automatically deploys via Netlify on push to main branch
- No manual build commands needed

### Testing
- **No tests exist** in this project
- If adding tests, use Vitest or Jest for JavaScript

## Code Style Guidelines

### General Principles
- Write code in **English** (variable names, comments, documentation)
- Write comments in **English**
- Use **vanilla design** - avoid frameworks
- Use **mobile-first design**

### HTML Guidelines
- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Include `lang` attribute on `<html>`: `en` or `es`
- Include meta viewport tag for responsive design
- Add `alt` attributes to all images
- Use proper heading hierarchy (`<h1>` through `<h6>`)

### CSS Guidelines
- Keep CSS minimal and vanilla
- Use CSS custom properties for theming when needed
- Follow mobile-first responsive design patterns
- Use meaningful class names (kebab-case)

### JavaScript Guidelines

#### Imports
- Use ES modules (`import`/`export`)
- Use explicit file extensions: `import { foo } from "./bar.js"`
- Group imports logically

#### Formatting
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multiline objects/arrays
- Maximum line length: 100 characters

#### Naming Conventions
- Functions: camelCase (`initApp`, `updateDateYear`)
- Constants: SCREAMING_SNAKE_CASE (only for true constants)
- Classes: PascalCase (if used)
- Files: kebab-case (`mobile-menu.js`, `scroll-animations.js`)

#### Functions
- Use named exports for modules
- Use JSDoc comments for public functions
- Keep functions small and focused
- Use descriptive names

```javascript
/**
 * Initialize the application
 */
function initApp() {
  // ...
}
```

#### Error Handling
- Use `console.warn` for missing DOM elements
- Return early from functions when preconditions aren't met
- Add defensive checks for null/undefined

```javascript
if (!header) {
  console.warn("Header element not found");
  return;
}
```

#### DOM Manipulation
- Check if elements exist before manipulating
- Use `document.getElementById` for single elements
- Use `document.querySelectorAll` for multiple elements

## Internationalization (i18n)

This is a bilingual website. Follow these rules:

### Directory Structure
- English: `en/` directory
- Spanish: `es/` directory
- Files are paired by purpose

### File Mappings
| English | Spanish |
|---------|---------|
| `en/index.html` | `es/index.html` |
| `en/about.html` | `es/nosotros.html` |
| `en/contact.html` | `es/contacto.html` |
| `en/portfolio.html` | `es/portafolio.html` |
| `en/services.html` | `es/servicios.html` |

### Synchronization Rule
- **ALWAYS** apply text changes to both language versions
- Text includes: headings, paragraphs, button text, link text, alt attributes, meta descriptions
- Both versions should be updated simultaneously

## Git Convention

Follow the rules in `.kilocode/skills/git-convention.md`:

### Commit Messages
Format: `:emoji: TYPE: description`

Common emojis:
- `:sparkles:` - New features
- `:bug:` - Bug fixes
- `:lipstick:` - UI/style changes
- `:memo:` - Documentation
- `:recycle:` - Refactoring
- `:globe_with_meridians:` - i18n changes

Example:
```
:sparkles: ADD: Contact form validation

Adds email and required field validation to contact form
```

## Project Structure

```
/
├── index.html              # Language redirector
├── netlify.toml            # Netlify config
├── assets/
│   ├── js/
│   │   ├── main.js         # Entry point
│   │   ├── components/     # UI components
│   │   │   ├── header.js
│   │   │   ├── mobile-menu.js
│   │   │   ├── mobile-menu-secondary.js
│   │   │   └── scroll-animations.js
│   │   ├── navigation.js
│   │   ├── router.js
│   │   ├── scroll.js
│   │   ├── view-transitions.js
│   │   └── utils/          # Utility functions
│   │       └── date_updater.js
│   └── css/                # Stylesheets
├── en/                     # English pages
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── portfolio.html
│   ├── services.html
│   └── privacy-policy.html
├── es/                     # Spanish pages
│   ├── index.html
│   ├── nosotros.html
│   ├── contacto.html
│   ├── portafolio.html
│   ├── servicios.html
│   └── politica-privacidad.html
└── plans/                  # Pricing/plan pages
```

## Accessibility Guidelines
- Ensure sufficient color contrast
- Make all interactive elements keyboard accessible
- Use proper ARIA attributes when needed
- Test with screen readers
- Include skip links for navigation

## Performance Guidelines
- Minimize JavaScript - keep it lightweight
- Defer non-critical scripts
- Optimize images (use modern formats like WebP)
- Use lazy loading for images below the fold
- Keep CSS minimal
