const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  const msgs = [];
  page.on('pageerror', e => { errors.push('PE: ' + e.message + ' @ ' + (e.stack || '').split('\n')[1]); });
  page.on('console', msg => { if (msg.type() === 'error') msgs.push('CE: ' + msg.text()); });
  await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/falcon-heavy-3d.html', { waitUntil: 'load' });
  await page.waitForTimeout(4000);
  console.log('PageErrors:', errors.length);
  errors.forEach(e => console.log(' ', e));
  console.log('ConsoleErrors:', msgs.length);
  msgs.forEach(m => console.log(' ', m));
  await browser.close();
})();
