# Portfolio professional-positioning refinement — 10 November 2026

Branch: `codex/portfolio-professional-positioning`

Initial refinement commit: `310dafe feat: refine portfolio positioning and experience`

The pre-implementation audit is recorded in [`AUDIT-2026-11-09.md`](./AUDIT-2026-11-09.md).

## Implemented

- Replaced the narrow cloud/backend hero with the requested real-world-software headline and supporting copy.
- Added two immediately visible audience paths: a résumé action for hiring teams and a pre-addressed email action for prospective clients.
- Added five concise, evidence-backed service categories covering API engineering, cloud/DevOps, web applications, data/automation/GIS, and POS/IT/business technology.
- Consolidated professional experience into one coherent timeline. Preserved Afarinick, AmaliTech, One Health Global Technologies, M365Connect, KNUST, HubbleMind, and Lerato Consult.
- Added the Ghana Revenue Authority internship with the supplied title, location, dates, and responsibility areas. The existing `GRA.webp` is imported through the normal Vite asset pipeline and displayed with the shared employer-logo treatment and accessible alternative text.
- Updated YɛnCare evidence from the current default branch: 471 documented backend tests, 34 authored Playwright scenarios, and 70 configured browser-project executions. Retained the verified five-person attribution and 121-author-commit figure.
- Removed the uncommitted 82% File Service coverage claim while retaining the 12 verified test functions, 12 Terraform modules, CI matrix, and architecture evidence.
- Broadened the page title, description, keywords, Open Graph/Twitter copy, Person structured data, web manifest, project-route description, and social-preview image to match: “Software Engineer | Backend & Cloud | Web Applications | Data & GIS.”
- Preserved the established themes, section system, project case studies, responsive behavior, animations, navigation, static prerendering, and interactive Earth implementation.
- Added automated assertions for the hero actions, five services, GRA content and decoded production image, and no-JavaScript output.

## Final UI/UX and globe polish

- Integrated the user-supplied KNUST, HubbleMind, and Lerato Consult logos through the Vite asset pipeline and added decoded-image regression checks for each one.
- Widened the experience logo frame so horizontal wordmarks remain legible, while preserving the shared fallback treatment and showing colour by default on touch-only devices.
- Rebalanced the five service cards from a compressed single row into a 3+2 desktop composition with more readable line lengths and stronger visual hierarchy.
- Replaced the duplicate lower hero link with concise proof points, leaving one unambiguous path to the selected work.
- Restyled the globe appearance modes as a clear segmented control, strengthened the rotation/reset affordances, and added an explicit Home-key instruction linked to the canvas accessibility description.
- Clarified the globe caption and Accra home-base label without changing the existing rendering, lazy-loading, failure recovery, or reduced-motion behaviour.

## Humanized copy pass

- Replaced the compressed hero line with “I turn bold ideas into software people trust.” and loosened its type spacing for a calmer three-line desktop composition.
- Rewrote the supporting hero copy, calls to action, section introductions, service descriptions, experience summaries, about narrative, contact prompt, globe labels, and footer in a warmer first-person voice.
- Reworked every project summary and case-study narrative to explain the purpose and decisions in plain language while preserving the verified technical evidence and metrics.
- Updated page descriptions and social metadata to match the more natural voice without weakening the portfolio’s software engineering positioning.
- Removed double-hyphen commands and em-dash constructions from visitor-facing copy.

## Files

### Added

- `docs/AUDIT-2026-11-09.md`
- `docs/REFINEMENT-2026-11-10.md`
- `docs/screenshots/portfolio-desktop.png`
- `docs/screenshots/portfolio-mobile.png`
- `src/components/Services.jsx`
- `src/assets/images/companies/GRA.webp` (user-supplied asset integrated without replacement)
- `src/assets/images/companies/hubblemind.jpg` (user-supplied asset)
- `src/assets/images/companies/knust.jpg` (user-supplied asset)
- `src/assets/images/companies/lerato.jpg` (user-supplied asset)

### Modified

- `README.md`
- `docs/PORTFOLIO.md`
- `index.html`
- `public/manifest.json`
- `public/og-image.png`
- `scripts/prerender.mjs`
- `src/components/About.jsx`
- `src/components/Contact.jsx`
- `src/components/Experience.jsx`
- `src/components/HeroGlobe.jsx`
- `src/components/Home.jsx`
- `src/components/RecordEntry.jsx`
- `src/components/Skills.jsx`
- `src/components/StructuredData.jsx`
- `src/components/globe/createGlobeScene.js`
- `src/config/constants.js`
- `src/data/projects.js`
- `src/index.css`
- `src/pages/HomePage.jsx`
- `src/pages/ProjectsPage.jsx`
- `tests/portfolio.spec.js`

## Verification

- `npm run lint`: passed with no errors or warnings.
- `npm run build`: passed; `/` and `/projects` prerendered successfully.
- Production asset output includes the hashed GRA WebP (`GRA-BMnh2PQO.webp`, 7.33 KB in this build).
- `npx playwright test`: **11/11 passed** in the final copy run (3.4 minutes).
- Experience regression coverage confirms all eight employer images are present and that the GRA, KNUST, HubbleMind, and Lerato Consult assets decode successfully.
- Automated axe checks: no violations in the scanned WCAG A/AA rules on both routes, both themes, or the open mobile menu.
- Responsive automation: no horizontal overflow at 320, 390, 768, 1024, 1440, or 1920 px.
- Covered keyboard Earth controls, reduced motion, mobile navigation, project filters, dialogs, WebGL/texture/context failures, country-data retry, offscreen rendering, route cleanup, and no-JavaScript content and metadata.
- User-facing HTTP checks: portfolio home, projects route, social image, GitHub profile, all 13 repository links, YɛnCare demo, and KORA demo returned 200. LinkedIn returned 999 to the automated client, its bot-block response; this does not establish a broken profile.
- Local résumé, Ghana Cocoa Belt PDF, theme script, manifest, icons, Earth assets, and generated route HTML are present in `dist/` after the build.
- Type checking: not applicable; the project is JavaScript/JSX and defines no separate type-check command.

## Screenshots

- [`portfolio-desktop.png`](./screenshots/portfolio-desktop.png) — 1440 × 1000 production hero with the interactive Earth ready.
- [`portfolio-mobile.png`](./screenshots/portfolio-mobile.png) — 390 × 844 production hero with both primary actions visible.

## Remaining limitations and unverified items

- The deferred Three.js chunk remains about 1.82 MB minified / 517 KB gzip. It is lazy-loaded and covered by lifecycle tests, but eliminating that cost would require a separate globe implementation tradeoff.
- Node still emits the existing CommonJS-to-ESM experimental warning for Vite configuration. It does not fail the build.
- The linked `public/resume.pdf` is newer and broader than the tracked `resume/resume.html`, but still contains the previous résumé’s stale “468 backend tests” wording. The current HTML template also contains the old 468/37 and 82% claims. It was not used to overwrite the newer PDF because it is not the authoritative source for that PDF. Update both from the authoritative résumé source in a separate résumé pass.
- LinkedIn cannot be conclusively validated by an unauthenticated automated request because it returns 999.
- Physical-device, Safari/Firefox UI, manual screen-reader, and production Lighthouse/Core Web Vitals checks remain appropriate follow-ups. Browser automation here uses Chromium for this portfolio.
- No production deployment or push was performed; the current live site will remain unchanged until this branch is reviewed, merged, and deployed through the existing host workflow.
