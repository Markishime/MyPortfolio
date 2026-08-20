import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#projects");
const heroH = await page.$eval("#home", (el) =>
  Math.round(el.getBoundingClientRect().height)
);
await page.evaluate(() => document.querySelector("#projects")?.scrollIntoView());
await page.waitForTimeout(400);
await page.getByRole("button", { name: "Embedded" }).click();
await page.waitForTimeout(250);
const embedded = await page.locator("#projects h3").allInnerTexts();
await page.screenshot({ path: "scripts/verify-out/desk-embedded.png" });
await page.getByRole("button", { name: "All" }).click();
await page.locator("#projects h3").nth(2).scrollIntoViewIfNeeded();
await page.waitForTimeout(250);
await page.screenshot({ path: "scripts/verify-out/desk-mid.png" });
const stillBtn = await page.getByRole("button", { name: /still|motion/i }).count();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await mobile.waitForSelector("h1");
const mobileHero = await mobile.$eval("#home", (el) =>
  Math.round(el.getBoundingClientRect().height)
);
await mobile.screenshot({ path: "scripts/verify-out/mob-hero.png" });

console.log(JSON.stringify({ heroH, mobileHero, embedded, stillBtn }, null, 2));
await browser.close();
