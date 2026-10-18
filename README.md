# Blessing Edmund — Portfolio

Production portfolio site built with React, Vite, and Tailwind CSS. Includes an interactive Three.js globe hero, project case studies, experience, skills, and contact.

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
│   ├── components/         # UI sections and shared components
│   ├── config/constants.js # site copy, links, navigation
│   ├── context/            # toast provider
│   ├── data/projects.js    # portfolio projects
│   ├── hooks/
│   ├── utils/analytics.js
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── vercel.json             # Vercel deploy + security headers
└── netlify.toml            # Netlify deploy
```

## Customize

1. Personal info and links: `src/config/constants.js`
2. Projects: `src/data/projects.js`
3. Experience: `src/components/Experience.jsx`
4. Resume PDF: `public/resume.pdf`
5. SEO / meta: `index.html`

## Deploy

**Vercel:** import the repo; build `npm run build`, output `dist` (see `vercel.json`).

**Netlify:** connect the repo; build and publish settings are in `netlify.toml`.

## Credits

- Globe rendering by [three-globe](https://github.com/vasturiano/three-globe) (MIT).
- Earth textures (`earth-blue-marble.jpg`, `earth-dark.jpg`, `earth-night.jpg`) and `clouds.png` in `public/` are from the [three-globe examples](https://github.com/vasturiano/three-globe/tree/master/example).
- `public/countries.geojson` is [Natural Earth](https://www.naturalearthdata.com/) 1:110m Admin 0 country boundaries (public domain), via the three-globe examples.

## License

Personal use. Built by Blessing Edmund.
