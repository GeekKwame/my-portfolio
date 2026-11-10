# Portfolio professional-positioning refinement — 10 November 2026

Branch: `codex/portfolio-professional-positioning`

Commit: `feat: refine portfolio positioning and experience`

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

## Files

### Added

- `docs/AUDIT-2026-11-09.md`
- `docs/REFINEMENT-2026-11-10.md`
- `docs/screenshots/portfolio-desktop.png`
- `docs/screenshots/portfolio-mobile.png`
- `src/components/Services.jsx`
- `src/assets/images/companies/GRA.webp` (user-supplied asset integrated without replacement)

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
- `src/components/Home.jsx`
- `src/components/RecordEntry.jsx`
- `src/components/Skills.jsx`
- `src/components/StructuredData.jsx`
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
- `npx playwright test`: **11/11 passed** in the final run.
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
