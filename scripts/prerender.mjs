import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

// Reuse the real React pages and their data. No second copy of project content.
// Client rendering progressively replaces this HTML with the interactive app.
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const { SEO, SITE_URL, PERSONAL_INFO } = await server.ssrLoadModule('/src/config/constants.js');
  const template = await readFile('dist/index.html', 'utf8');
  const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  for (const path of ['/', '/projects']) {
    const title = path === '/' ? SEO.title : `Projects | ${PERSONAL_INFO.name}`;
    const description = path === '/' ? SEO.description : `Engineering projects by ${PERSONAL_INFO.name}: Python APIs, AWS infrastructure, full-stack applications, and geospatial analysis, with architecture decisions and source code.`;
    const canonical = new URL(path, SITE_URL).href;
    let html = template.replace('<div id="root"></div>', `<div id="root">${renderToString(React.createElement(App, { initialPath: path }))}</div>`);
    html = html.replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
      .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description")\s+content=")[^"]*"/g, `$1${escape(description)}"`)
      .replace(/(<meta (?:property="og:title"|name="twitter:title")\s+content=")[^"]*"/g, `$1${escape(title)}"`)
      .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${canonical}"`)
      .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${canonical}"`);
    const directory = path === '/' ? 'dist' : 'dist/projects';
    await mkdir(directory, { recursive: true });
    await writeFile(`${directory}/index.html`, html);
    console.log(`Prerendered ${path}: ${Buffer.byteLength(html)} bytes of HTML`);
  }
} finally {
  await server.close();
}
