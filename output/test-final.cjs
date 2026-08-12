const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  // Test directo
  for (const m of ['falcon-9/falcon9-3d', 'starship/starship', 'falcon-heavy-3d']) {
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/' + m + '.html', { waitUntil: 'load' });
    await page.waitForTimeout(3500);
    await page.screenshot({ path: 'D:/nucle-ar/output/' + m.replace('/', '-') + '-final.png' });
    const info = await page.evaluate(() => {
      const stage = document.querySelector('three-d-stage');
      const obj = stage && stage._object;
      return { hasStage: !!stage, hasObj: !!obj, name: obj && obj.name };
    });
    console.log(m + ': ' + JSON.stringify(info) + ' - ' + errors.length + ' errores');
    errors.forEach(e => console.log('  ' + e));
    await page.close();
  }
  await browser.close();
})();
