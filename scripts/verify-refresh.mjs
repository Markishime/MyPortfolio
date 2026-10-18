import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const baseURL = process.env.PORTFOLIO_TEST_URL || "http://localhost:3002";
const output = path.resolve("scripts/verify-out/refresh");
await mkdir(output, { recursive: true });

const expected = [
  "CropDrive AI", "AGS AI Assistant", "Simplabots", "Kinestra",
  "DATUM Estimating", "Masbate Today", "Soda+", "Bayarin",
];
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];

try {
  for (const config of [
    { name: "desktop", width: 1440, height: 1000, reducedMotion: "no-preference", entry: "drag" },
    { name: "mobile", width: 390, height: 844, reducedMotion: "no-preference", entry: "Enter" },
    { name: "small-mobile", width: 360, height: 640, reducedMotion: "reduce", entry: "Space" },
    { name: "tablet", width: 768, height: 1024, reducedMotion: "reduce", entry: "Enter" },
  ].filter((config) => !process.argv[2] || config.name === process.argv[2])) {
    const page = await browser.newPage({
      viewport: { width: config.width, height: config.height },
      reducedMotion: config.reducedMotion,
    });
    const errors = [];
    const failedAssets = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.url().startsWith(baseURL) && response.status() >= 400) failedAssets.push(`${response.status()} ${response.url()}`);
    });

    const response = await page.goto(baseURL, { waitUntil: "networkidle", timeout: 60000 });
    assert.equal(response.status(), 200);
    const badge = page.getByRole("button", { name: "Pull the badge to enter", exact: true });
    await badge.waitFor({ state: "visible" });
    assert.equal(await page.getByRole("button", { name: "Enter the site", exact: true }).count(), 0);
    const badgeBox = await badge.boundingBox();
    assert(badgeBox.y >= 0 && badgeBox.y + badgeBox.height <= config.height, "Badge fits the entry screen");
    await page.screenshot({ path: path.join(output, `${config.name}-entry.png`) });

    if (config.entry === "drag") {
      const x = badgeBox.x + badgeBox.width / 2;
      const y = badgeBox.y + badgeBox.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x, y + 160, { steps: 16 });
      await page.mouse.up();
    } else {
      await badge.focus();
      await badge.press(config.entry);
    }

    await page.locator("#home h1").waitFor({ state: "visible", timeout: 15000 });
    await page.locator("#contact").waitFor({ state: "attached" });
    await page.waitForFunction(() => document.querySelector("#home video")?.readyState >= 2);
    await page.waitForTimeout(1100);
    await page.screenshot({ path: path.join(output, `${config.name}-hero.png`) });
    const heroVideo = page.locator("#home video");
    assert.equal(await heroVideo.getAttribute("src"), "/media/Pixelated.mp4");
    assert.equal(await heroVideo.evaluate((video) => video.paused), config.reducedMotion === "reduce");
    const startTime = await heroVideo.evaluate((video) => video.currentTime);
    await page.waitForTimeout(400);
    const laterTime = await heroVideo.evaluate((video) => video.currentTime);
    if (config.reducedMotion !== "reduce") assert(laterTime > startTime, "Hero video plays");

    for (const section of ["origin", "about", "projects", "skills", "certifications", "contact"]) {
      await page.locator(`#${section}`).evaluate((element) => element.scrollIntoView({ block: "start" }));
      await page.waitForTimeout(1000);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      assert.equal(overflow, false, `${config.name}: no overflow at ${section}`);
      await page.screenshot({ path: path.join(output, `${config.name}-${section}.png`) });
      if (section === "about") assert.equal(await heroVideo.evaluate((video) => video.paused), true, "Offscreen hero pauses");
    }

    const experience = await page.locator(".experience-track").allTextContents();
    assert.match(experience[0], /Personal experience1 year/);
    assert.match(experience[1], /Work experience1 year and 7 months/);
    const projectsStat = page.locator(".about-stats > div").filter({ hasText: "Projects Built" });
    await projectsStat.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector(".about-stats dd")?.textContent === "11");
    assert.equal((await projectsStat.locator("dd").textContent()).trim(), "11");
    await page.locator("#projects").evaluate((element) => element.scrollIntoView({ block: "start" }));
    const titles = await page.locator(".project-grid article h3").allTextContents();
    assert.deepEqual(titles.slice(0, 8), expected);
    assert.equal(titles.length, 12, "All built projects and the design concept are retained");

    const carousel = page.getByRole("group", { name: "Depth carousel" });
    await carousel.scrollIntoViewIfNeeded();
    await carousel.focus();
    await carousel.getByRole("tab", { name: "Go to slide 1", exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".project-feature-copy h3")?.textContent === "CropDrive AI");
    await carousel.getByRole("button", { name: "Next slide", exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".project-feature-copy h3")?.textContent === "AGS AI Assistant");
    assert.equal(await carousel.getByRole("tab", { name: "Go to slide 2", exact: true }).getAttribute("aria-selected"), "true");
    await carousel.getByRole("button", { name: "Previous slide", exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".project-feature-copy h3")?.textContent === "CropDrive AI");
    await carousel.focus();
    await carousel.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector(".project-feature-copy h3")?.textContent === "AGS AI Assistant");
    await carousel.press("ArrowLeft");
    await page.waitForFunction(() => document.querySelector(".project-feature-copy h3")?.textContent === "CropDrive AI");
    await page.screenshot({ path: path.join(output, `${config.name}-carousel.png`) });

    const lanes = page.getByRole("toolbar", { name: "Filter projects", exact: true });
    const stack = page.getByRole("toolbar", { name: "Filter by stack" });
    await stack.getByRole("button", { name: /^Next.js/ }).click();
    assert((await page.locator(".project-grid article").count()) > 0);
    await lanes.getByRole("button", { name: /^Embedded/ }).click();
    assert.equal(await page.locator(".project-grid article").count(), 2, "Changing lane clears an incompatible stack filter");
    assert.deepEqual(await page.locator(".project-grid article h3").allInnerTexts(), ["Smart EcoLock", "LockMate"]);
    await lanes.getByRole("button", { name: /^All/ }).click();
    const firstCard = page.locator(".project-grid article").first();
    await firstCard.getByRole("button", { name: "Read more", exact: true }).click();
    assert.equal(await firstCard.getByRole("button", { name: "Show less" }).getAttribute("aria-expanded"), "true");
    await firstCard.getByRole("button", { name: "Show less" }).click();
    assert.equal(await firstCard.getByRole("button", { name: "Read more", exact: true }).getAttribute("aria-expanded"), "false");

    const missingImages = await page.locator("main img").evaluateAll((images) => images.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.getAttribute("src")));
    assert.deepEqual(missingImages, []);
    if (config.width < 1024) {
      await page.getByRole("button", { name: "Open menu", exact: true }).click();
      await page.locator(".portfolio-mobile-menu").getByRole("link", { name: "Contact", exact: true }).click();
      assert.equal(await page.getByRole("button", { name: "Open menu", exact: true }).getAttribute("aria-expanded"), "false");
    }
    assert.deepEqual(errors, [], `${config.name}: no runtime errors`);
    assert.deepEqual(failedAssets, [], `${config.name}: no failed local assets`);
    results.push({ viewport: config.name, entry: config.entry, projectCount: titles.length, experience, errors, failedAssets });
    await page.close();
  }
  console.log(JSON.stringify({ status: "passed", results, screenshots: output }, null, 2));
} finally {
  await browser.close();
}
