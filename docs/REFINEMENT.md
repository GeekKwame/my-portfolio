# Portfolio refinement — 26 October 2026

## Initial audit

Inspected the complete source tree, project data, maintenance guide, CI and hosting configuration, static assets, and the existing globe implementation before major edits. Ran the original site locally and opened the live deployment in Chromium. Checked the homepage, projects route and filter, mobile navigation, both theme implementations, and widths of 320, 390, 768, 1024 and 1920 pixels.

**Verified stack:** React 18, JavaScript/JSX, Vite 7, Tailwind 3, React Icons, vanilla Three.js and three-globe. A small History API router serves `/` and `/projects`; React Three Fiber and TypeScript are not used. The starting working tree was clean.

**Already strong:** substantive project case studies, source links and architecture diagrams; capability groups connected to evidence; consistent typography and spacing; semantic sections; theme persistence; résumé and contact actions; image enlargement; project filters; accurate Accra coordinates. Baseline lint and build passed, the initial automated accessibility scan returned no violations, and the sampled widths had no horizontal overflow.

**Opportunities and defects:**

- The globe had four valuable modes and country picking, but no automatic Earth rotation. Strong ambient light reduced depth; drag sensitivity was high and there was no keyboard rotation or WebGL fallback.
- Its render loop continued scheduling frames offscreen; the library's separate animation loops were not explicitly paused or destroyed. Texture changes reloaded images, error states were limited, and reduced motion was sampled only once.
- The hero name occupied three lines at a common desktop size while the Earth felt small. Repeated technology copy competed with the primary actions.
- Back-to-top targeted `#home`, which does not exist on `/projects`.
- The initial HTML exposed almost no meaningful content without JavaScript. Route metadata was changed only after client rendering. No sitemap or robots file existed.
- The Three.js vendor chunk was already substantial: **1,833.38 KB minified / 521.07 KB gzip**. Preserving the country explorer means retaining that library cost.

**Preserved:** the existing application architecture, name and initials, all project descriptions and evidence, employment and education, project slugs/routes, résumé, social and contact links, project filtering, figure dialogs, both themes, four globe modes, and geographic selection. No new accomplishments or metrics were added to portfolio content. The Web & AI integration skill group uses technologies already documented in YɛnCare, KORA, and Renal Route.

**Priorities followed:** Earth rendering and lifecycle first; hero and shared visual tokens second; navigation and progressive content third; browser, accessibility, failure-case and performance verification last. Random decorative night arcs were removed because they represented no verified connection and distracted from the Earth.

## Implementation

- **Visual system:** deep charcoal with a slight blue tint, mint accents, existing Inter and Cal Sans, controlled borders, stable pill buttons, consistent 44px globe controls. Dark is now the default; a saved light/dark choice still wins and syncs across tabs. Light mode remains fully supported.
- **Hero:** two-line name, concise engineering positioning and existing factual introduction; project, GitHub and contact actions; more balanced Earth scale; geographic caption and scroll link. Phone layout puts copy and actions before the Earth.
- **Projects:** retained the evidence and architecture content; refined featured-card surfaces and section introduction. Added filter-state synchronization for navigation and hash changes. All original slugs remain unchanged.
- **Skills / About / experience:** added a project-backed Web & AI integration group; shortened section headings; retained all career, education and project claims. Existing experience timelines and contact channels continue working.
- **Motion:** shorter entrance travel, no button-width shift on hover, finite portrait animation, and static reduced-motion styles. Section headings remain visible in static HTML.
- **Navigation:** back-to-top works on both routes; malformed encoded hash fragments no longer throw. Mobile menu, Escape behavior, inert background, theme persistence, and native image dialogs are retained.
- **SEO:** build-time React rendering produces complete homepage and projects HTML, route-specific title/description/canonical/social metadata, and existing Person JSON-LD. Added robots.txt and sitemap.xml, and updated Vercel/Netlify project rewrites. The client uses createRoot to replace generated HTML and activate interactions; this is prerendering, not hydration or a framework migration. The no-JavaScript version exposes content and links; filtering and 3D controls require JavaScript.

## Earth report

`HeroGlobe.jsx` now handles interface state; `globe/createGlobeScene.js` owns the scene and lifecycle. Existing country helpers are in `globe/countries.js`. `globe/earthMaterial.js` extends a standard Phong material.

- Retained the existing **2048 × 1024** surface, cloud and night textures and their attribution. No larger textures, postprocessing library, bloom chain, or animation framework was added.
- Directional sunlight and low ambient fill provide a terminator and depth. A shader blends emissive night imagery on the dark hemisphere. A conservative surface-colour mask adds subtle ocean highlights. This is an efficient visual approximation, not a physically exact atmosphere or current astronomical simulation.
- Clouds use the existing RGBA texture on a separate lit sphere; a restrained atmosphere and rim remain part of three-globe. Full-night and countries modes remain available.
- Earth rotation advances by elapsed time, about 0.035 radians per second. OrbitControls provides bounded polar angles, drag damping, and no zoom/pan clipping. Rotation resumes five seconds after interaction. Countries mode holds rotation for selection.
- Accra is at **5.6037° N, 0.187° W**. The marker, restrained pulse, label and screen-space coordinates all use this location. Country selection is possible by pointer or native select; country population values are estimates from the bundled Natural Earth data, not live statistics.
- Arrow keys, left/right buttons, reset and pause controls support keyboard use. Reduced-motion changes are handled live and disable autonomous movement. Horizontal touch dragging works while CSS preserves vertical page scrolling and pinch zoom.
- The import waits until the Earth is near the viewport. Device pixel ratio is capped at **1.75**, or **1.25** on coarse-pointer/low-core devices. Those devices also use lower geometry detail and at most 30 render frames per second.
- Rendering stops offscreen and in hidden documents. Paused/reduced-motion scenes render only when invalidated. Library animation loops are paused; the scene has one owned scheduler. Textures are cached per scene, clouds/countries load on demand, fetch errors offer retries, and late texture loads are disposed after teardown.
- Layer data uses per-scene copies of Accra; three-globe attaches scene references to records, so shared configuration objects must never be passed directly. Layout-effect cleanup runs before DOM detachment so OrbitControls can remove its document listeners correctly. Heap investigation identified and fixed both retention paths.
- Cleanup cancels the frame and loading timer, aborts country fetches, removes listeners and observers, disposes controls, library layers, geometry, materials, textures and renderer, and releases the WebGL context.
- A **33 KB transparent WebP** capture of the actual scene provides the loading and unsupported-WebGL fallback. Local boundaries prevent a globe chunk failure from replacing the portfolio with a global error page. Context loss and missing day textures show a static Earth and clear status.

## Significant files

| Area | Files |
| --- | --- |
| Hero and Earth UI | `src/components/Home.jsx`, `HeroGlobe.jsx`, `GlobeExperience.jsx` |
| Rendering and lifecycle | `src/components/globe/createGlobeScene.js`, `earthMaterial.js`, `countries.js`, `GlobeFallback.jsx` |
| Visual and content refinements | `src/index.css`, `FeaturedProjects.jsx`, `Skills.jsx`, `About.jsx` |
| Theme and navigation | `src/theme/*`, `public/theme-init.js`, `ScrollToTop.jsx`, `NavBar.jsx`, `src/routing/navigation.js`, `src/pages/ProjectsPage.jsx` |
| Static rendering | `scripts/prerender.mjs`, `src/App.jsx`, `src/hooks/usePathname.js`, `useReveal.js`, `index.html` |
| Assets and hosting | `public/earth-fallback.webp`, `robots.txt`, `sitemap.xml`, `vercel.json`, `netlify.toml` |
| Verification | `playwright.config.js`, `tests/portfolio.spec.js`, `.github/workflows/ci.yml`, `eslint.config.mjs`, `package.json`, `package-lock.json` |
| Documentation | `README.md`, `docs/PORTFOLIO.md`, this report |

## Verification

- `npm run lint`: passed, no errors or warnings.
- `npm run build`: passed, including both generated HTML pages (approximately 61 KB and 66 KB uncompressed).
- Browser validation covers **8 tests** against the production build. The full suite passed before the stricter heap regression was added; that regression exposed two retention paths, both now fixed. After the fixes, the seven other tests passed and the final focused run passed both affected globe tests (2/2). Covers actual rotation/pause/drag/keyboard behavior, every appearance mode, country selection, responsive widths, saved themes, mobile menu, filtering, dialogs, reduced-motion changes, WebGL/texture/context loss, country retry, offscreen rendering, repeated route cleanup, and content with JavaScript disabled.
- Automated axe scans: **zero violations** for the scanned WCAG A/AA rules on both routes in both themes and in the mobile menu. This does not establish complete WCAG 2.2 AA conformance; manual assistive-technology testing is still appropriate.
- Layouts: no horizontal overflow at **320, 390, 768, 1024, 1440, 1920px**. Visually inspected desktop, light theme, mobile introduction, mobile Earth, project cards, and all Earth appearances.
- Additional touch emulation: horizontal touch gestures changed the Earth view; a deviceScaleFactor 3 phone rendered at approximately **1.25 DPR**; no horizontal overflow.
- Rendering instrumentation: draw calls increased when visible and remained unchanged during an offscreen sample. No canvas remained on the Projects route; exactly one returned on the homepage across three navigation cycles. The strengthened Chrome heap regression additionally found **zero detached canvas instances after forced garbage collection**, across all three cycles.
- Heap investigation before the fixes showed growth from 7.74 MB to 12.17 MB across ten navigation cycles. Retaining paths identified OrbitControls document listeners and the shared Accra data record. The final regression checks surviving canvas instances, rather than claiming a universal heap-size or GPU-memory improvement.
- No page-level runtime errors occurred in the normal globe interaction test. Expected WebGL failure logging was exercised separately.
- Final production bundle sizes: application **85.03 KB / 30.00 KB gzip**, React **140.80 KB / 45.27 KB gzip**, Earth interface/scene **34.46 KB / 10.43 KB gzip**, and Three.js **1,821.53 KB / 517.33 KB gzip**. The large 3D chunk remains deferred, not eliminated. These build measurements do not establish faster user-perceived loading.
- Dependency audit initially reported 18 advisories. Compatible updates within the declared ranges resolved them; `npm audit` reports **zero vulnerabilities**. Vite is locked to 7.3.7 and PostCSS to 8.5.31; Three.js and three-globe remain unchanged. Browser testing dependencies are development-only. Axe is constrained to the 4.11 patch line to retain Node 20 compatibility.
- The build still reports its existing large-chunk warning and this Node version's CommonJS-to-ESM configuration warning. Neither prevents the build. No major framework/dependency migration was performed.

### External links

Checked the configured project/profile URLs with HTTP GET requests. All **13 project repositories**, the GitHub profile, portfolio and YɛnCare demo returned 200. KORA returned **503 twice**, with Render indicating suspension; its existing URL is retained because this is an external hosting issue. LinkedIn returned **999**, which prevents automated verification and does not establish that the profile is broken. Résumé, project PDF and static assets remain local.

Project facts were cross-checked against the existing data and public repositories, including [File Service](https://github.com/GeekKwame/file-service-server), [Event-Connect](https://github.com/GeekKwame/event-registration-system-sam), [Ghana Cocoa Belt](https://github.com/GeekKwame/ghana-cocoa-belt-qgis) and [YɛnCare](https://github.com/GeekKwame/yencare-platform). Existing numerical claims were preserved rather than refreshed without a full repository audit.

## Remaining recommendations

- Restore the suspended KORA service, or remove its demo link if it is intentionally retired.
- Validate on physical iOS/Android devices and Safari/Firefox; current automation uses Chromium and software WebGL. Perform manual screen-reader testing.
- Measure Lighthouse and field Core Web Vitals on the deployed, approved build. No Lighthouse score, FPS improvement or Core Web Vitals improvement is claimed here.
- Further bundle reduction would require evaluating a narrower globe implementation or custom country geometry. That is a separate tradeoff, not a silent replacement of working features.
- Run a longer GPU-memory soak test on real hardware. Short browser heap samples and canvas-count checks do not prove leak freedom.

No commit, push, or production deployment was performed.
