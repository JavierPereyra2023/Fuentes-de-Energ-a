const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  for (const m of ['falcon-9/falcon9-3d', 'starship/starship', 'falcon-heavy-3d']) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/' + m + '.html');
    await page.waitForTimeout(3000);
    console.log(m + ': ' + errors.length + ' errores');
    errors.forEach(e => console.log('  ' + e));
    await page.close();
  }
  await browser.close();
})();
