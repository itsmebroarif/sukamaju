# Implementation Tasks

- [x] Install dependencies and configure Tailwind CSS + PostCSS
- [x] Set up `public/index.html` (Google Fonts and metadata)
- [x] Create `games.json` database and `locales.js` dictionary
- [x] Create Zustand state stores in `src/lib/store.js`
- [x] Build reusable UI components with a clean retro style (`RetroButton.js`, `RetroInput.js`, `RetroCard.js`)
- [x] Create layout components: `Navbar.js`, `Footer.js`, `CartSidebar.js`
- [x] Create page components:
  - [x] Hero Section (`Hero.js`)
  - [x] Featured Games (`FeaturedGames.js`)
  - [x] Services Showcase (`Services.js`)
  - [x] About Page & Stats (`About.js`)
  - [x] Game Store (`GameStore.js`)
  - [x] Contact Form (`Contact.js`)
- [x] Implement Multi-Step Request Wizards & SweetAlert2 WhatsApp Flow (`RequestWizard.js`)
- [x] Integrate components in `App.js` with hash-based routing & page transition animations
- [x] Configure manifest.json & PWA setup
- [x] Verify build and responsive mobile-first views

## New Requested Features
- [x] Create 8-bit sound effects engine using Web Audio API (`src/lib/sfx.js`)
- [x] Implement hover, scroll, success, and fail sound triggers on buttons and inputs
- [x] Build Fetch API module (`src/lib/api.js`) for Google Sheets integration
- [x] Modify `Navbar.js` to change the CTA from "Request Game" to "Open Collab"
- [x] Update `RequestWizard.js` to serve as the Collab Wizard (Name, Email, Phone, Idea)
- [x] Add the Game Engine showcase section
- [x] Add the FAQ accordion section
- [x] Validate warning-free production build

## Mobile Layout Optimization (Bottom-Only Navigation)
- [x] Refactor `Navbar.js` to hide top navbar on mobile and add floating settings widget
- [x] Redesign bottom navigation bar with Play Store style active pill indicators
- [x] Add bottom padding to `Footer.js` to prevent fixed bottom bar overlap
- [x] Add bottom padding to `<main>` in `App.js` to prevent page content overlap
- [x] Build and verify local dev environment and production build

## Game URL Redirects & Admin Edit Panel
- [x] Add playUrl field to games.json database entries
- [x] Refactor GameStore.js and FeaturedGames.js to open playUrl dynamically in a new tab (_blank)
- [x] Implement edit game fields and form state handler in Admin.js
- [x] Add Cancel Edit button and dynamic creator wizard title in Admin.js
- [x] Synchronize changes and push warning-free code to GitHub
