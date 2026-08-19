// Informa la posicion vertical de cada <img> en viewport de celular,
// para decidir cuales pueden llevar loading="lazy".
import { chromium } from 'file:///C:/Users/javie/AppData/Local/npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright/index.mjs';

const base = 'http://127.0.0.1:8765';
const browser = await chromium.launch({
  executablePath: 'C:/Users/javie/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe',
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

for (const path of process.argv.slice(2)) {
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'load', timeout: 40000 }).catch(() => {});
  const imgs = await page.evaluate(() => [...document.images].map(i => ({
    src: (i.currentSrc || i.src).split('/').pop(),
    top: Math.round(i.getBoundingClientRect().top + scrollY),
    vh: innerHeight,
  })));
  for (const i of imgs) {
    console.log(`${i.top > i.vh ? 'lazy ' : 'EAGER'}  top=${String(i.top).padStart(6)}  ${path}  ${i.src}`);
  }
  await page.close();
}
await browser.close();
