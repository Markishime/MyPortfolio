import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('scripts/verify-out', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const reports = [];
try {
  for (const [name, width, height, reducedMotion] of [
    ['desktop', 1440, 1000, 'no-preference'],
    ['phone', 375, 812, 'no-preference'],
    ['reduced', 390, 844, 'reduce'],
    ['tablet', 768, 1024, 'no-preference'],
    ['landscape', 844, 390, 'reduce'],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(process.env.AUDIT_URL || 'http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('#contact', { timeout: 120000 });
    await page.locator('#home canvas').waitFor({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `scripts/verify-out/hero-${name}.png` });
    const hero = await page.locator('#home').evaluate((node) => ({ width: node.scrollWidth, height: node.clientHeight }));
    const sections = [];
    for (const id of ['about', 'projects', 'playground', 'skills', 'certifications', 'contact']) {
      const section = page.locator(`#${id}`);
      await section.evaluate((node) => node.scrollIntoView({ behavior: 'instant', block: 'start' }));
      await page.waitForTimeout(650);
      sections.push(await section.evaluate((node) => ({ id: node.id, heading: node.querySelector('h2')?.textContent, opacity: node.querySelector('h2') && getComputedStyle(node.querySelector('h2')).opacity, overflow: document.documentElement.scrollWidth > innerWidth })));
    }
    const missingImages = await page.locator('img').evaluateAll((images) => images.filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute('src')));
    const invalidAnchors = await page.locator('a[href^="#"]').evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')).filter((href) => href !== '#' && !document.getElementById(href.slice(1))));
    reports.push({ name, hero, sections, missingImages, invalidAnchors, errors: [...new Set(errors)] });
    console.log(JSON.stringify(reports.at(-1)));
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile('scripts/verify-out/audit.json', JSON.stringify(reports, null, 2));
}
if (reports.some((r) => r.errors.length || r.missingImages.length || r.invalidAnchors.length || r.sections.some((s) => s.overflow || s.opacity === '0'))) process.exitCode = 1;
