import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

await mkdir('scripts/verify-out', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const mobile of process.argv.includes('--mobile') ? [true] : [false, true]) {
    const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, reducedMotion: mobile ? 'reduce' : 'no-preference' });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 120000 });
    const projects = page.locator('#projects');
    await projects.waitFor({ timeout: 120000 });
    assert.ok(await projects.getByRole('heading', { name: 'Marci Metzger', exact: true }).count());
    assert.ok(await projects.locator('a[href="https://github.com/Markishime/marcimetzger"]').count());
    assert.ok(await projects.locator('a[href="https://marcimetzger-kohl.vercel.app/"]').count());
    const image = await page.request.get('http://localhost:3001/media/marci-metzger.jpg');
    assert.equal(image.status(), 200);
    assert.match(await projects.textContent(), /13 built projects/);
    const lab = page.locator('#playground');
    await lab.evaluate((node) => node.scrollIntoView({ behavior: 'instant', block: 'start' }));
    console.log(JSON.stringify({ mobile, step: 'viewer in view' }));
    await lab.locator('canvas').waitFor({ timeout: 120000 });
    console.log(JSON.stringify({ mobile, step: 'canvas ready' }));
    await lab.getByRole('button', { name: 'Embedded board', exact: true }).click();
    assert.equal(await lab.getByRole('button', { name: 'Embedded board', exact: true }).getAttribute('aria-pressed'), 'true');
    await lab.getByRole('button', { name: 'Rotate right', exact: true }).click();
    await lab.getByRole('button', { name: 'Zoom in', exact: true }).click();
    await lab.getByRole('button', { name: 'Reset view', exact: true }).click();
    if (mobile) assert.ok(await lab.getByRole('button', { name: 'Auto spin', exact: true }).isDisabled());
    else {
      await lab.getByRole('button', { name: 'Auto spin', exact: true }).click();
      await lab.getByRole('button', { name: 'Pause spin', exact: true }).click();
    }
    await lab.getByRole('button', { name: 'Coastal pavilion', exact: true }).click();
    await page.waitForTimeout(1000);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: `scripts/verify-out/model-${mobile ? 'mobile' : 'desktop'}.png` });
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ mobile, passed: true, errors }));
    await page.close();
  }
} finally {
  await browser.close();
}
