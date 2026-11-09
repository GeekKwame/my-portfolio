// Rebuild public/resume.pdf from resume/resume.html.
// Requires the Playwright Chromium already installed for this repo.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(root, 'resume', 'resume.html');
const pdfPath = path.join(root, 'public', 'resume.pdf');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: false,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: `
    <div style="width:100%; padding:0 13mm; font-family: Inter, 'Noto Sans', sans-serif; font-size:8px; color:#5c5c5c; display:flex; justify-content:space-between;">
      <span>Blessing Edmund Kwame Dogbe · Cloud &amp; Backend Engineer</span>
      <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
    </div>`,
  margin: { top: '12mm', right: '13mm', bottom: '14mm', left: '13mm' },
});
await browser.close();
console.log(pdfPath);
