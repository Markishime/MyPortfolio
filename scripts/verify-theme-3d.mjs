import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "scripts", "verify-out");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const errors = [];

async function collect(page) {
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await collect(page);
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector("h1.hero-title", { timeout: 20000 });
await page.waitForTimeout(1600);

const heroText = await page.locator("h1.hero-title").innerText();
const primary = await page.getByText("Full Stack Developer").count();
const secondary = await page.getByText("Computer Engineer").count();
const iotSelected = await page.getByText("Selected discipline").count();
const iotRole = await page.getByText("IoT Engineer").count();

const webgl = await page.evaluate(() => document.documentElement.dataset.webgl);
const canvasCount = await page.locator("canvas").count();

const fullstackBtn = page.getByRole("button", { name: /Full Stack Developer/i }).first();
await fullstackBtn.click();
await page.waitForTimeout(650);
const accentBefore = await page.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue("--theme-accent").trim()
);
await page.screenshot({ path: path.join(outDir, "theme-hero-fullstack.png") });

const engineerBtn = page.getByRole("button", { name: /Computer Engineer/i }).first();
await engineerBtn.click();
await page.waitForTimeout(650);
const accentAfter = await page.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue("--theme-accent").trim()
);
const identity = await page.evaluate(() => document.documentElement.dataset.identity);

await page.screenshot({ path: path.join(outDir, "theme-hero-engineer.png") });

await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
await page.waitForTimeout(500);
const aboutCopy = await page.locator("#about").innerText();
await page.screenshot({ path: path.join(outDir, "theme-about.png") });

await page.evaluate(() => document.querySelector("#projects")?.scrollIntoView());
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "theme-projects.png") });

await page.evaluate(() => document.querySelector("#contact")?.scrollIntoView());
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outDir, "theme-contact.png") });

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
await collect(mobile);
await mobile.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 60000 });
await mobile.waitForSelector("h1.hero-title", { timeout: 20000 });
await mobile.waitForTimeout(1600);
await mobile.screenshot({ path: path.join(outDir, "theme-mobile-hero.png") });
await mobile.evaluate(() => document.querySelector("#about")?.scrollIntoView());
await mobile.waitForTimeout(400);
await mobile.screenshot({ path: path.join(outDir, "theme-mobile-about.png") });

const reduced = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await collect(reduced);
await reduced.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 60000 });
await reduced.waitForSelector("h1.hero-title", { timeout: 20000 });
await reduced.waitForTimeout(500);
const reducedWebgl = await reduced.evaluate(() => document.documentElement.dataset.webgl);
const reducedCanvas = await reduced.locator("canvas").count();
await reduced.screenshot({ path: path.join(outDir, "theme-reduced.png") });

console.log(JSON.stringify({
  heroText,
  primary,
  secondary,
  iotSelected,
  iotRole,
  accentBefore,
  accentAfter,
  identity,
  webgl,
  canvasCount,
  aboutHasFullStack: aboutCopy.includes("Full Stack Developer"),
  aboutHasComputerEngineer: aboutCopy.includes("Computer Engineer"),
  reducedWebgl,
  reducedCanvas,
  errors,
}, null, 2));

await browser.close();
if (iotSelected || iotRole || !primary || !secondary) process.exit(1);
if (accentBefore === accentAfter) process.exit(1);
