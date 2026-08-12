const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PE: ' + e.message));
  await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/falcon-heavy-3d.html', { waitUntil: 'load' });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: 'D:/nucle-ar/output/falcon-heavy-fixed.png' });
  console.log('PE:', errors.length);
  errors.forEach(e => console.log(' ', e));
  const info = await page.evaluate(() => {
    return {
      hasCanvas: !!document.querySelector('canvas'),
      canvasSize: (() => { const c = document.querySelector('canvas'); return c ? `${c.width}x${c.height}` : null; })(),
      bodyText: document.body.textContent.replace(/\s+/g, ' ').trim().substring(0, 200)
    };
  });
  console.log('Info:', JSON.stringify(info));
  await browser.close();
})();
