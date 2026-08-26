import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "scripts", "verify-out");
await mkdir(outDir, { recursive: true });

const executablePath =
  process.env.PLAYWRIGHT_CHROME ||
  "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe";

const browser = await chromium.launch({
  headless: true,
  executablePath,
});

function collect(page) {
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  return errors;
}

async function snapshot(name, size) {
  const page = await browser.newPage({ viewport: size });
  const errors = collect(page);
  await page.addInitScript(() => sessionStorage.setItem("mlc-ready", "1"));

  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("#home h1", { timeout: 30000 });
  await page.waitForTimeout(600);

  const hero = await page.locator("h1").first().innerText();
  await page.screenshot({ path: path.join(outDir, `${name}-reel-hero.png`) });

  await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
  await page.waitForTimeout(350);
  const aboutVisible = await page.locator("#about").count();
  await page.screenshot({ path: path.join(outDir, `${name}-reel-about.png`) });

  await page.evaluate(() => document.querySelector("#showreel")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(700);

  const bodyText = await page.locator("#showreel").innerText();
  const hasKicker = /Showreel|Scroll to travel/i.test(bodyText);
  const hasCebu = /Built in Cebu/i.test(bodyText);
  const hasShipped = /Shipped as systems/i.test(bodyText);
  const hasPictureLine = /Hardware, software, and AI treated as one picture/i.test(bodyText);
  const hasLocks = /locks/i.test(bodyText);
  const hasLifeOs = /life OS/i.test(bodyText);
  const hasFields = /fields/i.test(bodyText);
  const hasCoasts = /coasts/i.test(bodyText);
  const aria = await page.locator("#showreel").getAttribute("aria-label");

  await page.screenshot({ path: path.join(outDir, `${name}-reel-intro.png`) });

  await page.evaluate(() => {
    const section = document.querySelector("#showreel");
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + window.innerHeight * 1.35);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, `${name}-reel-mid.png`) });

  await page.evaluate(() => {
    const section = document.querySelector("#showreel");
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + window.innerHeight * 2.4);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, `${name}-reel-panel2.png`) });

  await page.evaluate(() => document.querySelector("#projects")?.scrollIntoView());
  await page.waitForTimeout(500);
  const projectsVisible = await page.locator("#projects").count();
  await page.screenshot({ path: path.join(outDir, `${name}-reel-projects.png`) });

  await page.close();
  return {
    name,
    hero,
    aboutVisible,
    projectsVisible,
    hasKicker,
    hasCebu,
    hasShipped,
    hasPictureLine,
    hasLocks,
    hasLifeOs,
    hasFields,
    hasCoasts,
    aria,
    errors,
  };
}

const results = [];
results.push(await snapshot("desk", { width: 1440, height: 900 }));
results.push(await snapshot("mob", { width: 390, height: 844 }));

await browser.close();
console.log(JSON.stringify(results, null, 2));

const failed = results.filter(
  (row) =>
    row.hasKicker ||
    !row.hasCebu ||
    !row.hasShipped ||
    !row.hasPictureLine ||
    !row.hasLocks ||
    !row.hasLifeOs ||
    !row.hasFields ||
    !row.hasCoasts ||
    row.errors.length
);
process.exit(failed.length ? 1 : 0);
