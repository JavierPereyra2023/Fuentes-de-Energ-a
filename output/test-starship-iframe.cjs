const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
  await page.goto('file:///D:/nucle-ar/conceptos/energia-espacial.html', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  // Scroll directo al último iframe (Starship, el tercer cohete)
  await page.evaluate(() => {
    const iframes = document.querySelectorAll('iframe[data-rocket-iframe]');
    const last = iframes[iframes.length - 1];
    if (last) last.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'D:/nucle-ar/output/energia-espacial-starship.png' });
  console.log('Screenshot saved');
  await browser.close();
})();
