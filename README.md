# Blessing Edmund — Portfolio

Production portfolio site built with React, Vite, and Tailwind CSS: a homepage with an interactive Three.js globe, selected projects, skills, experience, and contact, plus a `/projects` page with every project. Dark mode is the default; the visitor’s saved light or dark preference takes priority. Both pages are prerendered to HTML at build time.

See [docs/PORTFOLIO.md](docs/PORTFOLIO.md) for how the site is structured, how the theme works, and how to add or update a project.

## Quick start

```bash
npm install
npm run dev
```

Dev server: [http://localhost:5173](http://localhost:5173)

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint
npx playwright install chromium
npm run test:e2e # build, then run browser and accessibility checks
```

Requires Node.js 20.19+ (see `.nvmrc` for 22).

## Tech stack

- **Vite** + **React 18**
- **Tailwind CSS**
- **three** / **three-globe** (hero)
- **react-icons**

## Project structure

```
├── public/                 # static assets (textures, icons, resume.pdf)
├── src/
│   ├── assets/images/      # profile, company logos, project images
│   ├── pages/              # Home, Projects, 404
│   ├── components/         # UI sections and shared components
│   ├── config/constants.js # site copy, links, navigation
│   ├── context/            # toast provider
│   ├── data/projects.js    # every project, tiered featured / additional / supporting
│   ├── routing/            # routes and client-side navigation
│   ├── theme/              # light/dark theme provider
│   ├── hooks/
│   ├── utils/analytics.js
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css           # theme colour tokens and shared styles
├── index.html
├── vite.config.js
├── vercel.json             # Vercel deploy, /projects rewrite, security headers
├── netlify.toml            # Netlify deploy
└── docs/PORTFOLIO.md       # maintenance guide
```

## Customize

1. Personal info and links: `src/config/constants.js`
2. Projects: `src/data/projects.js` (see [docs/PORTFOLIO.md](docs/PORTFOLIO.md#projects))
3. Experience: `src/components/Experience.jsx`
4. Resume PDF: `public/resume.pdf`
5. SEO / meta: `index.html`

## Deploy

**Vercel:** import the repo; build `npm run build`, output `dist` (see `vercel.json`).

**Netlify:** connect the repo; build and publish settings are in `netlify.toml`.

## Refinement report

See [docs/REFINEMENT.md](docs/REFINEMENT.md) for the initial audit, Earth rendering and lifecycle details, verification results, and remaining limitations.

## Credits

- Ghana Cocoa Belt map preview and PDF: [Ghana Cocoa Belt QGIS project](https://github.com/GeekKwame/ghana-cocoa-belt-qgis), by Blessing Edmund Kwame Dogbe. Farm plots are synthetic. Administrative boundaries: OCHA / HDX (CC BY-IGO); roads and places: © OpenStreetMap contributors (ODbL 1.0); tree-cover loss: Hansen/UMD/Google/USGS/NASA (CC BY 4.0). See the project's [third-party notices](https://github.com/GeekKwame/ghana-cocoa-belt-qgis/blob/main/THIRD_PARTY_NOTICES.md) for licence links and attribution.

- The static Earth fallback is a capture of this portfolio’s WebGL scene, encoded as a 33 KB WebP. It uses the same credited Earth texture as the interactive view.
- Globe rendering by [three-globe](https://github.com/vasturiano/three-globe) (MIT).
- Earth textures (`earth-blue-marble.webp`, `earth-dark.jpg`, `earth-night.webp`) and `clouds.webp` in `public/` are from the [three-globe examples](https://github.com/vasturiano/three-globe/tree/master/example). The day, night, and cloud textures are resized to 2048×1024 and converted to WebP.
- `public/countries.geojson` is [Natural Earth](https://www.naturalearthdata.com/) 1:110m Admin 0 country boundaries (public domain), via the three-globe examples.

## License

Personal use. Built by Blessing Edmund.
