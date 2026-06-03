# The Library — Simple Books Catalogue

A small vanilla-JavaScript web app to search books through the public
[Open Library API](https://openlibrary.org/), browse the results and save
favorites that persist in `localStorage`.

No frameworks, no runtime libraries, no jQuery — just **HTML, CSS and ES6+
modules**. [Vite](https://vitejs.dev/) is used only as a build tool (a dev
dependency); it does not ship any code into the app.

## Task

Implementation of the "Simple Books Catalogue" test assignment.

- **Task description / requirements:** see the original assignment document
  ([Task description](https://drive.google.com/file/d/1RBRcuH-_oAvtjem5Xs0c4NXZ8I38aYyH/view)).

## Features

- **Search** books by title, author or keyword (Open Library `search.json`).
- **Live search** with debounce, plus an explicit *Search* button / Enter.
- **Book cards** with cover (placeholder when missing), title, author(s) and
  first publish year.
- **Favorites**: add/remove with the heart button, persisted in `localStorage`
  and restored on reload; a dedicated sidebar to review and remove them.
- **Request states**: idle prompt, loading spinner, "Nothing found" and
  "Network error".
- **Filter by author** within the current results.
- **Theme switcher** (Light / Dark), also persisted.
- **Responsive** layout for desktop and mobile.

## How to run the app

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm.

### 1. Install dependencies

```bash
npm install
```

### 2. Development server (hot reload)

```bash
npm run dev
```

Vite prints a local URL (e.g. `http://localhost:5173`). The source files in
`src/` are served and reloaded live as you edit them.

### 3. Production build

```bash
npm run build
```

This produces an optimized, minified build in the `dist/` folder. Regardless of
how many files exist during development, the build output is exactly three
things:

```
dist/
├── index.html        # HTML entry
├── app.js            # single minified JS bundle (all CSS inlined into it)
└── assets/
    └── book.svg      # the favicon icon
```

CSS is folded into the JS bundle by a small custom Vite plugin
(see [`vite.config.js`](vite.config.js)), so no separate stylesheet file is
emitted.

### 4. Preview the production build

```bash
npm run preview
```

Serves the contents of `dist/` over HTTP so you can verify the build exactly as
a reviewer would see it. (Opening `dist/index.html` directly from the file
system is blocked by the browser's ES-module / CORS policy — it must be served
over HTTP.)

## Project structure

Each folder below notes the **type of files it stores**.

```
TheLibrary/
├── index.html                # HTML entry point; mounts the app into #app
├── package.json              # Project metadata, npm scripts, the Vite dev dependency
├── package-lock.json         # Locked dependency tree for reproducible installs
├── vite.config.js            # Build config (single JS file + CSS inlining)
├── .gitignore                # Ignored files (node_modules, dist, OS cruft, etc.)
├── README.md                 # This document
└── src/                      # Application source — all dev-time code lives here
    ├── main.js               # Entry point: holds state, renders, wires events
    ├── constants.js          # App constants: API endpoints, storage keys, tunables
    │
    ├── api/                  # Network layer — JS modules; the only place that calls fetch
    │   └── openLibrary.js    # Open Library client + book normalization
    │
    ├── components/           # View layer — JS modules returning HTML strings (no DOM libs)
    │   ├── Header.js
    │   ├── ThemeToggle.js
    │   ├── SearchBar.js
    │   ├── BookCard.js
    │   ├── BookList.js       # Results grid + view states + author filter
    │   ├── FavoritesPanel.js
    │   ├── Pager.js          # Page navigation (centered under the catalogue)
    │   ├── Footer.js
    │   └── icons.js          # Inline SVG icons as strings (use currentColor)
    │
    ├── utils/                # Framework-agnostic helper JS modules
    │   ├── storage.js        # Safe localStorage wrappers
    │   ├── debounce.js       # debounce()
    │   └── escapeHtml.js     # Escape text before it goes into an HTML string
    │
    ├── styles/               # CSS files, split per concern + per component
    │   ├── index.css         # Imports fonts + all partials (defines load order)
    │   ├── variables.css     # Design tokens + theme definitions
    │   ├── base.css          # Reset, typography, shared primitives
    │   ├── layout.css        # Header / workspace / footer layout
    │   └── components/       # CSS files — one per UI component
    │       ├── theme-toggle.css
    │       ├── search.css
    │       ├── book-card.css
    │       ├── favorites.css
    │       └── status.css
    │
    └── assets/               # Static image assets (SVG icons shipped with the app)
        └── book.svg          # App / favicon icon
```