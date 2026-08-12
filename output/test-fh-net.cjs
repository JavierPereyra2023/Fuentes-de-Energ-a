const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('request', r => {
    if (r.url().includes('unpkg') || r.url().includes('react')) {
      console.log('REQ: ' + r.url().substring(0, 100));
    }
  });
  page.on('response', r => {
    if (r.url().includes('unpkg') || r.url().includes('react')) {
      console.log('RES: ' + r.status() + ' ' + r.url().substring(0, 100));
    }
  });
  page.on('pageerror', e => console.log('PE: ' + e.message));
  await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/falcon-heavy-3d.html');
  await page.waitForTimeout(3000);
  await browser.close();
})();
