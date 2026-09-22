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
  await page.waitForTimeout(700);

  const stackButtons = await page.locator("#projects [aria-label='Filter by stack'] button").allInnerTexts();
  const kinestra = page.locator("#projects article").filter({ hasText: "Kinestra" }).first();
  const kinestraStack = await kinestra.locator("button").allInnerTexts();
  const masbate = page.locator("#projects article").filter({ hasText: "Masbate Today" });
  const masbateStack = await masbate.locator("button").allInnerTexts();
  const datum = page.locator("#projects article").filter({ hasText: "DATUM Estimating" });
  const datumStack = await datum.locator("button").allInnerTexts();

  const shadcnFilter = page.locator("#projects button").filter({ hasText: /shadcn/i });
  let shadcnTitles = [];
  if (await shadcnFilter.count()) {
    await shadcnFilter.first().click();
    await page.waitForTimeout(400);
    shadcnTitles = await page.locator("#projects h3").allInnerTexts();
  }
  await page.screenshot({ path: path.join(outDir, `${name}-ui-projects.png`) });

  await page.evaluate(() =>
    document.querySelector("#skills")?.scrollIntoView({ block: "start" })
  );
  await page.waitForTimeout(600);
  const skillsText = await page.locator("#skills").innerText();
  await page.screenshot({ path: path.join(outDir, `${name}-ui-skills.png`) });

  await page.close();
  return {
    name,
    stackButtons,
    kinestraStack,
    masbateStack,
    datumStack,
    shadcnTitles,
    skillsHasShadcn: skillsText.includes("shadcn/ui"),
    skillsHasFramer: skillsText.includes("Framer Motion"),
    skillsHasGsap: skillsText.includes("GSAP"),
    skillsHasUiLibraries: skillsText.includes("UI Libraries"),
    errors,
  };
}

const desktop = await run("desk", { width: 1440, height: 900 });
const mobile = await run("mob", { width: 390, height: 844 });
console.log(JSON.stringify({ desktop, mobile }, null, 2));
await browser.close();
