import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "scripts", "verify-out");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function run(name, size) {
  const page = await browser.newPage({ viewport: size });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#projects");
  await page.evaluate(() => document.querySelector("#projects")?.scrollIntoView());
  await page.waitForTimeout(600);

  const titles = await page.locator("#projects h3").allInnerTexts();
  const motionBtn = await page.getByRole("button", { name: /motion|still/i }).count();
  const stills = await page.locator("[data-still]").count();
  const videos = await page.locator("#projects video").count();
  const workHeight = await page.$eval("#projects", (el) => el.getBoundingClientRect().height);
  const heroHeight = await page.$eval("#home", (el) => el.getBoundingClientRect().height);

  await page.screenshot({ path: path.join(outDir, `${name}-projects-top.png`) });

  const last = page.locator("#projects h3").last();
  await last.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, `${name}-projects-end.png`) });

  await page.evaluate(() => document.querySelector("#contact")?.scrollIntoView());
  await page.waitForTimeout(400);
  const contactVisible = await page.locator("#contact h2").isVisible();
  await page.screenshot({ path: path.join(outDir, `${name}-contact.png`) });

  await page.close();
  return { name, titles, motionBtn, stills, videos, workHeight, heroHeight, contactVisible, errors };
}

const desktop = await run("desk", { width: 1440, height: 900 });
const mobile = await run("mob", { width: 390, height: 844 });
console.log(JSON.stringify({ desktop, mobile }, null, 2));
await browser.close();
