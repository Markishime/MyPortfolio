import { chromium } from "playwright-core";
import path from "node:path";

const projects = [
  ["cropdrive.jpg", "https://cropdrive.ai"],
  ["teambuilder.jpg", "https://mcteambuilder.streamlit.app/"],
  ["simplabots.jpg", "https://simplabots.com/"],
  ["masbate.jpg", "https://masbatetoday.web.app/"],
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];

for (const [filename, url] of projects) {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1,
  });

  try {
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? "unknown"}`);

    await page.waitForTimeout(2500);

    if (filename === "cropdrive.jpg") {
      const reject = page.getByRole("button", { name: "Reject" });
      if (await reject.isVisible().catch(() => false)) await reject.click();
    }

    if (filename === "teambuilder.jpg") {
      const wake = page.getByRole("button", { name: /get this app back up/i });
      if (await wake.isVisible().catch(() => false)) {
        await wake.click();
        await page.waitForFunction(
          () => !document.body.innerText.includes("gone to sleep due to inactivity"),
          { timeout: 60000 }
        );
      }
    }

    await page.waitForTimeout(3500);
    await page.screenshot({
      path: path.join(process.cwd(), "public", "media", filename),
      type: "jpeg",
      quality: 90,
    });
    results.push({ filename, status: "captured", title: await page.title() });
  } catch (error) {
    results.push({ filename, status: "kept existing image", error: String(error) });
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));