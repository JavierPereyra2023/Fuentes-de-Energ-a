const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const failed = [];
  page.on('response', r => { if (!r.ok() && r.url().startsWith('file:')) failed.push(r.status() + ' ' + r.url()); });
  page.on('pageerror', e => console.log('PE:', e.message));
  page.on('console', msg => { if (msg.type() === 'error' || msg.type() === 'warning') console.log(msg.type() + ':', msg.text()); });
  await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/falcon-heavy-3d.html', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  console.log('Failed:', failed);
  await browser.close();
})();
