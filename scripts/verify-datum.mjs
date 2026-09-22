import { chromium } from "playwright-core";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const outDir = path.join(process.cwd(), "scripts", "verify-out");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: "msedge" });

async function enter(page) {
  await page.goto("http://localhost:3001", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(800);
  const skip = page.locator(".void-skip");
  if (await skip.count()) {
    await skip.first().click({ force: true });
    await page.waitForTimeout(2200);
  }
}

async function run(name, size) {
  const page = await browser.newPage({ viewport: size });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));

  await enter(page);
  await page.waitForSelector("#projects", { timeout: 30000 });
  await page.evaluate(() =>
    document.querySelector("#projects")?.scrollIntoView({ block: "start" })
  );
  await page.waitForTimeout(900);

  const titles = await page.locator("#projects h3").allInnerTexts();
  const datumCard = page
    .locator("#projects article")
    .filter({ hasText: "DATUM Estimating" });
  const datumCount = await datumCard.count();

  let github = null;
  let live = null;
  let stack = [];
  if (datumCount) {
    github = await datumCard.locator("a", { hasText: "GitHub" }).getAttribute("href");
    live = await datumCard.locator("a", { hasText: "Live" }).getAttribute("href");
    stack = await datumCard.locator("button").allInnerTexts();
  }

  await page.screenshot({
    path: path.join(outDir, `${name}-datum-projects.png`),
  });

  const webFilter = page.locator("#projects button").filter({ hasText: /^Web/ });
  if (await webFilter.count()) {
    await webFilter.first().click();
    await page.waitForTimeout(500);
  }
  const webTitles = await page.locator("#projects h3").allInnerTexts();

  const datumHeading = page.locator("#projects h3", { hasText: "DATUM Estimating" });
  if (await datumHeading.count()) {
    await datumHeading.last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
  }
  await page.screenshot({
    path: path.join(outDir, `${name}-datum-card.png`),
  });

  const featureText = (await page.locator(".project-feature-panel").count())
    ? await page.locator(".project-feature-panel").innerText()
    : "";

  const gsapFilter = page.locator("#projects button").filter({ hasText: /^GSAP/ });
  let gsapTitles = [];
  if (await gsapFilter.count()) {
    await gsapFilter.first().click();
    await page.waitForTimeout(400);
    gsapTitles = await page.locator("#projects h3").allInnerTexts();
  }

  const readMore = datumCard.locator("button", { hasText: /Read more/i });
  let expanded = "";
  if (await readMore.count()) {
    await readMore.first().click();
    await page.waitForTimeout(300);
    expanded = await datumCard.locator("p").first().innerText();
  }
  await page.screenshot({
    path: path.join(outDir, `${name}-datum-expanded.png`),
  });

  const next = page.locator(".projects-depth-stage button, .depth-carousel button").last();
  let featured = "";
  for (let i = 0; i < 14; i += 1) {
    featured = (await page.locator(".project-feature-panel").count())
      ? await page.locator(".project-feature-panel h3").innerText()
      : "";
    if (featured.includes("DATUM")) break;
    const right = page.locator('button[aria-label*="next" i], button[aria-label*="Next" i]');
    if (await right.count()) {
      await right.first().click();
    } else if (await next.count()) {
      await next.click();
    }
    await page.waitForTimeout(350);
  }
  await page.screenshot({
    path: path.join(outDir, `${name}-datum-feature.png`),
  });

  await page.evaluate(() =>
    document.querySelector("#skills")?.scrollIntoView({ block: "start" })
  );
  await page.waitForTimeout(400);
  const frontendTab = page.getByRole("button", { name: /Frontend/i });
  let skills = [];
  if (await frontendTab.count()) {
    await frontendTab.first().click();
    await page.waitForTimeout(300);
    skills = await page.locator("#skills").innerText();
  }

  await page.close();
  return {
    name,
    titles,
    webTitles,
    gsapTitles,
    datumCount,
    github,
    live,
    stack,
    expanded: expanded.slice(0, 180),
    featureHasDatum: featured.includes("DATUM"),
    featuredTitle: featured,
    skillsHasGsap: typeof skills === "string" && skills.includes("GSAP"),
    skillsHasThree: typeof skills === "string" && skills.includes("Three.js"),
    errors,
  };
}

const desktop = await run("desk", { width: 1440, height: 900 });
const mobile = await run("mob", { width: 390, height: 844 });
console.log(JSON.stringify({ desktop, mobile }, null, 2));
await browser.close();
