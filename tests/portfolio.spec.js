import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function readyGlobe(page) {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Pause rotation', exact: true })).toBeEnabled();
  await page.waitForTimeout(500);
}

test('Earth rotation, pause, drag, keyboard, reset, and appearance layers', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await readyGlobe(page);
  const canvas = page.locator('canvas');
  const before = await canvas.screenshot();
  await page.waitForTimeout(600);
  expect((await canvas.screenshot()).equals(before)).toBe(false);
  await page.getByRole('button', { name: 'Pause rotation', exact: true }).click();
  await page.waitForTimeout(300);
  const paused = await canvas.screenshot();
  await page.waitForTimeout(600);
  expect((await canvas.screenshot()).equals(paused)).toBe(true);
  await canvas.focus();
  await page.keyboard.press('ArrowRight');
  expect((await canvas.screenshot()).equals(paused)).toBe(false);
  const rect = await canvas.boundingBox();
  const beforeDrag = await canvas.screenshot();
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
  await page.mouse.down();
  await page.mouse.move(rect.x + rect.width * 0.7, rect.y + rect.height / 2, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(800);
  expect((await canvas.screenshot()).equals(beforeDrag)).toBe(false);
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  for (const name of ['Night', 'Clouds', 'True colour']) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.getByRole('button', { name, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
  await page.getByRole('button', { name: 'Countries', exact: true }).click();
  await expect(page.getByLabel('Explore a country')).toBeEnabled();
  await page.getByLabel('Explore a country').selectOption({ label: 'Ghana' });
  await expect(page.locator('.globe-status')).toContainText('Ghana');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(page.getByLabel('Explore a country')).toHaveValue('');
  expect(errors).toEqual([]);
});

test('responsive layouts, saved themes, navigation, filters, and image dialogs', async ({ page }) => {
  await readyGlobe(page);
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole('switch', { name: 'Dark theme' }).click();
  await page.reload();
  await expect(page.getByRole('switch', { name: 'Dark theme' })).toHaveAttribute('aria-checked', 'false');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.locator('#main')).toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('navigation', { name: 'Site menu' }).getByRole('link', { name: /Projects/ }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button', { name: /Geospatial/ }).click();
  await expect(page).toHaveURL(/focus=geospatial/);
  await expect(page.locator('article')).toHaveCount(2);
  await page.getByRole('button', { name: /Enlarge figure/ }).first().click();
  await expect(page.locator('dialog[open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole('link', { name: 'Back to top', exact: true }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(100);
});

test('WCAG automated checks on both routes, both themes, and mobile menu', async ({ page }) => {
  for (const path of ['/', '/projects']) {
    await page.goto(path);
    await page.waitForTimeout(800);
    for (const theme of ['dark', 'light']) {
      if (theme === 'light') await page.getByRole('switch', { name: 'Dark theme' }).click();
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(result.violations, `${path} ${theme}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`).toEqual([]);
    }
    await page.getByRole('switch', { name: 'Dark theme' }).click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('reduced motion stays still, accepts keyboard input, and responds to preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.globe-canvas')).toHaveClass(/is-ready/);
  await page.waitForTimeout(1000);
  await expect(page.getByRole('button', { name: 'Reduced motion' })).toBeDisabled();
  const canvas = page.locator('canvas');
  const before = await canvas.screenshot();
  await page.waitForTimeout(700);
  expect((await canvas.screenshot()).equals(before)).toBe(true);
  await canvas.focus();
  await page.keyboard.press('ArrowLeft');
  expect((await canvas.screenshot()).equals(before)).toBe(false);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.getByRole('button', { name: 'Pause rotation', exact: true })).toBeEnabled();
});

test('WebGL and texture failures leave the portfolio usable', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.includes('webgl') ? null : getContext.call(this, type, ...args);
    };
  });
  await page.goto('/');
  await expect(page.getByText('Interactive Earth is unavailable. You can still explore all my work below.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore projects', exact: false }).first()).toBeVisible();
  await expect(page.locator('#contact')).toContainText('dogbeblessingkwame@gmail.com');
});

test('failed textures, country data retry, and context loss have honest fallbacks', async ({ page }) => {
  await page.route('**/earth-blue-marble.webp', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByText('Interactive Earth is unavailable. You can still explore all my work below.')).toBeVisible();
  await page.unroute('**/earth-blue-marble.webp');
  await page.route('**/countries.geojson', (route) => route.fulfill({ status: 503, body: 'Unavailable' }));
  await readyGlobe(page);
  await page.getByRole('button', { name: 'Countries', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Retry countries' })).toBeVisible();
  await page.unroute('**/countries.geojson');
  await page.getByRole('button', { name: 'Retry countries' }).click();
  await expect(page.getByLabel('Explore a country')).toBeEnabled();
  await page.locator('canvas').evaluate((canvas) => canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await expect(page.getByText('Interactive Earth is unavailable. You can still explore all my work below.')).toBeVisible();
});

test('WebGL stops drawing offscreen and disposes on route changes', async ({ page }) => {
  await page.addInitScript(() => {
    window.drawCount = 0;
    const draw = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function (...args) {
      window.drawCount += 1;
      return draw.apply(this, args);
    };
  });
  await readyGlobe(page);
  const count = await page.evaluate(() => window.drawCount);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.drawCount)).toBeGreaterThan(count);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  const hiddenCount = await page.evaluate(() => window.drawCount);
  await page.waitForTimeout(700);
  expect(await page.evaluate(() => window.drawCount)).toBe(hiddenCount);
  const cdp = await page.context().newCDPSession(page);
  for (let i = 0; i < 3; i += 1) {
    await page.locator('footer').getByRole('link', { name: /All projects/i }).click();
    await expect(page.locator('canvas')).toHaveCount(0);
    await page.waitForTimeout(150);
    await cdp.send('HeapProfiler.collectGarbage');
    const prototype = (await cdp.send('Runtime.evaluate', { expression: 'HTMLCanvasElement.prototype' })).result;
    const canvases = (await cdp.send('Runtime.queryObjects', { prototypeObjectId: prototype.objectId })).objects;
    const retained = (await cdp.send('Runtime.callFunctionOn', {
      objectId: canvases.objectId, functionDeclaration: 'function() { return this.length; }', returnByValue: true,
    })).result.value;
    await cdp.send('Runtime.releaseObject', { objectId: canvases.objectId });
    await cdp.send('Runtime.releaseObject', { objectId: prototype.objectId });
    expect(retained, 'Detached canvases must not be retained by document listeners').toBe(0);
    await page.locator('header').first().getByRole('link', { name: /home$/i }).click();
    await expect(page.locator('canvas')).toHaveCount(1);
    await page.locator('footer').scrollIntoViewIfNeeded();
  }
});

test('production HTML works without JavaScript and has route-specific metadata', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('h1')).toContainText('Blessing');
  await expect(page.locator('#work-title')).toBeVisible();
  await expect(page.locator('#contact')).toContainText('dogbeblessingkwame@gmail.com');
  await page.goto('http://127.0.0.1:4173/projects/');
  await expect(page).toHaveTitle('Projects | Blessing Edmund');
  await expect(page.locator('article')).toHaveCount(10);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://devedmund.vercel.app/projects');
  await context.close();
});
