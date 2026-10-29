import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto('https://marcimetzger-kohl.vercel.app/', { waitUntil: 'networkidle', timeout: 60000 });
  console.log((await page.locator('body').innerText()).slice(0, 5000));
  await page.screenshot({ path: 'public/media/marci-metzger.jpg', type: 'jpeg', quality: 88 });
} finally {
  await browser.close();
}
