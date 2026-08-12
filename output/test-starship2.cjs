const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  const consoleMsgs = [];
  page.on('pageerror', e => errors.push('PAGE_ERROR: ' + e.message));
  page.on('console', msg => consoleMsgs.push(msg.type() + ': ' + msg.text()));
  await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/starship/starship.html', { waitUntil: 'load' });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'D:/nucle-ar/output/starship-fixed.png' });
  console.log('ERRORS:', errors.length);
  errors.forEach(e => console.log('  ' + e));
  console.log('CONSOLE (errores):');
  consoleMsgs.filter(m => m.startsWith('error')).slice(0, 10).forEach(m => console.log('  ' + m));
  const info = await page.evaluate(() => {
    const stage = document.querySelector('three-d-stage');
    if (!stage) return { stage: false };
    const obj = stage._object;
    if (!obj) return { stage: true, object: false };
    return {
      stage: true, object: true, type: obj.type, name: obj.name,
      children: obj.children.length,
      childNames: obj.children.map(c => c.name + ' (' + c.children.length + ' children)')
    };
  });
  console.log('INFO:', JSON.stringify(info, null, 2));
  await browser.close();
})();
