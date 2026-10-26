# Portfolio maintenance guide

How the site is put together, how the theme works, and how to add or change a project.

## Structure

Two pages, prerendered at build time and enhanced by a small client-side router (no router dependency):

| Path | Component | Contents |
|---|---|---|
| `/` | `src/pages/HomePage.jsx` | Hero, selected projects, skills, experience, about, contact |
| `/projects` | `src/pages/ProjectsPage.jsx` | Every project: case studies, more projects, experiments |
| anything else | `src/pages/NotFoundPage.jsx` | 404 with links back |

```
src/
├── App.jsx                  # providers, navbar, page switch, footer
├── pages/                   # one file per route
├── components/              # sections and shared UI
│   ├── FeaturedProjects.jsx # homepage project cards
│   ├── ProjectThumb.jsx     # fixed-ratio image with a text fallback
│   ├── ProjectLinks.jsx     # live demo / source links
│   ├── Link.jsx             # internal link that routes without a reload
│   └── ThemeToggle.jsx      # light/dark switch
├── data/projects.js         # all project content
├── config/constants.js      # personal info, navigation, SEO copy
├── routing/navigation.js    # routes, navigate(), hash scrolling
├── theme/                   # theme provider and helpers
└── hooks/                   # usePathname, useTheme, useDocumentMeta, useReveal
public/theme-init.js         # applies the theme before first paint
```

### Adding a page

1. Add the path to `ROUTES` in `src/routing/navigation.js` and the component to `PAGES` in `src/App.jsx`.
2. Call `useDocumentMeta` in the page so it gets its own title, description, and canonical URL.
3. Add the route to `scripts/prerender.mjs` and point the host rewrite to its generated HTML file. `/projects` uses `dist/projects/index.html`; both Vercel and Netlify are configured for this.

Use `<Link to="/path">` for internal links. Links to homepage sections from other pages use `/#section-id`.

## Theme

- Colours are CSS variables in `src/index.css` (`:root` for light, `.dark` for dark), stored as space-separated RGB so Tailwind opacity modifiers work (`bg-ink/80`). Tailwind maps them in `tailwind.config.js`: `paper`, `ink`, `rule`, `accent`, `signal`. Use these names instead of raw colours so both themes stay consistent.
- `public/theme-init.js` runs in `<head>` before the page renders. It reads the saved choice from `localStorage` (`theme`), defaults to dark mode, and sets the `dark` class on `<html>`. It is an external file because the Content-Security-Policy in `vercel.json` blocks inline scripts.
- `src/theme/ThemeProvider.jsx` owns the theme in React. First visits use dark mode; after the visitor uses the switch, the saved choice wins. Other open tabs update through the `storage` event.
- While switching, the `theme-switching` class turns transitions off for one frame so every colour changes at once. Elements that should still animate (the switch knob) carry `data-theme-motion`.
- If you change the storage key or the background colours, update both `public/theme-init.js` and `src/theme/themeContext.js`.

## Projects

All project content lives in `src/data/projects.js`. Each project has a `tier`:

| Tier | Where it appears | Fields used |
|---|---|---|
| `featured` | Homepage card and full case study on `/projects` | everything below |
| `additional` | Card on `/projects` | `summary`, `approach`, `stack`, `links` |
| `supporting` | One-line entry on `/projects` | `summary`, `stack`, `links` |

Order within a tier is the order in the array. Keep three or four projects featured, each showing a different capability; the homepage grid is designed for that. With an odd number, the first card spans the full width.

### Adding or updating a project

1. Copy an existing entry of the same tier and give it a unique `slug`. The slug is its anchor on `/projects` (`/projects#slug`), so changing it breaks existing links, including the "Used in" links in `src/components/Skills.jsx`.
2. Set `focus` to one or more ids from `FOCUS_AREAS`; these drive the filter chips on `/projects`. A focus area with no projects hides its chip.
3. Write `summary` as one sentence on what it does and for whom. For featured projects also write `capability` (what it proves), `highlight` (one engineering fact), and `problem`, `approach`, `decision`.
4. Only state facts you can point to in the repository: test counts from the test files, resource counts from the Terraform, live URLs you have opened recently. Leave optional fields out rather than guessing.
5. Images go in `src/assets/images/portfolio/` as WebP, imported at the top of the file. Set `kind: 'diagram'` for architecture diagrams (shown on white, uncropped) or `'screenshot'` (cropped to the card). Give `width`, `height`, `alt`, and `caption`. Without an image, cards show a text panel instead.
6. Add `links.live` only while the demo is reachable. Remove it when a deployment is taken down.
7. For a static map, use `links.map` for a PDF instead of labelling it a live demo. Ghana Cocoa Belt uses `/ghana-cocoa-belt.pdf`, with a PNG preview imported from the published project. Refresh both assets together and preserve the source attribution in the caption and README credits.

## Checks before deploying

```bash
npm run lint
npm run build
npm run preview   # then check /, /projects, and /projects#<slug>
npx playwright install chromium
npm run test:e2e
```

Check both themes, a reload on `/projects`, and a phone-width viewport.

## Earth scene

`GlobeExperience.jsx` defers the heavy import until the scene is within 200px of the viewport and contains a local error boundary. `HeroGlobe.jsx` owns UI state. `globe/createGlobeScene.js` owns Three.js, asset loading, controls, visibility, and cleanup. `globe/earthMaterial.js` adds the day/night shading; `globe/countries.js` holds the existing country material and picking helpers.

Keep the frame loop in the scene owner. Do not add React state updates to it or resume three-globe's internal animation loops. Every new geometry, texture, listener, and timer needs corresponding cleanup. Country-mode rotation is intentionally held while people explore it. The sun direction is artistic, not a live solar simulation.

The fallback image is a transparent capture of the scene facing Accra. Update it if the initial camera or day texture changes. Keep its dimensions and the reserved globe layout stable during loading.

## Static HTML

`npm run build` runs Vite followed by `scripts/prerender.mjs`, which renders the actual React pages and project data to `/index.html` and `/projects/index.html`. The client uses `createRoot` to replace this markup and activate interactions; it does not hydrate. Keep state initializers safe when `window` is absent. Effects remain client-only. Route-specific titles, descriptions, canonical URLs, and JSON-LD are in the generated HTML. Rebuild whenever portfolio content changes.
