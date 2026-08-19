import { chromium } from 'file:///C:/Users/javie/AppData/Local/npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright/index.mjs';
const base = 'http://127.0.0.1:8765';
const browser = await chromium.launch({
  executablePath: 'C:/Users/javie/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe',
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
for (const [path, name, y] of JSON.parse(process.argv[2])) {
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'load', timeout: 40000 }).catch(() => {});
  await page.evaluate(async (yy) => {
    for (const i of document.images) i.loading = 'eager';
    scrollTo(0, yy); await new Promise(r => setTimeout(r, 1200));
  }, y);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `output/playwright/rev-${name}.png` });
  await page.close();
}
await browser.close();
