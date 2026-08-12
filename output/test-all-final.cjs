const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  for (const m of ['falcon-9/falcon9-3d', 'starship/starship', 'falcon-heavy-3d']) {
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/' + m + '.html', { waitUntil: 'load' });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'D:/nucle-ar/output/final-' + m.replace('/', '-') + '.png' });
    const info = await page.evaluate(() => {
      // 3D stage (Falcon 9, Starship)
      const stage = document.querySelector('three-d-stage');
      if (stage && stage._object) {
        return { type: 'stage', name: stage._object.name, children: stage._object.children?.length || 0 };
      }
      // DC bundle (Falcon Heavy) — busca canvas
      const canvas = document.querySelector('canvas');
      if (canvas) {
        return { type: 'canvas', size: `${canvas.width}x${canvas.height}` };
      }
      return { type: 'unknown' };
    });
    console.log(m + ': ' + JSON.stringify(info) + ' - ' + errors.length + ' errores');
    errors.forEach(e => console.log('  ' + e));
    await page.close();
  }
  await browser.close();
})();
