# AGENTS.md - OpenCode Guidelines for beaniwa.com

This document provides guidelines for OpenCode and other agentic tools operating in this repository.

## Color Palette

- **Orange**: `#fa6e02`
- **Black**: `#111111`


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
- Ask to deploy always
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

### HTML & Accessibility Guidelines (A11y)
- **Mandatory ARIA & Identification**: When adding NEW elements, you MUST always include:
  - `aria-label`: For descriptive text on interactive elements (especially those without visible text).
  - `title`: To provide additional contextual information on hover.
  - `aria-labelledby`: When a visible label or heading exists to describe the element.
  - `role`: To define the element's purpose if it's not natively semantic.
- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- Include `alt` attributes to all images (descriptive for content, empty for decorative).
- Ensure all interactive elements are keyboard accessible and have visible focus states.
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

### Commit Messages
Format: `:emoji: TYPE: description`

Common emojis:
- `:sparkles:` - New features
- `:bug:` - Bug fixes
- `:lipstick:` - UI/style changes
- `:memo:` - Documentation
- `:recycle:` - Refactoring
- `:globe_with_meridians:` - i18n changes

#### Extended Emoji List
- `:art:` - Improve structure / format
- `:zap:` - Improve performance
- `:fire:` - Remove code or files
- `:ambulance:` - Critical hotfix
- `:rocket:` - Deploy stuff
- `:tada:` - Begin a project
- `:white_check_mark:` - Add, update, or pass tests
- `:lock:` - Fix security or privacy issues
- `:closed_lock_with_key:` - Add or update secrets
- `:bookmark:` - Release / Version tags
- `:rotating_light:` - Fix compiler / linter warnings
- `:construction:` - Work in progress
- `:green_heart:` - Fix CI Build
- `:arrow_down:` - Downgrade dependencies
- `:arrow_up:` - Upgrade dependencies
- `:pushpin:` - Pin dependencies
- `:construction_worker:` - Add or update CI build system
- `:chart_with_upwards_trend:` - Add or update analytics
- `:heavy_plus_sign:` - Add a dependency
- `:heavy_minus_sign:` - Remove a dependency
- `:wrench:` - Add or update configuration files
- `:hammer:` - Add or update development scripts
- `:pencil2:` - Fix typos
- `:rewind:` - Revert changes
- `:twisted_rightwards_arrows:` - Merge branches
- `:package:` - Add or update compiled files
- `:alien:` - Update code due to external API changes
- `:truck:` - Move or rename resources
- `:page_facing_up:` - Add or update license
- `:boom:` - Introduce breaking changes
- `:bento:` - Add or update assets
- `:wheelchair:` - Improve accessibility
- `:bulb:` - Add or update comments
- `:beers:` - Write code drunkenly
- `:speech_balloon:` - Add or update text and literals
- `:card_file_box:` - Database changes
- `:loud_sound:` - Add or update logs
- `:mute:` - Remove logs
- `:children_crossing:` - Improve user experience
- `:building_construction:` - Architectural changes
- `:iphone:` - Responsive design
- `:clown_face:` - Mock things
- `:egg:` - Add or update an easter egg
- `:see_no_evil:` - Add or update .gitignore
- `:camera_flash:` - Add or update snapshots
- `:alembic:` - Perform experiments
- `:mag:` - Improve SEO
- `:label:` - Add or update types
- `:seedling:` - Add or update seed files
- `:triangular_flag_on_post:` - Feature flags
- `:goal_net:` - Catch errors
- `:dizzy:` - Add or update animations
- `:wastebasket:` - Deprecate code
- `:passport_control:` - Authorization/permissions
- `:adhesive_bandage:` - Simple non-critical fix
- `:monocle_face:` - Data exploration
- `:coffin:` - Remove dead code
- `:test_tube:` - Add a failing test
- `:necktie:` - Business logic
- `:stethoscope:` - Healthcheck
- `:bricks:` - Infrastructure changes
- `:technologist:` - Developer experience
- `:money_with_wings:` - Money related infrastructure
- `:thread:` - Multithreading/concurrency
- `:safety_vest:` - Validation
- `:airplane:` - Offline support
- `:t-rex:` - Backwards compatibility

### Workflow Rules
- **All changes only to main branch**
- Use imperative mood (e.g., "Add feature" not "Added feature")
- Keep subject line under 72 characters
- Start with a capital letter (or use ADD for new features)
- Do not end with a period

### Examples
```
:sparkles: ADD: Password reset functionality

Fixes #123
```

```
:bug: RESOLVE: Mobile navigation overflow

The navigation menu was overflowing on mobile devices.
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
