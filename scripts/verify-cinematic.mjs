import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "scripts", "verify-out");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function runViewport(name, size) {
  const page = await browser.newPage({ viewport: size });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("h1");
  await page.waitForTimeout(400);

  const overlay = await page.locator("nextjs-portal").count();
  const hero = await page.locator("h1").first().innerText();
  const two = await page.getByText("Two years", { exact: false }).count();
  const yearsBuilding = await page.getByText("Years building").count();
  const fourYears = await page.getByText("Years Experience").count();

  await page.screenshot({
    path: path.join(outDir, `${name}-hero.png`),
    fullPage: false,
  });

  await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(outDir, `${name}-about.png`),
    fullPage: false,
  });

  await page.evaluate(() => document.querySelector("#projects")?.scrollIntoView());
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(outDir, `${name}-work.png`),
    fullPage: false,
  });

  const reelCta = page.getByRole("link", { name: /enter the reel/i });
  if (await reelCta.count()) {
    await reelCta.click({ force: true });
    await page.waitForTimeout(400);
  }

  if (size.width < 800) {
    const toggle = page.getByRole("button", { name: /toggle menu/i });
    if (await toggle.count()) {
      await toggle.click({ force: true });
      await page.waitForTimeout(200);
      await page.getByRole("link", { name: "Contact" }).last().click({ force: true });
      await page.waitForTimeout(400);
    }
  } else {
    await page.evaluate(() => document.querySelector("#contact")?.scrollIntoView());
    await page.waitForTimeout(400);
  }

  await page.screenshot({
    path: path.join(outDir, `${name}-contact.png`),
    fullPage: false,
  });

  const motion = page.getByRole("button", { name: /animations/i });
  if (await motion.count()) {
    await motion.first().click({ force: true });
    const pressed = await motion.first().getAttribute("aria-pressed");
    errors.push(`motion-pressed:${pressed}`);
  }

  const sections = {
    about: await page.locator("#about").count(),
    projects: await page.locator("#projects").count(),
    skills: await page.locator("#skills").count(),
    certs: await page.locator("#certifications").count(),
    contact: await page.locator("#contact").count(),
  };

  await page.close();
  return { name, hero, two, yearsBuilding, fourYears, overlay, sections, errors };
}

const desktop = await runViewport("desktop", { width: 1440, height: 900 });
const mobile = await runViewport("mobile", { width: 390, height: 844 });

console.log(JSON.stringify({ desktop, mobile }, null, 2));
await browser.close();
