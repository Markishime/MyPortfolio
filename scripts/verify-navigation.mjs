import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const baseUrl = process.env.AUDIT_URL || 'http://localhost:3001';
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
  assert.ok(await page.locator('#home video').evaluate((video) => video.paused));
  await page.getByRole('button', { name: 'Resume motion', exact: true }).click();
  await page.getByRole('link', { name: 'Explore my work', exact: true }).click();
  await page.waitForFunction(() => Math.abs(document.querySelector('#projects').getBoundingClientRect().top - 96) < 20, null, { timeout: 10000 });
  const filter = page.getByRole('toolbar', { name: 'Filter projects', exact: true });
  await filter.getByRole('button', { name: /^AI/ }).click();
  assert.equal(await page.locator('.project-grid').getByRole('heading', { name: 'Marci Metzger' }).count(), 0);
  await filter.getByRole('button', { name: /^All/ }).click();
  assert.equal(await page.locator('.project-grid').getByRole('heading', { name: 'Marci Metzger' }).count(), 1);
  const firstCard = page.locator('.project-grid article').first();
  await firstCard.getByRole('button', { name: 'Read more' }).click();
  assert.equal(await firstCard.getByRole('button', { name: 'Show less' }).getAttribute('aria-expanded'), 'true');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', { name: 'Open menu', exact: true }).getAttribute('aria-expanded'), 'false');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Contact', exact: true }).click();
  await page.waitForTimeout(600);
  assert.equal(await page.getByRole('button', { name: 'Open menu', exact: true }).getAttribute('aria-expanded'), 'false');
  assert.ok(await page.locator('#contact a[href^="mailto:"]').count());
  await page.close();

  for (const reducedMotion of ['reduce', 'no-preference']) {
  const fallback = await browser.newPage({ reducedMotion, viewport: { width: 375, height: 812 } });
  const fallbackErrors = [];
  fallback.on('pageerror', (error) => fallbackErrors.push(error.message));
  await fallback.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return String(type).startsWith('webgl') ? null : getContext.call(this, type, ...args);
    };
  });
  await fallback.goto(baseUrl, { waitUntil: 'networkidle' });
  await fallback.getByRole('heading', { name: /Ideas into/ }).waitFor({ state: 'visible', timeout: 10000 });
  assert.equal(await fallback.locator('#home canvas').count(), 0);
  if (reducedMotion === 'reduce') assert.ok(await fallback.getByRole('button', { name: 'Reduced motion', exact: true }).isDisabled());
  await fallback.locator('#playground').evaluate((node) => node.scrollIntoView({ behavior: 'instant' }));
  await fallback.getByText('Interactive 3D needs WebGL 2.', { exact: false }).waitFor({ state: 'visible' });
  assert.deepEqual(fallbackErrors, []);
  await fallback.close();
  }
  console.log('Passed: motion controls, project navigation and filters, expanded cards, mobile menu, contact links, reduced motion and WebGL fallback.');
} finally { await browser.close(); }
