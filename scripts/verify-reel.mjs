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

const required = [
  "Kinestra",
  "EcoLock",
  "LockMate",
  "Orbit",
  "CropDrive",
  "Simplabots",
  "Team Builder",
  "MasbateToday",
  "Fields",
  "Agents",
  "Crews",
  "Coasts",
];

async function snapshot(name, size) {
  const page = await browser.newPage({ viewport: size });
  const errors = collect(page);
  await page.addInitScript(() => sessionStorage.setItem("mlc-ready", "1"));

  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("#home h1", { timeout: 30000 });
  await page.waitForTimeout(500);

  await page.evaluate(() => document.querySelector("#showreel")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(800);

  const bodyText = await page.locator("#showreel").innerText();
  const hasCebu = /Built in Cebu/i.test(bodyText);
  const hasShipped = /Shipped as systems/i.test(bodyText);
  const hasPictureLine = /Hardware, software, and AI treated as one picture/i.test(bodyText);
  const missing = required.filter((label) => !new RegExp(label, "i").test(bodyText));
  const liveHref = await page.locator("#showreel a[href]").count();
  const aria = await page.locator("#showreel").getAttribute("aria-label");

  await page.screenshot({ path: path.join(outDir, `${name}-reel-intro.png`) });

  const markers = [1.05, 2.1, 3.2, 4.4, 5.6];
  for (const [i, factor] of markers.entries()) {
    await page.evaluate((mult) => {
      const section = document.querySelector("#showreel");
      if (!section) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + window.innerHeight * mult);
    }, factor);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outDir, `${name}-reel-p${i + 1}.png`) });
  }

  await page.evaluate(() => document.querySelector("#projects")?.scrollIntoView());
  await page.waitForTimeout(450);
  const projectsVisible = await page.locator("#projects").count();
  await page.screenshot({ path: path.join(outDir, `${name}-reel-projects.png`) });

  await page.close();
  return {
    name,
    hasCebu,
    hasShipped,
    hasPictureLine,
    missing,
    liveHref,
    aria,
    projectsVisible,
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
    row.hasCebu ||
    row.hasShipped ||
    row.hasPictureLine ||
    row.missing.length ||
    row.liveHref < 6 ||
    row.errors.length
);
process.exit(failed.length ? 1 : 0);
